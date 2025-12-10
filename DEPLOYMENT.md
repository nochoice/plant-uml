# Google Cloud Run Deployment Setup

This guide will help you set up automatic deployment to Google Cloud Run via GitHub Actions.

## Prerequisites

1. Google Cloud Platform account
2. GitHub repository with admin access
3. `gcloud` CLI installed (for initial setup)

## Step 1: Set up Google Cloud Project

1. Create a new GCP project or use an existing one
2. Enable required APIs:
```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

3. Create Artifact Registry repository:
```bash
gcloud artifacts repositories create plantuml-analyzer \
  --repository-format=docker \
  --location=europe-central2 \
  --description="PlantUML Analyzer container images"
```

## Step 2: Create Service Account

1. Create a service account for GitHub Actions:
```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"
```

2. Grant necessary permissions:
```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

3. Create and download service account key:
```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

1. **GCP_PROJECT_ID**: Your Google Cloud project ID
   ```
   Get it with: gcloud config get-value project
   ```

2. **GCP_SA_KEY**: Contents of the `key.json` file
   ```bash
   cat key.json
   ```
   Copy the entire JSON content

3. **OPENAI_API_KEY**: Your OpenAI API key
   ```
   Your OpenAI API key from https://platform.openai.com/api-keys
   ```

## Step 4: Deploy

Once secrets are configured, push to the master branch:

```bash
git add .
git commit -m "Add Cloud Run deployment"
git push origin master
```

The GitHub Action will:
1. Build a Docker image
```bash
# Configure Docker
gcloud auth configure-docker europe-central2-docker.pkg.dev


# Build and push image
IMAGE_URL=europe-central2-docker.pkg.dev/$PROJECT_ID/plantuml-analyzer/app
docker build -t $IMAGE_URL .
docker push $IMAGE_URL

# Deploy to Cloud Run
gcloud run deploy plantuml-analyzer \
  --image $IMAGE_URL \
  --platform managed \
  --region europe-central2 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your-key-here

```

## Accessing Your Application

After deployment, Cloud Run will provide a URL like:
```
https://plantuml-analyzer-xxxxx-uc.a.run.app
```

## Cost Optimization

Cloud Run pricing:
- First 2 million requests/month are free
- Pay only when the app is processing requests
- Automatically scales to zero when not in use

View logs:
```bash
gcloud run logs read plantuml-analyzer --region europe-central2
```

Check service status:
```bash
gcloud run services describe plantuml-analyzer --region europe-central2
```
Check service status:
```bash
gcloud run services describe plantuml-analyzer --region us-central1
```
