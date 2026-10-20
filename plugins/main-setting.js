let handler = async (m, { conn, usedPrefix }) => {
	let senderJid = conn.getJid ? conn.getJid(m.sender) : m.sender;
	let user = global.db.data?.users?.[senderJid] || global.db.data?.users?.[m.sender] || {};
	let chat = global.db.data?.chats?.[m.chat] || {};
	let setting = global.db.data?.settings?.[conn.user.jid] || {};

	let text = `
*⚙️ PENGATURAN BOT*

*──「 Status Pengaturan Chat 」──*
• *Bot Aktif:* ${chat.isBanned ? '❌ Mati' : '✅ Aktif'}
• *Welcome:* ${chat.welcome ? '✅ Aktif' : '❌ Mati'}
• *Anti Link:* ${chat.antiLink ? '✅ Aktif' : '❌ Mati'}
• *Detect Admin:* ${chat.detect ? '✅ Aktif' : '❌ Mati'}
• *Anti Delete:* ${chat.delete ? '✅ Aktif' : '❌ Mati'}
• *Anti ViewOnce:* ${chat.viewonce ? '✅ Aktif' : '❌ Mati'}
• *Auto VN Delete:* ${chat.autodelvn ? '✅ Aktif' : '❌ Mati'}
• *Fitur Game:* ${chat.game ? '✅ Aktif' : '❌ Mati'}

*──「 Status Pengaturan Akun Kamu 」──*
• *Auto Level Up:* ${user.autolevelup ? '✅ Aktif' : '❌ Mati'}
• *Kirim Dokumen:* ${user.useDocument ? '✅ Aktif' : '❌ Mati'}

*──「 Status Pengaturan Global (Owner) 」──*
• *Mode Publik:* ${setting.public ? '✅ Aktif' : '❌ Self'}
• *Anti Call:* ${setting.anticall ? '✅ Aktif' : '❌ Mati'}
• *Anti Tag:* ${setting.antitag ? '✅ Aktif' : '❌ Mati'}
• *Grup Only:* ${setting.gconly ? '✅ Aktif' : '❌ Mati'}

_Gunakan perintah berikut untuk mengubah opsi:_
• *${usedPrefix}on <opsi>* untuk mengaktifkan
• *${usedPrefix}off <opsi>* untuk mematikan
Contoh: *${usedPrefix}on welcome*
`.trim();

	await conn.reply(m.chat, text, m);
};

handler.help = ['setting'];
handler.tags = ['info', 'main'];
handler.command = /^setting(s)?$/i;

export default handler;
