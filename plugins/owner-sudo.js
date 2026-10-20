let handler = async (m, { conn, text, usedPrefix }) => {
	let who = m.mentionedJid?.[0] || m.quoted?.sender;
	if (!who) return m.reply(`Tag orang yang ingin dijalankan perintahnya!\nContoh: *${usedPrefix}sudo @user .menu*`);

	let realJid = conn.getJid ? conn.getJid(who) : who;
	let txt = text.replace(/@[0-9]+/g, '').trim();
	if (!txt) return m.reply('Masukkan perintah yang ingin dijalankan!');

	let msg = {
		key: {
			remoteJid: m.chat,
			fromMe: false,
			id: 'SUDO_' + Date.now(),
			participant: m.isGroup ? realJid : undefined,
		},
		message: {
			extendedTextMessage: {
				text: txt,
			},
		},
	};

	await conn.ev.emit('messages.upsert', {
		messages: [msg],
		type: 'notify',
	});
};

handler.help = ['sudo <@user> <command>'];
handler.tags = ['owner'];
handler.command = /^sudo$/i;
handler.rowner = true;

export default handler;
