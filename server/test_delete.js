
async function test() {
  try {
    const loginRes = await fetch('http://localhost:4001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'hanshuai1987' })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginRes.status, loginData.token ? 'Got token' : 'No token');
    
    if (!loginData.token) return;

    const targetId = '57b11e1f-6e8c-4379-a943-d272fea35bda';
    const deleteRes = await fetch(`http://localhost:4001/api/admin/users/${targetId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    const deleteText = await deleteRes.text();
    console.log('Delete:', deleteRes.status, deleteText);

  } catch (e) {
    console.error(e);
  }
}
test();
