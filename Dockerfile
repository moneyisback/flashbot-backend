# ➤ Base image
FROM node:20-alpine

# ➤ Create app directory
WORKDIR /app

# ➤ Copy dependencies
COPY package*.json ./
COPY yarn.lock ./

# ➤ Install deps
RUN yarn install

# ➤ Copy source
COPY . .

# ➤ Set ENV if needed (you can override with --env-file)
ENV NODE_ENV=production

# ➤ Default run: scanner
CMD ["yarn", "start:scanner"]
