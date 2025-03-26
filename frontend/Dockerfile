FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# 먼저 빌드 실행
RUN npm run build

EXPOSE 3000

# 정적 파일을 제공하는 서버 실행
CMD ["npx", "serve", "-s", "dist"]