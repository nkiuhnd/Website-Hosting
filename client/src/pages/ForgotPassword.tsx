import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface ForgotPasswordForm {
  phone: string;
  recoveryCode: string;
  newPassword: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordForm>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  const lookupUsername = async () => {
    setError('');
    setSuccess('');
    try {
      const phone = getValues('phone');
      if (!phone) {
        setError('请输入手机号');
        return;
      }
      const res = await api.get('/auth/lookup-username', { params: { phone } });
      setUsername(res.data.username);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } } | null | undefined)?.response?.data;
      const rawMessage = (data && typeof data === 'object' && 'message' in data)
        ? (data as { message?: unknown }).message
        : undefined;
      const message = typeof rawMessage === 'string' ? rawMessage : undefined;
      setError(message || '查询失败');
    }
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/forgot', {
        phone: data.phone,
        recoveryCode: data.recoveryCode,
        newPassword: data.newPassword
      });
      setSuccess('密码重置成功，请使用新密码登录');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } } | null | undefined)?.response?.data;
      const rawMessage = (data && typeof data === 'object' && 'message' in data)
        ? (data as { message?: unknown }).message
        : undefined;
      const message = typeof rawMessage === 'string' ? rawMessage : undefined;
      setError(message || '重置失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">找回密码</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
        {!username && (
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">手机号</label>
            <input
              {...register('phone', { required: true })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <span className="text-red-500 text-sm">必填项</span>}
          </div>
          <button
            onClick={lookupUsername}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            查询用户名
          </button>
        </div>
        )}
        {username && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="mb-2 text-sm text-gray-600">
            确认账户名：<span className="font-semibold text-gray-900">{username}</span>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">恢复 PIN</label>
            <input
              {...register('recoveryCode', { required: true })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.recoveryCode && <span className="text-red-500 text-sm">必填项</span>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">新密码</label>
            <input
              type="password"
              {...register('newPassword', { required: true })}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && <span className="text-red-500 text-sm">必填项</span>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            提交
          </button>
        </form>
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">返回登录</Link>
        </p>
      </div>
    </div>
  );
}
