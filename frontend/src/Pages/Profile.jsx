import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';

const Profile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tailwind reusable classes
  const inputClass = 'border border-brand-muted focus:border-brand-accent focus:ring-brand-accent focus:ring-1 p-2 w-full rounded-md bg-white';
  const labelClass = 'block mb-1 font-medium text-brand-secondary';
  const buttonClass = 'bg-brand-primary text-white px-4 py-2 rounded-full hover:bg-brand-secondary transition';

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await AuthService.getProfile(user.id);
        setForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          currentPassword: '',
          addressLine1: profile.addressLine1 || '',
          addressLine2: profile.addressLine2 || '',
          city: profile.city || '',
          province: profile.province || '',
          postalCode: profile.postalCode || '',
          country: profile.country || ''
        });
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Unable to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = AuthService.getCurrentUser();
      const response = await AuthService.updateProfile({ customerId: user.id, ...form });
      if (response.success) {
        alert('Profile updated successfully');
        setForm((prev) => ({ ...prev, currentPassword: '' }));
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-brand-primary">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-brand-primary">
      <div className="bg-white border border-brand-muted rounded-3xl shadow-sm p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-display font-semibold">My Profile</h1>
          <button
            type="button"
            onClick={() => navigate('/change-password')}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-full hover:bg-brand-accent-dark transition"
          >
            Change Password
          </button>
        </div>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
          </div>

        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Address Line 1</label>
          <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Address Line 2</label>
          <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input name="city" value={form.city} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Province</label>
          <input name="province" value={form.province} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Postal Code</label>
        <input name="postalCode" value={form.postalCode} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <input name="country" value={form.country} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Current Password</label>
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className={inputClass} required />
        </div>
        
        <button type="submit" className={buttonClass}>Save Changes</button>
      </form>
      </div>
    </div>
  );
};

export default Profile;
