const axios = require("axios");

module.exports = async function (url, asin, page) {
  return axios.post(url, {
    pageNumber: page,
    reftag: `cm_cr_arp_d_paging_btm_next_${page}`,
    asin
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Referer": `https://www.amazon.com/product-reviews/${asin}/`,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
    }
  })
}
