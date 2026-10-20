import { GoogleGenerativeAI } from '@google/generative-ai';
import { UguuSe } from '../lib/uploadImage.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let text;
  if (args.length >= 1) {
    text = args.join(' ');
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  } else {
    return m.reply(`• *Example:* ${usedPrefix + command} halo gemini`);
  }

  const apiKey = global.geminiKey || process.env.GEMINI_API_KEY || 'AIzaSyCGycrkgySg3r0BcOi-BNQuQ1BBZUplbmc';
  const genAI = new GoogleGenerativeAI(apiKey);

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key }
  });

  try {
    let responseText = '';
    let thumbUrl = 'https://telegra.ph/file/4bae3d5130aabcbe94588.jpg';

    if (!mime) {
      // Mode teks: coba gemini-2.0-flash, fallback ke gemini-1.5-flash
      let model;
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
        const result = await model.generateContent(text);
        responseText = result.response.text();
      } catch (err) {
        if (/not found/i.test(err?.message)) {
          model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
          const result = await model.generateContent(text);
          responseText = result.response.text();
        } else {
          throw err;
        }
      }

      if (!responseText) throw new Error('Response kosong dari Gemini API.');

      await conn.sendMessage(m.chat, {
        text: responseText,
        contextInfo: {
          externalAdReply: {
            title: 'GEMINI AI',
            body: 'Google Generative AI',
            thumbnailUrl: thumbUrl,
            sourceUrl: 'https://gemini.google.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      // Mode gambar / vision
      if (!/image\/(png|jpe?g|webp)/.test(mime)) {
        throw 'Mohon reply atau kirim gambar (JPG/PNG/WebP) dengan teks!';
      }

      let media = await q.download();
      const imageBase64 = Buffer.from(media).toString('base64');
      const mimeType = mime.includes('webp') ? 'image/webp' : (mime || 'image/jpeg');

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      };

      // Model multimodal (teks + gambar)
      let model;
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([imagePart, text]);
        responseText = result.response.text();
      } catch {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const result = await model.generateContent([imagePart, text]);
        responseText = result.response.text();
      }

      if (!responseText) throw new Error('Response kosong dari Gemini Vision API.');

      // Upload untuk thumbnail externalAdReply jika memungkinkan
      try {
        const uploadResult = await UguuSe(media).catch(() => null);
        if (uploadResult?.url) thumbUrl = uploadResult.url;
      } catch { }

      await conn.sendMessage(m.chat, {
        text: responseText,
        contextInfo: {
          externalAdReply: {
            title: 'GEMINI VISION',
            body: 'Google Generative AI Multimodal',
            thumbnailUrl: thumbUrl,
            sourceUrl: 'https://gemini.google.com',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    });

    let errMsg = e?.message || e;
    if (/API_KEY_IP_ADDRESS_BLOCKED/i.test(errMsg) || /violates this restriction/i.test(errMsg)) {
      m.reply(`*Google Gemini Error:* API Key yang digunakan dibatasi oleh pemiliknya (IP Address restriction).\n\nSilakan gunakan API Key Anda sendiri dari https://aistudio.google.com/ lalu tambahkan di config.js:\n\`global.geminiKey = 'AIzaSy...'\``);
    } else {
      m.reply(`Terjadi kesalahan saat memproses permintaan Gemini:\n\n${errMsg}`);
    }
  }
};

handler.help = ['gemini <teks>', 'gemini (reply foto) <teks>'];
handler.tags = ['ai', 'tools'];
handler.command = /^(gemini)$/i;
handler.limit = true;
handler.register = true;

export default handler;
