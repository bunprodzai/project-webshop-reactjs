import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listProducts = async (token, page, litmit, keyword, sortKey, sortType) => {
  const result = await getAuth(`${admin}/products?page=${page}&limit=${litmit}&keyword=${keyword}&sortKey=${sortKey}&sortType=${sortType}`, token);
  return result;
}

export const editProduct = async (id, option, token) => {
  const result = await patchAuth(`${admin}/products/edit-item/${id}`, option, token);
  return result;
}

export const deleteProduct = async (id, token) => {
  const result = await delAuth(`${admin}/products/delete-item/${id}`, token);
  return result;
}

export const addProduct = async (option, token) => {
  const result = await postAuth(`${admin}/products/create-item`, option, token);
  return result;
}

export const changeStatusProduct = async (token, status, id) => {
  const result = await getAuth(`${admin}/products/change-status/${status}/${id}`, token);
  return result;
}