import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Input Text Dan Karakter!\nContoh: *${usedPrefix + command} hai Kirito|Kirito*`;
    try {
        let [prompt, logic] = text.split('|');
        if (!prompt || !logic) throw `Format salah!\nContoh: *${usedPrefix + command} hai Kirito|Kirito*`;
        await m.reply('Tunggu sebentar...');
        let res = await fetch(`https://api.betabotz.eu.org/api/search/c-ai?prompt=${encodeURIComponent(prompt)}&char=${encodeURIComponent(logic)}&apikey=beta-KiyoEditz`);
        let json = await res.json();
        if (json.message) m.reply(json.message);
        else m.reply('Tidak ada respon dari karakter.');
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat menjalankan perintah: ' + (error.message || error));
    }
};

handler.help = ['c-ai', 'character-ai'];
handler.tags = ['tools'];
handler.command = /^(c-ai|character-ai)$/i;

export default handler;
