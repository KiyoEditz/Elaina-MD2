let linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let txt = text ? text : m.quoted ? m.quoted.text : false;
    if (!txt) throw `Masukkan link grup WhatsApp yang ingin diperiksa!\n\nContoh:\n*${usedPrefix + command} https://chat.whatsapp.com/xxxx*`;

    let [, code] = txt.match(linkRegex) || [];
    if (!code) throw 'Tautan undangan grup WhatsApp tidak valid!';

    let res = await conn.groupGetInviteInfo(code).catch(() => null);
    if (!res) {
        res = await conn.query({
            json: ["query", "invite", code],
            expect200: true
        }).catch(() => null);
    }
    if (!res) throw 'Gagal mengambil informasi grup. Pastikan link grup masih aktif dan tidak di-reset.';

    let creationDate = res.creation ? formatDate(res.creation * 1000) : '-';
    let subjectOwner = res.subjectOwner ? (conn.getJid ? conn.getJid(res.subjectOwner) : res.subjectOwner) : null;
    let descOwner = res.descOwner ? (conn.getJid ? conn.getJid(res.descOwner) : res.descOwner) : null;

    let caption = `╭──── 〔 *GROUP LINK INSPECTOR* 〕 ─⬣
│ 🆔 *ID*       : ${res.id}
│ 🏷️ *Nama*     : ${res.subject}
│ 📅 *Dibuat*   : ${creationDate}
│ 👥 *Anggota*  : ${res.size || (res.participants?.length || 0)} Member
${subjectOwner ? `│ ✏️ *Nama diedit*: @${subjectOwner.split('@')[0]}\n` : ''}${descOwner ? `│ 📝 *Deskripsi diedit*: @${descOwner.split('@')[0]}\n` : ''}╰────────────────────────⬣

📜 *Deskripsi Grup:*
${res.desc || '_Tidak ada deskripsi_'}`.trim();

    let pp = await conn.profilePictureUrl(res.id + '@g.us', 'image').catch(() => null);
    if (pp) {
        await conn.sendFile(m.chat, pp, 'group_icon.jpg', caption, m, false, {
            mentions: conn.parseMention(caption)
        });
    } else {
        await m.reply(caption, null, {
            contextInfo: {
                mentionedJid: conn.parseMention(caption)
            }
        });
    }
};

handler.help = ['inspectlink <link_grup>'];
handler.tags = ['tools'];
handler.command = /^(inspectlink|inspectgc|inspectgroup)$/i;

export default handler;

function formatDate(n, locale = 'id') {
    let d = new Date(n);
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
