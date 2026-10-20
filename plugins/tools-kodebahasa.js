let handler = async (m) => {
    let readMore = String.fromCharCode(8206).repeat(4001);
    let caption = `╔═══「 *KODE BAHASA GOOGLE* 」
╟ id : Indonesian (Indonesia)
╟ en : English (Inggris)
╟ ja : Japanese (Jepang)
╟ ar : Arabic (Arab)
╟ ko : Korean (Korea)
${readMore}╟ af : Afrikaans
╟ sq : Albanian
╟ hy : Armenian
╟ ca : Catalan
╟ zh : Chinese
╟ zh-cn : Chinese (Mandarin/China)
╟ zh-tw : Chinese (Mandarin/Taiwan)
╟ hr : Croatian
╟ cs : Czech
╟ da : Danish
╟ nl : Dutch
╟ en-au : English (Australia)
╟ en-uk : English (United Kingdom)
╟ en-us : English (United States)
╟ eo : Esperanto
╟ fi : Finnish
╟ fr : French
╟ de : German
╟ el : Greek
╟ ht : Haitian Creole
╟ hi : Hindi
╟ hu : Hungarian
╟ is : Icelandic
╟ it : Italian
╟ la : Latin
╟ lv : Latvian
╟ mk : Macedonian
╟ no : Norwegian
╟ pl : Polish
╟ pt : Portuguese
╟ pt-br : Portuguese (Brazil)
╟ ro : Romanian
╟ ru : Russian
╟ sr : Serbian
╟ sk : Slovak
╟ es : Spanish
╟ sw : Swahili
╟ sv : Swedish
╟ ta : Tamil
╟ th : Thai
╟ tr : Turkish
╟ vi : Vietnamese
╚═════════════`.trim();

    m.reply(caption);
};

handler.help = ['kodebahasa'];
handler.tags = ['tools'];
handler.command = /^kodebahasa$/i;

export default handler;
