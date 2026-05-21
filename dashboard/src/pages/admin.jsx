import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { LayoutDashboard, Utensils, Info, PhoneCall, LogOut, Edit3, Trash2 } from 'lucide-react';
import MenuSection from './Menu';
import Contact from './Contact';
import About from './about';
import "./admin.css"; 

const Sidebar = ({ activeSection, onLogout }) => {
  const menuItems = [
    { id: 'inventory', label: 'Kitchen Inventory', icon: LayoutDashboard, path: '/admin/inventory' },
    { id: 'menu', label: 'Menu', icon: Utensils, path: '/admin/menu' },
    { id: 'about', label: 'About', icon: Info, path: '/admin/about' },
    { id: 'contact', label: 'Contact', icon: PhoneCall, path: '/admin/contact' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-inner">
        <div className="brand-row">
          <span className="brand-title">CantoBox</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                window.location.href = item.path;
              }}
              className={`sidebar-button ${activeSection === item.id ? 'active' : ''}`}
            >
              <item.icon className="icon-small" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="sidebar-logout">
          <LogOut className="icon-small" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

// --- MAIN ADMIN DASHBOARD ---
function AdminDashboard() {
  // --- STATE ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [available, setAvailable] = useState(true);
  const location = useLocation();

  const CATEGORIES = ["Appetizer", "Dessert", "Beverage"];


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const fetchMenu = () => {
    axios.get("http://localhost:1337/api/menu")
      .then((res) => setMenuItems(res.data))
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Failed to load menu items");
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // --- VALIDATION ---
  const validate = () => {
    let temp = {};
    if (!name.trim()) temp.name = "Dish name is required";
    if (!price || price <= 0) temp.price = "Enter a valid price";
    if (!category) temp.category = "Select a category";
    
    // Check for duplicate dish name when adding new dish
    if (!editingId) {
      const duplicateDish = menuItems.find(item => 
        item.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      if (duplicateDish) {
        temp.name = "A dish with this name already exists";
      }
    }
    
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // --- SAVE / UPDATE ---
  const handleSave = async () => {
    if (!validate()) return;

    let imagePath = '';
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      try {
        const uploadRes = await axios.post('http://localhost:1337/api/upload', formData);
        imagePath = uploadRes.data.imagePath;
      } catch (err) { 
        console.error("Upload error:", err);
        alert("Upload failed: " + (err.response?.data?.message || err.message)); 
        return; 
      }
    }

    const payload = { 
      name, 
      description, 
      price: parseFloat(price), 
      category, 
      available
    };

    if (imagePath) {
      payload.imageUrl = imagePath;
    } else if (editingId && currentImageUrl) {
      payload.imageUrl = currentImageUrl;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:1337/api/menu/${editingId}`, payload);
        alert("Dish updated!");
      } else {
        await axios.post('http://localhost:1337/api/menu', payload);
        alert("Dish added!");
      }
      clearFields();
      fetchMenu();
    } catch (err) { 
      console.error("Save error:", err);
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    }
  };

  // --- DELETE LOGIC ---
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:1337/api/menu/${itemToDelete._id}`);
      setDeleteDialogOpen(false);
      fetchMenu();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setAvailable(item.available !== false);
    setCurrentImageUrl(item.imageUrl || '');
    setShowModal(true);
  };

  const clearFields = () => {
    setName(''); setDescription(''); setPrice('');
    setCategory(''); setEditingId(null); setImage(null);
    setCurrentImageUrl('');
    setErrors({}); setShowModal(false); setAvailable(true);
  };

  // Updated layout mapping strings to sync headers
  const sectionLabels = {
    inventory: { tag: 'Menu Management', title: 'Kitchen Inventory' },
    menu: { tag: 'Menu.jsx', title: 'Seasonal Offerings' },
    about: { tag: 'About.jsx', title: 'Our Story' },
    contact: { tag: 'Contact.jsx', title: 'Get in Touch' }
  };

  const activeSection = location.pathname.split('/')[2] || 'inventory';
  const activeSectionInfo = sectionLabels[activeSection] || sectionLabels.inventory;

  return (
    <div className="admin-root admin-fullpage">
      <Sidebar activeSection={activeSection} onLogout={handleLogout} />

      <main className="admin-main">
        {/* Header only shown on inventory */}
        {activeSection === 'inventory' && (
          <header className="admin-header">
            <div className="header-tag">{activeSectionInfo.tag}</div>
            <h1 className="page-title">{activeSectionInfo.title}</h1>
            <button className="hero-button" onClick={() => setShowModal(true)}>
              <span>+</span>
              Add New Dish
            </button>
          </header>
        )}

        {activeSection === 'inventory' && (
          <>
            <div className="search-panel">
              <div className="search-wrapper">
                <span className="search-icon"></span>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search menu items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="menu-grid">
              {menuItems
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <div key={item._id} className="menu-card">
                    <div className="menu-card-image">
                      {item.imageUrl ? (
                        <img src={`http://localhost:1337/uploads/${item.imageUrl}`} alt={item.name} />
                      ) : (
                        <span>🍽️</span>
                      )}
                    </div>
                    <div className="menu-card-meta">
                      <div className="menu-card-top">
                        <span className="menu-card-category">{item.category}</span>
                        <span className={`availability-dot ${item.available ? '' : 'unavailable'}`}></span>
                      </div>
                      <h3 className="menu-card-title">{item.name}</h3>
                      <p className="menu-card-desc">{item.description}</p>
                    </div>
                    <div className="menu-card-amount">
                      <div className="menu-card-price">₱{item.price}</div>
                      <div className="action-buttons">
                        <button className="icon-button edit-button" onClick={() => handleEdit(item)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="icon-button delete-button" onClick={() => { setItemToDelete(item); setDeleteDialogOpen(true); }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {activeSection === 'menu' && <MenuSection />}
        {activeSection === 'about' && <About />}
        {activeSection === 'contact' && <Contact />}

        {/* Add/Edit Modal */}
        {activeSection === 'inventory' && showModal && (
          <div className="modal-overlay active">
            <div className="modal-dialog">
              <div className="modal-inner">
                <div className="modal-header">
                  <h2 className="modal-title">{editingId ? 'Edit Dish' : 'Add New Dish'}</h2>
                  <button className="modal-close-button" onClick={clearFields}>×</button>
                </div>
                
                <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Dish Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select 
                          className="form-select" 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {errors.category && <span className="error-text">{errors.category}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Price (PHP)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={price} 
                          onChange={(e) => setPrice(e.target.value)} 
                          min="0"
                          step="0.01"
                          required
                        />
                        {errors.price && <span className="error-text">{errors.price}</span>}
                      </div>
                    </div>
                    
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-textarea" 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)}
                          rows="4"
                        ></textarea>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Image</label>
                        <input 
                          type="file" 
                          className="form-input" 
                          onChange={(e) => setImage(e.target.files[0])} 
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-footer">
                    <button type="submit" className="save-button">
                      <span>💾</span>
                      {editingId ? 'Update Dish' : 'Add Dish'}
                    </button>
                    <div className="toggle-group">
                      <span className="toggle-label">Available</span>
                      <div className={`toggle-switch ${available ? 'active' : ''}`} onClick={() => setAvailable(!available)}>
                        <div className="toggle-thumb"></div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove "{itemToDelete?.name}" from the menu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;  