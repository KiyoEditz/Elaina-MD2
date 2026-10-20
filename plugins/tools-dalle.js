import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`Generate gambar dengan AI.\n\nContoh:\n*${usedPrefix + command} cyberpunk city in rain*`);
    await m.reply('_*Tunggu sedang diproses...*_');
    try {
        const response = await axios.get('https://widipe.com/dalle?text=' + encodeURIComponent(text), {
            responseType: 'arraybuffer'
        });
        return conn.sendFile(m.chat, Buffer.from(response.data), 'dalle.jpg', `Result From : ${text}`, m);
    } catch (error) {
        console.error(error);
        m.reply('Maaf, sepertinya ada yang error: ' + (error.message || error));
    }
};

handler.help = ['dalle'];
handler.tags = ['tools', 'ai'];
handler.limit = true;
handler.command = /^(dalle)$/i;

export default handler;
