import axios from 'axios';
import { getHeader } from '../Util/util';


const BASE_URL = import.meta.env.VITE_BASE_URL;

const listOrders = async (status) =>{
	const params = {};
	if (status) {
		params.status = status;
	}
	const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
		headers: getHeader(),
		params: params,
	});
	return response.data;
}

const getOrderById = async (orderId) =>{
	const response = await axios.get(`${BASE_URL}/api/admin/orders/${orderId}`, { headers: getHeader() });
	return response.data;
}

const updateOrderStatus = async (orderId, status) => {
	const response = await axios.put(`${BASE_URL}/api/admin/orders/${orderId}/status`, { status: status }, { headers: getHeader() });
	return response.data;
}

export default {listOrders, getOrderById, updateOrderStatus};