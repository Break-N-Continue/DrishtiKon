# ─────────────────────────────────────────────────────────────────────────────
# DrishtiKon — Environment Variables Template
# Copy this file to .env and fill in your values.
#
# LOCAL DEV:  docker compose up  (DynamoDB Local runs in Docker)
# PRODUCTION: values stored in AWS SSM Parameter Store, injected via SAM
# ─────────────────────────────────────────────────────────────────────────────

# JWT Secret (Base64-encoded, minimum 256 bits / 32 bytes)
# Generate with: openssl rand -base64 32
JWT_SECRET=<your-base64-jwt-secret>

# AWS SES SMTP credentials (same values as before migration)
SES_SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SES_SMTP_PORT=465
SES_SMTP_USERNAME=<your-ses-iam-smtp-username>
SES_SMTP_PASSWORD=<your-ses-smtp-password>
MAIL_FROM_EMAIL=no-reply@break-n-continue.live

# ── LOCAL DEV ONLY ─────────────────────────────────────────────────────────
# docker-compose.yml injects these automatically; no real AWS account needed.
# Uncomment only if running the API outside of docker-compose:
# DYNAMODB_ENDPOINT=http://localhost:8000
# AWS_ACCESS_KEY_ID=local
# AWS_SECRET_ACCESS_KEY=local
# AWS_REGION=ap-south-1

# ── CLOUDFLARE PAGES (set in CF Dashboard → Settings → Environment Variables)
# NEXT_PUBLIC_API_URL=https://<api-gateway-id>.execute-api.ap-south-1.amazonaws.com/api
