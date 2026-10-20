let handler = async (m, { conn, text }) => {
	let jid = conn.getJid ? conn.getJid(m.sender) : m.sender;
	let user = global.db.data.users[jid] || global.db.data.users[m.sender];
	if (!user) {
		user = global.db.data.users[jid] = {};
	}
	user.afk = +new Date();
	user.afkReason = text || '';
	let name = conn.getName ? conn.getName(m.sender) : m.pushName || m.sender.split('@')[0];
	m.reply(`*${name}* sekarang AFK${text ? ': ' + text : ''}`.trim());
};

handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = /^afk$/i;

export default handler;
