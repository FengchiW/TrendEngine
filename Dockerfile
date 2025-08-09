# Use the official Cypress image with browsers and Node.js
FROM cypress/browsers:node-22.17.1-chrome-129.0.6647.137-1-ff-129.0-edge-129.0.2792.81-1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for the dev server
EXPOSE 5173
