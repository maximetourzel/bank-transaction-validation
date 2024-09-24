# Dockerfile pour l'application Angular
# Étape de build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build --prod

# Étape de production
FROM nginx:alpine

COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
