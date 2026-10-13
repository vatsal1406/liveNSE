import api from "./api";

export const getLatestNews = async (page = 1) => {
    const response = await api.get(`/news/latest?page=${page}&limit=50`);
    return response.data.data;
};

export const getOneNews = async () => {
    const response = await api.get("/news/one");
    return response.data;
};

export const getNewsById = async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data.data;
};

export const searchCompany = async (company) => {
    const response = await api.get(`/news/search?company=${company}`);
    return response.data;
};