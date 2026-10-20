// Live Wallpaper Anime By: DaniDesignA :) 
// Jangan Hapus Wm Hargai Yang Sudah Membuat fitur Ini
// Klo Eror Chat: wa.me/6285819572683

import axios from 'axios';
import * as cheerio from 'cheerio';

async function moewalls(query = '', options = {}) {
    const defaultOptions = {
        baseUrl: 'https://moewalls.com',
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    const config = { ...defaultOptions, ...options };

    try {
        const searchUrl = query
            ? `${config.baseUrl}/?s=${encodeURIComponent(query)}`
            : config.baseUrl;

        const response = await axios.get(searchUrl, {
            timeout: config.timeout,
            headers: config.headers
        });

        const $ = cheerio.load(response.data);
        const wallpapers = [];

        $('.g1-collection-item, .g1-collection-item-l, .snax-list-item, article.post, .entry-tpl-grid').each((index, element) => {
            const $item = $(element);

            const title = $item.find('.entry-title a, h2 a, h3 a').first().text().trim();
            const thumbnail = $item.find('img').attr('data-src') || $item.find('img').attr('src') || '';
            const source = $item.find('.entry-title a, h2 a, h3 a').first().attr('href');

            if (!title || !source) return;

            // Hindari duplikasi jika ada multiple matching selectors
            if (wallpapers.some(w => w.source === source)) return;

            const wallpaper = {
                title,
                thumbnail,
                source,
                index: wallpapers.length + 1,
                video: '' // Akan diisi nanti
            };

            wallpapers.push(wallpaper);
        });

        async function getWallpaperDetails(pageUrl) {
            try {
                const pageResponse = await axios.get(pageUrl, {
                    timeout: config.timeout,
                    headers: config.headers
                });
                const $page = cheerio.load(pageResponse.data);

                // Ekstraksi video URL (prioritaskan download direct link / mp4 daripada webm preview)
                let video =
                    $page('a[href*="/dl/4k/"]').attr('href') ||
                    $page('a[href*="/dl/hd/"]').attr('href') ||
                    $page('a[href*="/dl/"]').attr('href') ||
                    $page('a[href*=".mp4"]').attr('href') ||
                    $page('a[download]').attr('href') ||
                    $page('.snax-download-link').attr('href') ||
                    $page('a.wallpaper-download-link').attr('href') ||
                    $page('video source[src*=".mp4"]').attr('src') ||
                    $page('video[src*=".mp4"]').attr('src') ||
                    $page('video source').attr('src') ||
                    $page('video').attr('src') ||
                    '';

                // Pastikan URL menjadi absolut jika website mengembalikan relative path
                if (video) {
                    if (video.startsWith('//')) {
                        video = 'https:' + video;
                    } else if (video.startsWith('/')) {
                        video = new URL(video, config.baseUrl).href;
                    }
                }

                return { video };
            } catch (error) {
                return { video: null };
            }
        }

        for (let wallpaper of wallpapers) {
            const details = await getWallpaperDetails(wallpaper.source);
            Object.assign(wallpaper, details);
        }

        return {
            query,
            total: wallpapers.length,
            wallpapers
        };
    } catch (error) {
        return {
            query,
            total: 0,
            error: error.message,
            wallpapers: []
        };
    }
}

export { moewalls };
export default moewalls;
