FROM node:latest
LABEL authors="lagunov"
WORKDIR /app
COPY package-lock.json ./
COPY package.json ./
RUN npm ci
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["npm", "run", "start:watch"]