const tag = "<!-- summary -->"
const hasSummary = content => content.split(tag).length === 3;
const excerpt = (content) => content.split(tag)[1];
const delHtmlTag = str => str.replace(/<[^>]+>/g,"");

module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter("excerpt", (content) =>
      excerpt(content.post)
    );

    eleventyConfig.addFilter("hasSummary", (content) =>
      hasSummary(content.post)
    );

    eleventyConfig.addFilter("delHtmlTag", (content) =>
      delHtmlTag(summary)
    );

    eleventyConfig.addShortcode("summary", function(content) {
    if (!hasSummary(content.post)) return ''
    const part = excerpt(content.post)
    const startIndex = part.indexOf('<!--')
    const endIndex = part.indexOf('-->')
    let summary = ''

    if( startIndex >= 0){
      summary = part.slice(startIndex+4, endIndex)
    } else {
      summary = delHtmlTag(part)
    }
    summary = summary.trim().replace(/(\r\n\t|\n|\r\t)/g,"")
    return `<div class="summary">${summary}</div>`
    });
};