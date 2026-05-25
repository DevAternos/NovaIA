require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Configuración
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const MODEL_NAME = process.env.MODEL_NAME || 'gemma:31b';

// Crear cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Función para llamar a la API de Ollama
async function callOllama(prompt) {
    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false
        });
        return response.data.response;
    } catch (error) {
        console.error('Error al llamar a Ollama:', error.message);
        throw error;
    }
}

// Evento cuando el bot está listo
client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
    console.log(`Escuchando mensajes en los servidores...`);
});

// Evento cuando se recibe un mensaje
client.on('messageCreate', async (message) => {
    // Ignorar mensajes del propio bot
    if (message.author.bot) return;

    // Ignorar mensajes que no sean de canales de texto
    if (!message.channel.isTextBased()) return;

    try {
        // Mostrar indicador de "escribiendo..."
        message.channel.sendTyping();

        // Llamar a la API de Ollama con el contenido del mensaje
        const response = await callOllama(message.content);

        // Dividir la respuesta si es muy larga (límite de Discord: 2000 caracteres)
        const chunks = [];
        const maxLength = 2000;
        
        if (response.length <= maxLength) {
            chunks.push(response);
        } else {
            // Dividir por párrafos o líneas si es posible
            let remaining = response;
            while (remaining.length > 0) {
                if (remaining.length <= maxLength) {
                    chunks.push(remaining);
                    break;
                }
                
                // Intentar cortar en un salto de línea o espacio
                let cutIndex = remaining.lastIndexOf('\n\n', maxLength);
                if (cutIndex === -1) {
                    cutIndex = remaining.lastIndexOf('\n', maxLength);
                }
                if (cutIndex === -1) {
                    cutIndex = remaining.lastIndexOf(' ', maxLength);
                }
                if (cutIndex === -1) {
                    cutIndex = maxLength;
                }
                
                chunks.push(remaining.substring(0, cutIndex));
                remaining = remaining.substring(cutIndex).trim();
            }
        }

        // Enviar cada chunk como mensaje separado
        for (const chunk of chunks) {
            if (chunk.trim()) {
                await message.channel.send(chunk);
            }
        }
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        message.channel.send('Lo siento, ocurrió un error al procesar tu mensaje.').catch(console.error);
    }
});

// Iniciar el bot
if (!DISCORD_TOKEN) {
    console.error('Error: No se encontró el token de Discord. Asegúrate de configurar la variable de entorno DISCORD_TOKEN.');
    process.exit(1);
}

client.login(DISCORD_TOKEN);
