FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma needs this during build
ENV DATABASE_URL="postgresql://postgres:00aa1122@postgres:5432/test"

RUN npx prisma generate

EXPOSE 3001

# RUN npm run build

CMD ["npm", "run", "start:dev"]