# AWS Bookstore Demo App

A full-stack sample web application that creates a bookstore storefront for customers to browse, search, and purchase fictitious books. Built with React, AWS Lambda, API Gateway, DynamoDB, ElastiCache, and OpenSearch.

## Architecture

**Frontend:** React 18 + Vite + Bootstrap 5, served via S3 + CloudFront

**Backend:** API Gateway → Lambda (Node.js 20 / Python 3.12) → DynamoDB, OpenSearch, ElastiCache Redis

**Databases:**
- **DynamoDB** — Product catalog, shopping cart, orders
- **OpenSearch** — Full-text search by title, author, category
- **ElastiCache Redis** — Best sellers leaderboard

## Running Locally

### Prerequisites

- Node.js 18+
- npm

### Steps

```bash
# 1. Start the mock API server
cd local-api
npm install
npm start
# API runs at http://localhost:4000

# 2. In a new terminal, start the frontend
cd assets
npm install
npm run dev
# App runs at http://localhost:5173
```

The local setup uses an in-memory mock API that simulates all backend endpoints (books, cart, orders, search, best sellers). No AWS account needed.

## Deploying to AWS

### Prerequisites

- AWS CLI configured with appropriate credentials
- Python 3.12 and pip (for building the Lambda layer)
- Node.js 18+ and npm

### Quick Deploy

```bash
./deploy.sh <S3_BUCKET>
```

This single command will:
1. Build all Lambda deployment packages
2. Create an S3 bucket for artifacts (if it doesn't exist)
3. Upload Lambda packages and seed data to S3
4. Deploy the CloudFormation stack (~15-20 min)
5. Build the React frontend
6. Upload the frontend to the S3 web assets bucket
7. Print the CloudFront URL

Only the S3 bucket name is required. Stack name defaults to `MyBookstore` and region defaults to `us-east-1`. To override:

```bash
./deploy.sh <S3_BUCKET> [STACK_NAME] [REGION]
```

### Manual Steps (if you prefer)

```bash
# 1. Build all Lambda deployment packages
./build-lambdas.sh

# 2. Create an S3 bucket for deployment artifacts (one-time)
aws s3 mb s3://YOUR_DEPLOY_BUCKET

# 3. Upload Lambda packages and data
aws s3 sync dist/ s3://YOUR_DEPLOY_BUCKET/
aws s3 sync data/ s3://YOUR_DEPLOY_BUCKET/data/

# 4. Deploy the CloudFormation stack (~15-20 min)
aws cloudformation deploy \
  --template-file template/master-fullstack.yaml \
  --stack-name MyBookstore \
  --parameter-overrides \
    ProjectName=mybookstore \
    AssetsBucketName=YOUR_DEPLOY_BUCKET \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

# 5. Get the stack outputs
aws cloudformation describe-stacks --stack-name MyBookstore \
  --query 'Stacks[0].Outputs' --output table
# Note the AssetsBucket (S3 bucket for frontend) and WebApplication (CloudFront URL)

# 6. Update the frontend API URL
#    Edit assets/src/config.ts — replace YOUR_API_ID with the API Gateway URL from outputs

# 7. Build and upload the frontend
cd assets
npm install
npm run build
aws s3 sync build/ s3://ASSETS_BUCKET_FROM_OUTPUT/

# 8. Invalidate CloudFront cache (if updating an existing deployment)
aws cloudfront create-invalidation --distribution-id DIST_ID --paths '/*'

# 9. Access the app via the CloudFront URL from outputs
#    e.g. https://d1234abcdef8.cloudfront.net
```

Stack creation takes ~15-20 minutes (OpenSearch cluster takes time to provision). The site is served via CloudFront (HTTPS) — the S3 bucket itself is not publicly accessible.

### Tearing down

```bash
# 1. Empty the web assets bucket
aws s3 rm s3://ASSETS_BUCKET_FROM_OUTPUT --recursive

# 2. Delete the stack
aws cloudformation delete-stack --stack-name MyBookstore
```

## Project Structure

```
├── assets/                  # React frontend (Vite + TypeScript)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── functions/
│   ├── APIs/                # Lambda functions for API endpoints
│   ├── streaming/           # DynamoDB stream handlers (search, best sellers)
│   └── setup/               # Stack setup utilities (data loading, roles)
├── local-api/               # Express mock server for local development
├── data/                    # Seed data (books.json)
├── template/
│   └── master-fullstack.yaml  # CloudFormation template (entire stack)
├── build-lambdas.sh         # Packages Lambda functions for deployment
└── deploy.sh                # One-command build + upload + deploy
```

## Cost

Running the full stack costs approximately **$0.10/hour** due to ElastiCache and OpenSearch instances. **Delete the stack when not in use.**

## License

This sample code is made available under a modified MIT license. See the LICENSE file.
