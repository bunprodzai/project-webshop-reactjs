import {delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";


export const listCategory = async (token, sortKey, sortType) => {
  try {
    const result = await getAuth(`${admin}/products-category?sortKey=${sortKey}&sortType=${sortType}`, token);
    return result;
  } catch (error) {
    console.error("Error in listCategory:", error.message);
    throw error;
  }
};

export const addCategory = async (option, token) => {
  const result = await postAuth(`${admin}/products-category/create`, option, token);
  return result;
}

export const editCategory = async (id, option, token) => {
  const result = await patchAuth(`${admin}/products-category/edit/${id}`, option, token);
  return result;
}
export const changeStatusCategory = async (token, status, id) => {
  const result = await getAuth(`${admin}/products-category/change-status/${status}/${id}`, token);
  return result;
}

export const deleteCategory = async (id, token) => {
  const result = await delAuth(`${admin}/products-category/delete-item/${id}`, token);
  return result;
}