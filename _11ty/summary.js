tag = "<!-- summary -->"
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
    if ( hasSummary(content.post) ){
      let summary = excerpt(content.post)
      if(summary.indexOf('<!--') > 0){
        return `<div class="summary">${summary.slice(6, -5)}</div>`
      }
      return `<div class="summary">${delHtmlTag(summary)}</div>`
    } else return '';
  });
};