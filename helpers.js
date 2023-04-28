const getUser = (element, domain) => {
  const url = element.find('div[data-hook="genome-widget"] a').attr('href');
  const name = element.find('div[data-hook="genome-widget"] span.a-profile-name').text();

  return {name, url: domain + url}
}

const getReview = (element) => {
  const title = trimText(element, "a", "review-title"),
    country = trimText(element, "span", "review-date"),
    date = trimText(element, "span", "review-date"),
    color = trimText(element, "a", "format-strip"),
    verified = trimText(element, "span", "avp-badge"),
    body = trimText(element, "span", "review-body"),
    helpful = trimText(element, "span", "helpful-vote-statement")[0]

  return {
    title,
    country: getCountry(country),
    date: getDate(date),
    color: color.replace('Color: ', ''),
    verified: verified === 'Verified Purchase',
    body,
    helpful: Number(helpful) || 0
  };
}

const getUrlWithPage = (url, num) => `${url}/ref=cm_cr_arp_d_paging_btm_next_${num}`


const trimText = (el, tag, hook) => {
  return el.find(`${tag}[data-hook='${hook}']`).text().trim()
}
const getDate = (reviewDate = "") => {
  const dateRegex = /on\s(.+)/;
  const dateMatch = reviewDate.match(dateRegex);

  return dateMatch ? dateMatch[1] : '';
}
const getCountry = (reviewCountry = "") => {
  const countryMatch = reviewCountry.match(/Reviewed in the (.*) on/);

  if (!countryMatch) return null
  return countryMatch[1].replace(/\p{Emoji}/gu, '')
}

module.exports = { getUser, getReview, getUrlWithPage }
