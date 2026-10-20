let handler = async (m, { conn }) => {
	let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	let realJid = conn.getJid ? conn.getJid(target) : target;

	if (!global.db.data.users[realJid]) global.db.data.users[realJid] = {};
	let user = global.db.data.users[realJid];

	user.limit = 999999999999;
	user.exp = 999999999999;
	user.level = 999;

	let num = realJid.split('@')[0];
	m.reply(`✅ *Cheat Aktif untuk @${num}!*\n• Limit: 999,999,999,999\n• EXP: 999,999,999,999\n• Level: 999`, null, {
		mentions: [realJid, target],
	});
};

handler.help = ['cheat'];
handler.tags = ['owner'];
handler.command = /^(cheat)$/i;
handler.owner = true;

export default handler;
