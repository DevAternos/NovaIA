require('dotenv').config();

module.exports = {
    // Discord
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    
    // Google Gemini
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
    
    // Ollama (alternativa)
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate',
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'gemma:7b',
    
    // Configuración del bot
    BOT_PREFIX: process.env.BOT_PREFIX || '!',
    MAX_MESSAGE_LENGTH: 2000
};
