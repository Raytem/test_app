FROM node:20

WORKDIR /webApp
COPY . .

RUN npm install
CMD ["npm", "start"]
