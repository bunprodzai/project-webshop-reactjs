import { get } from "../../utils/request";


export const detailProductGet = async (slug) => {
  const result = await get(`/products/detail/${slug}`);
  return result;
}

export const productsCategoryGet = async (slugCategory) => {
  const result = await get(`/products/${slugCategory}`);
  return result;
}

export const productsSearchGet = async (slugCategory) => {
  const result = await get(`/search?keyword=${slugCategory}`);
  return result;
}