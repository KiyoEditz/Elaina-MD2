let handler = async (m, { conn, text }) => {
	if (!text) return m.reply('Masukkan nama/judul baru untuk grup!');

	try {
		await conn.groupUpdateSubject(m.chat, text);
		m.reply(`✅ Sukses mengubah nama grup menjadi: *${text}*`);
	} catch (e) {
		console.error(e);
		m.reply(`❌ Gagal mengubah nama grup: ${e.message}`);
	}
};

handler.help = ['setsubject <judul>'];
handler.tags = ['owner', 'group'];
handler.command = /^((set)?(judul|subje(ct|k)))$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
