#!/bin/bash

# Create backend directory and files
echo "Creating backend directory and files..."
mkdir -p backend

# backend/Dockerfile
cat << 'EOF' > backend/Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend's requirements file and install dependencies
# This is done first to leverage Docker's layer caching
COPY ./backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code into the container
COPY ./backend/ /app/
EOF

# backend/.env
# Note: This file contains sensitive data and should be added to .gitignore
cat << 'EOF' > backend/.env
# MySQL Settings
MYSQL_DATABASE=fastapi_db
MYSQL_USER=fastapi_user
MYSQL_PASSWORD=fastapi_password
MYSQL_ROOT_PASSWORD=supersecretrootpassword
EOF

# backend/.dockerignore
cat << 'EOF' > backend/.dockerignore
# Git specific
.git
.gitignore

# Docker specific
.dockerignore
Dockerfile
docker-compose.yml

# Environment files
.env
*.env

# Python specific cache and virtual environment
.venv/
venv/
__pycache__/
*.pyc

# IDE and OS specific files
.vscode/
.idea/
*.DS_Store

# Documentation
README.md

# Test artifacts
backend/.pytest_cache/
backend/htmlcov/
EOF

echo "Backend files created."

# Create frontend directory and files
echo "Creating frontend directory and files..."
mkdir -p frontend

# frontend/Dockerfile
cat << 'EOF' > frontend/Dockerfile
# Stage 1: Build the Angular application
# Use a specific Node.js version for reproducibility. Alpine images are smaller.
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application's source code
COPY . .

# IMPORTANT: Replace <your-project-name> with the name of your project.
# This command builds the app for production, and the output will be in /app/dist/<your-project-name>
RUN npm run build -- --output-path=./dist/frontend

# Stage 2: Serve the application from a lightweight Nginx server
# Use a stable, small Nginx image
FROM nginx:stable-alpine

# Copy the custom Nginx configuration file
# This is crucial for single-page applications (SPAs) like Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the 'builder' stage to Nginx's web root
# The source path should match the output-path from the build command in Stage 1
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# The default Nginx command will start the server.
# CMD ["nginx", "-g", "daemon off;"]
EOF

# frontend/nginx.conf
cat << 'EOF' > frontend/nginx.conf
server {
  listen 80;

  # Set the root directory to where the Angular app files are located
  root /usr/share/nginx/html;
  
  # This is the main configuration for a single-page application (SPA)
  # It tries to find a file matching the URI, then a directory,
  # and if it fails, it falls back to serving /index.html.
  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

# frontend/.dockerignore
cat << 'EOF' > frontend/.dockerignore
# Ignore node_modules, as they will be installed inside the container
node_modules

# Ignore local build artifacts
dist
.angular

# Ignore Docker files
Dockerfile
.dockerignore

# Ignore Git files and other common unnecessary files
.git
.gitignore
README.md
EOF

echo "Frontend files created."

# Create Docker Compose file
echo "Creating docker-compose.yml..."
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      # Expose MySQL port to the host machine for debugging/database clients
      - "3306:3306"
    volumes:
      # Persist database data
      - mysql_data:/var/lib/mysql

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    restart: always
    ports:
      - "8000:8000"
    volumes:
      # Mount the backend code for live reloading
      - ./backend:/app
    env_file:
      - ./backend/.env
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: angular_prod_container
    ports:
      # Map the Nginx port to the host
      - "80:80"
    restart: unless-stopped

volumes:
  mysql_data:

EOF

echo "docker-compose.yml created."

echo "Docker environment setup is complete!"