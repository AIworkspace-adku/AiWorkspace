# Stage 1: Build the React app
FROM node:20.2.0-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only the package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the static files
FROM node:20.2.0-alpine

# Install 'serve' globally
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=builder /app/build /app/build

# Expose the port the app will run on
EXPOSE 3000

# Use 'serve' to serve the static files
CMD ["serve", "-s", "build", "-l", "3000"]
