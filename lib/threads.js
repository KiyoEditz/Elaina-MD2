import axios from 'axios';
import * as cheerio from 'cheerio';

async function threadster(id) {
  try {
    const response = await axios.get(`https://threadster.app/download/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const profile = $('.download_item_profile_pic img').attr('src');
    const caption = $('.download_itemcaption_text').text().trim();
    const download = $('.download_iteminfoactions_button').attr('href');
    const resolution = $('table tr:nth-child(2) td:first-child').text();

    return {
      profile: {
        picture: profile,
      },
      content: {
        caption: caption,
        download: {
          link: download,
          resolution: resolution,
        },
      },
    };
  } catch (error) {
    return {
      error: 'Error scraping page',
      message: error.message,
      responseStatus: error.response ? error.response.status : null,
      responseHeaders: error.response ? error.response.headers : null,
    };
  }
}

export { threadster };
export default threadster;
