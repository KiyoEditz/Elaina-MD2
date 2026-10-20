let handler = async (m, { conn, text }) => {
	if (!text) return m.reply('Masukkan nama baru untuk bot!\nContoh: *.setbotname Elaina-MD*');

	try {
		await conn.updateProfileName(text);
		global.namebot = text;
		m.reply(`✅ Sukses mengganti nama profil bot menjadi: *${text}*`);
	} catch (e) {
		console.error(e);
		m.reply(`❌ Gagal mengganti nama bot: ${e.message}`);
	}
};

handler.help = ['setbotname <nama>'];
handler.tags = ['owner'];
handler.command = /^(setbotname)$/i;
handler.owner = true;

export default handler;
