#!/bin/bash

# Build script to combine split CLI parts back into a single file

set -e

echo "🔨 Building CLI from split parts..."

OUTPUT_FILE="cli-rebuilt.js"
PARTS_DIR="src/parts"

# Check if parts directory exists
if [ ! -d "$PARTS_DIR" ]; then
    echo "❌ Error: $PARTS_DIR directory not found"
    exit 1
fi

# Combine all parts
echo "📦 Combining parts..."
cat \
    "$PARTS_DIR/part-00-header.js" \
    "$PARTS_DIR/part-01-utils.js" \
    "$PARTS_DIR/part-02-aws-sdk.js" \
    "$PARTS_DIR/part-03-dependencies.js" \
    "$PARTS_DIR/part-04-core.js" \
    "$PARTS_DIR/part-05-cli.js" \
    "$PARTS_DIR/part-06-api.js" \
    "$PARTS_DIR/part-07-tools.js" \
    "$PARTS_DIR/part-08-runtime.js" \
    "$PARTS_DIR/part-09-main.js" \
    > "$OUTPUT_FILE"

# Make executable
chmod +x "$OUTPUT_FILE"

# Show results
LINES=$(wc -l < "$OUTPUT_FILE")
SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')

echo "✅ Build complete!"
echo "📄 Output: $OUTPUT_FILE"
echo "📊 Lines: $LINES"
echo "💾 Size: $SIZE"
echo ""
echo "You can now run: ./$OUTPUT_FILE --help"
