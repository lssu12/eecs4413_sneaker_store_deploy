import axios from 'axios';
import { getHeader } from '../Util/util';


const BASE_URL = import.meta.env.VITE_BASE_URL;

const listCustomers = async () => {
	const response = await axios.get(`${BASE_URL}/api/admin/customers`, {
		headers: getHeader(),
	});
	return response.data;
};

const getCustomerbyId = async (customerId) => {
	const response = await axios.get(`${BASE_URL}/api/admin/customers/${customerId}`, {
		headers: getHeader(),
	});
	return response.data;
};
const updateCustomer = async (customerId, customerData) => {
	const response = await axios.put(`${BASE_URL}/api/admin/customers/${customerId}`, customerData, {
		headers: getHeader(),
	});
	return response.data;
};

const deleteCustomer = async (customerId) => {
	const response = await axios.delete(`${BASE_URL}/api/admin/customers/${customerId}`, {
		headers: getHeader(),
	});
	return response.data;
};

export default { listCustomers, getCustomerbyId, updateCustomer, deleteCustomer };
