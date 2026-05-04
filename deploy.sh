#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh <S3_BUCKET_NAME> [STACK_NAME] [REGION]"
  echo ""
  echo "Example: ./deploy.sh my-bookstore-artifacts MyBookstore us-east-1"
  exit 1
fi

S3_BUCKET="$1"
STACK_NAME="${2:-MyBookstore}"
REGION="${3:-us-east-1}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Building Lambda packages ==="
"$SCRIPT_DIR/build-lambdas.sh"

echo ""
echo "=== Creating S3 bucket (if it doesn't exist) ==="
aws s3 mb "s3://$S3_BUCKET" --region "$REGION" 2>/dev/null || true

echo ""
echo "=== Uploading Lambda packages and data to s3://$S3_BUCKET ==="
aws s3 sync "$SCRIPT_DIR/dist/" "s3://$S3_BUCKET/" --region "$REGION"
aws s3 sync "$SCRIPT_DIR/data/" "s3://$S3_BUCKET/data/" --region "$REGION"

echo ""
echo "=== Deploying CloudFormation stack: $STACK_NAME (~15-20 min) ==="
aws cloudformation deploy \
  --template-file "$SCRIPT_DIR/template/master-fullstack.yaml" \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --parameter-overrides \
    ProjectName=mybookstore \
    AssetsBucketName="$S3_BUCKET" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

echo ""
echo "=== Getting stack outputs ==="
WEB_BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`AssetsBucket`].OutputValue' --output text)
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`WebApplication`].OutputValue' --output text)
API_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text 2>/dev/null || echo "")

echo "  Assets bucket: $WEB_BUCKET"
echo "  CloudFront URL: $CLOUDFRONT_URL"
echo "  API URL: $API_URL"

echo ""
echo "=== Building and uploading frontend ==="
if [ -n "$API_URL" ] && [ "$API_URL" != "None" ]; then
  echo "  Updating config with API URL: $API_URL"
  sed -i.bak "s|YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod|${API_URL#https://}|" "$SCRIPT_DIR/assets/src/config.ts"
  rm -f "$SCRIPT_DIR/assets/src/config.ts.bak"
fi

(cd "$SCRIPT_DIR/assets" && npm install --silent && npm run build)

if [ -n "$WEB_BUCKET" ] && [ "$WEB_BUCKET" != "None" ]; then
  echo "  Uploading to s3://$WEB_BUCKET/"
  aws s3 sync "$SCRIPT_DIR/assets/build/" "s3://$WEB_BUCKET/" --region "$REGION"
else
  echo "  WARNING: Could not determine assets bucket. Upload frontend manually:"
  echo "  aws s3 sync assets/build/ s3://YOUR_ASSETS_BUCKET/"
fi

echo ""
echo "=== Deployment complete! ==="
echo ""
echo "Site URL: $CLOUDFRONT_URL"
echo ""
echo "Note: CloudFront may take a few minutes to propagate."
echo "If you see AccessDenied, wait a minute and try again."
