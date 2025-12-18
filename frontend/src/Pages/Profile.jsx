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

  // Tailwind reusable classes
  const inputClass = 'border p-2 w-full rounded';
  const labelClass = 'block mb-1 font-medium';
  const buttonClass = 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition';

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }

    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      currentPassword: '',
      addressLine1: user.addressLine1 || '',
      addressLine2: user.addressLine2 || '',
      city: user.city || '',
      province: user.province || '',
      postalCode: user.postalCode || '',
      country: user.country || ''
    });
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

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
  );
};

export default Profile;
