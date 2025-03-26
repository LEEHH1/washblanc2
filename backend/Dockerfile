FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# 먼저 빌드 실행
RUN npm run build

EXPOSE 4000

# 프로덕션 모드 실행
CMD ["npm", "run", "start"]
