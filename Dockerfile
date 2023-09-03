FROM node:20.5.1
WORKDIR /app/gateway
COPY ./ ./
RUN npm install
CMD [ "npm", "start" ]