let handler = async (m, { text }) => {
	if (!m.isGroup) return global.dfail('group', m, conn);
	if (!text) {
		return m.reply(
			'Masukkan teks template welcome baru!\n\nKeyword yang tersedia:\n• *@user* : Mention member baru\n• *@subject* : Nama/Judul grup\n• *@desc* : Deskripsi grup\n\nContoh:\n*.setwelcome Halo @user, selamat datang di grup @subject!*'
		);
	}

	if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
	global.db.data.chats[m.chat].sWelcome = text;

	m.reply('✅ Pesan welcome untuk grup ini berhasil diatur!');
};

handler.help = ['setwelcome <teks>'];
handler.tags = ['owner', 'group'];
handler.command = /^setwelcome$/i;
handler.admin = true;
handler.group = true;

export default handler;
