# GitHub Actions Deployment Setup Guide

This guide explains how to configure the required secrets and environment variables for the GitHub Actions workflow to deploy your Java application using Docker and EC2.

## 📋 Required GitHub Secrets

Before running the GitHub Actions workflow, you need to configure the following secrets in your GitHub repository:

### 🐳 Docker Hub Configuration

| Secret Name         | Description              | How to Get                                                           |
| ------------------- | ------------------------ | -------------------------------------------------------------------- |
| `DOCKER_USERNAME`   | Your Docker Hub username | Register at [hub.docker.com](https://hub.docker.com)                 |
| `DOCKER_TOKEN`      | Docker Hub access token  | Generate in Docker Hub → Account Settings → Security → Access Tokens |
| `DOCKER_REPO_NAME`  | Docker repository name   | Create repository in Docker Hub (e.g., `my-java-app`)                |
| `DOCKER_IMAGE_NAME` | Container name on EC2    | Choose a name for your running container (e.g., `drishti-kon-app`)   |

### ☁️ AWS EC2 Configuration

| Secret Name   | Description                    | How to Get                                                                 |
| ------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `EC2_HOST`    | EC2 instance IP or hostname    | AWS Console → EC2 → Instances → Select instance → Copy Public IPv4 address |
| `EC2_USER`    | SSH username for EC2           | Usually `ubuntu` for Ubuntu AMI, `ec2-user` for Amazon Linux               |
| `EC2_SSH_KEY` | Private SSH key for EC2 access | Download .pem file when creating EC2 key pair                              |

## 🔧 Step-by-Step Setup Instructions

### 1. Docker Hub Setup

1. **Create Docker Hub Account**
   - Visit [hub.docker.com](https://hub.docker.com)
   - Register for a free account

2. **Create Repository**
   - Click "Create Repository"
   - Set repository name (e.g., `drishti-kon`)
   - Keep it public or private based on preference

3. **Generate Access Token**
   - Go to Account Settings → Security → Access Tokens
   - Click "New Access Token"
   - Name it "GitHub Actions"
   - Copy the generated token

### 2. AWS EC2 Setup

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS AMI (recommended)
   - Select instance type (t2.micro for testing)
   - Create or select existing key pair
   - Configure security group to allow SSH (port 22) and HTTP (port 8080)

2. **Install Docker on EC2**

   ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker ubuntu
   ```

3. **Configure SSH Key**
   - Download the .pem file when creating the key pair
   - Copy the entire contents of the .pem file (including headers)

### 3. GitHub Repository Secrets Configuration

1. **Navigate to Repository Settings**
   - Go to your GitHub repository
   - Click on "Settings" tab
   - Select "Secrets and variables" → "Actions"

2. **Add Repository Secrets**
   Click "New repository secret" for each of the following:

   **Docker Secrets:**
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_TOKEN`: Access token from Docker Hub
   - `DOCKER_REPO_NAME`: Your Docker repository name
   - `DOCKER_IMAGE_NAME`: Container name (e.g., `drishti-kon-app`)

   **EC2 Secrets:**
   - `EC2_HOST`: EC2 public IP address (e.g., `3.15.123.456`)
   - `EC2_USER`: SSH username (usually `ubuntu`)
   - `EC2_SSH_KEY`: Complete contents of your .pem file

## 🚀 How to Run the Workflow

1. **Go to Actions Tab**
   - Navigate to your GitHub repository
   - Click on the "Actions" tab

2. **Select Workflow**
   - Find "Docker Build -> Push -> Deploy" workflow
   - Click on it

3. **Run Workflow**
   - Click "Run workflow" button
   - Select branch (usually `main`)
   - Choose environment (production/staging)
   - Click "Run workflow"

## 📝 Example Secret Values

```
DOCKER_USERNAME=myusername
DOCKER_TOKEN=dckr_pat_1234567890abcdef...
DOCKER_REPO_NAME=drishti-kon
DOCKER_IMAGE_NAME=drishti-kon-app
EC2_HOST=3.15.123.456
EC2_USER=ubuntu
EC2_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

## 🔒 Security Best Practices

1. **Never commit secrets to your repository**
2. **Use access tokens instead of passwords**
3. **Regularly rotate access tokens**
4. **Limit EC2 security group access to your IP when possible**
5. **Use least privilege access for all credentials**

## 🛠️ Prerequisites

Make sure your project has:

- `mvnw` (Maven wrapper) executable
- `Dockerfile` in the project root
- Java 21 compatible application
- Port 8080 exposed in your application

## 🐛 Troubleshooting

### Common Issues:

- **Docker login fails**: Check DOCKER_TOKEN is correctly set
- **SSH connection fails**: Verify EC2_HOST, EC2_USER, and EC2_SSH_KEY
- **Build fails**: Ensure your application compiles with Java 21
- **Port access**: Check EC2 security group allows port 8080

### Debug Steps:

1. Check GitHub Actions logs for specific error messages
2. Verify all secrets are correctly set in repository settings
3. Test SSH connection manually: `ssh -i your-key.pem ubuntu@your-ec2-ip`
4. Ensure EC2 instance has Docker installed and running

## 📞 Need Help?

If you encounter issues:

1. Check the GitHub Actions workflow logs
2. Verify all secrets are properly configured
3. Test individual components (Docker build, SSH connection) separately
4. Review AWS EC2 security groups and network settings
