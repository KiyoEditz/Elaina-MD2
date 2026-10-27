let handler = async (m, { text, usedPrefix, command }) => {
	if (!global.db.data.extra) global.db.data.extra = {};
	if (!global.db.data.extra.redeemCodes) global.db.data.extra.redeemCodes = {};
	let codes = global.db.data.extra.redeemCodes;

	let [cmd, ...args] = (text || '').trim().split(/\s+/);
	cmd = (cmd || '').toLowerCase();

	if (cmd === 'list' || cmd === 'daftar') {
		let list = Object.values(codes);
		if (!list.length) return m.reply('Belum ada kode redeem yang di-generate.');

		let txt = `*〔 DAFTAR KODE REDEEM 〕*\nTotal: *${list.length}* kode\n\n`;
		let count = 1;
		for (let c of list.slice(-20)) {
			let status = c.used ? `❌ Terpakai (${c.usedBy || 'Grup'})` : '✅ Tersedia';
			txt += `${count++}. \`${c.code}\`\n   • Tipe: ${c.type} (${c.days} Hari) | ${status}\n`;
		}
		if (list.length > 20) txt += `\n_...dan ${list.length - 20} kode lainnya._`;
		return m.reply(txt.trim());
	}

	if (cmd === 'del' || cmd === 'delete' || cmd === 'hapus') {
		let target = (args[0] || '').toUpperCase();
		if (!target) return m.reply(`Masukkan kode yang ingin dihapus atau ketik: *${usedPrefix + command} del used* untuk menghapus semua kode yang sudah terpakai.`);
		if (target === 'USED') {
			let deleted = 0;
			for (let [k, v] of Object.entries(codes)) {
				if (v.used) {
					delete codes[k];
					deleted++;
				}
			}
			return m.reply(`✅ Berhasil menghapus *${deleted}* kode yang sudah terpakai.`);
		}
		if (codes[target]) {
			delete codes[target];
			return m.reply(`✅ Berhasil menghapus kode \`${target}\`.`);
		}
		return m.reply(`Kode \`${target}\` tidak ditemukan.`);
	}

	let type = (text || 'trial').toLowerCase();
	let days = 3;
	if (type === 'half') days = 15;
	else if (type === 'one' || type === 'gold') days = 30;
	else if (type === 'two' || type === 'diamond') days = 60;
	else if (!isNaN(parseInt(type))) {
		days = Math.max(1, parseInt(type));
		type = `${days}d`;
	}

	let randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
	let code = `ELN-${type.toUpperCase()}-${randomPart}`;

	codes[code] = {
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

handler.help = ['gencode [trial/half/one/two/hari]', 'gencode list', 'gencode del <kode/used>'];
handler.tags = ['owner'];
handler.command = /^(gen(erate)?code)$/i;
handler.owner = true;

export default handler;
