#!/bin/bash
set -e

# Build script for Lambda deployment packages
# Usage: ./build-lambdas.sh [S3_BUCKET] [REGION]
# After running, upload the dist/ folder contents to your S3 bucket:
#   aws s3 sync dist/ s3://YOUR_BUCKET/

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"
FUNCTIONS_DIR="$SCRIPT_DIR/functions"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/functions" "$DIST_DIR/data"

echo "=== Building Node.js API Lambda functions ==="

# Simple Node.js functions (use SDK v3 from runtime, no bundling needed)
declare -a SIMPLE_NODE_FUNCTIONS=(
  "APIs/listBooks.js:ListBooks"
  "APIs/getBook.js:GetBook"
  "APIs/addToCart.js:AddToCart"
  "APIs/removeFromCart.js:RemoveFromCart"
  "APIs/getCartItem.js:GetCartItem"
  "APIs/updateCart.js:UpdateCart"
  "APIs/listItemsInCart.js:ListItemsInCart"
  "APIs/listOrders.js:ListOrders"
  "APIs/checkout.js:Checkout"
  "setup/uploadBooks.js:UploadBooks"
  "setup/createOSRole.js:CreateOSRole"
)

for entry in "${SIMPLE_NODE_FUNCTIONS[@]}"; do
  SRC="${entry%%:*}"
  NAME="${entry##*:}"
  echo "  Packaging $NAME..."
  TMPDIR=$(mktemp -d)
  cp "$FUNCTIONS_DIR/$SRC" "$TMPDIR/index.js"
  (cd "$TMPDIR" && zip -q "$DIST_DIR/functions/$NAME.zip" index.js)
  rm -rf "$TMPDIR"
done

echo "=== Building Redis Lambda functions (need node_modules) ==="

# Functions that need the redis package bundled
declare -a REDIS_FUNCTIONS=(
  "APIs/getBestSellers.js:GetBestSellers"
  "streaming/updateBestSellers.js:UpdateBestSellers"
)

for entry in "${REDIS_FUNCTIONS[@]}"; do
  SRC="${entry%%:*}"
  NAME="${entry##*:}"
  echo "  Packaging $NAME (with redis)..."
  TMPDIR=$(mktemp -d)
  cp "$FUNCTIONS_DIR/$SRC" "$TMPDIR/index.js"
  (cd "$TMPDIR" && cat > package.json << 'EOF'
{"dependencies":{"redis":"^4.7.0"}}
EOF
  npm install --omit=dev --quiet 2>/dev/null
  zip -qr "$DIST_DIR/functions/$NAME.zip" .)
  rm -rf "$TMPDIR"
done

echo "=== Building Python Lambda functions ==="

# Python functions (single file, no external deps - those come from the layer)
declare -a PYTHON_FUNCTIONS=(
  "APIs/search.py:Search"
  "streaming/updateSearchCluster.py:UpdateSearchCluster"
  "setup/deleteBuckets.py:DeleteBuckets"
)

for entry in "${PYTHON_FUNCTIONS[@]}"; do
  SRC="${entry%%:*}"
  NAME="${entry##*:}"
  echo "  Packaging $NAME..."
  TMPDIR=$(mktemp -d)
  # NeptuneIAM and NeptuneLoader use lambda_function.lambda_handler
  if [[ "$NAME" == "NeptuneIAM" || "$NAME" == "NeptuneLoader" ]]; then
    cp "$FUNCTIONS_DIR/$SRC" "$TMPDIR/lambda_function.py"
  else
    cp "$FUNCTIONS_DIR/$SRC" "$TMPDIR/index.py"
  fi
  (cd "$TMPDIR" && zip -q "$DIST_DIR/functions/$NAME.zip" *.py)
  rm -rf "$TMPDIR"
done

echo "=== Building Python Lambda Layer ==="
echo "  Installing requests, requests_aws4auth for Python 3.12..."
LAYER_DIR=$(mktemp -d)
PIP_CMD=$(command -v pip3 || command -v pip || echo "")
if [ -z "$PIP_CMD" ]; then
  echo "  ERROR: pip/pip3 not found. Skipping layer build."
  echo "  Install Python 3.12 and pip, then re-run."
else
  $PIP_CMD install --target "$LAYER_DIR/python" \
    requests requests-aws4auth
  (cd "$LAYER_DIR" && zip -qr "$DIST_DIR/functions/PythonLambdaLayer.zip" python/)
fi
rm -rf "$LAYER_DIR"

echo "=== Copying data files ==="
cp "$SCRIPT_DIR/data/"* "$DIST_DIR/data/"

echo ""
echo "=== Build complete! ==="
echo "Output: $DIST_DIR/"
echo ""
echo "To deploy, upload to your S3 bucket:"
echo "  aws s3 sync $DIST_DIR/ s3://YOUR_BUCKET_NAME/"
echo ""
echo "Then deploy the CloudFormation stack with:"
echo "  aws cloudformation deploy \\"
echo "    --template-file template/master-fullstack.yaml \\"
echo "    --stack-name MyBookstore \\"
echo "    --parameter-overrides ProjectName=mybookstore AssetsBucketName=YOUR_BUCKET_NAME \\"
echo "    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM"
