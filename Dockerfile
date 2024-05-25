FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV MODEL_URL=https://storage.googleapis.com/dermaone-model/model.json

CMD ["npm", "start"]