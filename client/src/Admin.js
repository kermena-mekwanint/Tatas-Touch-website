import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [inspirationImages, setInspirationImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadTarget, setUploadTarget] = useState("gallery");
  const [uploading, setUploading] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(() => Number(localStorage.getItem("tataGoal")) || 50000);

  // SETTINGS STATE
  const [settings, setSettings] = useState({ phones: [], branches: [], services: [] });
  const [newPhone, setNewPhone] = useState("");
  const [newBranch, setNewBranch] = useState("");
  const [newService, setNewService] = useState("");

  // SECURITY STATE
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:5000/api/bookings/all').then(res => res.json()).then(data => setBookings(data));
      fetch('http://localhost:5000/api/gallery').then(res => res.json()).then(data => setGalleryImages(data));
      fetch('http://localhost:5000/api/inspiration').then(res => res.json()).then(data => setInspirationImages(data)).catch(() => []);
      fetch('http://localhost:5000/api/settings').then(res => res.json()).then(data => {
        const phones = Array.isArray(data.phones) ? data.phones : (data.phone ? [data.phone] : []);
        setSettings({ ...data, phones });
      }).catch(() => {});
    }
  }, [isLoggedIn]);

  const updateBooking = async (id, updates) => {
    try {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, ...updates } : b));
      await fetch(`http://localhost:5000/api/bookings/${id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) { console.error("Update failed"); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const saveSettings = async (updatedSettings) => {
    try {
      await fetch('http://localhost:5000/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      setSettings(updatedSettings);
    } catch (err) { alert("Settings update failed"); }
  };

  const handleUpdateSecurity = async () => {
    if (!security.currentPassword || !security.newPassword) {
      return alert("Please enter both current and new passwords.");
    }
    try {
      const res = await fetch('http://localhost:5000/api/admin/update-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(security)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully! ✨");
        setSecurity({ ...security, currentPassword: '', newPassword: '' });
      } else {
        alert(data.message || "Update failed. Check your current password.");
      }
    } catch (err) { alert("Server error updating security"); }
  };

  const addPhone = () => {
    if (!newPhone) return;
    const updated = { ...settings, phones: [...(settings.phones || []), newPhone] };
    saveSettings(updated);
    setNewPhone("");
  };

  const removePhone = (phoneNum) => {
    const updated = { ...settings, phones: settings.phones.filter(p => p !== phoneNum) };
    saveSettings(updated);
  };

  const addBranch = () => {
    if (!newBranch) return;
    const updated = { ...settings, branches: [...(settings.branches || []), newBranch] };
    saveSettings(updated);
    setNewBranch("");
  };

  const removeBranch = (branchName) => {
    const updated = { ...settings, branches: settings.branches.filter(b => b !== branchName) };
    saveSettings(updated);
  };

  const addService = () => {
    if (!newService) return;
    const updated = { ...settings, services: [...(settings.services || []), newService] };
    saveSettings(updated);
    setNewService("");
  };

  const removeService = (serviceName) => {
    const updated = { ...settings, services: (settings.services || []).filter(s => s !== serviceName) };
    saveSettings(updated);
  };

  const downloadCSV = () => {
    const headers = "Name,Phone,Services,Price,Status,Date,Time\n";
    const rows = bookings.map(b =>
      `${b.name},${b.phone},"${Array.isArray(b.services) ? b.services.join(' & ') : b.service}",${b.price || 0},${b.status},${b.date},${b.time}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tatas_Touch_Report_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return alert("Select at least one file!");
    setUploading(true);
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return fetch(`http://localhost:5000/api/${uploadTarget}/upload`, { method: 'POST', body: formData });
    });
    try {
      await Promise.all(uploadPromises);
      const updatedRes = await fetch(`http://localhost:5000/api/${uploadTarget}`);
      const updatedData = await updatedRes.json();
      if (uploadTarget === "gallery") setGalleryImages(updatedData);
      else setInspirationImages(updatedData);
      setSelectedFiles([]);
      alert(`Successfully published ${selectedFiles.length} photos! ✨`);
    } catch (e) { alert("Error during bulk upload"); } finally { setUploading(false); }
  };

  const handleDeleteMedia = async (id, target) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/${target}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (target === "gallery") setGalleryImages(prev => prev.filter(img => img._id !== id));
        else setInspirationImages(prev => prev.filter(img => img._id !== id));
      }
    } catch (err) { alert("Delete failed"); }
  };

  const stats = (() => {
    const completedBookings = bookings.filter(b => b.status === 'Completed');
    const earnings = completedBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    return {
      earnings,
      completedCount: completedBookings.length,
      percent: Math.min(((earnings / monthlyGoal) * 100), 100).toFixed(1)
    };
  })();

  const pieData = Object.entries(bookings.reduce((acc, b) => {
    const servicesToCount = Array.isArray(b.services) ? b.services : [b.service];
    servicesToCount.forEach(s => { if (s) acc[s] = (acc[s] || 0) + 1; });
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const COLORS = ['#e91e63', '#2196f3', '#9c27b0', '#4caf50', '#ff9800', '#00bcd4'];

  if (!isLoggedIn) return <div style={{padding: '50px', textAlign: 'center'}}>Redirecting to Login...</div>;

  return (
    <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh', fontFamily: '"Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#e91e63', fontSize: '32px', fontWeight: '800' }}>Tata's Touch Admin</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={downloadCSV} style={{ background: '#4caf50', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Download CSV</button>
            <button onClick={() => { localStorage.removeItem("adminToken"); window.location.reload(); }} style={{ background: '#333', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
            <div style={{ background: '#e91e63', color: 'white', padding: '40px', borderRadius: '24px', position: 'relative' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' }}>Monthly Revenue</p>
                <h2 style={{ fontSize: '48px', fontWeight: '900', margin: 0 }}>{stats.earnings.toLocaleString()} ETB</h2>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #eee' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', color: '#e91e63' }}>Monthly Clients</p>
                <h2 style={{ fontSize: '48px', fontWeight: '900', margin: 0, color: '#333' }}>{stats.completedCount}</h2>
                <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>Completed Appointments</p>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#e91e63' }}>Goal Progress</p>
                    <input type="number" value={monthlyGoal} onChange={(e) => { setMonthlyGoal(Number(e.target.value)); localStorage.setItem("tataGoal", e.target.value); }} style={{ border: '1px solid #eee', borderRadius: '5px', width: '80px', textAlign: 'center' }} />
                </div>
                <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden', margin: '20px 0' }}>
                    <div style={{ width: `${stats.percent}%`, background: '#e91e63', height: '100%' }}></div>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>{stats.percent}% Reached</h3>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
            <div style={{ padding: '25px', background: 'white', borderRadius: '24px', border: '1px solid #eee' }}>
                <h3 style={{ color: '#e91e63', fontSize: '14px', marginBottom: '15px' }}>SALON SETTINGS</h3>
                
                <label style={{ fontSize: '12px', color: '#888' }}>Manage Public Phones</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="09..." style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <button onClick={addPhone} style={{ background: '#e91e63', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer' }}>Add</button>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                    {settings.phones?.map(p => (
                        <span key={p} style={{ background: '#e1f5fe', color: '#0288d1', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', display: 'flex', alignItems: 'center', border: '1px solid #b3e5fc' }}>
                            {p} <button onClick={() => removePhone(p)} style={{ border: 'none', background: 'none', color: '#0288d1', marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    ))}
                </div>

                <label style={{ fontSize: '12px', color: '#888' }}>Manage Branches</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <input type="text" value={newBranch} onChange={(e) => setNewBranch(e.target.value)} placeholder="Branch..." style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <button onClick={addBranch} style={{ background: '#333', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px' }}>Add</button>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                    {settings.branches?.map(b => (
                        <span key={b} style={{ background: '#fce4ec', color: '#e91e63', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                            {b} <button onClick={() => removeBranch(b)} style={{ border: 'none', background: 'none', color: '#e91e63', marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    ))}
                </div>

                <label style={{ fontSize: '12px', color: '#888' }}>Manage Services (Full List)</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <input 
                      type="text" 
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={newService} 
                      onChange={(e) => setNewService(e.target.value)} 
                      placeholder="Service...." 
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} 
                    />
                    <button onClick={addService} style={{ background: '#333', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px' }}>Add</button>
                </div>
                <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '12px', background: '#fafafa', maxHeight: '120px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {settings.services?.length > 0 ? settings.services.filter(s => s !== 'admin' && s !== "Tata's Touch").map(s => (
                        <span key={s} style={{ background: '#e3f2fd', color: '#2196f3', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', border: '1px solid #bbdefb' }}>
                            {s} <button onClick={() => removeService(s)} style={{ border: 'none', background: 'none', color: '#2196f3', marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    )) : <p style={{fontSize: '11px', color: '#aaa'}}>No services added yet.</p>}
                </div>
            </div>

            <div style={{ padding: '25px', background: 'white', borderRadius: '24px', border: '1px solid #eee' }}>
                <h3 style={{ color: '#e91e63', fontSize: '14px', marginBottom: '15px' }}>SECURITY & ACCESS</h3>
                <label style={{ fontSize: '12px', color: '#888' }}>Admin Username</label>
                <input type="text" value="admin" disabled style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '10px', background: '#f9f9f9', color: '#555' }} />
                <label style={{ fontSize: '12px', color: '#888' }}>Current Password</label>
                <input type="password" value={security.currentPassword} onChange={(e) => setSecurity({...security, currentPassword: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }} />
                <label style={{ fontSize: '12px', color: '#888' }}>New Password</label>
                <input type="password" value={security.newPassword} onChange={(e) => setSecurity({...security, newPassword: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label style={{ fontSize: '11px', color: '#888' }}>Security Question</label>
                        <input type="text" value={security.securityQuestion} onChange={(e) => setSecurity({...security, securityQuestion: e.target.value})} placeholder="Pet's name?" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '11px', color: '#888' }}>Answer</label>
                        <input type="text" value={security.securityAnswer} onChange={(e) => setSecurity({...security, securityAnswer: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                </div>
                <button onClick={handleUpdateSecurity} style={{ width: '100%', background: '#333', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', marginTop: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Update Security</button>
            </div>
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', marginBottom: '40px', border: '1px solid #eee', height: '400px' }}>
          <h3 style={{ color: '#e91e63', marginBottom: '20px' }}>Service Popularity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '50px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #eee' }}>
            <h3 style={{ color: '#e91e63' }}>Bulk Upload</h3>
            <select value={uploadTarget} onChange={e => setUploadTarget(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px' }}>
              <option value="gallery">Our Work (Gallery)</option>
              <option value="inspiration">Inspo Board</option>
            </select>
            <input type="file" multiple onChange={e => setSelectedFiles(e.target.files)} style={{ marginBottom: '15px', display: 'block' }} />
            <button onClick={handleUpload} disabled={uploading} style={{ width: '100%', background: '#e91e63', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
              {uploading ? "Uploading..." : `Publish ${selectedFiles.length} Photos`}
            </button>
          </div>
          <div style={{ background: '#fdf2f5', padding: '25px', borderRadius: '24px' }}>
            <h3>Gallery Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
              {galleryImages.map(img => (
                <div key={img._id} style={{ position: 'relative', height: '60px' }}>
                  <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
                  <button onClick={() => handleDeleteMedia(img._id, 'gallery')} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#f0f4ff', padding: '25px', borderRadius: '24px' }}>
            <h3>Inspo Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxHeight: '150px', overflowY: 'auto' }}>
              {inspirationImages.map(img => (
                <div key={img._id} style={{ position: 'relative', height: '60px' }}>
                  <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
                  <button onClick={() => handleDeleteMedia(img._id, 'inspiration')} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '20px', fontWeight: '800' }}>Recent Appointments</h2>
        <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fff0f5', textAlign: 'left' }}>
                <th style={{ padding: '20px' }}>Customer</th>
                <th style={{ padding: '20px' }}>Services</th>
                <th style={{ padding: '20px' }}>Price (ETB)</th>
                <th style={{ padding: '20px' }}>Status</th>
                <th style={{ padding: '20px' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => {
                const isVIP = bookings.filter(x => x.phone === b.phone).length >= 3;
                return (
                  <tr key={b._id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {b.name}
                        {isVIP && (
                          <span style={{ background: '#fff9c4', color: '#fbc02d', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', border: '1px solid #fbc02d', fontWeight: '900' }}>★ VIP</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{b.phone}</div>
                    </td>
                    <td style={{ padding: '20px' }}>{Array.isArray(b.services) ? b.services.join(', ') : b.service}</td>
                    <td style={{ padding: '20px' }}>
                      <input type="number" value={b.price || 0} onChange={(e) => updateBooking(b._id, { price: Number(e.target.value) })} style={{ width: '80px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    </td>
                    <td style={{ padding: '20px' }}>
                      <select value={b.status} onChange={(e) => updateBooking(b._id, { status: e.target.value })} style={{ padding: '8px', borderRadius: '10px', fontWeight: 'bold', border: 'none', background: b.status === 'Completed' ? '#e8f5e9' : b.status === 'Cancelled' ? '#ffebee' : '#fff3e0', color: b.status === 'Completed' ? '#2e7d32' : b.status === 'Cancelled' ? '#c62828' : '#ef6c00' }}>
                        <option value="Pending">🕒 Pending</option>
                        <option value="Completed">✅ Completed</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <button onClick={() => deleteBooking(b._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center', paddingBottom: '40px' }}>
          <Link to="/" style={{ color: '#e91e63', textDecoration: 'none', fontWeight: '900', borderBottom: '2px solid #e91e63', fontSize: '18px' }}>← Back to Tata's Touch Website</Link>
        </div>
      </div>
    </div>
  );
}

export default Admin;