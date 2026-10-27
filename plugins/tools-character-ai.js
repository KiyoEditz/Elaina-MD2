import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Input Text Dan Karakter!\nContoh: *${usedPrefix + command} hai Kirito|Kirito*`;
    try {
        let [prompt, logic] = text.split('|');
        if (!prompt || !logic) throw `Format salah!\nContoh: *${usedPrefix + command} hai Kirito|Kirito*`;
        let lannKey = global.lann || global.APIKeys?.['https://api.betabotz.eu.org'] || 'XwxIaeoY';
        let res = await fetch(`https://api.betabotz.eu.org/api/search/c-ai?prompt=${encodeURIComponent(prompt)}&char=${encodeURIComponent(logic)}&apikey=${lannKey}`);
        let json = await res.json();
        if (json.message) m.reply(json.message);
        else m.reply('Tidak ada respon dari karakter.');
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat menjalankan perintah: ' + (error.message || error));
    }
};

handler.help = ['cai <teks|karakter>', 'character-ai <teks|karakter>'];
handler.tags = ['ai', 'tools'];
handler.command = /^(c-?ai|character-ai)$/i;

export default handler;
