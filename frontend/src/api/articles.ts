import API from "./axios";

export const searchArticles = async (query: string) => {
  const res = await API.get(`/search/articles?q=${query}`);
  return res.data; // { results: [...] }
};

export const getArticle = async (pmid: string) => {
  const res = await API.get(`/search/articles/${pmid}`);
  return res.data.article;
};
