let handler = async (m, { conn }) => {
	let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
	let realJid = conn.getJid ? conn.getJid(target) : target;

	if (!global.db.data.users[realJid]) global.db.data.users[realJid] = {};
	let user = global.db.data.users[realJid];

	user.money = 999999999;
	user.limit = 999999999999;
	user.exp = 99999999999;
	user.level = 1000;

	let num = realJid.split('@')[0];
	m.reply(`🚗💨 *HESOYAM AKTIF!* (@${num})\n• Uang: 999,999,999\n• Limit: 999,999,999,999\n• EXP: 99,999,999,999\n• Level: 1000`, null, {
		mentions: [realJid, target],
	});
};

handler.help = ['hesoyam'];
handler.tags = ['owner'];
handler.command = /^(hesoyam)$/i;
handler.owner = true;

export default handler;
