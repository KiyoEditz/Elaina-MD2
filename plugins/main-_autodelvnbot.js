import crypto from 'crypto';

export default {
	async all(m) {
		let chat = global.db.data?.chats?.[m.chat];
		if (chat?.autodelvn && !m.fromMe && m.isBaileys && m.mtype === 'audioMessage' && m.msg?.ptt && m.quoted) {
			let { key } = await m.reply('.delete', null, {
				messageId: '3EB0' + crypto.randomBytes(12).toString('hex'),
			}).catch(() => ({}));
			if (key) await this.sendMessage(m.chat, { delete: key }).catch(() => {});
		}
	},
};
