require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config/config');
const { callGemini } = require('./src/geminiService');
const { splitMessage } = require('./src/utils');

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
