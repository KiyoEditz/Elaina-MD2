import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

class NekoPoi {
    async latest() {
        try {
            const response = await fetch("https://nekopoi.care", { headers: defaultHeaders });
            const html = await response.text();
            const $ = cheerio.load(html);

            const series = [];
            const episode = [];

            // Rekomendasi / Ticker
            $(".nk-ticker ul li, .animeseries ul li").each((_, element) => {
                const a = $(element).find("a").first();
                const htmlContent = a.attr("original-title");
                if (htmlContent) {
                    const exec = cheerio.load(htmlContent);
                    const info = {};
                    exec(".nk-tooltip-detail p, .areadetail p").each((_, infoElement) => {
                        const name = exec(infoElement).find("b").text().trim().replace(':', '');
                        const value = exec(infoElement).text().replace(`${name}:`, "").trim();
                        if (name) info[name.split(" ").join("_").toLowerCase().trim()] = value;
                    });

                    series.push({
                        title: exec(".nk-tooltip-card h2, .infoarea h2").first().text().trim() || a.text().trim(),
                        thumbnail: exec(".nk-tooltip-img, .areabaru img").attr("src"),
                        ...info,
                        url: a.attr("href"),
                    });
                }
            });

            // Post terbaru
            $(".nk-search-results ul li, #boxid .eropost").each((_, element) => {
                const a = $(element).find("a.nk-search-item, a").first();
                const title = $(element).find(".nk-search-info h2, .eroinfo h2 a").first().text().trim();
                const release = $(element).find(".nk-search-desc, .eroinfo span").first().text().trim();
                const url = a.attr("href") || $(element).find("a").first().attr("href");
                if (title && url) {
                    episode.push({
                        title,
                        release,
                        url,
                    });
                }
            });

            return { series, episode };
        } catch (error) {
            throw new Error(`Failed to fetch latest data: ${error.message}`);
        }
    }

    async detail(url) {
        try {
            const response = await fetch(url, { headers: defaultHeaders });
            const html = await response.text();
            const $ = cheerio.load(html);

            const result = {
                metadata: {},
                episode: [],
            };

            // Informasi detail anime
            $(".animeinfos .listinfo ul li, .nk-post-body .konten p").each((_, element) => {
                const name = $(element).find("b, strong").text().trim().replace(':', '');
                const value = $(element).text().replace(`${name}:`, "").trim();
                if (name) result.metadata[name.toLowerCase()] = value;
            });

            result.metadata.thumbnail = $(".nk-featured-img img, .animeinfos .imgdesc img").attr("src");
            result.metadata.sinopsis = $(".nk-post-body .konten, .animeinfos p").text().trim();

            $(".animeinfos .episodelist ul li, .nk-related-list li").each((_, element) => {
                const title = $(element).find(".nk-related-title a, a").first().text().trim();
                const url = $(element).find("a").first().attr("href");
                if (title && url) {
                    result.episode.push({
                        title,
                        url,
                    });
                }
            });

            return result;
        } catch (error) {
            throw new Error(`Failed to fetch detail data: ${error.message}`);
        }
    }

    async episode(url) {
        try {
            const response = await fetch(url, { headers: defaultHeaders });
            const html = await response.text();
            const $ = cheerio.load(html);

            const result = {
                metadata: {},
                download: [],
            };

            const title = $(".nk-post-header h1, .contentpost img").first().text().trim() || $(".nk-featured-img img").attr("title");
            const images = $(".nk-featured-img img, .contentpost img").attr("src");
            const synopsis = $(".nk-post-body .konten, .contentpost .konten").text().trim();

            result.metadata = { title, images, synopsis };
            result.metadata.stream = $("#nk-player iframe, #show-stream iframe").attr("src");

            $(".nk-download-row, .liner").each((_, element) => {
                const name = $(element).find(".nk-download-name, .name").text().trim();
                const links = [];

                $(element).find(".nk-download-links a, .listlink a").each((_, link) => {
                    links.push({
                        name: $(link).text().trim(),
                        url: $(link).attr("href"),
                    });
                });

                if (name) {
                    result.download.push({
                        title: name,
                        source: links,
                    });
                }
            });

            return result;
        } catch (error) {
            throw new Error(`Failed to fetch episode data: ${error.message}`);
        }
    }

    async search(q) {
        try {
            const searchUrl = `https://nekopoi.care/?s=${encodeURIComponent(q).replace(/%20/g, '+')}`;
            const response = await fetch(searchUrl, { headers: defaultHeaders });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            const html = await response.text();

            // Cek apakah terkena pemblokiran ISP / Internet Positif
            if (html.includes('internet-positif') || html.includes('trustpositif') || html.includes('Internet Baik')) {
                throw new Error('Akses ke nekopoi.care diblokir oleh ISP (Internet Positif). Silakan gunakan DNS 1.1.1.1 / VPN pada server bot.');
            }

            const $ = cheerio.load(html);
            const episode = [];

            // Mendukung struktur baru (.nk-search-results) dan struktur lama (.result)
            $(".nk-search-results ul li, .result ul li, article").each((_, element) => {
                const a = $(element).find("a.nk-search-item, a").first();
                const link = a.attr("href") || $(element).find("h2 a").attr("href") || "";
                const title = $(element).find(".nk-search-info h2, h2").first().text().trim();
                const desc = $(element).find(".nk-search-desc, p").first().text().trim();

                // Ekstraksi gambar dari background-image style atau tag img
                const thumbStyle = $(element).find(".nk-search-thumb, .thumb").attr("style") || "";
                const bgMatch = thumbStyle.match(/url\(['"]?(.*?)['"]?\)/);
                const images = bgMatch ? bgMatch[1] : ($(element).find("img").attr("data-src") || $(element).find("img").attr("src") || "");

                if (title && link) {
                    episode.push({
                        title,
                        type: link.includes("/hentai/") ? "Hentai Series" : (title.startsWith("[3D]") ? "3D Hentai" : (title.startsWith("[L2D]") ? "L2D Hentai" : "Hentai Episodes")),
                        desc,
                        images,
                        url: link,
                    });
                }
            });

            console.log(`[NEKOPOI] Search "${q}": found ${episode.length} items from ${searchUrl}`);
            return episode;
        } catch (error) {
            throw new Error(`Gagal mengambil hasil pencarian: ${error.message}`);
        }
    }
}

const nekopoi = new NekoPoi();
export { NekoPoi, nekopoi };
export default nekopoi;
