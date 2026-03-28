FROM node:20 AS build
ARG VITE_BACKEND_URL=http://localhost:3000/api/v1
WORKDIR /build
COPY package.json .
RUN npm install --ignore-scripts --package-lock=false
COPY . .
RUN npm run build

FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .