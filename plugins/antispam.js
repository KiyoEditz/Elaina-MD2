let handler = async (m, { conn }) => {
	let chat = db.data.chats[m.chat];

	chat.antispam = !chat.antispam;
	if (!chat.antispam) chat.spamWarnings = {};

	await conn.sendMessage(m.chat, {
		text: `🛡️ *Anti Spam ${chat.antispam ? 'ON ✅' : 'OFF ❌'}*`,
	}, { quoted: m });
};

handler.help    = ['antispam'];
handler.tags    = ['group'];
handler.command = ['antispam'];
handler.group   = true;
handler.admin   = true;
handler.botAdmin = true;

export default handler;