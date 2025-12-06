# AWS Commands Reference

Quick reference for common AWS CLI commands specific to the Metal Direct production deployment.

## Account Information

```bash
# Account ID
AWS_ACCOUNT_ID="952956873675"

# Primary Region
AWS_REGION="eu-central-1"

# Project Name
PROJECT_NAME="metalpro"
```

---

## Docker & ECR (Elastic Container Registry)

### Login to ECR
```bash
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  952956873675.dkr.ecr.eu-central-1.amazonaws.com
```

### Build and Push Image
```bash
# Build
docker build -t metalpro-backend:latest .

# Tag
docker tag metalpro-backend:latest \
  952956873675.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest

# Push
docker push 952956873675.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest
```

### List ECR Images
```bash
aws ecr list-images \
  --repository-name metalpro-backend \
  --region eu-central-1
```

---

## ECS (Elastic Container Service)

### Service Management

**Describe Service**
```bash
aws ecs describe-services \
  --cluster metalpro-production \
  --services metalpro-backend-task-service-cglk1ocr \
  --region eu-central-1
```

**Update Service (Force New Deployment)**
```bash
aws ecs update-service \
  --cluster metalpro-production \
  --service metalpro-backend-task-service-cglk1ocr \
  --force-new-deployment \
  --region eu-central-1
```

**List Running Tasks**
```bash
aws ecs list-tasks \
  --cluster metalpro-production \
  --service-name metalpro-backend-task-service-cglk1ocr \
  --desired-status RUNNING \
  --region eu-central-1
```

**Describe Tasks**
```bash
# Get task ARN first, then describe
aws ecs describe-tasks \
  --cluster metalpro-production \
  --tasks TASK_ARN \
  --region eu-central-1
```

**Check Task Health Status**
```bash
aws ecs list-tasks \
  --cluster metalpro-production \
  --service-name metalpro-backend-task-service-cglk1ocr \
  --region eu-central-1 | \
jq -r '.taskArns[]' | \
xargs -I {} aws ecs describe-tasks \
  --cluster metalpro-production \
  --tasks {} \
  --region eu-central-1 \
  --query 'tasks[0].{TaskDef:taskDefinitionArn,HealthStatus:healthStatus,LastStatus:lastStatus}'
```

### Task Definitions

**List Task Definitions**
```bash
aws ecs list-task-definitions \
  --family-prefix metalpro-backend-task \
  --region eu-central-1 \
  --sort DESC
```

**Get Latest Task Definition**
```bash
aws ecs list-task-definitions \
  --family-prefix metalpro-backend-task \
  --region eu-central-1 \
  --sort DESC \
  --max-items 1 \
  --query 'taskDefinitionArns[0]' \
  --output text
```

**Describe Task Definition**
```bash
aws ecs describe-task-definition \
  --task-definition metalpro-backend-task:10 \
  --region eu-central-1
```

**Register New Task Definition**
```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region eu-central-1
```

### One-Off Tasks

**Run Database Migration**
```bash
aws ecs run-task \
  --cluster metalpro-production \
  --task-definition metalpro-backend-task:10 \
  --launch-type FARGATE \
  --network-configuration file:///tmp/network-config.json \
  --overrides file:///tmp/migration-overrides.json \
  --region eu-central-1
```

---

## Application Load Balancer

### Load Balancer Information

**Describe Load Balancer**
```bash
aws elbv2 describe-load-balancers \
  --names metalpro-alb \
  --region eu-central-1
```

**Get Load Balancer DNS**
```bash
aws elbv2 describe-load-balancers \
  --names metalpro-alb \
  --region eu-central-1 \
  --query 'LoadBalancers[0].{DNS:DNSName,HostedZoneId:CanonicalHostedZoneId}'
```

### Listeners

**List Listeners**
```bash
# Get ALB ARN first
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names metalpro-alb \
  --region eu-central-1 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# List listeners
aws elbv2 describe-listeners \
  --load-balancer-arn $ALB_ARN \
  --region eu-central-1
```

### Target Groups

**Describe Target Health**
```bash
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:eu-central-1:952956873675:targetgroup/metalpro-backend-tg/98579a4ddb0ec4b1 \
  --region eu-central-1
```

**Detailed Target Health**
```bash
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:eu-central-1:952956873675:targetgroup/metalpro-backend-tg/98579a4ddb0ec4b1 \
  --region eu-central-1 \
  --query 'TargetHealthDescriptions[].{IP:Target.Id,Port:Target.Port,State:TargetHealth.State,Reason:TargetHealth.Reason}'
```

---

## RDS (PostgreSQL Database)

### Database Information

**Connection String**
```bash
# Endpoint
metalpro-production.cnqwyecw8z8o.eu-central-1.rds.amazonaws.com:5432

# Database Name
metalpro

# Connection via psql
psql -h metalpro-production.cnqwyecw8z8o.eu-central-1.rds.amazonaws.com \
     -U metalpro_user \
     -d metalpro
```

---

## ElastiCache (Redis)

### Redis Information

**Connection String**
```bash
# Endpoint
metalpro-redis.hgplcp.ng.0001.euc1.cache.amazonaws.com:6379

# Test connection (from ECS container)
redis-cli -h metalpro-redis.hgplcp.ng.0001.euc1.cache.amazonaws.com -p 6379 ping
```

---

## Route 53 (DNS)

### Hosted Zone

**Hosted Zone ID**
```bash
HOSTED_ZONE_ID="Z0090057MKCWJVEBZUGQ"
```

**List DNS Records**
```bash
aws route53 list-resource-record-sets \
  --hosted-zone-id Z0090057MKCWJVEBZUGQ \
  --output json
```

**List DNS Records (Formatted)**
```bash
aws route53 list-resource-record-sets \
  --hosted-zone-id Z0090057MKCWJVEBZUGQ \
  --output json | \
jq -r '.ResourceRecordSets[] | "\(.Name) \(.Type) \(.AliasTarget.DNSName // .ResourceRecords[0].Value // "")"' | \
column -t
```

**Get Nameservers**
```bash
aws route53 get-hosted-zone \
  --id Z0090057MKCWJVEBZUGQ \
  --query 'DelegationSet.NameServers'
```

### Create DNS Records

**Create A Record (Alias to ALB)**
```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z0090057MKCWJVEBZUGQ \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.metal-direct.ro",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z215JYRZR1TBD5",
          "DNSName": "metalpro-alb-1509305323.eu-central-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }'
```

**Create A Record (Alias to CloudFront)**
```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z0090057MKCWJVEBZUGQ \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "metal-direct.ro",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d27nvx7t92abyt.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

---

## ACM (Certificate Manager)

### SSL Certificates

**Certificate ARN (us-east-1 for CloudFront)**
```bash
CERT_ARN_US_EAST_1="arn:aws:acm:us-east-1:952956873675:certificate/5f5ceb09-663d-4c3b-b362-adc700d5b755"
```

**Request New Certificate**
```bash
aws acm request-certificate \
  --domain-name metal-direct.ro \
  --subject-alternative-names www.metal-direct.ro \
  --validation-method DNS \
  --region us-east-1
```

**Describe Certificate**
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:952956873675:certificate/5f5ceb09-663d-4c3b-b362-adc700d5b755 \
  --region us-east-1
```

**Check Certificate Status**
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:952956873675:certificate/5f5ceb09-663d-4c3b-b862-adc700d5b755 \
  --region us-east-1 \
  --query 'Certificate.Status' \
  --output text
```

**Get Validation Records**
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:952956873675:certificate/5f5ceb09-663d-4c3b-b362-adc700d5b755 \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions[].ResourceRecord'
```

---

## CloudFront

### Distribution Information

**Distribution ID**
```bash
CLOUDFRONT_DIST_ID="E3ECMFUJEN6NSX"
```

**Distribution Domain**
```bash
# CloudFront URL
d27nvx7t92abyt.cloudfront.net
```

**Get Distribution Config**
```bash
aws cloudfront get-distribution \
  --id E3ECMFUJEN6NSX \
  --query 'Distribution'
```

**Get Distribution Config (for updates)**
```bash
# Get ETag for updates
ETAG=$(aws cloudfront get-distribution-config \
  --id E3ECMFUJEN6NSX \
  --query 'ETag' \
  --output text)

# Get config
aws cloudfront get-distribution-config \
  --id E3ECMFUJEN6NSX \
  --query 'DistributionConfig' > /tmp/cf-config.json
```

**Update Distribution**
```bash
aws cloudfront update-distribution \
  --id E3ECMFUJEN6NSX \
  --distribution-config file:///tmp/cf-updated.json \
  --if-match "$ETAG"
```

**Create Invalidation**
```bash
aws cloudfront create-invalidation \
  --distribution-id E3ECMFUJEN6NSX \
  --paths "/*"
```

---

## CloudWatch Logs

### View Logs

**Tail Logs (Live)**
```bash
aws logs tail /ecs/metalpro-backend-task \
  --follow \
  --region eu-central-1
```

**Tail Recent Logs**
```bash
aws logs tail /ecs/metalpro-backend-task \
  --since 5m \
  --region eu-central-1
```

**Filter Logs**
```bash
aws logs tail /ecs/metalpro-backend-task \
  --since 10m \
  --filter-pattern "ERROR" \
  --format short \
  --region eu-central-1
```

---

## S3 (Frontend Hosting)

### S3 Bucket

**Bucket Name**
```bash
BUCKET_NAME="metal-direct-frontend"
```

**Upload Frontend Build**
```bash
# Sync build directory
aws s3 sync ./dist s3://metal-direct-frontend/ \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

# Upload index.html separately (no cache)
aws s3 cp ./dist/index.html s3://metal-direct-frontend/index.html \
  --cache-control "no-cache"
```

**List Bucket Contents**
```bash
aws s3 ls s3://metal-direct-frontend/ --recursive
```

**Empty Bucket**
```bash
aws s3 rm s3://metal-direct-frontend/ --recursive
```

---

## S3 (Product Images)

### S3 Bucket Setup

**Bucket Name**
```bash
PRODUCT_IMAGES_BUCKET="metalpro-product-images"
```

**Create Bucket**
```bash
aws s3api create-bucket \
  --bucket metalpro-product-images \
  --region eu-central-1 \
  --create-bucket-configuration LocationConstraint=eu-central-1
```

**Configure Public Access Block**
```bash
# Allow public read access for product images
aws s3api put-public-access-block \
  --bucket metalpro-product-images \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

**Set Bucket Policy (Public Read)**
```bash
aws s3api put-bucket-policy \
  --bucket metalpro-product-images \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::metalpro-product-images/*"
    }]
  }'
```

**Configure CORS**
```bash
aws s3api put-bucket-cors \
  --bucket metalpro-product-images \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["http://localhost:8080", "https://metal-direct.ro"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }'
```

### Product Image Operations

**Upload Product Image**
```bash
# Upload image with public-read ACL
aws s3 cp /path/to/image.jpg \
  s3://metalpro-product-images/products/{SKU}/image.jpg \
  --content-type image/jpeg \
  --cache-control "max-age=31536000"
```

**List Product Images**
```bash
# List all images
aws s3 ls s3://metalpro-product-images/products/ --recursive

# List images for specific product
aws s3 ls s3://metalpro-product-images/products/{SKU}/
```

**Delete Product Image**
```bash
aws s3 rm s3://metalpro-product-images/products/{SKU}/image.jpg
```

**Get Image URL**
```bash
# Direct S3 URL
https://metalpro-product-images.s3.eu-central-1.amazonaws.com/products/{SKU}/image.jpg

# Or via CloudFront (if configured)
# Set AWS_CLOUDFRONT_URL in .env
```

---

## Secrets Manager

### Database Credentials

**Store DATABASE_URL**
```bash
aws secretsmanager create-secret \
  --name metalpro/database-url \
  --secret-string "postgresql://USER:PASSWORD@metalpro-production.cnqwyecw8z8o.eu-central-1.rds.amazonaws.com:5432/metalpro" \
  --region eu-central-1
```

**Store JWT_SECRET**
```bash
aws secretsmanager create-secret \
  --name metalpro/jwt-secret \
  --secret-string "$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")" \
  --region eu-central-1
```

**Store Redis URL**
```bash
aws secretsmanager create-secret \
  --name metalpro/redis-url \
  --secret-string "redis://metalpro-redis.hgplcp.ng.0001.euc1.cache.amazonaws.com:6379" \
  --region eu-central-1
```

**Retrieve Secret**
```bash
aws secretsmanager get-secret-value \
  --secret-id metalpro/database-url \
  --region eu-central-1 \
  --query 'SecretString' \
  --output text
```

---

## Common Deployment Workflows

### Full Backend Deployment

```bash
#!/bin/bash
# Complete backend deployment workflow

# 1. Build Docker image
docker build -t metalpro-backend:latest .

# 2. Tag for ECR
docker tag metalpro-backend:latest \
  952956873675.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest

# 3. Login to ECR
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  952956873675.dkr.ecr.eu-central-1.amazonaws.com

# 4. Push to ECR
docker push 952956873675.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest

# 5. Force new deployment
aws ecs update-service \
  --cluster metalpro-production \
  --service metalpro-backend-task-service-cglk1ocr \
  --force-new-deployment \
  --region eu-central-1

# 6. Monitor deployment
aws ecs describe-services \
  --cluster metalpro-production \
  --services metalpro-backend-task-service-cglk1ocr \
  --region eu-central-1 \
  --query 'services[0].deployments'
```

### Full Frontend Deployment

```bash
#!/bin/bash
# Complete frontend deployment workflow

# 1. Build frontend
npm run build:skip-tests

# 2. Upload to S3
aws s3 sync ./dist s3://metal-direct-frontend/ \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

aws s3 cp ./dist/index.html s3://metal-direct-frontend/index.html \
  --cache-control "no-cache"

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E3ECMFUJEN6NSX \
  --paths "/*"
```

### Database Migration

```bash
#!/bin/bash
# Run database migrations via ECS task

# Create network config file
cat > /tmp/network-config.json << 'EOF'
{
  "awsvpcConfiguration": {
    "subnets": [
      "subnet-025e2b205be611248",
      "subnet-093b9f2d78be382ce",
      "subnet-09d7256e175589cd8"
    ],
    "securityGroups": ["sg-081894c2e23ed9edc"],
    "assignPublicIp": "ENABLED"
  }
}
EOF

# Create migration overrides
cat > /tmp/migration-overrides.json << 'EOF'
{
  "containerOverrides": [{
    "name": "metalpro-backend",
    "command": ["npx", "prisma", "migrate", "deploy"]
  }]
}
EOF

# Run migration task
aws ecs run-task \
  --cluster metalpro-production \
  --task-definition metalpro-backend-task:10 \
  --launch-type FARGATE \
  --network-configuration file:///tmp/network-config.json \
  --overrides file:///tmp/migration-overrides.json \
  --region eu-central-1
```

---

## Monitoring & Debugging

### Check Complete System Status

```bash
#!/bin/bash
# Complete health check of all services

echo "=== ECS Tasks ==="
aws ecs list-tasks \
  --cluster metalpro-production \
  --service-name metalpro-backend-task-service-cglk1ocr \
  --region eu-central-1 | \
jq -r '.taskArns[]' | \
xargs -I {} aws ecs describe-tasks \
  --cluster metalpro-production \
  --tasks {} \
  --region eu-central-1 \
  --query 'tasks[0].{TaskDef:taskDefinitionArn,HealthStatus:healthStatus,LastStatus:lastStatus}'

echo ""
echo "=== Target Health ==="
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:eu-central-1:952956873675:targetgroup/metalpro-backend-tg/98579a4ddb0ec4b1 \
  --region eu-central-1 \
  --query 'TargetHealthDescriptions[].{IP:Target.Id,State:TargetHealth.State}' \
  --output table

echo ""
echo "=== Backend Health ==="
curl -s http://metalpro-alb-1509305323.eu-central-1.elb.amazonaws.com/health | jq '.'

echo ""
echo "=== Frontend Health ==="
curl -s https://metal-direct.ro -o /dev/null -w "HTTP Status: %{http_code}\n"
```

---

## DNS Testing

### Check DNS Propagation

```bash
# Check via Google DNS
dig metal-direct.ro @8.8.8.8

# Check via Cloudflare DNS
dig metal-direct.ro @1.1.1.1

# Check NS records
dig metal-direct.ro NS @8.8.8.8

# Check directly from Route 53
dig @ns-466.awsdns-58.com metal-direct.ro
```

---

## Quick Reference

### Important ARNs and IDs

```bash
# AWS Account
952956873675

# ECS Cluster
metalpro-production

# ECS Service
metalpro-backend-task-service-cglk1ocr

# Task Definition Family
metalpro-backend-task

# ALB
metalpro-alb

# Target Group ARN
arn:aws:elasticloadbalancing:eu-central-1:952956873675:targetgroup/metalpro-backend-tg/98579a4ddb0ec4b1

# CloudFront Distribution
E3ECMFUJEN6NSX

# Route 53 Hosted Zone
Z0090057MKCWJVEBZUGQ

# Certificate (us-east-1)
arn:aws:acm:us-east-1:952956873675:certificate/5f5ceb09-663d-4c3b-b362-adc700d5b755

# S3 Buckets
metal-direct-frontend
metalpro-product-images

# ECR Repository
952956873675.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend
```

---

**Last Updated**: November 23, 2025
**Version**: 1.0.0
