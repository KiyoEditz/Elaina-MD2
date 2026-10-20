import skata from '../lib/sambung-kata.js';

let handler = (m) => m;

handler.before = async function (m) {
	this.skata = this.skata ? this.skata : {};
	let id = m.chat;
	if (!(id in this.skata)) return true;
	let room = this.skata[id];
	let users = global.db.data.users;
	let _kata = await genKata();
	let member = room.player;
	let bonus = rwd(500, 600);
	let lose_skata;
	let win_skata;

	function mmr(apa = '', jid = '') {
		let user = users[jid] || {};
		let currentSkata = user.skata || 0;
		if (apa === 'win') {
			if (currentSkata > 5000) win_skata = rwd(5, 9);
			else if (currentSkata > 3000) win_skata = rwd(5, 10);
			else if (currentSkata > 1500) win_skata = rwd(10, 15);
			else if (currentSkata > 1000) win_skata = rwd(15, 20);
			else if (currentSkata > 500) win_skata = rwd(20, 30);
			else win_skata = rwd(30, 50);
		} else {
			if (currentSkata > 8000) lose_skata = rwd(35, 50);
			else if (currentSkata > 5000) lose_skata = rwd(25, 30);
			else if (currentSkata > 3000) lose_skata = rwd(20, 25);
			else if (currentSkata > 1500) lose_skata = rwd(15, 19);
			else if (currentSkata > 1000) lose_skata = rwd(10, 14);
			else if (currentSkata > 500) lose_skata = rwd(5, 9);
			else lose_skata = rwd(1, 5);
		}
		return apa === 'win' ? win_skata : lose_skata;
	}

	let who;
	let readMoreStr = this.readmore || global.readMore || String.fromCharCode(8206).repeat(4001);

	if (room.new) {
		if (!/nextkata/i.test(m.text)) return true;
		room.new = false;
		room.killer = false;
		room.kata = _kata;
		let playerList = room.player.map((v, i) => `${i + 1}. ${users[v]?.name || v.split('@')[0]}`).join('\n');
		room.chat = await this.reply(
			m.chat,
			`Saatnya @${room.curr.split('@')[0]}\nMulai : *${_kata.toUpperCase()}*\n*${room.filter(_kata).toUpperCase()}... ?*\n*Reply untuk menjawab!*\n"nyerah" untuk menyerah\nXP terkumpul: ${room.win_point}\nTersisa: \n${readMoreStr + playerList}`,
			null,
			{ mentions: [room.curr, ...room.player] }
		);
	}

	if (room.diam) {
		if (!/nextkata/i.test(m.text)) return true;
		room.diam = false;
		room.waktu = setTimeout(() => {
			lose_skata = mmr('lose', room.curr);
			win_skata = room.killer ? mmr('win', room.killer) : null;
			let mentionList = room.killer ? [room.curr, room.killer] : [room.curr];
			this.reply(
				m.chat,
				`Waktu jawab habis\n@${room.curr.split('@')[0]} tereliminasi -${lose_skata} MMR${room.killer ? `\n@${room.killer.split('@')[0]} +${win_skata} MMR` : ''}`,
				room.chat,
				{ mentions: mentionList }
			).then((_) => {
				room.eliminated.push(room.curr);
				if (room.killer) {
					if (!users[room.killer]) users[room.killer] = {};
					if (!users[room.curr]) users[room.curr] = {};
					users[room.killer].skata = (users[room.killer].skata || 0) + win_skata;
					users[room.curr].skata = (users[room.curr].skata || 0) - lose_skata;
				}
				let index = member.indexOf(room.curr);
				member.splice(index, 1);
				if (index === member.length) room.curr = member[0];
				else room.curr = member[index];
				if (member.length === 1 && room.status === 'play') {
					this.reply(m.chat, `@${member[0].split('@')[0]} Berhasil bertahan\n+${room.win_point}XP`, room.chat, {
						mentions: [member[0]],
					}).then((_) => {
						if (!users[member[0]]) users[member[0]] = {};
						users[member[0]].exp = (users[member[0]].exp || 0) + room.win_point;
						delete this.skata[id];
						return true;
					});
				} else {
					room.diam = true;
					room.new = true;
					who = room.curr;
					let fn = this.preSudo ? this.preSudo.bind(this) : global.conn?.preSudo;
					if (fn) {
						fn('nextkata', who, m).then(async (_) => {
							this.ev.emit('messages.upsert', _);
						});
					}
				}
			});
		}, 30000);
	}

	if (room.curr === m.sender) {
		if (/nyerah/i.test(m.text)) {
			lose_skata = mmr('lose', room.curr);
			win_skata = room.killer ? mmr('win', room.killer) : null;
			clearTimeout(room.waktu);
			let mentionList = room.killer ? [room.curr, room.killer] : [room.curr];
			this.reply(
				m.chat,
				`@${room.curr.split('@')[0]} tereliminasi -${lose_skata} MMR${room.killer ? `\n@${room.killer.split('@')[0]} +${win_skata} MMR` : ''}`,
				room.chat,
				{ mentions: mentionList }
			);
			room.eliminated.push(room.curr);
			if (room.killer) {
				if (!users[room.killer]) users[room.killer] = {};
				if (!users[room.curr]) users[room.curr] = {};
				users[room.killer].skata = (users[room.killer].skata || 0) + win_skata;
				users[room.curr].skata = (users[room.curr].skata || 0) - lose_skata;
			}
			let index = member.indexOf(room.curr);
			member.splice(index, 1);
			if (index === member.length) room.curr = member[0];
			else room.curr = member[index];
			if (member.length === 1 && room.status === 'play') {
				await this.reply(m.chat, `@${member[0].split('@')[0]} Berhasil bertahan\n+${room.win_point}XP`, room.chat, {
					mentions: [member[0]],
				});
				if (!users[member[0]]) users[member[0]] = {};
				if (win_skata) users[member[0]].skata = (users[member[0]].skata || 0) + win_skata;
				users[member[0]].exp = (users[member[0]].exp || 0) + room.win_point;
				delete this.skata[id];
				return true;
			}
			room.new = true;
			room.diam = true;
			who = room.curr;
			let fn = this.preSudo ? this.preSudo.bind(this) : global.conn?.preSudo;
			if (fn) {
				let msg = await fn('nextkata', who, m);
				this.ev.emit('messages.upsert', msg);
			}
		}

		let roomId = room.chat?.id || room.chat?.key?.id;
		if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/(Mulai|Tersisa) ?:/i.test(m.quoted.text)) return true;
		if (m.quoted.id === roomId || m.quoted.id === room.chat?.id || m.quoted.id === room.chat?.key?.id) {
			let answerF = m.text.toLowerCase().split(' ')[0].trim().replace(/[^a-z]/gi, '');
			let checkF = await skata.cKata(m.text.toLowerCase().split(' ')[0]);
			if (!answerF.startsWith(room.filter(room.kata))) {
				return m.reply(`👎🏻 *Salah!*\nJawaban harus dimulai dari kata *${room.filter(room.kata)}*`);
			} else if (!checkF.status) {
				return m.reply(`👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* tidak valid!`);
			} else if (room.filter(room.kata) === answerF) {
				return m.reply(`👎🏻 *Salah!*\nJawabanmu sama dengan soal, silahkan cari kata lain!`);
			} else if (room.basi.includes(answerF)) {
				return m.reply(`👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* sudah pernah digunakan!`);
			}

			clearTimeout(room.waktu);
			room.killer = room.curr;
			if (!users[m.sender]) users[m.sender] = {};
			users[m.sender].exp = (users[m.sender].exp || 0) + bonus;

			let waktunya = member.indexOf(room.curr);
			room.curr = member[waktunya + 1];
			if (waktunya + 1 >= member.length) room.curr = member[0];
			room.basi.push(answerF);
			room.win_point += 200;

			let playerList = room.player.map((v, i) => `${i + 1}. ${users[v]?.name || v.split('@')[0]}`).join('\n');
			room.chat = await this.reply(
				m.chat,
				`👍+${bonus}XP\nGiliran @${room.curr.split('@')[0]}\n*${room.filter(answerF).toUpperCase()}... ?*\n*Reply untuk menjawab!*\n"nyerah" untuk menyerah\nXP terkumpul: ${room.win_point}\nTersisa: \n${readMoreStr + playerList}`,
				m,
				{ mentions: [room.curr, ...room.player] }
			);
			room.diam = true;
			room.kata = answerF;
			who = room.curr;
			let fn = this.preSudo ? this.preSudo.bind(this) : global.conn?.preSudo;
			if (fn) {
				let msg = await fn('nextkata', who, m);
				this.ev.emit('messages.upsert', msg);
			}
			return true;
		}
	} else if (room.curr !== m.sender) {
		let roomId = room.chat?.id || room.chat?.key?.id;
		if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/(Mulai|Tersisa) ?:/i.test(m.quoted.text)) return true;
		if (m.quoted.id === roomId || m.quoted.id === room.chat?.id || m.quoted.id === room.chat?.key?.id) {
			if (room.eliminated.includes(m.sender)) {
				m.reply(`_Hei, kamu sudah tereliminasi, tunggu hingga game ini selesai_\n*Nice Try, next game*`);
			} else if (room.player.includes(m.sender)) {
				m.reply(`_Bukan giliranmu.._`);
			} else {
				m.reply(`_*Kamu tidak dapat menjawab soal itu*_\nKarena kamu tidak bergabung dalam game ini\n\nTunggu hingga game ini berakhir, kemudian ikutlah bermain!`);
			}
		} else {
			m.reply(`Soal itu sudah lewat`);
		}
	}
	return true;
};

export default handler;

async function genKata() {
	let json = await skata.kata();
	let result = json.kata;
	while (result.length < 3) {
		json = await skata.kata();
		result = json.kata;
	}
	return result;
}

function rwd(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
