import BASE_URL from '../../config';

export const EndPoints = {
  registerUser: `/post/register`,
  loginUser: `/post/login`,
  upsertHistory: '/post/upsert-history',

  getUserDetail: `/get/user-detail`,
  getProducts: `/get/products`,
  getSellerInfo: `/get/seller-info`,
  searchProducts: `/get/search-product`,
  getProductOffer: `/get/product-offers`,
  graphImageWithProxy: `/get/graph-image`,
  findProductAsin: `/get/find-product-asins`,
  getGraphData: `/get/graph-data`,
  getSellerRevenue: `/get/calculate-seller-revenue`,
  getHistory: `/get/history`,
};
