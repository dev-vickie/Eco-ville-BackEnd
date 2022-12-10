FROM node:18-buster

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV PORT 3000

RUN npx prisma generate

CMD ["npm","start"]