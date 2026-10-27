
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import levelling from '../lib/levelling.js';

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

let desc = '';

let handler = async (m, { conn, usedPrefix: _p, args }) => {
	let fakeOption = {
		key: {
			remoteJid: 'status@broadcast',
			participant: '0@s.whatsapp.net',
			fromMe: false,
		},
		message: {
			imageMessage: {
				//mimetype: "image/jpeg",
				caption: `${global.namebot || 'Elaina-MD'} WhatsApp`,
				thumbnail: global.menu || (fs.existsSync('./media/menu.jpg') ? fs.readFileSync('./media/menu.jpg') : null),
				mediaType: 1,
				renderLargerThumbnail: true,
			},
		},
	};

	let defaultMenu = {
		before: `
╔══════════════
╟「 Hai, %ucap *${conn.user?.name || global.namebot || 'Bot'}* 」
╚════════════════
`.trim(),
		header: '*〘 %category 〙*\n╔══════════════',
		body: '╟ %cmd%islimit',
		footer: '╚════════════════\n',
		after: `*%week %weton, %date*\n*Waktu Server:* %time WIB`,
	};

	try {
		let tags;
		let type = (args[0] || '').toLowerCase();
		switch (type) {
			case 'sticker':
			case 'stiker':
				tags = {
					sticker: 'Menu Sticker',
					stickertext: 'Teks ke Sticker',
					stickertomedia: 'Stiker ke Media',
					stickerother: 'Sticker Lain',
					stickerprems: 'Sticker Premium',
				};
				desc = 'Ini adalah fitur untuk membuat stiker kamu sendiri dari gambar/video/teks';
				break;
			case 'all':
				tags = {
					main: 'Main',
					anonymous: 'Anonymous',
					islami: 'Islami',
					game: 'Game',
					anime: 'Anime',
					tools: 'Tools',
					ai: 'Artificial Intelligence (AI)',
					fun: 'Fun',
					primbon: 'Primbon',
					group: 'Group',
					info: 'Info',
					audio: 'Audio',
					maker: 'Maker',
					internet: 'Internet',
					downloader: 'Downloader',
					nsfw: 'Nsfw',
					vote: 'Voting',
					absen: 'Absen',
					premium: 'Premium',
					advanced: 'Advanced',
					owner: 'Owner',
					giveaway: 'Giveaway',
					nocategory: 'No Category',
				};
				desc = `Ini adalah semua fitur bot yang ada`;
				break;
			case 'download':
				tags = {
					downloader: 'Menu Download',
					downloadersosmed: 'SosMed Download',
					downloaderanime: 'Anime Download',
				};
				desc = `Ini adalah fitur untuk mendownload media melalui link/url\nContoh:\n${_p}tiktok https://vm.tiktok.com/abcdefghi\n`;
				break;
			case 'edukasi':
				tags = {
					belajar: 'Menu Edukasi',
				};
				desc = `Ini adalah fitur edukasi`;
				break;
			case 'media':
				tags = {
					media: 'Menu Media',
				};
				desc = `\nIni adalah fitur untuk mendownload media melalui keyword\nContoh:\n${_p}play bertaut\n`;
				break;
			case 'anime':
				tags = {
					anime: 'Menu anime',
				};
				desc = `\nIni adalah fitur untuk mendownload anime melalui judul\nContoh:\n${_p}anichin yosuga no sora\n`;
				break;
			case 'gambar':
				tags = {
					image: 'Menu Gambar',
					imagerandom: 'Random',
					photooxy: 'Menu Photooxy',
					textpro: 'Menu TextPro',
				};
				desc = `Ini adalah fitur generator gambar`;
				break;
			case 'maker':
				tags = {
					maker: 'Menu Maker',
				};
				desc = `Ini adalah fitur maker/kreasi`;
				break;
			case 'pencarian':
				tags = {
					search: 'Menu Pencarian',
				};
				desc = `Ini adalah fitur untuk pencarian berdasarkan keyword`;
				break;
			case 'tools':
			case 'tool':
				tags = {
					tools: 'Menu Tools',
				};
				desc = `Ini adalah fitur tools/alat`;
				break;
			case 'sastra':
				tags = {
					quotes: 'Menu Sastra',
				};
				desc = `Ini adalah fitur pilihan sastra`;
				break;
			case 'group':
				tags = {
					group: 'Menu Group',
					admin: 'Admin Group',
				};
				desc = `Ini adalah fitur untuk Group Chat`;
				break;
			case 'fun':
				tags = {
					fun: 'Menu Fun',
					kerang: 'Kerang Ajaib',
				};
				desc = `Ini adalah fitur fun/senang-senang`;
				break;
			case 'game':
				tags = {
					game: 'Menu Game',
				};
				desc = `Ini adalah beberapa fitur game`;
				break;
			case 'ai':
				tags = {
					ai: 'Menu AI',
				};
				desc = `Ini adalah menu AI`;
				break;
			case 'rpg':
				tags = {
					rpg: 'Menu rpg',
				};
				desc = `Ini adalah beberapa fitur rpg`;
				break;
			case 'premium':
				tags = {
					premium: 'Menu Premium',
					jadibot: 'Jadi Bot',
				};
				desc = `Ini adalah fitur khusus user Premium`;
				break;
			case 'info':
				tags = {
					main: 'Start Bot',
					xp: 'Exp & Limit',
					info: 'Menu Info',
				};
				desc = `Ini adalah fitur Informasi Bot`;
				break;
			case 'anony':
				tags = {
					anonymous: 'Chat Anonymous',
				};
				desc = `Ini adalah fitur Anonymous Chat yang memungkinkan kamu untuk chat dengan orang yg tidak kmu knal sblmnya.. mirip Telegram\nNote: Fiturs ini hanya digunakan di Private Chat /Chat Pribadi\n`;
				break;
			case 'owner':
				tags = {
					owner: 'Menu Owner/Jadibot',
				};
				desc = `Ini adalah fitur khusus Owner/Jadibot`;
				break;
			case 'editor':
				tags = {
					audio: 'Menu Audio Editor',
					editorgambar: 'Coming soon',
				};
				break;
			case 'msg':
			case 'penyimpanan':
			case 'database':
				tags = {
					database: 'Menu Penyimpanan',
					cmd: 'Menu Command Media',
				};
				desc = `Untuk menyimpan teks, vn, audio, video, gambar ke dalam memori Bot`;
				break;
			case 'kelas':
				tags = {
					vote: 'Menu Vote',
					absen: 'Menu Absen',
				};
				break;
			default:
				type = '';
				break;
		}

		let user = global.db.data?.users?.[m.sender] || {};
		let { exp = 0, limit = 20, level = 0, registered = false, role = 'Novice', name: namaa } = user;
		let { min, xp, max } = levelling.xpRange(level, global.multiplier || 38);
		let name = namaa || conn.getName(m.sender) || m.pushName || 'User';
		let d = new Date(new Date() + 3600000);
		let locale = 'id';
		let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
		let week = d.toLocaleDateString(locale, { weekday: 'long' });
		let date = d.toLocaleDateString(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
		let time = d.toLocaleTimeString(locale, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		});

		let _uptime = process.uptime() * 1000;
		let _muptime;
		if (process.send) {
			process.send('uptime');
			_muptime =
				(await new Promise((resolve) => {
					process.once('message', resolve);
					setTimeout(resolve, 1000);
				})) * 1000;
		}

		conn.menu = conn.menu ? conn.menu : {};
		let muptime = clockString(_muptime);
		let uptime = clockString(_uptime);
		let totalreg = Object.keys(global.db.data?.users || {}).length;
		let rtotalreg = Object.values(global.db.data?.users || {}).filter((user) => user.registered == true).length;
		let before = conn.menu.before || defaultMenu.before;
		let header = conn.menu.header || defaultMenu.header;
		let body = conn.menu.body || defaultMenu.body;
		let footer = conn.menu.footer || defaultMenu.footer;
		let after = conn.menu.after || defaultMenu.after;
		let _text;

		if (!type) {
			tags = {
				menuringkas: 'Daftar Menu',
			};
			before =
				conn.menu.before ||
				`
Hai, 
_%ucap *%name!*_

┏❏──「 *INFO* 」───⬣
│○ *Library:* Baileys
│○ *Function:* Assistant
┗––––––––––✦
 
┌  ◦ Uptime : %uptime
│  ◦ Hari : %week %weton
│  ◦ Waktu : %time
│  ◦ Tanggal : %date
│  ◦ Version : %version
└  ◦ Prefix Used : [ %p ]

┏❏──「 *NOTE* 」───⬣
│○ If you find a bug or want
│ a premium upgrade, please
│ contact the owner.
│○ *Ⓟ* = Premium
│○ *Ⓛ* = Limit
┗––––––––––✦
`;
			_text = before;
		} else {
			_text = before + '\n' + desc + '\n';
		}

		if (type === 'all') {
			for (let plugin of Object.values(global.plugins || {})) {
				if (plugin && 'tags' in plugin) {
					let pTags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags];
					for (let tag of pTags) {
						if (!(tag in tags)) tags[tag] = tag;
					}
				}
			}
		}

		let help = Object.values(global.plugins || {})
			.filter((plugin) => !plugin.disabled)
			.map((plugin) => {
				return {
					help: Array.isArray(plugin.help) ? plugin.help : plugin.help ? [plugin.help] : [],
					tags: Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : [],
					prefix: 'customPrefix' in plugin,
					limit: plugin.limit,
					premium: plugin.premium,
				};
			});

		let groups = {};
		for (let tag in tags) {
			groups[tag] = [];
			for (let menu of help) {
				if (menu.tags && menu.tags.includes(tag)) {
					if (menu.help && menu.help.length) groups[tag].push(menu);
				}
			}
		}

		for (let tag in groups) {
			if (!groups[tag] || !groups[tag].length) continue;
			_text += header.replace(/%category/g, tags[tag]) + '\n';
			for (let menu of groups[tag]) {
				for (let h of menu.help) {
					let flags = (menu.limit ? ' Ⓛ' : '') + (menu.premium ? ' Ⓟ' : '');
					_text +=
						body
							.replace(/%cmd/g, menu.prefix ? h : '%p' + h)
							.replace(/%islimit/g, flags) + '\n';
				}
			}
			_text += footer;
		}
		_text += after;

		let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : '';
		let replace = {
			'%': '%',
			p: _p,
			uptime,
			muptime,
			exp: exp - min,
			maxexp: xp,
			totalexp: exp,
			version: `5.0.0`,
			xp4levelup: max - exp,
			level,
			limit,
			name,
			ucap: typeof global.ucap === 'function' ? global.ucap() : ucap(),
			weton,
			week,
			date,
			time,
			totalreg,
			rtotalreg,
			role,
			readmore: conn.readmore || readMore,
		};

		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, n) => '' + replace[n]);
		/*
				try {
					await conn.sendMessage(
						m.chat,
						{
							text: text,
							contextInfo: {
								mentionedJid: [m.sender],
								externalAdReply: {
									title: date,
									mediaType: 1,
									previewType: 0,
									renderLargerThumbnail: true,
									thumbnailUrl: 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg',
									sourceUrl: global.source || 'https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F',
								},
							},
						},
						{ quoted: m }
					);
				} catch {
					await conn.relayMessage(
						m.chat,
						{
							extendedTextMessage: {
								text: text,
								contextInfo: {
									mentionedJid: [m.sender],
									externalAdReply: {
										title: date,
										mediaType: 1,
										previewType: 0,
										renderLargerThumbnail: true,
										thumbnailUrl: 'https://telegra.ph/file/cce9ab4551f7150f1970d.jpg',
										sourceUrl: global.source || 'https://whatsapp.com/channel/0029ValggF79mrGXnImOmk1F',
									},
								},
								mentions: [m.sender],
							},
						},
						{}
					);
				}
			} catch (e) {
				console.error(e);
				m.reply('Terjadi kesalahan saat menampilkan menu.');
			}
				*/
		try {
			await conn.sendMessage(
				m.chat,
				{
					image: { url: './media/elaina.png' },
					caption: text,
				},
				{ quoted: m }
			);
		} catch (imgErr) {
			console.error('[menu] gagal kirim gambar, fallback ke teks:', imgErr);
			await conn.sendMessage(m.chat, { text: text }, { quoted: m });
		}
	} catch (e) {
		console.error(e);
		m.reply('Terjadi kesalahan saat menampilkan menu.');
	}
};

handler.help = [
	'all',
	'stiker',
	'anony',
	'download',
	'media',
	'edukasi',
	'ai',
	'gambar',
	'maker',
	'pencarian',
	'tools',
	'sastra',
	'group',
	'kelas',
	'fun',
	'game',
	'rpg',
	'premium',
	'penyimpanan',
	'editor',
	'owner',
	'info',
].map((v) => 'menu ' + v);
handler.tags = ['menuringkas'];
handler.command = /^(menu|help|\?)$/i;
handler.exp = 3;

export default handler;

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}

function ucap() {
	const hr = moment.tz('Asia/Jakarta').format('HH');
	let res;
	if (hr >= 2 && hr < 10) {
		res = 'Pagi 🌤️🏞️';
	} else if (hr >= 10 && hr <= 14) {
		res = 'Siang ☀️🏝️';
	} else if (hr > 14 && hr <= 17) {
		res = 'Sore ⛅🌅';
	} else {
		res = 'Malam 🌙🌌';
	}
	return 'Selamat ' + res;
}