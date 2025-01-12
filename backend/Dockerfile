# Use a lightweight base image
FROM node:20.2.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package files to leverage Docker caching
COPY package*.json ./

# Install only production dependencies for a lean image
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set NODE_ENV to production for better performance
ENV NODE_ENV=production

# Use a robust CMD instruction to start the app
CMD ["npm", "start"]