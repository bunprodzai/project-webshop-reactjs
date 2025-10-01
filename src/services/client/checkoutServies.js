import { get, patch, post, postAuth } from "../../utils/request";

export const orderUserPost = async (options, tokenUser) => {
  const result = await postAuth(`/checkout/order-user`, options, tokenUser);
  return result;
}

export const successOrderPatch = async (orderId, options) => {
  const result = await patch(`/checkout/success/${orderId}`, options);
  return result;
}

export const detailOrderGet = async (orderId) => {
  const result = await get(`/checkout/order/detail/${orderId}`);
  return result;
}

export const createQrPost = async (options) => {
  const result = await post(`/vn-pay/create-qr`, options);
  return result;
}

export const checkVoucherPost = async (options) => {
  const result = await post(`/checkout/check-voucher`, options);
  return result;
}