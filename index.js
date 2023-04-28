const cheerio = require('cheerio');
const apiCall = require("./api-call")
const {getUrlWithPage, getUser, getReview} = require("./helpers");

const url = "https://www.amazon.com/hz/reviews-render/ajax/reviews/get"
const domain = new URL(url).origin;

async function getAmazonProductReviews(asin) {
  const resultList = []
  let pageNum = 1;
  let isLast = false;

  while (!isLast) {
    const urlWithPagination = getUrlWithPage(url, pageNum)

    let data
    try {
      const res = await apiCall(urlWithPagination, asin, pageNum)
      data = res.data
    } catch (e) {
      throw e
    }

    const pageContentArray = []
    data.split("&&&").forEach((item) => {
      if (item.includes(`data-hook=\\"review\\"`)) {
        pageContentArray.push(JSON.parse(item))
      }
    })

    if (!pageContentArray.length) {
      isLast = true
      break
    }

    const $ = cheerio.load(pageContentArray.join(","));
    // Extracting review information
    $('div[data-hook="review"]').each((i, el) => {
      const element = $(el)

      const user = getUser(element, domain)
      const body = getReview(element)

      resultList.push({user, body});
    });

    pageNum++;
  }

  return {
    total: resultList.length,
    list: resultList
  }
}

getAmazonProductReviews("B07QS1YG85")
  .then(res => console.log("Result: ", JSON.stringify(res, null, 2)))
  .catch(e => console.log("Error: ", e.code, e))
