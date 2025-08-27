export const buildSellerAsinQuery = (productsQuery, seller, sellerId) => {
  const categoryMap =
    seller?.categories?.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {}) || {};

  const query = {
    sellerIds: sellerId,
    page: 0,
    perPage: 10000,
  };

  if (productsQuery.rootCategory?.length) {
    console.log(productsQuery.rootCategory, categoryMap);

    query.rootCategory = productsQuery.rootCategory
      .map((catName) => categoryMap[catName])
      .filter(Boolean)
      .join(',');
  }

  if (productsQuery.brand?.length) {
    query.brand = productsQuery.brand.join(',');
  }

  console.log(query);

  return (
    '?' +
    Object.entries(query)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  );
};
