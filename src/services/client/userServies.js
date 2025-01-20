import { get, patch, post } from "../../utils/request";

export const forgotPasswordPost = async (options) => {
  const result = await post(`/users/password/forgot`, options);
  return result;
}

export const optPasswordPost = async (email, options) => {
  const result = await post(`/users/password/otp/${email}`, options);
  return result;
}

export const resetPasswordPost = async (options) => {
  const result = await post(`/users/password/reset-password`, options);
  return result;
}

export const registerPost = async (options) => {
  const result = await post(`/users/register`, options);
  return result;
}

export const infoGet = async (tokenUser) => {
  const result = await get(`/users/info/${tokenUser}`);
  return result;
}

export const editInfoPatch = async (options) => {
  const result = await patch(`/users/info/edit`, options);
  return result;
}

export const resetPassowrdPatch = async (options) => {
  const result = await patch(`/users/info/reset-password`, options);
  return result;
}