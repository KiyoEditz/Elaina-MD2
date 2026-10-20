let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted) throw `Balas pesan yang ingin diberi reaction emoji!\n\nContoh:\n*${usedPrefix + command} 🗿*`;
    if (!text) throw `Masukkan 1 emoji!\n\nContoh:\n*${usedPrefix + command} 🗿*`;

    let emoji = text.trim();

    await conn.sendMessage(m.chat, {
        react: {
            text: emoji,
            key: m.quoted.fakeObj ? m.quoted.fakeObj.key : m.quoted.key ? m.quoted.key : {
                remoteJid: m.chat,
                id: m.quoted.id,
                fromMe: m.quoted.fromMe
            }
        }
    });
};

handler.help = ['react <emoji>'];
handler.tags = ['tools'];
handler.command = /^(react)$/i;

export default handler;
