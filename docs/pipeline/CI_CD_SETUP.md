# CI/CD Pipeline Setup for Metal Direct

## Overview

This document describes the automated CI/CD pipeline for deploying the Metal Direct application to AWS. The pipeline automatically deploys both the backend (Node.js/Express) and frontend (React) when changes are pushed to the `main` branch.

**Pipeline Triggers:**
- Push to `main` branch → Automatic deployment
- Backend and Frontend deploy in parallel
- No manual intervention required

**Deployment Targets:**
- **Backend**: AWS ECS Fargate (containerized)
- **Frontend**: AWS S3 + CloudFront CDN

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│                      (main branch)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │ git push
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions Workflow                    │
│                    (.github/workflows/)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────┐   ┌─────────────────────────┐   │
│  │  Backend Deployment   │   │  Frontend Deployment    │   │
│  │                       │   │                         │   │
│  │  1. Build Docker      │   │  1. Build React app     │   │
│  │  2. Push to ECR       │   │  2. Upload to S3        │   │
│  │  3. Update ECS        │   │  3. Invalidate CDN      │   │
│  └───────────┬───────────┘   └───────────┬─────────────┘   │
│              │                           │                  │
└──────────────┼───────────────────────────┼──────────────────┘
               │                           │
               ▼                           ▼
     ┌─────────────────┐         ┌──────────────────┐
     │  AWS ECR + ECS  │         │  AWS S3 + CF     │
     │  Backend Tasks  │         │  Static Files    │
     └─────────────────┘         └──────────────────┘
```

---

## Current AWS Infrastructure

| Resource | Name/ID | Details |
|----------|---------|---------|
| **Backend** |
| ECR Repository | `metalpro-backend` | `952956873675.dkr.ecr.eu-central-1.amazonaws.com/metalpro-backend` |
| ECS Cluster | `metalpro-production` | Fargate cluster |
| ECS Service | `metalpro-backend-task-service-cglk1ocr` | 2 tasks, auto-scaling |
| Task Definition | `metalpro-backend-task` | Latest revision: 11 |
| Load Balancer | ALB | `https://api.metal-direct.ro` |
| **Frontend** |
| S3 Bucket | `metal-direct-frontend` | Static website hosting |
| CloudFront Distribution | `E3ECMFUJEN6NSX` | CDN with SSL |
| Domain | `metal-direct.ro` | Route 53 DNS |
| **Region** |
| AWS Region | `eu-central-1` | Frankfurt |

---

## Prerequisites

Before setting up CI/CD, ensure:

- ✅ GitHub repository is created
- ✅ AWS infrastructure is deployed (completed ✅)
- ✅ GitHub has access to AWS (IAM user will be created)
- ✅ All secrets are stored in AWS Secrets Manager (completed ✅)

---

## Part 1: What I Will Do (Automated Setup)

I will create and configure the following files in your repository:

### 1. GitHub Actions Workflows

#### `.github/workflows/deploy-backend.yml`
**Purpose**: Deploy backend to AWS ECS when code is pushed to `main`

**Steps**:
1. Checkout code
2. Configure AWS credentials
3. Login to AWS ECR
4. Build Docker image
5. Tag image with commit SHA and `latest`
6. Push images to ECR
7. Update ECS service to trigger new deployment
8. Wait for deployment to stabilize
9. Verify health endpoint

**Trigger**: Push to `main` branch (changes in `backend/` or workflow file)

---

#### `.github/workflows/deploy-frontend.yml`
**Purpose**: Deploy frontend to S3 + CloudFront when code is pushed to `main`

**Steps**:
1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Build React production bundle
5. Configure AWS credentials
6. Sync build files to S3 bucket
7. Invalidate CloudFront cache
8. Verify deployment

**Trigger**: Push to `main` branch (changes in `frontend/` or workflow file)

---

### 2. IAM User for GitHub Actions

I will create a dedicated IAM user with the minimum required permissions:

**User Name**: `github-actions-metal-direct`

**Permissions**:
- ECR: Push/pull Docker images
- ECS: Update services, describe tasks
- S3: Upload/delete objects in frontend bucket
- CloudFront: Create cache invalidations

**IAM Policy** (least privilege principle):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSAccess",
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:ListTasks"
      ],
      "Resource": [
        "arn:aws:ecs:eu-central-1:952956873675:service/metalpro-production/*",
        "arn:aws:ecs:eu-central-1:952956873675:task/metalpro-production/*"
      ]
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::metal-direct-frontend",
        "arn:aws:s3:::metal-direct-frontend/*"
      ]
    },
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::952956873675:distribution/E3ECMFUJEN6NSX"
    }
  ]
}
```

### 3. Access Keys

I will generate AWS access keys for the GitHub Actions IAM user and provide them to you securely.

---

## Part 2: What You Need To Do (GitHub Configuration)

Once I provide the access keys, you need to configure GitHub Secrets:

### Step 1: Add GitHub Secrets

1. **Go to your GitHub repository**
2. **Click**: Settings → Secrets and variables → Actions → New repository secret

3. **Add the following secrets** (I will provide the values):

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS access key for GitHub Actions | `AKIA...` (I'll provide) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for GitHub Actions | (I'll provide) |
| `AWS_REGION` | AWS region | `eu-central-1` |
| `ECR_REGISTRY` | ECR registry URL | `952956873675.dkr.ecr.eu-central-1.amazonaws.com` |
| `ECR_REPOSITORY` | ECR repository name | `metalpro-backend` |
| `ECS_CLUSTER` | ECS cluster name | `metalpro-production` |
| `ECS_SERVICE` | ECS service name | `metalpro-backend-task-service-cglk1ocr` |
| `ECS_TASK_DEFINITION` | Task definition family | `metalpro-backend-task` |
| `S3_BUCKET` | Frontend S3 bucket | `metal-direct-frontend` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution | `E3ECMFUJEN6NSX` |

### Step 2: Verify Secrets

After adding secrets, verify they are configured:

1. Go to Settings → Secrets and variables → Actions
2. You should see all 10 secrets listed
3. GitHub will show only secret names (values are hidden)

---

## Deployment Flow

### When You Push to Main:

```
┌────────────────────────────────────────────────────────────┐
│  Developer pushes code to main branch                      │
└────────────────┬───────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  GitHub Actions triggers workflows                         │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────┐  ┌──────────────────────────┐│
│  │  Backend Workflow       │  │  Frontend Workflow       ││
│  │  (if backend/ changed)  │  │  (if frontend/ changed)  ││
│  └────────────┬────────────┘  └───────────┬──────────────┘│
│               │                            │               │
│               ▼                            ▼               │
│  ┌─────────────────────────┐  ┌──────────────────────────┐│
│  │  1. Build Docker image  │  │  1. Build React app      ││
│  │  2. Push to ECR         │  │  2. Upload to S3         ││
│  │  3. Update ECS service  │  │  3. Invalidate CDN       ││
│  │  ⏱ ~5-7 minutes        │  │  ⏱ ~3-5 minutes         ││
│  └─────────────────────────┘  └──────────────────────────┘│
│                                                              │
└────────────────┬───────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│  Deployment complete! 🎉                                    │
│  • Backend: https://api.metal-direct.ro                    │
│  • Frontend: https://metal-direct.ro                       │
└────────────────────────────────────────────────────────────┘
```

### Deployment Times:

| Component | Build Time | Deploy Time | Total |
|-----------|-----------|-------------|-------|
| Backend (Docker + ECS) | ~3-4 min | ~2-3 min | ~5-7 min |
| Frontend (React + S3 + CDN) | ~2-3 min | ~1-2 min | ~3-5 min |

---

## Monitoring Deployments

### Via GitHub Actions UI

1. Go to your repository
2. Click **Actions** tab
3. See workflow runs in real-time
4. Click on any run to see detailed logs
5. Each step shows success/failure status

### Via AWS Console

**Backend (ECS):**
```bash
# Watch deployment status
aws ecs describe-services \
  --cluster metalpro-production \
  --services metalpro-backend-task-service-cglk1ocr \
  --region eu-central-1

# Watch task health
aws ecs list-tasks \
  --cluster metalpro-production \
  --service-name metalpro-backend-task-service-cglk1ocr \
  --region eu-central-1
```

**Frontend (S3 + CloudFront):**
```bash
# Check S3 sync
aws s3 ls s3://metal-direct-frontend --recursive

# Check CloudFront invalidation
aws cloudfront get-invalidation \
  --distribution-id E3ECMFUJEN6NSX \
  --id <invalidation-id> \
  --region eu-central-1
```

---

## Rollback Procedures

### Backend Rollback

If a deployment fails or introduces bugs:

**Option 1: Automatic Rollback**
- ECS will automatically stop deploying if health checks fail
- Old tasks remain running

**Option 2: Manual Rollback via GitHub**
```bash
# Revert the problematic commit
git revert <commit-hash>
git push origin main

# GitHub Actions will automatically deploy the reverted code
```

**Option 3: Manual Rollback via AWS**
```bash
# List task definition revisions
aws ecs list-task-definitions \
  --family-prefix metalpro-backend-task \
  --region eu-central-1

# Update service to previous revision
aws ecs update-service \
  --cluster metalpro-production \
  --service metalpro-backend-task-service-cglk1ocr \
  --task-definition metalpro-backend-task:<PREVIOUS_REVISION> \
  --region eu-central-1
```

### Frontend Rollback

**Option 1: Via GitHub** (recommended)
```bash
git revert <commit-hash>
git push origin main
```

**Option 2: Via AWS S3**
```bash
# S3 versioning is enabled, restore previous version
aws s3api list-object-versions \
  --bucket metal-direct-frontend

aws s3api copy-object \
  --copy-source metal-direct-frontend/<key>?versionId=<version-id> \
  --bucket metal-direct-frontend \
  --key <key>
```

---

## Workflow Features

### 1. Path-Based Triggers

Workflows only run when relevant code changes:

- **Backend workflow**: Runs when `backend/**` or `Dockerfile` changes
- **Frontend workflow**: Runs when `frontend/**` changes

This saves time and compute resources.

### 2. Build Caching

- **Backend**: Docker layers are cached in ECR
- **Frontend**: npm dependencies are cached between builds

### 3. Health Checks

- **Backend**: Workflow verifies `/health` endpoint after deployment
- **Frontend**: Workflow checks if index.html is accessible

### 4. Deployment Status Badges

Add these to your README.md:

```markdown
![Backend Deployment](https://github.com/<your-username>/<repo-name>/actions/workflows/deploy-backend.yml/badge.svg)
![Frontend Deployment](https://github.com/<your-username>/<repo-name>/actions/workflows/deploy-frontend.yml/badge.svg)
```

---

## Security Best Practices

✅ **What We're Doing**:
- IAM user with least-privilege permissions
- Secrets stored in GitHub Secrets (encrypted)
- No secrets in code or logs
- AWS access keys rotated every 90 days (reminder)
- Separate IAM user for CI/CD (not root account)

🔒 **Additional Recommendations**:
- Enable GitHub branch protection on `main`
- Require pull request reviews before merging
- Enable GitHub Advanced Security (optional)
- Set up AWS CloudTrail to audit GitHub Actions activity

---

## Troubleshooting

### Backend Deployment Fails

**Symptom**: GitHub Actions shows "Deploy Backend" failed

**Common Causes**:
1. Docker build errors → Check `docker build` logs in GitHub Actions
2. ECR push failed → Verify IAM permissions for ECR
3. ECS service update timeout → Check ECS service health in AWS Console
4. Health check failed → Verify `/health` endpoint is working

**Debug Steps**:
```bash
# Check ECS service events
aws ecs describe-services \
  --cluster metalpro-production \
  --services metalpro-backend-task-service-cglk1ocr \
  --query 'services[0].events[0:5]'

# Check task logs
aws logs tail /ecs/metalpro-backend --follow
```

### Frontend Deployment Fails

**Symptom**: GitHub Actions shows "Deploy Frontend" failed

**Common Causes**:
1. Build errors → Check `npm run build` logs
2. S3 sync failed → Verify IAM permissions for S3
3. CloudFront invalidation timeout → Check distribution status

**Debug Steps**:
```bash
# Check S3 bucket contents
aws s3 ls s3://metal-direct-frontend/ --recursive

# Check CloudFront distribution
aws cloudfront get-distribution \
  --id E3ECMFUJEN6NSX
```

### GitHub Actions Not Triggering

**Symptom**: Workflow doesn't run after push to main

**Causes**:
1. Workflow file has syntax errors
2. Workflow is disabled in GitHub settings
3. Changes are in paths that don't trigger the workflow

**Fix**:
1. Go to Actions tab → Check for syntax errors
2. Actions → Enable workflow if disabled
3. Check `paths` filter in workflow file

---

## Cost Implications

**GitHub Actions (Free tier)**:
- 2,000 minutes/month for private repos
- Unlimited for public repos
- Each deployment: ~8-10 minutes total
- ~200 deployments/month within free tier

**AWS Costs (No additional cost)**:
- ECR storage: Existing image storage costs
- ECS: Pay for task runtime (already running)
- S3: Minimal additional cost for CI/CD uploads
- CloudFront: Invalidations: First 1,000/month free

**Estimated additional cost**: < $5/month

---

## Next Steps

After I create the workflows and IAM user:

1. **You**: Add GitHub Secrets (I'll provide values)
2. **You**: Test deployment by pushing a small change
3. **We**: Monitor first deployment together
4. **You**: Set up branch protection rules (recommended)

---

## Support & Documentation

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **AWS ECS Deployment**: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/
- **AWS S3 Static Hosting**: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

---

**Created**: November 24, 2025
**Author**: Claude (Metal Direct CI/CD Setup)
**Status**: Ready for implementation
