import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (['cariobat', 'obat', 'sakit', 'penyakit'].includes(command)) {
        if (!args[0]) {
            return conn.reply(m.chat, `Masukkan nama obat yang ingin dicari!\n\nContoh:\n*${usedPrefix + command} paracetamol*`, m);
        }

        try {
            const obatName = args.join(' ');
            await conn.reply(m.chat, 'Tunggu sebentar, sedang mencari informasi obat...', m);
            const response = await fetch(`https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev/cariobat?obat=${encodeURIComponent(obatName)}`);

            if (!response.ok) {
                return conn.reply(m.chat, 'Gagal mengambil data obat dari server.', m);
            }

            const data = await response.json();

            if (data && Array.isArray(data) && data.length > 0) {
                const result = data.slice(0, 5).map(item => {
                    return `💊 *Obat:* ${item.alt}\n💰 *Harga:* ${item.harga}\n🔗 *Sumber:* ${item.sumber}`;
                }).join('\n\n');

                conn.reply(m.chat, `╭──── 〔 *DATA OBAT* 〕 ─⬣\n\n${result}\n\n╰────────────────────────⬣`, m);
            } else {
                conn.reply(m.chat, `Tidak ada data obat yang ditemukan untuk "${obatName}".`, m);
            }
        } catch (error) {
            console.error('Error fetching obat data:', error);
            conn.reply(m.chat, 'Terjadi kesalahan saat mencari data obat.', m);
        }
    } else if (['keteranganobat', 'penjelasanobat', 'ktobat', 'indikasiobat', 'komposisiobat', 'dosisobat', 'ketobat'].includes(command)) {
        if (!args[0]) {
            return conn.reply(m.chat, `Masukkan link sumber obat!\n\nContoh:\n*${usedPrefix + command} https://...*`, m);
        }

        try {
            const linkObat = args[0];
            await conn.reply(m.chat, 'Sedang mengambil detail obat...', m);
            const response = await fetch(`https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev/penjelasanobat?link=${encodeURIComponent(linkObat)}`);
            const data = await response.json();
            const keteranganData = data?.Data;

            if (keteranganData) {
                const keteranganResult = `╭──── 〔 *DETAIL OBAT* 〕 ─⬣
│ 📝 *Deskripsi*: ${keteranganData.Deskripsi || '-'}
│ 📋 *Indikasi Umum*: ${keteranganData['Indikasi Umum'] || '-'}
│ 🧪 *Komposisi*: ${keteranganData.Komposisi || '-'}
│ 💉 *Dosis*: ${keteranganData.Dosis || '-'}
│ 📌 *Aturan Pakai*: ${keteranganData['Aturan Pakai'] || '-'}
│ ⚠️ *Perhatian*: ${keteranganData.Perhatian || '-'}
│ 🚫 *Kontra Indikasi*: ${keteranganData['Kontra Indikasi'] || '-'}
│ 💊 *Efek Samping*: ${keteranganData['Efek Samping'] || '-'}
│ 📦 *Kemasan*: ${keteranganData.Kemasan || '-'}
│ 🏷️ *Golongan*: ${keteranganData['Golongan Produk'] || '-'}
│ 🏭 *Manufaktur*: ${keteranganData.Manufaktur || '-'}
│ 🔖 *No. Registrasi*: ${keteranganData['No. Registrasi'] || '-'}
╰────────────────────────⬣`;
                conn.reply(m.chat, keteranganResult, m);
            } else {
                conn.reply(m.chat, 'Tidak ada data detail obat yang ditemukan.', m);
            }
        } catch (e) {
            conn.reply(m.chat, 'Gagal mengambil detail obat: ' + (e.message || e), m);
        }
    } else if (['checkdata', 'cekimel', 'cekemail', 'checkemail', 'cekdata'].includes(command)) {
        if (!args[0]) {
            return m.reply(`Masukkan alamat email yang ingin dicek kebocoran datanya!\n\nContoh:\n*${usedPrefix + command} example@gmail.com*`);
        }

        let email = args[0].toLowerCase().trim();
        try {
            let res = await fetch(`https://0e87ad76-6c4e-40ff-bb5a-6bbdab145ae2-00-39qk1kw7vab6l.worf.replit.dev/checkdata?email=${encodeURIComponent(email)}`);
            if (res.status !== 200) {
                return m.reply('Server pemeriksaan kebocoran data sedang sibuk.');
            }

            let json = await res.json();
            let output = '';

            if (json.Data && json.Data.results && json.Data.results.length > 0) {
                output += `⚠️ KEBOCORAN DATA DITEMUKAN (DATA BREACH):\n\n`;
                for (let result of json.Data.results) {
                    output += `🚨 Sumber: ${result.title}\n`;
                    output += `📝 Info: ${result.description}\n`;
                    for (let data of (result.data || [])) {
                        output += `• Bocor: ${data['Data yang bocor'] || '-'}\n`;
                        output += `• Tanggal: ${data['Tanggal Kejadian'] || '-'}\n`;
                    }
                    output += '\n';
                }
            } else {
                output += `✅ Email Anda aman! Tidak ditemukan dalam database kebocoran data (Data Breach).`;
            }

            m.reply(output.trim());
        } catch (e) {
            m.reply(`Gagal memeriksa email: ${e.message || e}`);
        }
    }
};

handler.help = ['cariobat <nama_obat>', 'penjelasanobat <link_sumber>', 'cekemail <email>'];
handler.tags = ['tools', 'internet'];
handler.command = /^(cariobat|penjelasanobat|cekemail|checkemail|keteranganobat|obat)$/i;

export default handler;
