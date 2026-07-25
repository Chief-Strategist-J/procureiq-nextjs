#!/bin/bash
set -e

# Change directory to the root of the nextjs package
cd "$(dirname "$0")/.."

echo "Checking bundle size budget..."

BUILD_DIR=".next"
if [ ! -d "$BUILD_DIR" ]; then
    echo "Build directory not found. Please run 'npm run build' first."
    exit 0 # Or exit 1 if you want to enforce build exists
fi

SIZE_KB=$(du -sk $BUILD_DIR | awk '{print $1}')
# Let's say budget is 500MB = 512000KB
LIMIT_KB=512000

if [ "$SIZE_KB" -gt "$LIMIT_KB" ]; then
    echo "Bundle size (${SIZE_KB} KB) exceeds budget (${LIMIT_KB} KB)!"
    exit 1
fi

echo "Bundle size (${SIZE_KB} KB) is within the budget (${LIMIT_KB} KB)."
exit 0
