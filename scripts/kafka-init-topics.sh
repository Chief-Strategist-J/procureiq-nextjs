#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
MIGRATIONS_DIR="$PROJECT_ROOT/kafka/migrations"
KAFKA_CONTAINER="procureiq-kafka"
BOOTSTRAP_SERVER="localhost:9092"

echo "================================================="
echo " Kafka Topic Migration Runner"
echo "================================================="

if ! docker ps --format '{{.Names}}' | grep -q "^${KAFKA_CONTAINER}$"; then
    echo "Kafka container ($KAFKA_CONTAINER) is not running. Skipping migration."
    exit 0
fi

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "No kafka/migrations directory found."
    exit 0
fi

for mig_file in $(ls "$MIGRATIONS_DIR"/*.json 2>/dev/null | sort); do
    echo "Applying Kafka Topic Migration: $(basename "$mig_file")"
    
    python3 -c "
import json, subprocess, sys

with open('$mig_file') as f:
    data = json.load(f)

for topic in data.get('topics', []):
    name = topic['name']
    partitions = str(topic.get('partitions', 1))
    rf = str(topic.get('replicationFactor', 1))
    
    cmd = [
        'docker', 'exec', '$KAFKA_CONTAINER',
        '/opt/kafka/bin/kafka-topics.sh',
        '--bootstrap-server', '$BOOTSTRAP_SERVER',
        '--create', '--if-not-exists',
        '--topic', name,
        '--partitions', partitions,
        '--replication-factor', rf
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f'  [✓] Migrated topic: {name}')
"
done

echo "Current Active Kafka Topics:"
docker exec "$KAFKA_CONTAINER" /opt/kafka/bin/kafka-topics.sh --bootstrap-server "$BOOTSTRAP_SERVER" --list || true
echo "================================================="
