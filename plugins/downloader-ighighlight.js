import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!args[0] || !(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i.test(args[0]))) {
		throw `Masukkan username Instagram tanpa @\nContoh: ${usedPrefix + command} natgeo`;
	}

	let api = global.API ? global.API('lolhuman', `/api/highlights/${args[0]}`, 'apikey') : `https://api.lolhuman.xyz/api/highlights/${args[0]}?apikey=${global.lolkey || 'RFK-Alya'}`;
	let res = await fetch(api);
	if (!res.ok) throw 'Server Error atau API Key tidak valid. Harap lapor owner.';
	let json = await res.json();
	if (!json.result || json.result.length === 0) throw 'Sorotan (highlight) tidak ditemukan atau akun di-private.';

	for (let link of json.result) {
		await conn.sendFile(m.chat, link, 'ighl' + (link.includes('mp4') ? '.mp4' : '.jpg'), '', m);
	}
};

handler.help = ['ighighlight <username>', 'igsorotan <username>'];
handler.tags = ['downloader', 'info'];
handler.command = /^(ig(highlights?|sorotan))$/i;
handler.limit = true;

export default handler;
