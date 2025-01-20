import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listAccountGet = async (token) => {
  const result = await getAuth(`${admin}/accounts`, token);
  return result;
}

export const editAccountPatch = async (id, option, token) => {
  const result = await patchAuth(`${admin}/accounts/edit/${id}`, option, token);
  return result;
}

export const deleteAccountDel = async (id, token) => {
  const result = await delAuth(`${admin}/accounts/delete/${id}`, token);
  return result;
}

export const addAccountPost = async (option, token) => {
  const result = await postAuth(`${admin}/accounts/create`, option, token);
  return result;
}

export const changeStatusAccountGet = async (token, status, id) => {
  const result = await getAuth(`${admin}/accounts/change-status/${status}/${id}`, token);
  return result;
}