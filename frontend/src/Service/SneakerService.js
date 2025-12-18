// SneakerService.js
import axios from 'axios';
import { BASE_URL, getHeader } from '../Util/util';

const fetchSneakers = async (params = {}) => {
  const response = await axios.get(`${BASE_URL}/api/sneakers`, {
    headers: getHeader(),
    params,
  });
  return response.data;
};

const getSneakerById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/sneakers/${id}`, { headers: getHeader() });
  return response.data;
};

const searchSneakers = async (keyword) => fetchSneakers({ q: keyword });

const getSneakersByBrand = async (brand) => fetchSneakers({ brand });

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
  fetchSneakers,
  getSneakerById,
  searchSneakers,
  getSneakersByBrand,
  createSneaker,
  updateSneaker,
  deleteSneaker,
};
