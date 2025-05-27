# watchdog/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY ../backend/utils/crash-watcher.js /utils/crash-watcher.js
CMD ["node", "/utils/crash-watcher.js"]
