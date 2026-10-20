let handler = async (m, { text, usedPrefix }) => {
	let type = (text || 'trial').toLowerCase();
	let days = 3;
	if (type === 'half') days = 15;
	else if (type === 'one' || type === 'gold') days = 30;
	else if (type === 'two' || type === 'diamond') days = 60;

	let randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
	let code = `ELN-${type.toUpperCase()}-${randomPart}`;

	if (!global.db.data.extra) global.db.data.extra = {};
	if (!global.db.data.extra.redeemCodes) global.db.data.extra.redeemCodes = {};

	global.db.data.extra.redeemCodes[code] = {
		code,
		type,
		days,
		createdAt: Date.now(),
		used: false,
		usedBy: '',
	};

	let caption = `
*〔 KODE AKTIVASI GRUP 〕*

• *Tipe:* ${type.toUpperCase()} (${days} Hari)
• *Kode Redeem:* \`${code}\`

_Cara Penggunaan:_
Ketik perintah berikut di dalam grup yang ingin diaktifkan:
*${usedPrefix}use ${code}*
`.trim();

	await m.reply(caption);
};

handler.help = ['generatecode [trial/half/one/two]'];
handler.tags = ['owner'];
handler.command = /^(gen(erate)?code)$/i;
handler.owner = true;

export default handler;
