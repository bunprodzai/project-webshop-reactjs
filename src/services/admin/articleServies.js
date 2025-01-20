import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listArticleGet = async (token) => {
  const result = await getAuth(`${admin}/articles`, token);
  return result;
}

export const editArticlePatch = async (id, option, token) => {
  const result = await patchAuth(`${admin}/articles/edit/${id}`, option, token);
  return result;
}

export const deleteArticleDel = async (id, token) => {
  const result = await delAuth(`${admin}/articles/delete/${id}`, token);
  return result;
}

export const addArticlePost = async (option, token) => {
  const result = await postAuth(`${admin}/articles/create`, option, token);
  return result;
}

export const detailArticleGet = async (token, id) => {
  const result = await getAuth(`${admin}/articles/${id}`, token);
  return result;
}