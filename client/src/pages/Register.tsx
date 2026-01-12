import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface RegisterForm {
  username: string;
  password: string;
  phone: string;
  recoveryCode?: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post('/auth/register', data);
      setSuccess(true);
      setTimeout(() => {
          navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } } | null | undefined)?.response?.data;
      const rawMessage = (data && typeof data === 'object' && 'message' in data)
        ? (data as { message?: unknown }).message
        : undefined;
      const message = typeof rawMessage === 'string' ? rawMessage : undefined;
      setError(message || t('register.registration_failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('register.title')}</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center bg-green-50 p-2 rounded">{t('register.success', 'Registration successful! Redirecting...')}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t('common.username')}</label>
            <input
              {...register('username', { required: true })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <span className="text-red-500 text-sm">{t('common.required')}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">手机号</label>
            <input
              {...register('phone', { required: true })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <span className="text-red-500 text-sm">必填项</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">找回用 PIN（建议 6 位数字）</label>
            <input
              {...register('recoveryCode')}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t('common.password')}</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <span className="text-red-500 text-sm">{t('common.required')}</span>}
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
            {t('common.register')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t('register.have_account')} <Link to="/login" className="text-blue-600 hover:underline">{t('common.login')}</Link>
        </p>
      </div>
    </div>
  );
}
