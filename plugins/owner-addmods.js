let handler = async (m, { conn, text }) => {
	let who = m.mentionedJid?.[0] || m.quoted?.sender || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : '');
	if (!who) return m.reply('Tag atau balas pesan orang yang ingin dijadikan Moderator!');

	let realJid = conn.getJid ? conn.getJid(who) : who;
	let num = realJid.split('@')[0];

	if (!Array.isArray(global.mods)) global.mods = [];
	if (global.mods.includes(num)) return m.reply(`@${num} sudah terdaftar sebagai Moderator!`, null, { mentions: [realJid, who] });

	global.mods.push(num);
	m.reply(`✅ Berhasil! @${num} sekarang menjadi Moderator Bot.`, null, { mentions: [realJid, who] });
};

handler.help = ['addmod <@user>'];
handler.tags = ['owner'];
handler.command = /^((add|\+)mod(s)?)$/i;
handler.rowner = true;

export default handler;
