let handler = async (m, { conn, usedPrefix }) => {
	if (!Array.isArray(global.conns)) global.conns = [];
	let users = [...new Set(global.conns.filter((c) => c && c.user && c.state !== 'close').map((c) => c.user))]
		.filter(Boolean);

	if (!users.length) {
		return m.reply('Belum ada bot clone (jadibot) yang aktif saat ini.');
	}

	let mentions = users.map((u) => u.jid || u);
	let text = `*〔 DAFTAR JADIBOT AKTIF 〕*\nTotal: ${users.length}\n\n` +
		users
			.map((v) => {
				let jid = v.jid || v;
				let num = jid.replace(/[^0-9]/g, '');
				return `• wa.me/${num}?text=${encodeURIComponent(usedPrefix + 'menu')} (@${num})`;
			})
			.join('\n');

	await conn.reply(m.chat, text, m, { mentions });
};

handler.help = ['listjadibot'];
handler.tags = ['info', 'main'];
handler.command = /^(list(jadi)?bot)$/i;

export default handler;
