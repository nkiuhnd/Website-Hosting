
import axios from 'axios';

async function testDelete() {
  try {
    // 1. Login
    console.log('Logging in as admin...');
    const loginRes = await axios.post('http://localhost:4000/api/auth/login', {
      username: 'admin',
      password: 'hanshuai1987'
    });
    
    const token = loginRes.data.token;
    console.log('Got token:', token ? 'Yes' : 'No');

    // 2. Delete user
    const targetId = '57b11e1f-6e8c-4379-a943-d272fea35bda';
    console.log(`Attempting to delete user ${targetId}...`);
    
    try {
      const deleteRes = await axios.delete(`http://localhost:4000/api/admin/users/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Delete result:', deleteRes.status, deleteRes.data);
    } catch (err: any) {
      console.log('Delete failed:', err.response?.status, err.response?.data);
    }

  } catch (error: any) {
    console.error('Login failed or other error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testDelete();
