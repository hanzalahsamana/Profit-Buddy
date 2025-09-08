import BASE_URL from '../../config';

export const EndPoints = {
  registerUser: `${BASE_URL}/post/register`,
  loginUser: `${BASE_URL}/post/login`,

  getProducts: `${BASE_URL}/get/products`,
  getSellerInfo: `${BASE_URL}/get/seller-info`,
  searchProducts: `${BASE_URL}/get/search-product`,
  getProductOffer: `${BASE_URL}/get/product-offers`,
  graphImageWithProxy: `${BASE_URL}/get/graph-image`,
  findProductAsin: `${BASE_URL}/get/find-product-asins`,
  getGraphData: `${BASE_URL}/get/graph-data`,
  getSellerRevenue: `${BASE_URL}/get/calculate-seller-revenue`,
};
