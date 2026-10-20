import os from 'os';
import { performance } from 'perf_hooks';

let handler = async (m, { conn }) => {
	const chats = Object.keys(conn.chats || {});
	const groups = chats.filter((v) => v.endsWith('g.us'));

	let old = performance.now();
	await m.reply('_Mengukur kecepatan respon..._');
	let neww = performance.now();
	let speed = ((neww - old) / 1000).toFixed(2);
	let res = os.cpus();

	let text = `
╔══「 Merespon dalam ${speed} detik 」
║ 
╟ 💬 *Status Chat:*
╟ Total Grup: *${groups.length}*
╟ Total Chat Pribadi: *${Math.max(0, chats.length - groups.length)}*
╟ Total Seluruh Chat: *${chats.length}* 
║ 
╟ 💻 *Info Server:*
╟ Platform: *${os.platform()} (${os.arch()})*
╟ CPU: *${res[0]?.model || 'Default'}*
╟ Total Core: *${res.length}*
╟ Speed: *${((res[0]?.speed || 0) / 1000).toFixed(1)} GHz*
╟ RAM: *${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}*
╚════════════════
`.trim();

	m.reply(text);
};

handler.help = ['ping', 'speed'];
handler.tags = ['info', 'main'];
handler.command = /^(ping|speed)$/i;

export default handler;

function formatSize(bytes) {
	if (!bytes || isNaN(bytes)) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}
