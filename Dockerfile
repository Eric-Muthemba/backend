# Stage 1: Build the application
FROM node:16-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:16-alpine

WORKDIR /usr/src/app


# Install Prisma CLI for migrations and generating the client
RUN npm install -g prisma

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/dist ./dist

# Install only production dependencies
RUN npm ci --only=production

# Run Prisma migrations and generate the Prisma client
RUN prisma generate

EXPOSE 8080

CMD ["node", "dist/index.js"]
