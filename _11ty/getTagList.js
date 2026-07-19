module.exports = function(collection) {
  let tagSet = new Set();
  collection.getAll().forEach(function(item) {
    if( "tags" in item.data ) {
      let tags = item.data.tags;

      tags = tags.filter(function(item) {
        switch(item) {
          // this list should match the `filter` list in tags.njk
          case "all":
          case "nav":
          case "post":
          case "posts":
            return false;
        }

        return true;
      });

      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  // returning an array in addCollection works in Eleventy 0.5.3
  // 排序讓 tag 順序在不同次建置間保持一致：collection.getAll() 的順序
  // 取決於檔案系統掃描，並不穩定，會讓 /tags/ 頁的區塊順序（連帶自動
  // 產生的 meta description）每次建置都不同。
  return [...tagSet].sort();
};
