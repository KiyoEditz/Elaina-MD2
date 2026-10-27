FROM node:22-bookworm-slim

# Install system dependencies: ffmpeg, webp tools, imagemagick, and build tools for native addons (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    webp \
    imagemagick \
    graphicsmagick \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency definitions and install
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Ensure working directories exist
RUN mkdir -p sessions tmp data

# Start the bot
CMD ["npm", "start"]
