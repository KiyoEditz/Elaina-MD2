let handler = async (m, { conn, text }) => {
	if (!text) return m.reply('Masukkan teks pesan yang ingin dibroadcast!');
	let chats = Object.keys(conn.chats || {});
	await m.reply(`⏳ _Mengirim pesan broadcast ke ${chats.length} chat..._`);

	let success = 0;
	for (let id of chats) {
		await sleep(1000);
		await conn
			.reply(id, `*〔 BROADCAST BOT 〕*\n\n${text}`.trim(), null)
			.then(() => success++)
			.catch(() => {});
	}
	m.reply(`✅ Broadcast selesai! Berhasil terkirim ke *${success}* chat.`);
};

handler.help = ['broadcast <teks>', 'bc <teks>'];
handler.tags = ['owner'];
handler.command = /^(broadcast|bc)$/i;
handler.owner = true;

export default handler;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
