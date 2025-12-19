import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Service/AuthService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword) {
      setError('Please complete all fields.');
      return;
    }
    if (form.newPassword === form.currentPassword) {
      setError('New password must be different from current password.');
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    const user = AuthService.getCurrentUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const response = await AuthService.changePassword({
        customerId: user.id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });

      if (response.success) {
        setSuccess('Password updated successfully.');
        setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setError(response.message || 'Unable to update password.');
      }
    } catch (err) {
      console.error('Failed to change password', err);
      const message = err.response?.data?.message || 'Failed to change password.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const cardClass = 'max-w-lg w-full bg-white p-8 rounded-3xl border border-brand-muted shadow-sm';
  const inputClass = 'w-full px-4 py-2 border border-brand-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent';
  const labelClass = 'text-brand-secondary font-medium';

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface px-4 text-brand-primary">
      <div className={cardClass}>
        <h1 className="text-3xl font-display font-semibold text-center mb-6">Change Password</h1>

        {error && <p className="mb-4 text-sm text-red-600 text-center">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-600 text-center">{success}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-brand-primary text-white py-3 rounded-full font-semibold hover:bg-brand-secondary transition disabled:opacity-70"
          >
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="mt-4 text-sm text-brand-accent hover:underline"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
