FROM node:20 AS build
ARG VITE_BACKEND_URL=http://localhost:3000/api/v1
WORKDIR /build
COPY package.json .
RUN npm install --ignore-scripts --package-lock=false
COPY . .
RUN npm run build

FROM node:20-slim AS final
WORKDIR /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/server.js ./server.js
COPY --from=build /build/package.json ./package.json
RUN npm install --omit=dev --ignore-scripts --package-lock=false
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]