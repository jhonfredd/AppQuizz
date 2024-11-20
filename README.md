# Aplicación Quizz

Aplicación completa que consta de un **frontend** desarrollado con React y Vite, y un **backend** basado en Node.js con conexion Express usando una base de datos MySQL.

---

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- **Node.js** (>= `v20.15.1`): [Descargar Node.js](https://nodejs.org/)
- **npm** (>= `v10.7.0`): Incluido con Node.js.
- **MySQL**: Servidor activo para manejar la base de datos.

---

## 🎨 Configuración del Frontend

### 1️⃣ Instalación de dependencias

En el directorio del **frontend**, ejecuta los siguientes comandos:

```bash
npm install
npm run dev
```

Esto iniciará el servidor de desarrollo. Deberías ver un mensaje como este:

```plaintext
 VITE v5.4.11  ready in 443 ms

  ➜  Local:   http://localhost:5173/login
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Abre el navegador en la dirección proporcionada junto a "Local".

### 2️⃣ Credenciales para el Login

- **Usuario**: `123@example.com`  
- **Contraseña**: `123`  

Estas credenciales te permitirán acceder a las vistas de los CRUD para gestionar preguntas y respuestas.

---

## ⚙️ Configuración del Backend

### 1️⃣ Configuración de la Base de Datos

En el directorio `backend`, encontrarás una carpeta llamada `base_datos_example` que contiene los archivos de ejemplo para la base de datos.

1. Crea una base de datos en MySQL con el nombre que prefieras.
2. Configura el archivo `.env` con los datos de tu entorno:

```plaintext
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_de_la_base_de_datos
```

### 2️⃣ Instalación de dependencias

En el directorio del **backend**, ejecuta los siguientes comandos:

```bash
npm install
npm start
```

Esto iniciará el servidor backend.

---

## 🛠️ Herramientas Utilizadas

- **Frontend**: React, Vite.
- **Backend**: Node.js, Express.
- **Base de Datos**: MySQL.

---

## 💡 Notas Adicionales

- Asegúrate de que tu servidor MySQL esté activo y configurado correctamente antes de iniciar el backend.
- Si tienes dudas o problemas, no dudes en contactarme.

---

¡Disfruta desarrollando y utilizando la **Aplicación Quizz**! 🎉
```