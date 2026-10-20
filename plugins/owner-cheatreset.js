let handler = async (m, { conn }) => {
	let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	let realJid = conn.getJid ? conn.getJid(target) : target;

	if (!global.db.data.users[realJid]) global.db.data.users[realJid] = {};
	let user = global.db.data.users[realJid];

	user.limit = 20;
	user.exp = 0;
	user.level = 0;

	let num = realJid.split('@')[0];
	m.reply(`🔄 *Reset Berhasil untuk @${num}!*\nSemua EXP & Level direset ke 0, Limit kembali ke 20.`, null, {
		mentions: [realJid, target],
	});
};

handler.help = ['cheatreset'];
handler.tags = ['owner'];
handler.command = /^(cheatreset)$/i;
handler.owner = true;

export default handler;
