FROM node:18

WORKDIR /app

COPY package*.json ./

# 모든 의존성 설치 (빌드에 필요한 개발 의존성 포함)
RUN npm install

COPY . .

# 빌드 실행
RUN npm run build

# serve 패키지 설치 (정적 파일 서빙용)
RUN npm install -g serve

EXPOSE 3000

# 정적 파일을 제공하는 서버 실행
CMD ["serve", "-s", "dist"]