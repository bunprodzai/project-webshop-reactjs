import { getAuth, patchAuth, post, postAuth } from "../../utils/request";

export const forgotPasswordPost = async (options) => {
  const result = await post(`/users/password/forgot`, options);
  return result;
}

export const optPasswordPost = async (email, options) => {
  const result = await post(`/users/password/otp/${email}`, options);
  return result;
}

export const resetPasswordPost = async (options, token) => {
  const result = await postAuth(`/users/password/reset-password`, options, token);
  return result;
}

export const registerPost = async (options) => {
  const result = await post(`/users/register`, options);
  return result;
}

export const infoGet = async (tokenUser) => {
  const result = await getAuth(`/users/info`, tokenUser);
  return result;
}

export const editInfoPatch = async (options, tokenUser) => {
  const result = await patchAuth(`/users/info/edit`, options, tokenUser);
  return result;
}

export const resetPassowrdPatch = async (options, tokenUser) => {
  const result = await patchAuth(`/users/info/reset-password`, options, tokenUser);
  return result;
}

export const historyOrderGet = async (tokenUser) => {
  const result = await getAuth(`/users/history-order`, tokenUser);
  return result;
}