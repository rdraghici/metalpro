# Production Deployment Guide

## Overview

This guide covers deploying the MetalPro Backend API to production on AWS infrastructure. The backend is containerized using Docker and can be deployed to AWS ECS (Elastic Container Service) or EC2.

---

## Prerequisites

### Required AWS Services

Before deployment, ensure you have:

- ✅ **AWS Account** with billing enabled
- ✅ **AWS RDS PostgreSQL** database instance
- ✅ **AWS ElastiCache Redis** instance
- ✅ **AWS SES** configured for email sending (see [AWS_SES_SETUP.md](./AWS_SES_SETUP.md))
- ✅ **AWS ECR** (Elastic Container Registry) repository created
- ✅ **AWS ECS** or **EC2** instances for hosting
- ✅ **AWS Load Balancer** (Application Load Balancer)
- ✅ **AWS Route 53** for DNS management
- ✅ **SSL Certificate** from AWS Certificate Manager

### Required Tools

Install these tools locally:

```bash
# Docker
docker --version  # Docker version 20.10+

# AWS CLI
aws --version     # AWS CLI version 2.0+

# Node.js (for local testing)
node --version    # Node.js 20 LTS
```

---

## Local Testing with Docker

### Step 1: Test Docker Build

Build the Docker image locally:

```bash
# Build the image
docker build -t metalpro-backend:local .

# Verify image size (should be ~200-300 MB)
docker images | grep metalpro-backend
```

### Step 2: Test with Docker Compose

Test the full stack locally:

```bash
# Start all services (PostgreSQL + Redis + Backend)
docker-compose up

# Check service health
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

**Expected Output:**
```
✅ Environment validation passed
🚀 MetalPro Backend Server Started
📡 Server running on: http://localhost:3001
```

### Step 3: Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# API info
curl http://localhost:3001/api

# Test authentication (should fail without token)
curl http://localhost:3001/api/users
```

---

## AWS Production Deployment

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────────┐                │
│  │   Route 53   │─────▶│  CloudFront CDN  │                │
│  │  (DNS)       │      │  (Static Assets)  │                │
│  └──────────────┘      └──────────────────┘                │
│                                                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │          Application Load Balancer               │       │
│  │          (SSL/TLS Termination)                   │       │
│  └──────────────────┬───────────────────────────────┘       │
│                     │                                        │
│       ┌─────────────┴─────────────┐                        │
│       │                           │                        │
│  ┌────▼─────┐              ┌──────▼────┐                  │
│  │  ECS Task│              │  ECS Task │                  │
│  │  Backend │              │  Backend  │                  │
│  │  Container│              │  Container│                  │
│  └────┬─────┘              └──────┬────┘                  │
│       │                           │                        │
│       └─────────┬─────────────────┘                        │
│                 │                                           │
│       ┌─────────┴──────────┐                              │
│       │                    │                              │
│  ┌────▼─────┐        ┌─────▼─────┐                       │
│  │   RDS    │        │ElastiCache│                       │
│  │PostgreSQL│        │   Redis   │                       │
│  └──────────┘        └───────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Deployment

### Step 1: Create AWS RDS PostgreSQL Database ✅

1. **Open AWS RDS Console**
2. **Create Database** (Standard Create):
   - **Engine**: PostgreSQL
   - **Engine Version**: 15.x (latest PostgreSQL 15)
   - **Templates**: Free tier (cost-effective for starting; switch to Production template for high availability)

   **Settings**:
   - DB instance identifier: `metalpro-production`
   - Master username: `metalpro_user`
   - Master password: (Generate strong password - **SAVE THIS!**)
   - Confirm password: (same as above)

   **Instance Configuration**:
   - DB instance class: `db.t3.micro` (Free tier eligible)

   **Storage**:
   - Storage type: `gp3`
   - Allocated storage: `20 GB`
   - Storage autoscaling: ✅ Enable (max 40 GB)

   **Connectivity**:
   - Virtual private cloud: Default VPC
   - Public access: **Yes** (secured with security group rules below)
   - VPC security group: Create new
   - New security group name: `metalpro-rds-sg`

   **Additional Configuration**:
   - Initial database name: `metalpro` (creates the database automatically)
   - Backup retention: 7 days
   - ✅ Enable deletion protection (prevents accidental deletion)

3. **Note the endpoint**: `metalpro-production.xxxxx.eu-central-1.rds.amazonaws.com`

4. **Configure Security Group** (Important for public access):
   - Go to EC2 → Security Groups → `metalpro-rds-sg`
   - **Inbound rules**:
     - Type: PostgreSQL
     - Protocol: TCP
     - Port: 5432
     - Source: Your IP (for initial setup/testing)
     - Source: Backend ECS security group (add after creating ECS service)
   - **Important**: Remove "Your IP" rule after deployment is complete and only allow ECS access

5. **Test Connection** (Optional - verify database is accessible):
```bash
# Connect to RDS from your local machine
psql -h metalpro-production.xxxxx.eu-central-1.rds.amazonaws.com \
     -U metalpro_user \
     -d metalpro

# Database 'metalpro' is already created from "Initial database name" setting
# Verify connection:
\l  # List databases
\q  # Quit
```

---

### Step 2: Create AWS ElastiCache Redis

1. **Open AWS ElastiCache Console**
2. **Create Redis Cluster**:
   - Cluster mode: Disabled
   - Name: `metalpro-redis-production`
   - Engine version: 7.x
   - Node type: cache.t3.micro (for small workloads)
   - Number of replicas: 1 (for high availability)
   - VPC: Same VPC as RDS and ECS
   - Security group: Allow Redis (6379) from backend security group

3. **Note the endpoint**: `metalpro-redis-production.xxxxx.cache.amazonaws.com:6379`

---

### Step 3: Push Docker Image to AWS ECR

1. **Create ECR Repository**:
```bash
# Create repository
aws ecr create-repository \
  --repository-name metalpro-backend \
  --region eu-central-1

# Note the repository URI
# Example: 123456789012.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend
```

2. **Authenticate Docker to ECR**:
```bash
# Get login password and authenticate
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.eu-central-1.amazonaws.com
```

3. **Build and Tag Image**:
```bash
# Build for production
docker build -t metalpro-backend:latest .

# Tag for ECR
docker tag metalpro-backend:latest \
  123456789012.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest
```

4. **Push Image to ECR**:
```bash
docker push 123456789012.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest
```

---

### Step 4: Create ECS Cluster and Task Definition

#### Option A: Using AWS Console

1. **Create ECS Cluster**:
   - Open ECS Console
   - Create Cluster
   - Cluster name: `metalpro-production`
   - Infrastructure: AWS Fargate (serverless) or EC2

2. **Create Task Definition**:
   - Family: `metalpro-backend-task`
   - Launch type: Fargate
   - CPU: 0.5 vCPU (or 1 vCPU for higher load)
   - Memory: 1 GB (or 2 GB for higher load)
   - Container definition:
     - Name: `metalpro-backend`
     - Image: `123456789012.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest`
     - Port mappings: 3001
     - Environment variables: (Load from .env.production)
     - Health check: CMD-SHELL, `curl -f http://localhost:3001/health || exit 1`

3. **Create ECS Service**:
   - Service name: `metalpro-backend-service`
   - Task definition: `metalpro-backend-task`
   - Desired tasks: 2 (for high availability)
   - Load balancer: Application Load Balancer
   - Target group: Create new (Port 3001)
   - Health check path: `/health`

#### Option B: Using AWS CLI

Create `task-definition.json`:
```json
{
  "family": "metalpro-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "metalpro-backend",
      "image": "123456789012.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3001"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:eu-central-1:123456789012:secret:metalpro/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:eu-central-1:123456789012:secret:metalpro/jwt-secret"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/metalpro-backend",
          "awslogs-region": "eu-central-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

---

### Step 5: Configure Application Load Balancer

1. **Create Target Group**:
   - Type: IP addresses (for Fargate)
   - Protocol: HTTP
   - Port: 3001
   - Health check path: `/health`
   - Health check interval: 30 seconds
   - Healthy threshold: 2
   - Unhealthy threshold: 3

2. **Create Load Balancer**:
   - Type: Application Load Balancer
   - Scheme: Internet-facing
   - Listeners:
     - HTTP (80) → Redirect to HTTPS
     - HTTPS (443) → Forward to target group
   - SSL Certificate: From AWS Certificate Manager

3. **Configure Security Groups**:
   - Load Balancer SG: Allow 80, 443 from 0.0.0.0/0
   - Backend SG: Allow 3001 from Load Balancer SG

---

### Step 6: Run Database Migrations

Before the first deployment, run Prisma migrations:

```bash
# SSH to bastion host or use ECS Exec
# Set environment variables
export DATABASE_URL="postgresql://metalpro_user:PASSWORD@metalpro-production.xxxxx.eu-central-1.rds.amazonaws.com:5432/metalpro"

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

Or use an ECS one-off task:
```bash
# Create a one-off task to run migrations
aws ecs run-task \
  --cluster metalpro-production \
  --task-definition metalpro-backend-task \
  --launch-type FARGATE \
  --override '{"containerOverrides":[{"name":"metalpro-backend","command":["npx","prisma","migrate","deploy"]}]}'
```

---

### Step 7: Configure DNS (Route 53)

1. **Create hosted zone**: `metalpro.ro`
2. **Create A record**:
   - Name: `api.metalpro.ro`
   - Type: A - IPv4 address
   - Alias: Yes
   - Alias target: Application Load Balancer DNS name

---

### Step 8: Verify Deployment

1. **Check service status**:
```bash
aws ecs describe-services \
  --cluster metalpro-production \
  --services metalpro-backend-service
```

2. **Test endpoints**:
```bash
# Health check
curl https://api.metalpro.ro/health

# Expected response:
# {"status":"healthy","service":"MetalPro Backend API","database":"connected","redis":"connected"}
```

3. **Monitor logs**:
```bash
# View CloudWatch Logs
aws logs tail /ecs/metalpro-backend --follow
```

---

## Environment Variables Management

### Using AWS Secrets Manager (Recommended)

```bash
# Store DATABASE_URL
aws secretsmanager create-secret \
  --name metalpro/database-url \
  --secret-string "postgresql://metalpro_user:PASSWORD@HOST:5432/metalpro"

# Store JWT_SECRET
aws secretsmanager create-secret \
  --name metalpro/jwt-secret \
  --secret-string "$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

# Store AWS SES credentials
aws secretsmanager create-secret \
  --name metalpro/aws-ses-credentials \
  --secret-string '{"AWS_ACCESS_KEY_ID":"AKIA...","AWS_SECRET_ACCESS_KEY":"..."}'
```

Update task definition to reference secrets (see `task-definition.json` example above).

---

## CI/CD Automation (Optional)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: metalpro-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster metalpro-production \
            --service metalpro-backend-service \
            --force-new-deployment
```

---

## Monitoring & Maintenance

### CloudWatch Alarms

Set up alarms for:
- CPU utilization > 80%
- Memory utilization > 80%
- Unhealthy target count > 0
- 5xx error rate > 1%

### Backup Strategy

- **Database**: Enable automated RDS backups (7-day retention minimum)
- **Logs**: CloudWatch Logs retention (30 days minimum)
- **Application data**: Regular snapshots of RDS database

### Scaling

**Auto Scaling Configuration**:
```bash
# Create auto scaling target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/metalpro-production/metalpro-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/metalpro-production/metalpro-backend-service \
  --policy-name cpu-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration \
    '{"TargetValue":70.0,"PredefinedMetricSpecification":{"PredefinedMetricType":"ECSServiceAverageCPUUtilization"}}'
```

---

## Rollback Procedure

If deployment fails:

1. **Rollback ECS service**:
```bash
# Find previous task definition revision
aws ecs list-task-definitions --family-prefix metalpro-backend-task

# Update service to previous revision
aws ecs update-service \
  --cluster metalpro-production \
  --service metalpro-backend-service \
  --task-definition metalpro-backend-task:PREVIOUS_REVISION
```

2. **Rollback database migrations** (if needed):
```bash
# Restore from RDS snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier metalpro-production-restored \
  --db-snapshot-identifier metalpro-production-snapshot-YYYY-MM-DD
```

---

## Cost Estimation

**Monthly AWS costs (approximate)**:

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| RDS PostgreSQL (db.t3.micro) | 20 GB storage | ~$20 |
| ElastiCache Redis (cache.t3.micro) | 1 node | ~$15 |
| ECS Fargate (2 tasks, 0.5 vCPU, 1 GB) | Running 24/7 | ~$30 |
| Application Load Balancer | 1 ALB | ~$25 |
| Data transfer | 100 GB/month | ~$10 |
| **Total** | | **~$100/month** |

*Costs will scale with usage. Enable AWS Cost Explorer for detailed tracking.*

---

## Security Checklist

Before production launch:

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable AWS WAF on Application Load Balancer
- [ ] Configure VPC security groups (least privilege)
- [ ] Enable RDS encryption at rest
- [ ] Enable CloudWatch Logs encryption
- [ ] Set up IAM roles with minimal permissions
- [ ] Enable AWS GuardDuty for threat detection
- [ ] Configure AWS Secrets Manager rotation
- [ ] Set up MFA for AWS root account
- [ ] Enable AWS CloudTrail for audit logging

---

## Troubleshooting

### Container fails to start

**Check logs**:
```bash
aws logs tail /ecs/metalpro-backend --follow
```

**Common issues**:
- Environment variables not set correctly
- Database connection failure (check security groups)
- Prisma client not generated (rebuild Docker image)

### Health check failures

**Check health endpoint**:
```bash
# SSH to ECS container
aws ecs execute-command \
  --cluster metalpro-production \
  --task TASK_ID \
  --container metalpro-backend \
  --interactive \
  --command "/bin/sh"

# Test health endpoint from inside container
curl http://localhost:3001/health
```

### Database connection issues

**Verify connectivity**:
```bash
# Test from ECS container
psql -h metalpro-production.xxxxx.eu-central-1.rds.amazonaws.com \
     -U metalpro_user \
     -d metalpro
```

**Check security groups**:
- Backend security group must allow outbound to RDS port 5432
- RDS security group must allow inbound from backend security group

---

## Support Resources

- **AWS Documentation**: https://docs.aws.amazon.com/ecs/
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Express.js Production**: https://expressjs.com/en/advanced/best-practice-performance.html
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/

---

**Last Updated**: November 23, 2025
**Version**: 1.0.0
