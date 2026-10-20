import axios from 'axios';
import * as cheerio from 'cheerio';

class GenshinCharacter {
    async getCharacter(name) {
        const url = `https://genshin.gg/characters/${name.toLowerCase()}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '-';
        const element = $('.character-element').attr('alt') || '-';
        const weapon = $('.character-path-icon').attr('alt') || '-';
        const role = $('.character-role').text() || '-';
        const upgradeMaterials = $('.character-materials-item')
            .map((_, el) => ({
                name: $(el).find('.character-materials-name').text().trim(),
                icon: $(el).find('.character-materials-icon').attr('src'),
            }))
            .get();
        const bestWeapons = $('.character-build-weapon')
            .map((_, el) => ({
                rank: $(el).find('.character-build-weapon-rank').text().trim(),
                name: $(el).find('.character-build-weapon-name').text().trim(),
                icon: $(el).find('.character-build-weapon-icon').attr('src'),
            }))
            .get();
        const bestArtifacts = $('.character-build-weapon-content.full')
            .map((_, el) => ({
                name: $(el).find('.character-build-weapon-name').text().trim(),
                icon: $(el).find('.character-build-weapon-icon').attr('src'),
                pieces: $(el).find('.character-build-weapon-count').text().trim(),
            }))
            .get();
        const stats = $('.character-stats-item')
            .map((_, el) => $(el).text().trim())
            .get();
        const bestTeams = $('.character-team')
            .map((_, el) => ({
                name: $(el).find('.character-team-name').text().trim(),
                characters: $(el).find('.character-team-characters img').map((_, img) => $(img).attr('alt')).get(),
            }))
            .get();
        const talents = $('.character-skills .character-skill')
            .map((_, el) => ({
                title: $(el).find('.character-skill-title').text().trim(),
                name: $(el).find('.character-skill-name').text().trim(),
                description: $(el).find('.character-skill-description').text().trim(),
            }))
            .get();

        return {
            title,
            description,
            element,
            weapon,
            role,
            upgradeMaterials,
            bestWeapons,
            bestArtifacts,
            stats,
            bestTeams,
            talents,
        };
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const genshin = new GenshinCharacter();
    const name = args[0];
    if (!name) return m.reply(`Masukkan nama karakter Genshin Impact!\n\nContoh:\n*${usedPrefix + command} hutao*`);

    try {
        await m.reply(global.wait || 'Sedang mencari data karakter...');
        const data = await genshin.getCharacter(name);
        const response = `🌟 *Character:* ${data.title}
📖 *Role:* ${data.role} | *Element:* ${data.element} | *Weapon:* ${data.weapon}
📝 *Description:* ${data.description}

---
🛠️ *Upgrade Materials:*
${data.upgradeMaterials.map(item => `• ${item.name}`).join('\n') || '-'}

---
⚔️ *Best Weapons:*
${data.bestWeapons.map((item, i) => `${i + 1}. ${item.name} (${item.rank})`).join('\n') || '-'}

---
🏺 *Best Artifacts:*
${data.bestArtifacts.map(artifact => `• ${artifact.name} (${artifact.pieces} Pcs)`).join('\n') || '-'}

---
📊 *Recommended Stats:*
${data.stats.join('\n') || '-'}

---
👥 *Best Teams:*
${data.bestTeams.map((team, i) => `${i + 1}. ${team.name} - ${team.characters.join(', ')}`).join('\n') || '-'}`.trim();

        conn.reply(m.chat, response, m);
    } catch (e) {
        m.reply('Karakter tidak ditemukan atau terjadi kesalahan server.');
    }
};

handler.help = ['genshinchar <nama>', 'genshin <nama>'];
handler.tags = ['tools', 'anime'];
handler.command = /^(genshinchar|genshinimpactcharacter|genshin)$/i;

export default handler;
