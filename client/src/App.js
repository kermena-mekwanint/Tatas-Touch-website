import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; 
import './App.css';
import './Gallery.css';
import Admin from './Admin'; 
import Login from './Login'; 
import ForgotPassword from './ForgotPassword';

// --- CONFIGURATION ---
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://tatas-touch.onrender.com'; 

// --- FAVORITES MODAL COMPONENT ---
const FavoritesModal = ({ isOpen, onClose, favorites, toggleFavorite }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex',
      justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '20px',
        maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
        position: 'relative', textAlign: 'center'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '15px', right: '15px', border: 'none',
          background: 'none', fontSize: '24px', cursor: 'pointer', color: '#888'
        }}>&times;</button>
        
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#d4a373', marginBottom: '20px' }}>My Saved Styles</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {favorites.map((img) => (
            <div key={img._id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={img.imageUrl} alt="Saved Style" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <button 
                onClick={() => toggleFavorite(img)}
                style={{
                  position: 'absolute', top: '5px', right: '5px', background: 'white',
                  border: 'none', borderRadius: '50%', width: '25px', height: '25px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>Show these to your technician during your appointment! ✨</p>
      </div>
    </div>
  );
};

function HomePage({ 
  formData, handleChange, handleSubmit, loading, branches, salonServices, 
  salonPhones, galleryImages, inspirationImages, handleServiceChange,
  favorites, toggleFavorite, formErrors, comments, newComment, setNewComment, handleCommentSubmit 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="App">
      <FavoritesModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        favorites={favorites} toggleFavorite={toggleFavorite} 
      />

      <header>
        <nav className="navbar">
          <h1 className="logo">
            <img src="/images/logo.jpg" alt="Logo" className="nav-logo" />
            <span className="brand-name">Tata's Touch</span>
          </h1>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a></li>
            <li><a href="#inspo" onClick={() => setMenuOpen(false)}>Inspo Board</a></li>
            <li><a href="#booking" onClick={() => setMenuOpen(false)}>Booking</a></li>
            <li><a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a></li> 
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }}><br/><br/><br/><br/>Beauty, cosmetic & personal care</h2>
          <p>Blending the nurturing care of a mother with the sophistication of a premium salon experience💅🏼🤍</p>
          <a href="#booking" className="btn">Book an Appointment</a>
        </div>
      </section>

      <section className="services" id="services" style={{ padding: '80px 20px', background: '#fff' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>Our Services & Pricing</h2>
        <div className="services-container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="service-category" style={{ background: '#fffafb', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ color: '#d4a373', borderBottom: '2px solid #f1e4e8', paddingBottom: '10px', marginBottom: '20px' }}>Nail Artistry</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Full Set Acrylic</span> <strong>450 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Gel Polish</span> <strong>300 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Custom Nail Design</span> <strong>From 150 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Overlay</span> <strong>350 ETB</strong></li>
            </ul>
          </div>
          <div className="service-category" style={{ background: '#fffafb', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ color: '#d4a373', borderBottom: '2px solid #f1e4e8', paddingBottom: '10px', marginBottom: '20px' }}>Lashes & Brows</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Classic Extensions</span> <strong>800 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Volume Lashes</span> <strong>1200 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Hybrid Set</span> <strong>1000 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Refill</span> <strong>500 ETB</strong></li>
            </ul>
          </div>
          <div className="service-category" style={{ background: '#fffafb', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            <h3 style={{ color: '#d4a373', borderBottom: '2px solid #f1e4e8', paddingBottom: '10px', marginBottom: '20px' }}>Spa Treatments</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Luxury Pedicure</span> <strong>500 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Manicure</span> <strong>350 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span>Paraffin Wax</span> <strong>200 ETB</strong></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Foot Massage (30min)</span> <strong>400 ETB</strong></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <h2 className="section-title">Our Work</h2>
        <div className="gallery-grid">
          {Array.isArray(galleryImages) && galleryImages.map((img) => (
            <div key={img._id} className="image-container">
               <img src={img.imageUrl} alt={img.caption || "Our Work"} />
               <button 
                  className={`heart-button ${favorites.some(f => f._id === img._id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(img)}
                >
                  {favorites.some(f => f._id === img._id) ? '♥' : '♡'}
                </button>
            </div>
          ))}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div key={`static-${num}`} className="image-container">
              <img src={`/images/tataimage${num}.png`} alt="Classic Design" />
              <button 
                className={`heart-button ${favorites.some(f => f._id === `static-${num}`) ? 'active' : ''}`}
                onClick={() => toggleFavorite({ _id: `static-${num}`, imageUrl: `/images/tataimage${num}.png` })}
              >
                {favorites.some(f => f._id === `static-${num}`) ? '♥' : '♡'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="inspo" id="inspo">
        <h2 className="section-title">Inspiration Board</h2>
        <div className="my-masonry-grid">
          {Array.isArray(inspirationImages) && inspirationImages.map((img) => (
            <div key={img._id} className="inspo-card">
              <img src={img.imageUrl} alt={img.caption || "Inspiration"} loading="lazy" onError={(e) => { e.target.src = "/images/logo.jpg"; }} />
              <div className="inspo-overlay">VIEW STYLE</div>
              <button 
                className={`heart-button ${favorites.some(f => f._id === img._id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(img)}
              >
                {favorites.some(f => f._id === img._id) ? '♥' : '♡'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="booking-form">
        <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          {formErrors.phone && <p style={{color: 'red', fontSize: '12px', textAlign: 'left', marginTop: '-10px', marginBottom: '10px'}}>{formErrors.phone}</p>}
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          {formErrors.email && <p style={{color: 'red', fontSize: '12px', textAlign: 'left', marginTop: '-10px', marginBottom: '10px'}}>{formErrors.email}</p>}
          <select name="branch" value={formData.branch} onChange={handleChange} required>
            <option value="">Select Branch</option>
            {branches.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
          <div className="multi-service-selection" style={{ marginBottom: '20px', padding: '15px', background: '#fffcfd', borderRadius: '15px', textAlign: 'left' }}>
            <p style={{ fontFamily: 'Playfair Display, serif', color: '#d4a373', marginBottom: '10px', fontSize: '1.1rem' }}>Select Services (One or more):</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {salonServices.length > 0 ? salonServices.map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" value={s} checked={formData.services.includes(s)} onChange={handleServiceChange} style={{ marginRight: '10px', accentColor: '#d4a373', width: '18px', height: '18px' }} />
                  {s}
                </label>
              )) : <p style={{fontSize: '12px', color: '#999'}}>Loading services...</p>}
            </div>
          </div>
          <input type="date" name="date" min={today} value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Submit Booking"}
          </button>
        </form>
      </section>

      <section id="reviews" style={{ padding: '80px 20px', background: '#fff' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px', fontFamily: 'Playfair Display, serif' }}>Client Reviews</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '50px' }}>
          {comments.length > 0 ? comments.map((c, i) => (
            <div key={i} style={{ background: '#fffafb', padding: '25px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ color: '#d4a373', fontSize: '1.1rem' }}>{c.name}</strong>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{new Date(c.date).toLocaleDateString()}</span>
              </div>
              <p style={{ color: '#555', lineHeight: '1.6', fontStyle: 'italic' }}>"{c.text}"</p>
            </div>
          )) : <p style={{ textAlign: 'center', color: '#999' }}>No reviews yet. Share your experience with us!</p>}
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fffcfd', padding: '40px', borderRadius: '25px', border: '1px solid #f1e4e8' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#d4a373', textAlign: 'center', marginBottom: '25px' }}>Leave a Review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Your Name" value={newComment.name} onChange={(e) => setNewComment({...newComment, name: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
            <textarea placeholder="Tell us about your visit..." value={newComment.text} onChange={(e) => setNewComment({...newComment, text: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '100px', fontFamily: 'inherit' }}></textarea>
            <button onClick={handleCommentSubmit} className="btn">Post Review</button>
          </div>
        </div>
      </section>

      {favorites.length > 0 && (
        <div className="view-favorites-badge" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          ♥ {favorites.length} Saved Styles
        </div>
      )}

      <footer className="contact" id="contact" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ marginBottom: '20px' }}>
            <strong>Phone:</strong> 
            {salonPhones && salonPhones.length > 0 ? salonPhones.map((p, idx) => (
              <span key={idx} style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                {p}{idx !== salonPhones.length - 1 ? ' | ' : ''}
              </span>
            )) : <span style={{ marginLeft: '10px' }}>+251-974-67-67-57</span>}
          </div>
          <div className="social-icons" style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
             <a href="https://www.instagram.com/tatas_touchs/" target="_blank" rel="noreferrer">
                <img src="/images/instagram icon.jpg" alt="Instagram" style={{ width: '35px', height: '35px', borderRadius: '8px' }} />
             </a>
             <a href="https://www.tiktok.com/@tatas.touch1" target="_blank" rel="noreferrer">
                <img src="/images/tiktok icon.png" alt="TikTok" style={{ width: '35px', height: '35px', borderRadius: '8px' }} />
             </a>
          </div>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '20px' }}>© {new Date().getFullYear()} Tata's Touch. All rights reserved | Powered by <strong>Elora Tech Solution</strong></p>
      </footer>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', branch: '', services: [], date: '', time: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [salonServices, setSalonServices] = useState([]); 
  const [salonPhones, setSalonPhones] = useState([]); 
  const [galleryImages, setGalleryImages] = useState([]);
  const [inspirationImages, setInspirationImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('tata_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (image) => {
    const isAlreadyFav = favorites.find(fav => fav._id === image._id);
    let updatedFavs = isAlreadyFav 
      ? favorites.filter(fav => fav._id !== image._id) 
      : [...favorites, image];
    setFavorites(updatedFavs);
    localStorage.setItem('tata_favorites', JSON.stringify(updatedFavs));
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/settings`).then(res => res.json()).then(data => {
        const finalData = data.settings || data; 
        setBranches(finalData.branches || []);
        setSalonServices(finalData.services || []);
        setSalonPhones(finalData.phones || (finalData.phone ? [finalData.phone] : []));
      }).catch(err => console.log("Settings error", err));

    fetch(`${BASE_URL}/api/comments`).then(res => res.json()).then(data => setComments(Array.isArray(data) ? data : []))
      .catch(err => console.log("Comments fetch error", err));

    fetch(`${BASE_URL}/api/gallery`).then(res => res.json()).then(data => setGalleryImages(Array.isArray(data) ? data : []))
      .catch(err => setGalleryImages([]));

    fetch(`${BASE_URL}/api/inspiration`).then(res => res.json()).then(data => setInspirationImages(Array.isArray(data) ? data : []))
      .catch(err => setInspirationImages([]));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData({ ...formData, services: checked ? [...formData.services, value] : formData.services.filter(s => s !== value) });
  };

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+251|0)[79]\d{8}$/;
    if (!emailRegex.test(formData.email)) errors.email = "Please enter a valid email address.";
    if (!phoneRegex.test(formData.phone.replace(/\s/g, '').replace(/-/g, ''))) errors.phone = "Invalid phone number.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (formData.services.length === 0) return alert("Please select at least one service!");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/bookings/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Booking Successful! ✨ We will call you in a minute thank you for choosing us");
        setFormData({ name: '', phone: '', email: '', branch: '', services: [], date: '', time: '' });
        setFormErrors({});
      }
    } catch (err) { alert("Server Error"); } finally { setLoading(false); }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.name || !newComment.text) return alert("Please provide both name and comment.");
    try {
      const response = await fetch(`${BASE_URL}/api/comments/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newComment, date: new Date() }),
      });
      if (response.ok) {
        const savedComment = await response.json();
        setComments([savedComment, ...comments]);
        setNewComment({ name: '', text: '' });
        alert("Thank you for your review! ✨");
      }
    } catch (err) { alert("Error posting review."); }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage 
            formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} 
            loading={loading} branches={branches} salonServices={salonServices} 
            salonPhones={salonPhones} galleryImages={galleryImages} 
            inspirationImages={inspirationImages} handleServiceChange={handleServiceChange}
            favorites={favorites} toggleFavorite={toggleFavorite}
            formErrors={formErrors} comments={comments} newComment={newComment}
            setNewComment={setNewComment} handleCommentSubmit={handleCommentSubmit}
          />
        } />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
      </Routes>
    </Router>
  );
}

export default App;