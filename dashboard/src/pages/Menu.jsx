import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { ChefHat, RefreshCw, X } from 'lucide-react'; // Added X icon for modal close
import { MENU_CATEGORIES } from '../constants';
import { formatPrice } from '../lib/utils';
import './menu.css';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to track which menu item is currently open in the modal
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:1337/api/menu');
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(); 
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="menu-section">
      <div className="content-wrapper">
        
        {/* Heading */}
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label">The Collection</span>
          <h2 className="section-title">Seasonal Offerings</h2>
          <p className="section-copy">
            Sourced directly from the lush valleys of Nueva Vizcaya. 
            Fresh, organic, and traditionally prepared.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          {['All', ...MENU_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
        
            >
              {cat === 'All' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="menu-loading" style={{ textAlign: 'center' }}>
            <RefreshCw className="animate-spin" />
            <p>Curating the day's harvest...</p>
          </div>
        ) : (
          <div className="menu-item-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredItems.map((item) => (
              /* UPDATED: Added onClick handler to item card to set state */
              <div 
                key={item._id || item.id} 
                className="menu-item-card" 
                onClick={() => setSelectedItem(item)}
                style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}
              >
                <div className="menu-item-image">
                  <img 
                    src={item.imageUrl ? `http://localhost:1337/uploads/${item.imageUrl}` : 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={item.name}
                    className="menu-item-image-img"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </div>

                <div className="menu-item-body" style={{ padding: '15px' }}>
                  <h3 className="menu-item-title">{item.name}</h3>
                  <p className="menu-item-copy" style={{ fontSize: '14px', color: '#666' }}>
                    {item.description}
                  </p>
                  
                  <div className="menu-item-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <div>
                      <span style={{ fontSize: '12px', display: 'block' }}>Price</span>
                      <span className="menu-item-price" style={{ fontWeight: 'bold' }}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {!item.available ? (
                      <span className="menu-item-status menu-item-unavailable">Restocking</span>
                    ) : (
                      <div className="menu-item-availability">
                        <ChefHat size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="menu-empty-state" style={{ textAlign: 'center', marginTop: '40px' }}>
            <p>The soil is resting. New surprises coming soon.</p>
          </div>
        )}

        {selectedItem && (
          <div className="menu-modal-overlay" onClick={() => setSelectedItem(null)}>
            <div className="menu-modal-wrapper" onClick={(e) => e.stopPropagation()}>
              <div className="menu-modal">
                
                <button className="menu-modal-close" onClick={() => setSelectedItem(null)}>
                  <X size={18} />
                </button>

                {selectedItem.imageUrl ? (
                  <img 
                    src={`http://localhost:1337/uploads/${selectedItem.imageUrl}`} 
                    alt={selectedItem.name} 
                    className="menu-modal-image"
                  />
                ) : (
                  <div className="menu-modal-image-placeholder">🍛</div>
                )}

                <div className="menu-modal-body">
                  <span className="menu-modal-category">{selectedItem.category || 'Specialty'}</span>
                  <h2 className="menu-modal-title">{selectedItem.name}</h2>
                  <p className="menu-modal-description">{selectedItem.description}</p>
                  
                  <div className="menu-modal-footer">
                    <div>
                      <span className="menu-modal-price-label">Price</span>
                      <span className="menu-modal-price">{formatPrice(selectedItem.price)}</span>
                    </div>

                    {selectedItem.available ? (
                      <span className="menu-modal-status-available">
                        <ChefHat size={16} /> Available Now
                      </span>
                    ) : (
                      <span className="menu-modal-status-unavailable">Temporarily Out</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}