let handler = (m, { text, usedPrefix, command }) => {
    let teks = text || (m.quoted && m.quoted.text) || false;
    if (!teks) throw `_Masukkan teks yang ingin diubah ke kode Morse!_\n\nContoh:\n*${usedPrefix + command} halo dunia*`;

    const morseDict = {
        'a': '•–', 'b': '–•••', 'c': '–•–•', 'd': '–••', 'e': '•',
        'f': '••–•', 'g': '––•', 'h': '••••', 'i': '••', 'j': '•–––',
        'k': '–•–', 'l': '•–••', 'm': '––', 'n': '–•', 'o': '–––',
        'p': '•––•', 'q': '––•–', 'r': '•–•', 's': '•••', 't': '–',
        'u': '••–', 'v': '•••–', 'w': '•––', 'x': '–••–', 'y': '–•––',
        'z': '––••', '1': '•––––', '2': '••–––', '3': '•••––', '4': '••••–',
        '5': '•••••', '6': '–••••', '7': '––•••', '8': '–––••', '9': '––––•',
        '0': '–––––', ' ': '/'
    };

    let morse = teks.toLowerCase().split('').map(char => {
        return morseDict[char] || char;
    }).join(' ');

    m.reply(`*Hasil Encode Morse:*\n\n${morse}`);
};

handler.help = ['morse <teks>'];
handler.tags = ['fun', 'tools'];
handler.command = /^morse$/i;

export default handler;
