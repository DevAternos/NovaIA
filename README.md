# Discord Gemini Bot

Bot de Discord que utiliza la API de Google Gemini para responder mensajes.

## Características

- ✅ Usa **gemini-2.0-flash-lite**, el modelo más económico de Gemini
- ✅ Respuestas inteligentes generadas por IA
- ✅ Manejo automático de mensajes largos
- ✅ Todo el código en un solo archivo (`bot.js`)
- ✅ Fácil configuración

## Estructura del Proyecto

```
/workspace
├── bot.js                 # Archivo principal del bot (todo el código)
├── .env                   # Variables de entorno (configuración personal)
├── .env.example           # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## Instalación

1. Clona el repositorio e instala las dependencias:

```bash
npm install
```

2. Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

3. Edita `.env` y agrega tu token de Discord y API Key de Gemini:

```env
DISCORD_TOKEN=tu_token_de_discord_aqui
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
GEMINI_MODEL=gemini-2.0-flash-lite
```

## Uso

### Iniciar el bot:

```bash
npm start
```

### Modo desarrollo (con auto-reload):

```bash
npm run dev
```

## Modelos de Gemini Disponibles

| Modelo | Descripción | Costo |
|--------|-------------|-------|
| `gemini-2.0-flash-lite` | **Más barato** - Recomendado para este bot | $ |
| `gemini-2.0-flash` | Equilibrio entre velocidad y calidad | $$ |
| `gemini-1.5-flash` | Alternativa económica | $ |
| `gemini-1.5-pro` | Mayor capacidad de razonamiento | $$$ |

Para cambiar de modelo, modifica la variable `GEMINI_MODEL` en tu archivo `.env`.

## Comandos

El bot responde a **todos los mensajes** directamente. No requiere prefijo.

## Licencia

ISC
