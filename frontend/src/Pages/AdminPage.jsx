import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

	return (
		<div className="min-h-screen flex flex-col items-center justify-start bg-brand-surface p-8 space-y-6 text-brand-primary">
			<h2 className="text-3xl font-display font-semibold">Admin Page</h2>

      <div className="flex flex-col space-y-4">
			<button
				onClick={() => navigate('/AdminCustomers')}
				className="w-64 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-secondary transition"
			>
          List of Customers
        </button>

			<button
				onClick={() => navigate('/AdminOrders')}
				className="w-64 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-secondary transition"
			>
          List of Orders
        </button>

			<button
				onClick={() => navigate('/AdminProducts')}
				className="w-64 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-secondary transition"
			>
          List of Products
        </button>

        
      </div>
    </div>
  );
};

export default AdminPage;
