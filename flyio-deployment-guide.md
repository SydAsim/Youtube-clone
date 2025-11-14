# Fly.io Backend Deployment Guide

This guide documents the complete process of deploying a custom Node.js backend to Fly.io, including Docker configuration, secrets management, and troubleshooting.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Docker Configuration](#docker-configuration)
4. [Fly.io Configuration (fly.toml)](#flyio-configuration-flytoml)
5. [Environment Variables & Secrets](#environment-variables--secrets)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)
8. [How Fly.io Works with Docker](#how-flyio-works-with-docker)

## Overview

Fly.io is a platform for running applications close to your users globally. It automatically builds Docker images from your code and deploys them to their infrastructure.

### What We Deployed
- **Custom Node.js Backend** with Express.js
- **MongoDB Database** connection
- **Cloudinary Integration** for file uploads
- **JWT Authentication** system
- **Health Check endpoints**

## Prerequisites

1. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. **Fly CLI Installed**: 
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
3. **Fly CLI Authenticated**:
   ```bash
   fly auth login
   ```
4. **Project Structure**:
   ```
   backend/
   ├── src/
   │   ├── app.js
   │   ├── controllers/
   │   ├── models/
   │   ├── routes/
   │   └── utils/
   ├── index.js
   ├── package.json
   ├── Dockerfile
   └── fly.toml
   ```

## Docker Configuration

### What is Docker?
Docker containers package your application with all its dependencies into a standardized unit. Fly.io uses Docker to run your application consistently across their infrastructure.

### Our Dockerfile

```dockerfile
# syntax = docker/dockerfile:1

# Use Node.js 23.4.0 Alpine (lightweight Linux)
ARG NODE_VERSION=23.4.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Build stage - installs dependencies
FROM base AS build

# Install build tools needed for some Node.js packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy package files first (for Docker layer caching)
COPY package-lock.json package.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Final stage - smaller production image
FROM base

# Copy built application from build stage
COPY --from=build /app /app

# Expose port 3000 (internal port)
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
```

### How Our Dockerfile Works

1. **Multi-stage Build**: 
   - `build` stage: Installs dependencies and builds the app
   - `final` stage: Copies only the built app, reducing image size

2. **Layer Caching**: 
   - Package files are copied first to leverage Docker's layer caching
   - Dependencies are only re-installed when package.json changes

3. **Production Optimizations**:
   - Uses `slim` version of Node.js (smaller image)
   - Sets `NODE_ENV=production`
   - Uses `npm ci` for faster, reliable dependency installation

## Fly.io Configuration (fly.toml)

### What is fly.toml?
`fly.toml` is Fly.io's configuration file that tells Fly.io how to run your application. It's like a deployment manifest.

### Our fly.toml Configuration

```toml
# fly.toml app configuration file generated for youtube-backend

app = 'youtube-backend'
primary_region = 'syd'  # Sydney region

[build]  # Build configuration (uses Dockerfile by default)

[http_service]
  internal_port = 3000        # Port our app listens on inside container
  force_https = true          # Redirect HTTP to HTTPS
  auto_stop_machines = false  # Don't stop machines when idle
  auto_start_machines = true  # Start machines when traffic comes
  min_machines_running = 1    # Keep at least 1 machine running always
  processes = ['app']         # Process name

  # Health check configuration
  [[http_service.checks]]
    interval = "15s"          # Check every 15 seconds
    timeout = "2s"            # Timeout after 2 seconds
    grace_period = "5s"       # Wait 5 seconds after startup before checking
    method = "GET"            # HTTP GET method
    path = "/api/v1/healthcheck"  # Health check endpoint

# Machine configuration
[[vm]]
  memory = '1gb'              # 1GB RAM
  cpu_kind = 'shared'         # Shared CPU (cheaper)
  cpus = 1                    # 1 CPU core
```

### Key fly.toml Settings Explained

- **`internal_port`**: Port your app listens on INSIDE the container (3000)
- **`force_https`**: Automatically redirects HTTP to HTTPS
- **`auto_stop_machines`**: Controls whether Fly.io stops idle machines
- **`min_machines_running`**: Ensures your app is always available
- **Health Checks**: Fly.io checks your app to ensure it's running properly

## Environment Variables & Secrets

### Why Use Secrets?
Environment variables contain sensitive data (database URLs, API keys, secrets). Fly.io secrets are encrypted and only available to your application.

### Our Required Environment Variables

```bash
# Server Configuration
PORT=3000
CORS_ORIGIN=*  # or your frontend domain

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Authentication
ACCESS_TOKEN_SECRET=your_random_secret_string
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_string  
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Setting Secrets in Fly.io

```bash
# Set individual secrets
fly secrets set PORT=3000
fly secrets set MONGODB_URI='your_mongodb_connection_string'
fly secrets set CORS_ORIGIN='*'
fly secrets set ACCESS_TOKEN_SECRET='your_jwt_secret_here'
fly secrets set ACCESS_TOKEN_EXPIRY='15m'
fly secrets set REFRESH_TOKEN_SECRET='your_refresh_secret_here'
fly secrets set REFRESH_TOKEN_EXPIRY='7d'
fly secrets set CLOUDINARY_CLOUD_NAME='your_cloudinary_cloud_name'
fly secrets set CLOUDINARY_API_KEY='your_cloudinary_api_key'
fly secrets set CLOUDINARY_API_SECRET='your_cloudinary_api_secret'

# List all secrets
fly secrets list

# Remove a secret
fly secrets remove SECRET_NAME
```

### How Fly.io Secrets Work

1. **Encrypted Storage**: Secrets are encrypted at rest
2. **Runtime Injection**: Secrets are injected into your app's environment at startup
3. **Security**: Never logged or exposed in plaintext
4. **Version Control**: Secrets are tracked separately from your code

## Deployment Process

### Step 1: Initialize Fly.io App

```bash
# Navigate to your backend directory
cd backend

# Initialize the app (creates fly.toml)
fly launch

# Or create manually with name
fly launch --app youtube-backend
```

### Step 2: Configure Environment

```bash
# Set all required secrets
fly secrets set PORT=3000 MONGODB_URI='...' CORS_ORIGIN='*' ...
```

### Step 3: Deploy Application

```bash
# Build and deploy
fly deploy

# Watch deployment progress
fly deploy --watch
```

### Step 4: Verify Deployment

```bash
# Check app status
fly status

# Check logs
fly logs

# Check health
curl https://your-app-name.fly.dev/api/v1/healthcheck
```

### What Happens During Deployment?

1. **Docker Build**: Fly.io builds a Docker image using your Dockerfile
2. **Image Push**: Image is pushed to Fly.io's registry
3. **Machine Creation**: Fly.io creates virtual machines with your image
4. **Health Checks**: Fly.io verifies your app is running
5. **DNS Setup**: Your app gets a DNS name (app-name.fly.dev)

## Troubleshooting Common Issues

### Issue 1: 502 Bad Gateway
**Cause**: App not listening on the expected port
**Solution**: 
- Check `internal_port` in fly.toml matches your app's PORT
- Ensure your app listens on `0.0.0.0` not `127.0.0.1`

### Issue 2: ERR_TIMED_OUT
**Cause**: App crashing on startup or network routing issues
**Solutions**:
- Check logs: `fly logs`
- Verify environment variables: `fly secrets list`
- Try different region if network issues persist

### Issue 3: Health Check Failing
**Cause**: Health check endpoint not responding
**Solutions**:
- Verify health endpoint exists and returns 200
- Check health check path in fly.toml
- Increase grace_period if app takes time to start

### Issue 4: Auto-stopping Issues
**Cause**: Fly.io stopping idle machines
**Solutions**:
- Set `auto_stop_machines = false`
- Set `min_machines_running = 1`
- Implement proper health checks

## How Fly.io Works with Docker

### The Docker Integration Process

1. **Dockerfile Detection**: Fly.io automatically detects your Dockerfile
2. **Remote Build**: Your code is sent to Fly.io's builders
3. **Image Creation**: Docker builds the image in the cloud
4. **Registry Storage**: Image is stored in Fly.io's registry
5. **Machine Deployment**: Image is deployed to Fly.io machines

### Why Docker Matters for Fly.io

1. **Consistency**: Same environment everywhere
2. **Isolation**: Your app runs in isolation from others
3. **Portability**: Can run anywhere Docker runs
4. **Efficiency**: Layer caching for faster deployments
5. **Security**: Container boundaries provide security

### Fly.io's Docker Optimizations

1. **Multi-stage Builds**: Smaller final images
2. **Layer Caching**: Faster rebuilds
3. **Parallel Builds**: Multiple images built simultaneously
4. **Registry Integration**: Built-in Docker registry

## Production Best Practices

### Security
- Use strong secrets
- Enable HTTPS (Fly.io does this automatically)
- Set appropriate CORS origins
- Use environment-specific configurations

### Performance
- Use multi-stage Docker builds
- Optimize Docker layer caching
- Set appropriate machine resources
- Implement proper health checks

### Monitoring
- Monitor logs: `fly logs --follow`
- Check status: `fly status`
- Set up health checks
- Monitor machine resources

### Scaling
- Adjust `min_machines_running` for availability
- Scale manually: `fly scale count 2`
- Set up auto-scaling if needed

## Summary

Our YouTube backend deployment to Fly.io involved:

1. ✅ **Dockerfile**: Multi-stage build for optimized container image
2. ✅ **fly.toml**: Configuration for networking, health checks, and scaling
3. ✅ **Secrets Management**: Secure environment variable handling
4. ✅ **Health Checks**: Automated monitoring and restarts
5. ✅ **HTTPS**: Automatic SSL certificate management
6. ✅ **Global Deployment**: App running in Sydney region

The result is a production-ready, globally available backend API that can handle authentication, file uploads, and database operations reliably.

## Next Steps

1. Connect your frontend to the backend URL
2. Set up monitoring and alerting
3. Configure custom domain (optional)
4. Set up CI/CD for automatic deployments
5. Implement proper logging and monitoring

---

**Your Backend is Live!** 🚀
URL: `https://youtube-backend.fly.dev`
Health Check: `https://youtube-backend.fly.dev/api/v1/healthcheck`
