# KiraKira Nihongo - Dockerfile for Google Cloud Run with Litestream + SQLite
FROM node:24-alpine

# Install curl, ca-certificates, and litestream
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz && rm /tmp/litestream.tar.gz

WORKDIR /app

# Copy application files (zero npm dependencies required - pure Node v24 standard library)
COPY . .

# Copy and setup Litestream configuration and startup script
COPY litestream.yml /etc/litestream.yml
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

# Environment settings
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Execute entrypoint
CMD ["/app/run.sh"]
