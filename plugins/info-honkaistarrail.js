/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Conributor : han (scrape) 
 • Honkai Char Name & Detail
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchCharacter(name) {
    const url = 'https://genshin.gg/star-rail/character-stats/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const characterData = {};

    $('.rt-tr').each((index, element) => {
        const characterName = $(element).find('.character-name').text().trim();
        if (characterName.toLowerCase() === name.toLowerCase()) {
            const hp = $(element).find('div').eq(1).text();
            const atk = $(element).find('div').eq(2).text();
            const def = $(element).find('div').eq(3).text();
            const speed = $(element).find('div').eq(4).text();
            const taunt = $(element).find('div').eq(5).text();
            const image = $(element).find('img.character-icon').attr('src');

            Object.assign(characterData, { name: characterName, hp, atk, def, speed, taunt, image });
        }
    });

    if (Object.keys(characterData).length === 0) throw 'Karakter tidak ditemukan';
    return characterData;
}

async function listCharacters() {
    const url = 'https://genshin.gg/star-rail/character-stats/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const characters = [];

    $('.rt-tr').each((index, element) => {
        const characterName = $(element).find('.character-name').text().trim();
        if (characterName) characters.push(characterName);
    });

    return characters;
}

const handler = async (m, { text, conn }) => {
    if (!text) {
        const characterNames = await listCharacters();
        const namesList = characterNames.map((name, index) => `- *${index + 1}. ${name}*`).join('\n');
        return conn.sendMessage(m.chat, {
            text: `📜 *Daftar Karakter Honkai: Star Rail*\n\n${namesList}`,
        }, { quoted: m });
    } else {
        try {
            const character = await searchCharacter(text);
            const message = `
📖 *Detail Karakter*
⭐ *Nama*: ${character.name}
💖 *HP*: ${character.hp}
⚔️ *ATK*: ${character.atk}
🛡️ *DEF*: ${character.def}
🚀 *Speed*: ${character.speed}
🎯 *Taunt*: ${character.taunt}
📷 *Gambar*: ${character.image}
`.trim();

            return conn.sendMessage(m.chat, {
                text: message,
                contextInfo: {
                    externalAdReply: {
                        title: character.name,
                        body: 'Detail Statistik Karakter',
                        thumbnailUrl: character.image,
                        mediaType: 1,
                    },
                },
            }, { quoted: m });
        } catch (error) {
            return conn.sendMessage(m.chat, { text: `${error}` }, { quoted: m });
        }
    }
};

handler.command = ['honkai-star', 'honkai-rail', 'star-rail'];
handler.tags = ['info'];
handler.help = ['honkai-star <nama karakter>'];
handler.limit = true;

export default handler;
