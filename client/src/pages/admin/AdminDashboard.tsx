import { useEffect, useState } from 'react';
import api from '../../api';
import { useTranslation } from 'react-i18next';

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalVisits: number;
  totalStorage: number;
  activeUsersToday: number;
  currentActiveUsers?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div>{t('common.loading')}</div>;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('admin.system_overview')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">{t('admin.total_users')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">{t('admin.total_projects')}</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">{t('admin.total_visits')}</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">{t('admin.storage_used')}</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{formatBytes(stats.totalStorage)}</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
         <h3 className="text-lg font-bold mb-2">{t('admin.activity')}</h3>
         <p className="text-gray-600">{t('admin.active_users_today')}: <span className="font-bold text-gray-900">{stats.activeUsersToday}</span></p>
         {typeof stats.currentActiveUsers === 'number' && (
           <p className="text-gray-600 mt-2">{t('admin.online')}: <span className="font-bold text-gray-900">{stats.currentActiveUsers}</span></p>
         )}
      </div>
    </div>
  );
}
