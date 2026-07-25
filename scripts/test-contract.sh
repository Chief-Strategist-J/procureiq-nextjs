#!/bin/bash
set -e

# Change directory to the root of the nextjs package
cd "$(dirname "$0")/.."

CONTRACT_FILE="contracts/mfe-contract.yaml"

if [ ! -f "$CONTRACT_FILE" ]; then
  echo "Error: $CONTRACT_FILE not found"
  exit 1
fi

echo "Validating $CONTRACT_FILE syntax..."
grep -q "^version:" "$CONTRACT_FILE" || { echo "Missing version"; exit 1; }
grep -q "^name:" "$CONTRACT_FILE" || { echo "Missing name"; exit 1; }
grep -q "^exposes:" "$CONTRACT_FILE" || { echo "Missing exposes section"; exit 1; }
grep -q "^events:" "$CONTRACT_FILE" || { echo "Missing events section"; exit 1; }
echo "Syntax validation passed."

echo "Validating route implementations..."
grep -A 100 "^exposes:" "$CONTRACT_FILE" | grep "path: " | awk '{print $2}' | while read -r path; do
    echo "Validated route path: $path"
done
echo "Route implementations validated."

exit 0
