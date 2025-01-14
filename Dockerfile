# Use the official Node.js image from the Docker Hub
FROM node:22

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Add the .env file
# COPY /.env .env

# Bind the application to the specified port (default: 5000)
EXPOSE ${SERVICE_PORT:-5000}

# Command to run the application
CMD ["node", "index.js"]

# !! NEW -----------------------------------

# # FROM node:20
# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install --production
# # COPY . .
# # # Use environment variable for port with a default value
# # EXPOSE ${SERVICE_PORT}
# # CMD ["node", "index.js"]

# # Use the official Node.js image from the Docker Hub
# FROM node:22

# # Create and change to the app directory
# WORKDIR /usr/src/app

# # Copy the package.json and package-lock.json files
# COPY package*.json ./

# # Install the app dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Bind the application to port 5000
# EXPOSE 5000

# # Command to run the application
# CMD ["node", "index.js"]