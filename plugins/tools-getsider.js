let handler = async (m, { conn }) => {
    if (!m.quoted) throw 'Reply pesan bot yang ingin dicek pembacanya!';
    if (!m.quoted.fromMe) throw 'Hanya bisa mengecek pesan yang dikirim oleh bot!';
    if (!m.quoted.id) throw 'Pesan tidak memiliki ID!';

    let members = m.quoted.chat.endsWith('g.us') 
        ? ((await conn.groupMetadata(m.quoted.chat).catch(() => null))?.participants?.length || 1) - 1 
        : m.quoted.chat.endsWith('@broadcast') ? -1 : 1;

    let info = await conn.messageInfo(m.quoted.chat, m.quoted.id).catch(() => null);
    if (!info) throw 'Tidak dapat mengambil info pembaca untuk pesan ini.';

    let { reads = [], deliveries = [] } = info;

    let readList = reads.sort((a, b) => b.t - a.t).map(({ jid, t }) => {
        let realJid = conn.getJid ? conn.getJid(jid) : jid;
        return `@${realJid.split('@')[0]} (${formatDate(t * 1000)})`;
    }).join('\n') || '-';

    let delivList = deliveries.sort((a, b) => b.t - a.t).map(({ jid, t }) => {
        let realJid = conn.getJid ? conn.getJid(jid) : jid;
        return `@${realJid.split('@')[0]} (${formatDate(t * 1000)})`;
    }).join('\n') || '-';

    let txt = `╭──── 〔 *SIDER CHECKER* 〕 ─⬣
│ 👁️ *Dibaca oleh (${reads.length}):*
${readList}
${members > 1 ? `\n_Tersisa ${Math.max(0, members - reads.length)} belum membaca_\n` : ''}
│ 📬 *Tersampaikan ke (${deliveries.length}):*
${delivList}
╰────────────────────────⬣`.trim();

    m.reply(txt, null, {
        contextInfo: {
            mentionedJid: conn.parseMention(txt)
        }
    });
};

handler.help = ['getsider'];
handler.tags = ['tools', 'group'];
handler.command = /^getsider$/i;
handler.group = true;

export default handler;

function formatDate(n, locale = 'id') {
    let d = new Date(n);
    return d.toLocaleTimeString(locale, {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
}
