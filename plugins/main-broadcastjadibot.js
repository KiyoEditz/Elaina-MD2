let handler = async (m, { conn, text }) => {
	if (conn.user.jid !== global.conn?.user?.jid) throw false;
	if (!Array.isArray(global.conns)) global.conns = [];
	let users = [...new Set(global.conns.filter((c) => c && c.user && c.state !== 'close').map((c) => c.user?.jid || c.user))]
		.filter(Boolean);
	if (!users.length) return m.reply('Tidak ada bot clone (jadibot) yang aktif untuk dibroadcast.');

	let cc = text ? m : m.quoted ? await m.getQuotedObj() : m;
	let teks = text ? text : cc.text || '';
	let content = conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : '*〔 BROADCAST JADIBOT 〕*\n\n' + teks);
	for (let id of users) {
		await conn.copyNForward(id, content, true).catch(() => {});
	}
	conn.reply(m.chat, `_Berhasil mengirim broadcast ke ${users.length} bot clone_`, m);
};

handler.help = ['broadcastjadibot <teks>'];
handler.tags = ['main'];
handler.command = /^(broadcast|bc)(jadi)?bot$/i;
handler.owner = true;

export default handler;
