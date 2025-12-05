import api from "./axios";

export async function listWebs() {
  const res = await api.get("/webs");
  return res.data;
}

export async function getWeb(id: string) {
  const res = await api.get(`/webs/${id}`);
  return res.data;
}

export async function createWeb(pmid: string, title: string, description: string) {
  const res = await api.post("/webs", { rootPmid: pmid, title, description });
  return res.data;
}

export async function deleteWeb(id: string) {
  const res = await api.delete(`/webs/${id}`);
  return res.data;
}
