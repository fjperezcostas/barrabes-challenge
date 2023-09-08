FROM node:18-alpine
WORKDIR /barrabes-challenge
COPY public/ /barrabes-challenge/public
COPY src/ /barrabes-challenge/src
COPY package.json /barrabes-challenge
RUN npm install
RUN npm install -g serve
RUN npm run build
EXPOSE 80
CMD ["serve", "build", "-l", "80"]
