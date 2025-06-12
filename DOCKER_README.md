# Docker Setup Guide

This project provides both development and production Docker configurations.

## Files Overview

- `Dockerfile` - Simple development Dockerfile
- `Dockerfile.prod` - Multi-stage production Dockerfile with security best practices
- `docker-compose.yml` - Development environment with hot reload
- `docker-compose.prod.yml` - Production environment
- `docker-helper.ps1` - PowerShell script for easy Docker management

## Development Mode

The development setup includes:
- Hot reload with volume mounting
- Database sync enabled
- Detailed logging
- Development dependencies

### Start Development Environment

```powershell
# Quick start
docker-compose up --build

# Or run detached
docker-compose up -d --build

# View logs
docker-compose logs -f nestjs-app
```

## Production Mode

The production setup includes:
- Multi-stage build for smaller image size
- Non-root user for security
- Production dependencies only
- Health checks
- Proper logging setup

### Start Production Environment

```powershell
# Quick start
docker-compose -f docker-compose.prod.yml up --build

# Or run detached
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f nestjs-app-prod
```

## Environment Variables

### Development
Uses `.env` file with development-friendly settings.

### Production
1. Copy `.env.prod.example` to `.env.prod`
2. Update all values with strong, unique passwords and secrets
3. The production compose file will automatically use these values

## Useful Commands

```powershell
# Use the helper script
.\docker-helper.ps1

# Stop everything
docker-compose down
docker-compose -f docker-compose.prod.yml down

# Clean up volumes (WARNING: This deletes data)
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Check status
docker-compose ps
```

## Ports

- **Development**: `http://localhost:8000`
- **Production**: `http://localhost:80` (mapped to container port 8000)
- **Database**: `localhost:5432`
- **Redis**: `localhost:6379`

## Health Checks

Production containers include health checks:
- NestJS app: HTTP health endpoint
- PostgreSQL: `pg_isready` command
- Redis: `ping` command

## Security Features (Production)

- Non-root user (`nestjs`)
- Multi-stage build (smaller attack surface)
- Production dependencies only
- Proper file permissions
- Health monitoring
- Environment variable validation
