import { WAMessageStubType } from 'baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

export default async function (m, conn = { user: {} }) {
	const _name = conn.getName(m.sender);
	const sender = PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international') + (_name ? ' ~' + _name : '');
	const chat = conn.getName(m.chat);
	const user = global.db.data.users[m.sender];
	const mentioned = m?.message?.[m.mtype]?.contextInfo?.mentionedJid ?? [];
	const me = PhoneNumber('+' + conn.user?.jid.split('@')[0]).getNumber('international');
	const filesize =
		(m.msg
			? m.msg.vcard
				? m.msg.vcard.length
				: m.msg.fileLength
					? m.msg.fileLength.low || m.msg.fileLength
					: m.msg.axolotlSenderKeyDistributionMessage
						? m.msg.axolotlSenderKeyDistributionMessage.length
						: m.text
							? m.text.length
							: 0
			: m.text
				? m.text.length
				: 0) || 0;
	console.log(
		`
\n▣ ${chalk.redBright('%s')}\n│⏰ ${chalk.black(chalk.bgYellow('%s'))}\n│📑 ${chalk.black(chalk.bgGreen('%s'))}\n│📊 ${chalk.magenta('%s [%s %sB]')}
│📤 ${chalk.green('%s')}\n│📃 ${chalk.yellow('%s')}\n│📥 ${chalk.green('%s')}\n│💬 ${chalk.black(chalk.bgYellow('%s'))}
▣──────···
`.trim(),
		me + ' ~' + conn.user.name,
		(m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date()).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
		m.messageStubType ? WAMessageStubType[m.messageStubType] : '',
		filesize,
		filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1),
		['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || '',
		sender,
		user ? `Limit: ${user.limit} | Premium: ${user.premium ? '✅' : '❌'}` : 'No data',
		m.chat + (chat ? ' ~' + chat : ''),
		m.mtype
			? m.mtype
					.replace(/message$/i, '')
					.replace('audio', m.msg.ptt ? 'PTT' : 'audio')
					.replace(/^./, (v) => v.toUpperCase())
			: ''
	);
	if (typeof m.text === 'string' && m.text) {
		let log = m.text.replace(/\u200e+/g, '');
		let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
		let mdFormat =
			(depth = 4) =>
			(_, type, text, monospace) => {
				let types = {
					_: 'italic',
					'*': 'bold',
					'~': 'strikethrough',
				};
				text = text || monospace;
				let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
				return formatted;
			};
		log = log.replace(mdRegex, mdFormat(4));
		if (mentioned) for (let users of mentioned) log = log.replace('@' + users.split('@')[0], chalk.blueBright('@' + conn.getName(users)));
		console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);
	}
	if (m.messageStubParameters)
		console.log(
			m.messageStubParameters
				.map((jid) => {
					jid = conn.decodeJid(jid);
					let name = conn.getName(jid);
					return chalk.gray(PhoneNumber('+' + jid.split('@')[0]).getNumber('international') + (name ? ' ~' + name : ''));
				})
				.join(', ')
		);
	if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`);
	else if (/ContactsArray/i.test(m.mtype)) console.log('👨‍👩‍👧‍👦 ');
	else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`);
	else if (/audio/i.test(m.mtype)) {
		const duration = m.msg.seconds;
		console.log(
			`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60)
				.toString()
				.padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`
		);
	}
	console.log();
}

let file = global.__filename(import.meta.url);
watchFile(file, () => {
	console.log(chalk.redBright("Update 'lib/print.js'"));
});