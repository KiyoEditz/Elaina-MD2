let handler = async (m, { conn, text, usedPrefix }) => {
	if (!text) return m.reply(`Silakan masukkan fitur yang ingin kamu request!\n\nContoh:\n*${usedPrefix}request Fitur Spotify Search*`);

	let ownerNum = Array.isArray(global.owner?.[0]) ? global.owner[0][0] : global.owner?.[0] || global.numberowner;
	let ownerJid = ownerNum.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

	let senderNum = (conn.getJid ? conn.getJid(m.sender) : m.sender).split('@')[0];
	let pesan = `*〔 REQUEST FITUR 〕*\n\n• *Pengirim:* @${senderNum}\n• *Chat:* ${m.isGroup ? 'Grup' : 'Pribadi'}\n• *Request:* ${text}`;

	await conn.reply(ownerJid, pesan, null, { mentions: [m.sender] });
	await m.reply('_Berhasil mengirimkan request fitur ke Owner Bot!_');
};

handler.help = ['request <fitur>'];
handler.tags = ['main'];
handler.command = /^req(uest?)?$/i;

export default handler;
