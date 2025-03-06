# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем приложение в режиме разработки
CMD ["npm", "run", "start"]
