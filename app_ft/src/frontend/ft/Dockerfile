FROM node:20

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo package.json para instalar dependencias primero
COPY package*.json ./

# Instalar Ionic CLI y Angular CLI globalmente + dependencias locales
RUN npm install -g @ionic/cli @angular/cli && npm install

# Copiar todo el proyecto
COPY . .

# Exponer puerto de Ionic
EXPOSE 8100

# Comando por defecto
CMD ["ionic", "serve", "--external"]
