import krakens from '../lib/krakendl.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*🚩 Contoh:* ${usedPrefix + command} https://krakenfiles.com/view/neTIvR1wIz/file.html`;
    try {
        const res = await krakens.download(text);
        if (res.error) throw res.error; 
        let msg = `乂 *K R A K E N  D O W N L O A D E R*\n\n`;
        msg += ` ◦ *Name* : ${res.fileName}\n`;
        msg += ` ◦ *Link* : ${res.downloadLink}\n`;

        if (res.thumbnail) {
            await conn.sendFile(m.chat, res.thumbnail, 'thumb.png', msg, m);
        }
        await conn.sendMessage(m.chat, { 
            document: { url: res.downloadLink }, 
            fileName: res.fileName + '.mp4', 
            mimetype: 'video/mp4' 
        }, { quoted: m });

    } catch (e) {
        throw `Error: ${e.message || e}`;
    }
};

handler.help = ['krakendl <url>'];
handler.tags = ['downloader'];
handler.command = /^(krakendl|krakendownload)$/i;
handler.limit = true;

export default handler;
