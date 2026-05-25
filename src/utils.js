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

module.exports = { splitMessage };
