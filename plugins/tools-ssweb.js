import axios from 'axios';

let handler = async (m, { args, conn, usedPrefix, command }) => {
    let url = args[0] || (m.quoted && m.quoted.text);
    if (!url) return conn.reply(m.chat, `Masukkan URL website!\n\n*Contoh:* *${usedPrefix + command} https://google.com*`, m);

    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    await m.reply('Sedang mengambil tangkapan layar website...');

    try {
        const response = await axios.get(`https://image.thum.io/get/width/1280/crop/800/${url}`, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `📸 *Screenshot Web:*\n${url}`
        }, { quoted: m });
    } catch (e) {
        m.reply(`Gagal mengambil screenshot: ${e.message || e}`);
    }
};

handler.help = ['ssweb <url>'];
handler.tags = ['tools'];
handler.command = /^(ssweb|screenshotweb)$/i;

export default handler;
