import { getAuth } from "../../utils/request";
const admin = "/admin";

export const listOrderGet = async (token) => {
  const result = await getAuth(`${admin}/orders`, token);
  return result;
}

export const detailOrderGet = async (id, token) => {
  const result = await getAuth(`${admin}/orders/detail/${id}`, token);
  return result;
}

export const changeStatusOrderGet = async (token, status, code) => {
  const result = await getAuth(`${admin}/orders/change-status/${status}/${code}`, token);
  return result;
}