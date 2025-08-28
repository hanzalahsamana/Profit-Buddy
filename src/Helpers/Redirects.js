const openInNewTab = (e, url) => {
  e?.preventDefault();
  e?.stopPropagation();
  if (url) window.open(url, '_blank');
};

export const redirectForSeller = (e, sellerId) => {
  if (!sellerId) return;
  const encoded = encodeURIComponent(sellerId.trim());
  openInNewTab(e, `/sellerProfile?sellerid=${encoded}`);
};

export const redirectToAmazonProductPage = (e, productAsin) => {
  if (!productAsin) return;
  const encoded = encodeURIComponent(productAsin.trim());
  openInNewTab(e, `https://www.amazon.com/dp/${encoded}`);
};

export const redirectToAmazonSellerPage = (e, sellerId) => {
  if (!sellerId) return;
  const encoded = encodeURIComponent(sellerId.trim());
  openInNewTab(e, `https://www.amazon.com/s?me=${encoded}`);
};

export const redirectToGoogleSearch = (e, searchTerm) => {
  if (!searchTerm) return;
  const encoded = encodeURIComponent(searchTerm.trim());
  openInNewTab(e, `https://www.google.com/search?q=${encoded}`);
};
