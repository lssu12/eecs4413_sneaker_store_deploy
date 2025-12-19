import React, { useState, useEffect } from 'react';
import AdminProductService from '../Service/AdminProductService';
import { useNavigate } from 'react-router-dom';
import { resolveSneakerImage } from '../Util/util';

const AdminProduct = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [formVisible, setFormVisible] = useState(false);
	const [historyProduct, setHistoryProduct] = useState(null);
	const [historyData, setHistoryData] = useState(null);
	const [historyLoading, setHistoryLoading] = useState(false);
	const [historyError, setHistoryError] = useState('');
	const emptyProduct = {
		id: null,
		sku: '',
		name: '',
		brand: '',
		description: '',
		price: '',
		stockQuantity: '',
		imageUrl: '',
	};

	const [formData, setFormData] = useState(emptyProduct);

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
		setFormData(emptyProduct);
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

	const handleViewHistory = async (product) => {
		setHistoryProduct(product);
		setHistoryData(null);
		setHistoryError('');
		setHistoryLoading(true);
		try {
			const data = await AdminProductService.getInventoryHistory(product.id);
			setHistoryData(data);
		} catch (err) {
			console.error('Failed to load inventory history', err);
			setHistoryError('Failed to load inventory history');
		} finally {
			setHistoryLoading(false);
		}
	};

	const formatDate = (value) => {
		if (!value) return 'N/A';
		const date = new Date(value);
		return date.toLocaleString();
	};

	const renderEvents = (title, events, emptyMessage) => (
		<div className="bg-white border border-brand-muted rounded-3xl p-5 shadow-sm">
			<h4 className="text-lg font-semibold mb-3">{title}</h4>
			{!events || events.length === 0 ? (
				<p className="text-sm text-brand-secondary">{emptyMessage}</p>
			) : (
				<ul className="space-y-3">
					{events.map((event, index) => (
						<li key={`${title}-${index}`} className="border border-brand-muted/70 rounded-2xl p-3 text-sm">
							<p className="font-semibold">{formatDate(event.eventTime)}</p>
							{event.previousPrice != null && event.newPrice != null && (
								<p>
									Price: ${Number(event.previousPrice ?? 0).toFixed(2)} → ${Number(event.newPrice ?? 0).toFixed(2)}
								</p>
							)}
							{event.previousStock != null && event.newStock != null && (
								<p>
									Stock: {event.previousStock} → {event.newStock}
								</p>
							)}
							{event.quantityDelta != null && (
								<p>Quantity Change: {event.quantityDelta}</p>
							)}
							{event.orderId && <p>Order ID: {event.orderId}</p>}
							{event.note && <p className="text-brand-secondary">{event.note}</p>}
						</li>
					))}
				</ul>
			)}
		</div>
	);

	const tableCellClass = "border border-brand-muted/70 px-4 py-2 text-sm";
	const inputClass = "w-full border border-brand-muted px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent";
	const buttonBaseClass = "text-white px-4 py-2 rounded-full hover:opacity-90 transition";
	const labelClass = "block mb-1 font-medium text-brand-secondary";

	return (
		<div className="p-6 bg-brand-surface min-h-screen text-brand-primary">

			<div className="relative mb-4">
				<button
					onClick={() => navigate('/Admin')}
					className={`bg-brand-primary ${buttonBaseClass} absolute left-0 hover:bg-brand-secondary`}
				>
					Back to Admin Page
				</button>
					<h2 className="text-2xl font-display font-semibold text-center">Product List</h2>
			</div>

			{/* Add New Product */}
				<div className="flex justify-end mb-4">
					<button
						onClick={handleAddNew}
						className={`bg-brand-accent ${buttonBaseClass} hover:bg-brand-accent-dark`}
					>
					Add Product
				</button>
			</div>

			{/* Add / Update Form */}
				{formVisible && (
					<form
						onSubmit={handleSubmit}
						className="p-6 border border-brand-muted rounded-3xl mb-6 bg-white shadow-sm space-y-4"
					>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={labelClass}>SKU</label>
							<input type="text" name="sku" value={formData.sku} onChange={handleChange} required className={inputClass}/>
						</div>
							<div>
								<label className={labelClass}>Name</label>
							<input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass}
							/>
						</div>
							<div>
								<label className={labelClass}>Brand</label>
							<input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClass}
							/>
						</div>
							<div>
								<label className={labelClass}>Description</label>
							<input type="text" name="description" value={formData.description} onChange={handleChange} className={inputClass}
							/>
						</div>
							<div>
								<label className={labelClass}>Price</label>
							<input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className={inputClass}
							/>
						</div>
							<div>
								<label className={labelClass}>Stock Quantity</label>
							<input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required className={inputClass}
							/>
						</div>
							<div className="md:col-span-2">
								<label className={labelClass}>Image URL</label>
							<input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass}
							/>
						</div>
						</div>

						<div className="flex space-x-3 mt-4">
							<button
								type="submit"
								className={`bg-brand-primary ${buttonBaseClass} hover:bg-brand-secondary`}
							>
							{isEditing ? 'Update Product' : 'Add Product'}
						</button>
							<button
								type="button"
								onClick={() => setFormVisible(false)}
								className={`bg-brand-muted text-brand-primary px-4 py-2 rounded-full hover:bg-brand-accent/70 transition`}
							>
							Cancel
						</button>
					</div>
				</form>
			)}

			{/* Products Table */}
			<div className="overflow-x-auto">
					<table className="min-w-full border border-brand-muted bg-white shadow-sm">
						<thead className="bg-brand-primary text-white">
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
									<tr key={product.id} className="hover:bg-brand-surface">
									<td className={tableCellClass}>{product.id}</td>
									<td className={tableCellClass}>{product.sku}</td>
									<td className={tableCellClass}>{product.name}</td>
									<td className={tableCellClass}>{product.brand}</td>
									<td className={tableCellClass}>{product.description}</td>
									<td className={tableCellClass}>{product.price.toFixed(2)}</td>
									<td className={tableCellClass}>{product.stockQuantity}</td>
									<td className={tableCellClass}>
										<img
											src={resolveSneakerImage(product.imageUrl, product.name)}
											alt={product.name}
											className="w-20 h-auto object-cover rounded"
										/>
									</td>
										<td className={`${tableCellClass} flex flex-wrap gap-2`}>
											<button
											onClick={() => handleEdit(product)}
												className="bg-brand-accent text-white px-3 py-1 rounded-full hover:bg-brand-accent-dark transition"
										>
											Edit
										</button>
											<button
											onClick={() => handleDelete(product.id)}
												className="bg-brand-secondary text-white px-3 py-1 rounded-full hover:bg-brand-primary transition"
										>
												Delete
										</button>
											<button
											onClick={() => handleViewHistory(product)}
												className="bg-brand-primary text-white px-3 py-1 rounded-full hover:bg-brand-secondary transition"
										>
											History
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
		{historyProduct && (
			<div className="mt-8 bg-brand-surface border border-brand-muted rounded-3xl p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h3 className="text-xl font-display font-semibold">Inventory History</h3>
						<p className="text-sm text-brand-secondary">{historyProduct.name} (SKU: {historyProduct.sku})</p>
					</div>
					<button
						onClick={() => {
							setHistoryProduct(null);
							setHistoryData(null);
							setHistoryError('');
						}}
						className="text-sm text-brand-accent hover:underline"
					>
						Close
					</button>
				</div>

				{historyLoading && <p className="text-brand-secondary">Loading history...</p>}
				{historyError && <p className="text-red-600">{historyError}</p>}
				{!historyLoading && !historyError && historyData && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{renderEvents('Price Changes', historyData.priceChanges, 'No price changes recorded')}
						{renderEvents('Transactions', historyData.transactions, 'No sales or adjustments yet')}
						{renderEvents('Restocks', historyData.restocks, 'No restocks recorded')}
					</div>
				)}
			</div>
		)}
	</div>
	);
};

export default AdminProduct;
