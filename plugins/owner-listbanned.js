let handler = async (m, { conn }) => {
	let users = Object.entries(global.db.data?.users || {}).filter(([_, u]) => u && u.banned);
	let chats = Object.entries(global.db.data?.chats || {}).filter(([_, c]) => c && c.isBanned);

	let text = `*〔 DAFTAR BANNED 〕*\n\n`;

	text += `*📌 Pengguna Dibanned (${users.length}):*\n`;
	if (users.length) {
		text += users.map(([jid, u], i) => `${i + 1}. @${jid.split('@')[0]} (${u.name || 'Tanpa Nama'})`).join('\n') + '\n\n';
	} else {
		text += '_Tidak ada pengguna yang dibanned._\n\n';
	}

	text += `*📌 Chat/Grup Dibanned (${chats.length}):*\n`;
	if (chats.length) {
		text += chats.map(([jid], i) => `${i + 1}. ${jid}`).join('\n');
	} else {
		text += '_Tidak ada chat yang dibanned._';
	}

	await conn.reply(m.chat, text.trim(), m, { mentions: users.map(([jid]) => jid) });
};

handler.help = ['listbanned'];
handler.tags = ['owner', 'info'];
handler.command = /^(listban(ned)?|ban(ned)?list|daftarban(ned)?)$/i;
handler.owner = true;

export default handler;
