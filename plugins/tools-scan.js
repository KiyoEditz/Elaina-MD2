let handler = async (m, { conn, args, usedPrefix, command }) => {
    let target = args[0] || (m.quoted ? m.quoted.sender : null) || (m.mentionedJid ? m.mentionedJid[0] : null);
    if (!target) throw `Masukkan nomor yang ingin dipindai!\n\nContoh:\n*${usedPrefix + command} 6285874068202*`;

    let cleanNum = target.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.slice(1);

    let [user] = await conn.onWhatsApp(cleanNum) || [];
    if (!user || !user.exists) {
        throw 'Nomor tersebut tidak terdaftar di WhatsApp!';
    }

    let jid = user.jid;
    let lid = user.lid;
    if (lid && conn.registerLid) {
        conn.registerLid(lid, jid);
    }

    let isInDatabase = false;
    if (global.db?.data?.users?.[jid] || (lid && global.db?.data?.users?.[lid])) {
        isInDatabase = true;
    }

    let sameGroup = [];
    let chats = Object.values(conn.chats || {}).filter(v => v.id?.endsWith('g.us') || v.jid?.endsWith('g.us'));
    for (let gc of chats) {
        let participants = gc.metadata?.participants || gc.participants || [];
        if (participants.some(p => p.id === jid || (lid && p.id === lid))) {
            sameGroup.push(gc.id || gc.jid);
        }
    }

    let str = `╭──── 〔 *SCAN WHATSAPP* 〕 ─⬣
│ 👤 *Nama*      : ${conn.getName(jid)}
│ 📱 *Nomor*     : +${cleanNum}
│ 💬 *Tag*       : @${cleanNum}
│ 🌐 *API*       : wa.me/${cleanNum}
│ 🆔 *JID*       : ${jid}
${lid ? `│ 🔑 *LID*       : ${lid}\n` : ''}│ 🏢 *Bisnis*    : ${user.isBusiness ? 'Ya' : 'Bukan'}
│ 💾 *Di Database*: ${isInDatabase ? 'Terdaftar' : 'Belum'}
│ 👥 *Grup Sama* : ${sameGroup.length} grup bersama bot
╰────────────────────────⬣`.trim();

    m.reply(str, m.chat, {
        contextInfo: {
            mentionedJid: conn.parseMention(str)
        }
    });
};

handler.help = ['scan <nomor>'];
handler.tags = ['tools'];
handler.command = /^scan$/i;

export default handler;
