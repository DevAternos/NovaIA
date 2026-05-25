# Bot de Discord con Ollama (Node.js)

Este bot de Discord se conecta a la API de Ollama y utiliza el modelo `gemma:31b` para procesar mensajes y responder automáticamente.

## Requisitos previos

1. **Node.js** instalado (versión 16 o superior)
2. **Ollama** instalado y ejecutándose localmente
3. El modelo `gemma:31b` descargado en Ollama
4. Un token de bot de Discord

## Instalación

### 1. Instalar dependencias de Node.js

```bash
npm install
```

### 2. Configurar Ollama

Asegúrate de tener Ollama instalado y el modelo `gemma:31b` descargado:

```bash
ollama pull gemma:31b
```

Inicia Ollama si no está corriendo:

```bash
ollama serve
```

### 3. Configurar el bot de Discord

1. Ve al [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot
5. En la sección "OAuth2" > "URL Generator", selecciona los scopes `bot` y los permisos necesarios (al menos "Send Messages" y "Read Message History")
6. Usa la URL generada para invitar al bot a tu servidor

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu token de Discord:

```
DISCORD_TOKEN=tu_token_de_discord_aqui
OLLAMA_API_URL=http://localhost:11434/api/generate
MODEL_NAME=gemma:31b
```

## Ejecución

Para iniciar el bot:

```bash
npm start
```

o

```bash
node bot.js
```

## Funcionamiento

- El bot escucha todos los mensajes en los canales de texto donde tiene permiso
- Ignora sus propios mensajes para evitar bucles infinitos
- Envía cada mensaje recibido a la API de Ollama
- Procesa la respuesta y la envía de vuelta al canal
- Divide automáticamente las respuestas largas en múltiples mensajes (límite de Discord: 2000 caracteres)
- Muestra el indicador de "escribiendo..." mientras procesa

## Personalización

Puedes cambiar el modelo editando la variable `MODEL_NAME` en el archivo `.env`:

```
MODEL_NAME=otro_modelo
```

También puedes cambiar la URL de Ollama si está en otro servidor:

```
OLLAMA_API_URL=http://tu-servidor:11434/api/generate
```

## Notas

- Asegúrate de que Ollama esté accesible desde la máquina donde corre el bot
- El modelo `gemma:31b` requiere recursos significativos de GPU/CPU
- Las respuestas pueden tardar dependiendo del hardware y la longitud del mensaje
