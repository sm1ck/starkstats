FROM node:20-alpine
WORKDIR /node
COPY server .
COPY client .
EXPOSE 5000
WORKDIR /node/server
CMD ["npm", "start"]