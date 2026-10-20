let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.mentionedJid && m.mentionedJid[0]) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else if (m.isGroup) {
        throw `_Tag salah satu user atau reply pesan user!_\nContoh: *${usedPrefix + command} @user Agus*`;
    } else {
        who = m.chat;
    }

    let realJid = conn.getJid ? conn.getJid(who) : who;
    let name = text ? text.replace(/@[0-9]+/g, '').trim() : '';
    if (!name) name = conn.getName(realJid, { withoutContact: true }) || 'Contact';

    return conn.sendContact(m.chat, realJid, name, m);
};

handler.help = ['save @tag <nama>'];
handler.tags = ['tools', 'group'];
handler.command = /^save$/i;

export default handler;
