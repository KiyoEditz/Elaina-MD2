let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan teks yang ingin dicari di chat ini!\n\nContoh: *${usedPrefix + command} halo|5*`;
    let [pesan, count] = text.split('|');
    let limit = Math.min(Math.max(parseInt(count) || 5, 1), 20);

    let found = [];
    if (conn.store?.messages?.[m.chat]) {
        let msgs = conn.store.messages[m.chat].array || [];
        found = msgs.filter(msg => {
            let txt = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            return txt.toLowerCase().includes(pesan.trim().toLowerCase());
        }).slice(-limit);
    } else if (conn.searchMessages) {
        let res = await conn.searchMessages(pesan.trim(), m.chat, limit, 1).catch(() => null);
        found = res?.messages || [];
    }

    if (found.length === 0) {
        return m.reply(`Tidak ditemukan pesan yang mengandung kata *"${pesan.trim()}"* di riwayat chat ini.`);
    }

    let txt = `🔍 Ditemukan *${found.length}* pesan dengan kata kunci *"${pesan.trim()}"*:\n\n`;
    for (let i = 0; i < found.length; i++) {
        let msg = found[i];
        let content = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '[Media / Lainnya]';
        let sender = msg.key?.participant || msg.participant || msg.key?.remoteJid || 'User';
        let senderJid = conn.getJid ? conn.getJid(sender) : sender;
        txt += `${i + 1}. *@${senderJid.split('@')[0]}*: ${content}\n`;
    }

    await m.reply(txt.trim(), null, {
        contextInfo: {
            mentionedJid: conn.parseMention(txt)
        }
    });
};

handler.help = ['caripesan <pesan>|<jumlah>'];
handler.tags = ['tools'];
handler.limit = true;
handler.command = /^caripesan$/i;

export default handler;
