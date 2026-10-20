let handler = async (m, { conn, text, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';
	let pesan = m.quoted?.text || text || '';

	if (!mime || !/image/.test(mime)) {
		return m.reply(`Kirim atau balas gambar dengan caption *${usedPrefix + command} <pesan>*`);
	}

	try {
		let media = await q.download();
		if (!media) return m.reply('Gagal mengunduh gambar.');

		let getGroups = await conn.groupFetchAllParticipating().catch(() => ({}));
		let groupIds = Object.values(getGroups).map((g) => g.id);

		if (!groupIds.length) return m.reply('Bot belum bergabung ke grup manapun.');

		await m.reply(`⏳ _Mengirim broadcast gambar ke ${groupIds.length} grup..._`);

		let success = 0;
		for (let id of groupIds) {
			await sleep(1500);
			await conn
				.sendMessage(id, { image: media, caption: pesan ? `*〔 BROADCAST MEDIA 〕*\n\n${pesan}` : '*〔 BROADCAST MEDIA 〕*' })
				.then(() => success++)
				.catch(() => {});
		}

		m.reply(`✅ Sukses mengirim broadcast gambar ke *${success}* grup.`);
	} catch (e) {
		console.error(e);
		m.reply(`❌ Terjadi kesalahan: ${e.message}`);
	}
};

handler.help = ['broadcastimg <teks>', 'bcimg <teks>'];
handler.tags = ['owner'];
handler.command = /^(broadcastimg|bcimg)$/i;
handler.owner = true;

export default handler;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
