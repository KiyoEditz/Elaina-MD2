let handler = async (m, { conn, args, usedPrefix }) => {
	if (!args[0]) return m.reply(`Masukkan link undangan grup WhatsApp!\nContoh: *${usedPrefix}join https://chat.whatsapp.com/xxxx*`);

	const regexLink = /chat\.whatsapp\.com\/([A-Za-z0-9_-]{10,})/i;
	const match = args[0].match(regexLink);

	if (!match) return m.reply('Format link undangan grup tidak valid.');

	const code = match[1];
	try {
		let res = await conn.groupAcceptInvite(code);
		m.reply(`✅ Berhasil bergabung ke grup! ${res ? '(ID: ' + res + ')' : ''}`);
	} catch (err) {
		console.error(err);
		m.reply('❌ Gagal bergabung. Kemungkinan link telah direset atau bot dibanned dari grup tersebut.');
	}
};

handler.help = ['join <link>'];
handler.tags = ['owner', 'group'];
handler.command = /^join$/i;
handler.owner = true;

export default handler;
