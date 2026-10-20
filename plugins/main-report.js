let handler = async (m, { conn, text, usedPrefix }) => {
	const tutor = `*Cara Melaporkan Fitur / Bug:*\n\n1. Reply pesan yang error/bermasalah\n2. Ketik: *${usedPrefix}report <penjelasan masalah>*\n\nContoh:\n*${usedPrefix}report Fitur TikTok download gagal merespon*`;

	if (!text) return m.reply(tutor);
	if (!m.quoted || !m.quoted.text) return m.reply(tutor);

	let ownerNum = Array.isArray(global.owner?.[0]) ? global.owner[0][0] : global.owner?.[0] || global.numberowner;
	let ownerJid = ownerNum.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

	let senderNum = (conn.getJid ? conn.getJid(m.sender) : m.sender).split('@')[0];
	let laporan = `*〔 LAPORAN FITUR / BUG 〕*\n\n• *Pengirim:* @${senderNum}\n• *Chat:* ${m.isGroup ? 'Grup' : 'Pribadi'}\n• *Pesan:* ${text}\n\n*Pesan yang Di-reply:*\n\`\`\`${m.quoted.text}\`\`\``;

	await conn.reply(ownerJid, laporan, null, { mentions: [m.sender] });
	await m.reply('Terima kasih! Laporan masalah telah diteruskan ke Owner Bot.');
};

handler.help = ['report <alasan>'];
handler.tags = ['main'];
handler.command = /^(report|lapor)$/i;

export default handler;
