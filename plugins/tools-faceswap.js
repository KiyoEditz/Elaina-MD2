import axios from 'axios';
import { randomUUID } from 'crypto';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || !args[1]) {
        return m.reply(`Silakan masukkan 2 URL gambar!\n\nContoh:\n*${usedPrefix + command} [URL_foto_target] [URL_wajah]*`);
    }

    const originalImgUrl = args[0];
    const targetFaceUrl = args[1];

    await m.reply('*Sedang melakukan Face Swap, mohon tunggu 10-50 detik...*');

    try {
        const result = await faceswap(originalImgUrl, targetFaceUrl);

        if (result.error) {
            return m.reply(`Gagal melakukan face swap: ${result.error}`);
        }

        if (result.data && result.data.url) {
            await conn.sendMessage(m.chat, {
                image: { url: result.data.url },
                caption: '✨ *Face Swap Berhasil!*'
            }, { quoted: m });
        } else {
            m.reply('Terjadi kesalahan saat memproses gambar.');
        }
    } catch (e) {
        m.reply(`Error: ${e.message || e}`);
    }
};

async function faceswap(original, target) {
    const API_URL = 'https://supawork.ai/supawork/headshot/api';
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 5000;

    const headers = {
        accept: 'application/json',
        'accept-language': 'id;q=0.5',
        authorization: 'null',
        'content-type': 'application/json',
        origin: 'https://supawork.ai',
        referer: 'https://supawork.ai/ai-face-swap',
        'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
        const identityID = randomUUID();
        const postData = {
            aigc_app_code: 'face_swap_single',
            face_swap_type: 'single',
            target_image_url: original,
            target_face_url: target,
            identity_id: identityID,
            currency_type: 'silver'
        };

        const initialResponse = await axios.post(`${API_URL}/swap/single`, postData, { headers });

        if (initialResponse.data.code !== 200) {
            return { error: initialResponse.data.message };
        }

        const taskId = initialResponse.data.data.task_id;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            await delay(RETRY_DELAY);

            const statusResponse = await axios.get(`${API_URL}/task/status`, {
                params: { task_id: taskId },
                headers
            });

            if (statusResponse.data.code === 200) {
                const taskStatus = statusResponse.data.data.status;

                if (taskStatus === 2) {
                    return { data: { url: statusResponse.data.data.result_image_url } };
                } else if (taskStatus === 3) {
                    return { error: 'Proses generate gagal di server' };
                }
            }
        }

        return { error: 'Batas waktu proses terlampaui (Timeout)' };
    } catch (error) {
        return { error: error.message };
    }
}

handler.help = ['faceswap <url_target> <url_wajah>'];
handler.tags = ['ai', 'tools'];
handler.command = /^(faceswap|tukarwajah)$/i;

export default handler;
