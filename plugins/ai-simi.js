import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
	if (!text) return m.reply(`Ketikkan pesan untuk SimSimi!\n\n*Contoh:* ${usedPrefix + command} halo simi`);

	try {
		let res = await fetch(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=id`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		let json = await res.json();
		let reply = json?.success || json?.response || json?.result;

		if (!reply || reply === 'gapaham banh:v') {
			return m.reply('Simi ga paham kamu ngomong apa :(');
		}

		await m.reply(reply);
	} catch (e) {
		console.error(e);
		m.reply('SimSimi sedang tidur atau server error.');
	}
};

handler.before = async function (m) {
	let chat = global.db.data?.chats?.[m.chat];
	if (chat?.simi && !chat?.isBanned) {
		if (/^.*(false|disable|turnoff|off|0)/i.test(m.text)) return;
		if (!m.text || m.isBaileys || m.fromMe) return;

		// Jangan respon jika ada prefix command
		let prefix = global.prefix;
		if (prefix && prefix.test(m.text)) return;

		try {
			let res = await fetch(`https://api.simsimi.net/v2/?text=${encodeURIComponent(m.text)}&lc=id`);
			if (!res.ok) return;

			let json = await res.json();
			let reply = json?.success || json?.response || json?.result;

			if (reply && reply !== 'gapaham banh:v') {
				await m.reply(reply);
			}
		} catch {}
	}
};

handler.help = ['simi <chat>'];
handler.tags = ['fun', 'ai'];
handler.command = /^((sim)?simi|simih)$/i;

export default handler;
