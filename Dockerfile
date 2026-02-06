FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy app files
COPY . .

# Expose ports
EXPOSE 3000 3001

# Start server
CMD ["npm", "start"]
