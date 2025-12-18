import React, { useState, useEffect } from 'react';
import AdminProductService from '../Service/AdminProductService';
import { useNavigate } from 'react-router-dom';

const AdminProduct = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [formVisible, setFormVisible] = useState(false);
	const [formData, setFormData] = useState({
		id: null,
		sku: '',
		name: '',
		brand: '',
		description: '',
		price: '',
		stockQuantity: '',
		imageUrl: '',
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const data = await AdminProductService.listProducts();
			setProducts(data);
		} catch (err) {
			console.error('Failed to fetch products', err);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleEdit = (product) => {
		setFormData(product);
		setIsEditing(true);
		setFormVisible(true);
	};

	const handleAddNew = () => {
		setFormData({
			id: null,
			sku: '',
			name: '',
			brand: '',
			description: '',
			price: '',
			stockQuantity: '',
			imageUrl: '',
		});
		setIsEditing(false);
		setFormVisible(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await AdminProductService.updateProduct(formData.id, formData);
			} else {
				await AdminProductService.addProduct(formData);
			}
			setFormVisible(false);
			setIsEditing(false);
			fetchProducts();
		} catch (err) {
			console.error('Failed to save product', err);
		}
	};

	const handleDelete = async (id) => {
		try {
			await AdminProductService.deleteProduct(id);
			fetchProducts();
		} catch (err) {
			console.error('Failed to delete product', err);
		}
	};

	const tableCellClass = "border px-4 py-2";
	const inputClass = "w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400";
	const buttonBaseClass = "text-white px-4 py-2 rounded hover:opacity-90 transition";

	return (
		<div className="p-6 bg-gray-50 min-h-screen">

			<div className="relative mb-4">
				<button
					onClick={() => navigate('/Admin')}
					className={`bg-blue-500 ${buttonBaseClass} absolute left-0 hover:bg-blue-800`}
				>
					Back to Admin Page
				</button>
				<h2 className="text-2xl font-bold text-black text-center">Product List</h2>
			</div>

			{/* Add New Product */}
			<div className="flex justify-end mb-4">
				<button
					onClick={handleAddNew}
					className={`bg-blue-500 ${buttonBaseClass} hover:bg-blue-800`}
				>
					Add Product
				</button>
			</div>

			{/* Add / Update Form */}
			{formVisible && (
				<form
					onSubmit={handleSubmit}
					className="p-4 border border-gray-300 rounded-lg mb-6 bg-gray-50 space-y-4"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block mb-1 font-medium">SKU</label>
							<input type="text" name="sku" value={formData.sku} onChange={handleChange} required className={inputClass}/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Name</label>
							<input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Brand</label>
							<input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Description</label>
							<input type="text" name="description" value={formData.description} onChange={handleChange} className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Price</label>
							<input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className={inputClass}
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Stock Quantity</label>
							<input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required className={inputClass}
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block mb-1 font-medium">Image URL</label>
							<input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass}
							/>
						</div>
					</div>

					<div className="flex space-x-2 mt-4">
						<button
							type="submit"
							className={`bg-green-500 ${buttonBaseClass} hover:bg-green-700`}
						>
							{isEditing ? 'Update Product' : 'Add Product'}
						</button>
						<button
							type="button"
							onClick={() => setFormVisible(false)}
							className={`bg-gray-500 ${buttonBaseClass} hover:bg-gray-800`}
						>
							Cancel
						</button>
					</div>
				</form>
			)}

			{/* Products Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-300">
					<thead className="bg-black text-white">
						<tr>
							<th className={tableCellClass}>ID</th>
							<th className={tableCellClass}>SKU</th>
							<th className={tableCellClass}>Name</th>
							<th className={tableCellClass}>Brand</th>
							<th className={tableCellClass}>Description</th>
							<th className={tableCellClass}>Price</th>
							<th className={tableCellClass}>Stock</th>
							<th className={tableCellClass}>Image</th>
							<th className={tableCellClass}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.length > 0 ? (
							products.map((product) => (
								<tr key={product.id} className="hover:bg-gray-50">
									<td className={tableCellClass}>{product.id}</td>
									<td className={tableCellClass}>{product.sku}</td>
									<td className={tableCellClass}>{product.name}</td>
									<td className={tableCellClass}>{product.brand}</td>
									<td className={tableCellClass}>{product.description}</td>
									<td className={tableCellClass}>{product.price.toFixed(2)}</td>
									<td className={tableCellClass}>{product.stockQuantity}</td>
									<td className={tableCellClass}>
										{product.imageUrl ? (
											<img src={product.imageUrl} alt={product.name} className="w-20 h-auto" />
										) : (
											'No Image'
										)}
									</td>
									<td className={`${tableCellClass} flex gap-2`}>
										<button
											onClick={() => handleEdit(product)}
											className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-800 transition"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(product.id)}
											className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-800 transition"
										>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="9" className="text-center py-4">
									No products found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminProduct;
