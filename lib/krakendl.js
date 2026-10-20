import axios from "axios";
import * as cheerio from "cheerio";

const krakens = {
   download: async (url) => {
       try {
           let { data } = await axios.get(url);
           let $ = cheerio.load(data);
           
           let videoUrl = $("video source").attr("src");
           let fileName = $(".coin-name h5").text().trim().replace(".mp4", "");
           let thumbnailUrl = $("video").attr("poster");

           if (videoUrl) {
               return {
                   fileName,
                   downloadLink: "https:" + videoUrl,
                   thumbnail: "https:" + thumbnailUrl
               };
           } else {
               return { error: "Link tidak ditemukan." };
           }
       } catch (error) {
           return { error: error.message };
       }
   }
};

export { krakens };
export default krakens;
