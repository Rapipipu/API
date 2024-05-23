FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV MODEL_URL=https://storage.googleapis.com/mlgc-submission-gcc-rafi/submission-model/model.json

CMD ["npm", "start"]