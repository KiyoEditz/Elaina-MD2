let handler = async (m, { conn }) => {
	let bot = conn.user.jid;
	let q = m.quoted ? m.quoted : m;
	let mime = (q.msg || q).mimetype || '';

	if (!mime || !/image/.test(mime)) {
		return m.reply('Kirim atau balas foto yang ingin dijadikan foto profil bot!');
	}

	try {
		let img = await q.download();
		if (!img) return m.reply('Gagal mengunduh foto.');

		await conn.updateProfilePicture(bot, img);
		m.reply('✅ Sukses mengganti foto profil bot!');
	} catch (e) {
		console.error(e);
		m.reply(`❌ Gagal mengubah foto profil: ${e.message}`);
	}
};

handler.help = ['setbotpp'];
handler.tags = ['owner'];
handler.command = /^(setbotpp)$/i;
handler.owner = true;

export default handler;
