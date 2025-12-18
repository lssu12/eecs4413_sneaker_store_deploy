import axios from 'axios';
import {BASE_URL, getHeader} from "../Util/util"

const listProducts = async () => {
	const response = await axios.get(`${BASE_URL}/api/admin/products`, {
		headers: getHeader(),
	});
	return response.data;
}

const addProduct = async (productData) => {
	const response = await axios.post(`${BASE_URL}/api/admin/products`, productData, {
		headers: getHeader(),
	});
	return response.data;
}

const updateProduct = async(productId, productData) => {
	const response = await axios.put(`${BASE_URL}/api/admin/products/${productId}`, productData, {
		headers: getHeader(),
	});
	return response.data;
}
const deleteProduct = async (productId) => {
	const response = await axios.delete(`${BASE_URL}/api/admin/products/${productId}`, {
		headers: getHeader(),
	});
	return response.data;
}

export default { listProducts, addProduct, updateProduct, deleteProduct}