FROM node:18

WORKDIR /app

COPY package*.json ./

# 모든 의존성 설치 (빌드에 필요한 devDependencies 포함)
RUN npm install

COPY . .

# 빌드 실행
RUN npm run build

# 이제 프로덕션용 의존성만 다시 설치 (선택 사항)
RUN npm prune --production

EXPOSE 4000

# 프로덕션 모드 실행
CMD ["npm", "run", "start"]