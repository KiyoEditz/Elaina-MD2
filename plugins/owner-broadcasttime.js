let handler = async (m, { conn, text }) => {
	let teks = m.quoted?.text || text;
	if (!teks) return m.reply('Masukkan teks atau reply pesan yang ingin dibroadcast!');

	let chats = Object.keys(conn.chats || {});
	await m.reply(`⏳ _Mengirim broadcast (delay 2 detik) ke ${chats.length} chat..._`);

	let success = 0;
	for (let id of chats) {
		await sleep(2000);
		await conn
			.reply(id, `*〔 BROADCAST DELAY 〕*\n\n${teks}`.trim(), null)
			.then(() => success++)
			.catch(() => {});
	}

	m.reply(`✅ Selesai mengirim broadcast ke *${success}* chat.`);
};

handler.help = ['broadcastdelay <teks>'];
handler.tags = ['owner'];
handler.command = /^(b(road)?c(ast)?(time|delay))$/i;
handler.owner = true;

export default handler;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
