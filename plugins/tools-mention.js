let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `_Masukkan teks bernomor yang berawalan @_\n\nContoh:\n*${usedPrefix + command} Halo @6285874068202 apa kabar?*`;
    m.reply(text, false, {
        contextInfo: {
            mentionedJid: conn.parseMention(text)
        }
    });
};

handler.help = ['mention @nomor'];
handler.tags = ['tools'];
handler.command = /^(mention|reply)$/i;

export default handler;
