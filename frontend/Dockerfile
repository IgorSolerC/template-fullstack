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
# CMD ["nginx", "-g", "daemon off;"] # <<< NÃO ESQUECER
