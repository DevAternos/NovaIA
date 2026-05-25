const axios = require('axios');
const config = require('../config/config');

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

module.exports = { callGemini };
