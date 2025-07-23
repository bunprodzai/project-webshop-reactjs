import { get, patch, post } from "../../utils/request";

export const orderPost = async (options) => {
  const result = await post(`/checkout/order`, options);
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