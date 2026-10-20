import { tiktokdl } from 'tiktokdl';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://vt.tiktok.com/ZSFNnpxvP/`;
  }

  if (!args[0].match(/tiktok/gi)) {
    throw 'Berikan URL dari TikTok yang valid!';
  }

  await conn.reply(m.chat, global.wait || '_*Sedang diproses, mohon tunggu...*_', m);

  try {
    const response = await tiktokdl(args[0]);
    const { video, music, images, title } = response;
    const useDocument = global.db?.data?.users?.[m.sender]?.useDocument || false;

    const cleanUrl = url => (url ? url.replace(/([^:]\/)\/+/g, '$1') : url);
    const videoUrl = cleanUrl(video);
    const musicUrl = cleanUrl(music);

    // Jika konten berupa slide gambar / foto
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        let caption = i === 0 ? `*TikTok Slide Downloader*${title ? `\n\n*Judul:* ${title}` : ''}` : '';
        let imgUrl = cleanUrl(images[i]);
        if (useDocument) {
          await conn.sendMessage(m.chat, {
            document: { url: imgUrl },
            mimetype: 'image/jpeg',
            fileName: `tiktok_${i + 1}.jpg`,
            caption
          }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, {
            image: { url: imgUrl },
            caption
          }, { quoted: m });
        }
      }
    } else if (videoUrl) {
      // Jika konten berupa video
      let caption = `*TikTok Video Downloader*${title ? `\n\n*Judul:* ${title}` : ''}`;
      if (useDocument) {
        await conn.sendMessage(m.chat, {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          fileName: 'tiktok.mp4',
          caption
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          caption,
          mimetype: 'video/mp4'
        }, { quoted: m });
      }
    } else {
      throw 'Tidak dapat menemukan media dari URL tersebut.';
    }

    // Mengirim audio / musik jika tersedia
    if (musicUrl) {
      if (useDocument) {
        await conn.sendMessage(m.chat, {
          document: { url: musicUrl },
          mimetype: 'audio/mpeg',
          fileName: 'lagu.mp3'
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          audio: { url: musicUrl },
          mimetype: 'audio/mpeg',
          fileName: 'lagu.mp3'
        }, { quoted: m });
      }
    }
  } catch (e) {
    console.error(e);
    throw typeof e === 'string' ? e : `Error: ${e?.message || global.eror || 'Terjadi kesalahan saat memproses unduhan TikTok'}`;
  }
};

handler.help = ['tiktok <url>', 'tt <url>'];
handler.command = /^(tiktok|tt)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;

export default handler;
