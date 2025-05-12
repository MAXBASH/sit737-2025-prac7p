# Use ARM64 Node image for M1 compatibility
FROM --platform=linux/arm64 node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY index.js .
COPY public ./public

# Add directory for public files if it doesn't exist
RUN mkdir -p public

# Create a simple index.html if it doesn't exist
RUN [ -f public/index.html ] || echo '<!DOCTYPE html><html><head><title>Todo App</title></head><body><h1>Todo App</h1><p>API is running.</p></body></html>' > public/index.html

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]