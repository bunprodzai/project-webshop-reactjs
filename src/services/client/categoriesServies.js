import { get } from "../../utils/request";

export const listCategoriesGet = async () => {
  const result = await get(`/categories`);
  return result;
}