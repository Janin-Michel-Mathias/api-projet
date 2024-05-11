# Build stage
FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]