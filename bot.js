require('dotenv').config();

// ==========================================
// CONFIGURACIÓN
// ==========================================
const config = {
    // Discord
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    
    // Google Gemini (modelo más económico)
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
    
    // Ollama (alternativa)
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate',
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'gemma:7b',
    
    // Configuración del bot
    BOT_PREFIX: process.env.BOT_PREFIX || '!',
    MAX_MESSAGE_LENGTH: 2000
};

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Divide un mensaje largo en chunks que no excedan el límite de Discord
 * @param {string} text - El texto a dividir
 * @param {number} maxLength - Longitud máxima por chunk (default: 2000)
 * @returns {string[]} - Array de chunks de texto
 */
function splitMessage(text, maxLength = 2000) {
    const chunks = [];
    
    if (text.length <= maxLength) {
        return [text];
    }
    
    let remaining = text;
    
    while (remaining.length > 0) {
        if (remaining.length <= maxLength) {
            chunks.push(remaining);
            break;
        }
        
        // Intentar cortar en un salto de párrafo
        let cutIndex = remaining.lastIndexOf('\n\n', maxLength);
        
        // Si no hay párrafos, intentar con salto de línea
        if (cutIndex === -1) {
            cutIndex = remaining.lastIndexOf('\n', maxLength);
        }
        
        // Si no hay saltos de línea, intentar con espacio
        if (cutIndex === -1) {
            cutIndex = remaining.lastIndexOf(' ', maxLength);
        }
        
        // Si no hay espacios, cortar forzosamente
        if (cutIndex === -1) {
            cutIndex = maxLength;
        }
        
        chunks.push(remaining.substring(0, cutIndex));
        remaining = remaining.substring(cutIndex).trim();
    }
    
    return chunks;
}

// ==========================================
// SERVICIO GEMINI
// ==========================================

const axios = require('axios');

/**
 * Llama a la API de Google Gemini
 * @param {string} prompt - El mensaje/prompt a enviar
 * @returns {Promise<string>} - La respuesta del modelo
 */
async function callGemini(prompt) {
    try {
        const model = config.GEMINI_MODEL;
        const apiKey = config.GEMINI_API_KEY;
        
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY no está configurada');
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await axios.post(url, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        });

        if (response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content &&
            response.data.candidates[0].content.parts) {
            return response.data.candidates[0].content.parts[0].text;
        }

        throw new Error('Respuesta inesperada de Gemini API');
    } catch (error) {
        console.error('Error al llamar a Gemini:', error.message);
        throw error;
    }
}

// ==========================================
// BOT DE DISCORD
// ==========================================

const { Client, GatewayIntentBits } = require('discord.js');

// Crear cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento cuando el bot está listo
client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`📡 Escuchando mensajes en los servidores...`);
    console.log(`🤖 Usando modelo: ${config.GEMINI_MODEL}`);
});

// Evento cuando se recibe un mensaje
client.on('messageCreate', async (message) => {
    // Ignorar mensajes del propio bot
    if (message.author.bot) return;

    // Ignorar mensajes que no sean de canales de texto
    if (!message.channel.isTextBased()) return;

    try {
        // Mostrar indicador de "escribiendo..."
        await message.channel.sendTyping();

        // Llamar a la API de Gemini con el contenido del mensaje
        const response = await callGemini(message.content);

        // Dividir la respuesta si es muy larga
        const chunks = splitMessage(response, config.MAX_MESSAGE_LENGTH);

        // Enviar cada chunk como mensaje separado
        for (const chunk of chunks) {
            if (chunk.trim()) {
                await message.channel.send(chunk);
            }
        }
    } catch (error) {
        console.error('❌ Error al procesar el mensaje:', error.message);
        message.channel.send('Lo siento, ocurrió un error al procesar tu mensaje.').catch(console.error);
    }
});

// ==========================================
// VALIDACIÓN E INICIO
// ==========================================

// Validar configuración antes de iniciar
if (!config.DISCORD_TOKEN) {
    console.error('❌ Error: No se encontró el token de Discord.');
    console.error('   Asegúrate de configurar la variable de entorno DISCORD_TOKEN');
    process.exit(1);
}

if (!config.GEMINI_API_KEY) {
    console.error('❌ Error: No se encontró la API Key de Gemini.');
    console.error('   Asegúrate de configurar la variable de entorno GEMINI_API_KEY');
    process.exit(1);
}

// Iniciar el bot
client.login(config.DISCORD_TOKEN);
