FROM node:16.17.0
LABEL maintainer="acharyasamir421@gmail.com"
WORKDIR /app

COPY package.json ./

RUN npm install -g npm@9.4.0
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["npm", "start"]
