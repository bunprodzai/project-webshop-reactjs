import { get, getAuth, patch, patchAuth } from "../../utils/request";

export const findCartGet = async (cartId) => {
  const result = await get(`/cart/get-cart/${cartId}`);
  return result;
}

export const cartCreateGet = async () => {
  const result = await get(`/cart/create`);
  return result;
}

export const findCartByUserId = async (tokenUser) => {
  const result = await getAuth(`/cart/find`, tokenUser);
  return result;
}

export const updateUserPatch = async (options, tokenUser) => {
  const result = await patchAuth(`/cart/update-user`, options, tokenUser);
  return result;
}

export const addCartPatch = async (productId, options) => {
  const result = await patch(`/cart/add/${productId}`, options);
  return result;
}


export const updateCartPatch = async (productId, options) => {
  const result = await patch(`/cart/update/${productId}`, options);
  return result;
}

export const delCartPatch = async (productId, options) => {
  const result = await patch(`/cart/delete/${productId}`, options);
  return result;
}
