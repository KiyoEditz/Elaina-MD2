import os, { cpus, totalmem, freemem } from 'os';
import { performance } from 'perf_hooks';

let handler = async (m, { conn }) => {
	let old = performance.now();
	let chats = Object.keys(conn.chats || {});
	let groupsIn = chats.filter((v) => v.endsWith('g.us'));
	let neww = performance.now();
	let latency = (neww - old).toFixed(2);

	let ramTotal = totalmem();
	let ramFree = freemem();
	let ramUsed = ramTotal - ramFree;
	let ramPercent = ((ramUsed / ramTotal) * 100).toFixed(1);

	let cpuList = cpus();
	let cpuModel = cpuList[0]?.model || 'Unknown';
	let cpuCore = cpuList.length;

	let d = new Date();
	let locale = 'id';
	let dates = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
	let times = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' });

	let usedMemObj = process.memoryUsage();

	let str = `
*───「 SPEED & SERVER INFO 2 」───*

⚡ *Latensi Respon:* ${latency} ms
⏱️ *Uptime Bot:* ${clockString(process.uptime() * 1000)}

*💬 Status Chat:*
• *${groupsIn.length}* Grup
• *${Math.max(0, chats.length - groupsIn.length)}* Chat Pribadi
• *${chats.length}* Total Chat

*💻 Informasi Server:*
• *Platform:* ${os.platform()} (${os.arch()})
• *Hostname:* ${os.hostname()}
• *OS:* ${os.type()} ${os.release()}
• *CPU:* ${cpuModel}
• *Core:* ${cpuCore} Core
• *RAM:* ${formatSize(ramUsed)} / ${formatSize(ramTotal)} (${ramPercent}%)
• *Free RAM:* ${formatSize(ramFree)}
• *Waktu Server:* ${dates}, ${times} WIB

*📊 Penggunaan Memori Node.js:*
${'```' + Object.keys(usedMemObj).map((key) => `${key.padEnd(12, ' ')}: ${formatSize(usedMemObj[key])}`).join('\n') + '```'}
`.trim();

	await m.reply(str);
};

handler.help = ['ping2', 'speed2'];
handler.tags = ['info', 'tools'];
handler.command = /^(ping2|speed2)$/i;

export default handler;

function formatSize(bytes) {
	if (!bytes || isNaN(bytes)) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function clockString(ms) {
	let d = isNaN(ms) ? 0 : Math.floor(ms / 86400000);
	let h = isNaN(ms) ? 0 : Math.floor(ms / 3600000) % 24;
	let m = isNaN(ms) ? 0 : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? 0 : Math.floor(ms / 1000) % 60;
	return `${d}h ${h}j ${m}m ${s}d`;
}
