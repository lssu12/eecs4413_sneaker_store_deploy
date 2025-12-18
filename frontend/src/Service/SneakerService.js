// SneakerService.js
import axios from 'axios';
import { BASE_URL, getHeader } from '../Util/util';

const getAllSneakers = async () => {
  const response = await axios.get(`${BASE_URL}/api/sneakers`, { headers: getHeader() });
  return response.data;
};

const getSneakerById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/sneakers/${id}`, { headers: getHeader() });
  return response.data;
};

const searchSneakers = async (keyword) => {
  const response = await axios.get(`${BASE_URL}/api/sneakers/search`, {
    headers: getHeader(),
    params: { q: keyword }
  });
  return response.data;
};

const getSneakersByBrand = async (brand) => {
  const response = await axios.get(`${BASE_URL}/api/sneakers/brand/${brand}`, { headers: getHeader() });
  return response.data;
};

const createSneaker = async (sneakerData) => {
  const response = await axios.post(`${BASE_URL}/api/sneakers`, sneakerData, { headers: getHeader() });
  return response.data;
};

const updateSneaker = async (id, sneakerData) => {
  const response = await axios.put(`${BASE_URL}/api/sneakers/${id}`, sneakerData, { headers: getHeader() });
  return response.data;
};

const deleteSneaker = async (id) => {
  const response = await axios.delete(`${BASE_URL}/api/sneakers/${id}`, { headers: getHeader() });
  return response.data;
};

export default {
  getAllSneakers,
  getSneakerById,
  searchSneakers,
  getSneakersByBrand,
  createSneaker,
  updateSneaker,
  deleteSneaker,
};
