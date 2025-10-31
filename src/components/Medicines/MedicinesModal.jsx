import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './MedicinesModal.css';

function MedicinesModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [userCoins, setUserCoins] = useState(1250); // Mock user coins
  const { t } = useLanguage();
  const { user } = useAuth();

  const categories = [
    { id: 'all', name: 'All Products', icon: 'grid-outline' },
    { id: 'medicines', name: 'Medicines', icon: 'medical-outline' },
    { id: 'vitamins', name: 'Vitamins', icon: 'fitness-outline' },
    { id: 'skincare', name: 'Skincare', icon: 'flower-outline' },
    { id: 'baby-care', name: 'Baby Care', icon: 'heart-outline' },
    { id: 'devices', name: 'Medical Devices', icon: 'hardware-chip-outline' }
  ];

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: 'Paracetamol 500mg (Strip of 10)',
      description: 'Pain relief and fever reducer tablets',
      currentPrice: 25,
      originalPrice: 35,
      discount: 29,
      source: 'local',
      category: 'medicines',
      coinsReward: 5,
      image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      inStock: true,
      bigDiscount: true
    },
    {
      id: 2,
      name: 'Vitamin D3 60K Capsules',
      description: 'High strength Vitamin D3 supplement',
      currentPrice: 180,
      originalPrice: 220,
      discount: 18,
      source: 'amazon',
      category: 'vitamins',
      coinsReward: 18,
      image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      inStock: true,
      bigDiscount: false
    },
    {
      id: 3,
      name: 'Digital Thermometer',
      description: 'Fast and accurate temperature measurement',
      currentPrice: 299,
      originalPrice: 499,
      discount: 40,
      source: 'flipkart',
      category: 'devices',
      coinsReward: 30,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=300',
      inStock: true,
      bigDiscount: true
    },
    {
      id: 4,
      name: 'Cetaphil Gentle Cleanser',
      description: 'Gentle daily facial cleanser for all skin types',
      currentPrice: 450,
      originalPrice: 550,
      discount: 18,
      source: 'local',
      category: 'skincare',
      coinsReward: 45,
      image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=300',
      inStock: true,
      bigDiscount: false
    },
    {
      id: 5,
      name: 'Baby Diapers (Medium - 60 pcs)',
      description: 'Ultra-soft and absorbent baby diapers',
      currentPrice: 699,
      originalPrice: 899,
      discount: 22,
      source: 'amazon',
      category: 'baby-care',
      coinsReward: 70,
      image: 'https://images.pexels.com/photos/6393342/pexels-photo-6393342.jpeg?auto=compress&cs=tinysrgb&w=300',
      inStock: true,
      bigDiscount: false
    },
    {
      id: 6,
      name: 'Multivitamin Tablets (30 count)',
      description: 'Complete daily nutrition supplement',
      currentPrice: 320,
      originalPrice: 480,
      discount: 33,
      source: 'local',
      category: 'vitamins',
      coinsReward: 32,
      image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
      inStock: true,
      bigDiscount: true
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        let filteredProducts = mockProducts;

        // Filter by category
        if (selectedCategory !== 'all') {
          filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
          );
        }

        // Filter by search query
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Filter by price
        if (priceFilter !== 'all') {
          const [min, max] = priceFilter.split('-').map(Number);
          filteredProducts = filteredProducts.filter(product =>
            product.currentPrice >= min && product.currentPrice <= max
          );
        }

        // Filter by source
        if (sourceFilter !== 'all') {
          filteredProducts = filteredProducts.filter(product =>
            product.source === sourceFilter
          );
        }

        setProducts(filteredProducts);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, selectedCategory, searchQuery, priceFilter, sourceFilter]);

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart! You'll earn ${product.coinsReward} Arovia Coins.`);
  };

  const handleBuyNow = (product) => {
    const newCoins = userCoins + product.coinsReward;
    setUserCoins(newCoins);
    alert(`Purchase successful! You earned ${product.coinsReward} Arovia Coins. Total: ${newCoins} coins.`);
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'local': return 'L';
      case 'amazon': return 'A';
      case 'flipkart': return 'F';
      default: return 'S';
    }
  };

  const getSourceName = (source) => {
    switch (source) {
      case 'local': return 'Local Pharmacy';
      case 'amazon': return 'Amazon';
      case 'flipkart': return 'Flipkart';
      default: return 'Store';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="medicines-modal-overlay">
      <div className="medicines-modal">
        <div className="medicines-header">
          <div className="medicines-header-content">
            <div className="medicines-header-icon">
              <ion-icon name="medical-outline"></ion-icon>
            </div>
            <div>
              <h3>Medicines & Products</h3>
              <p>Affordable pharmacy with great discounts</p>
            </div>
          </div>
          <button className="close-medicines-btn" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="medicines-content">
          {user && (
            <div className="arovia-coins-banner">
              <div className="coins-icon">
                <ion-icon name="diamond-outline"></ion-icon>
              </div>
              <div className="coins-info">
                <h4>Arovia Coins</h4>
                <p>Earn coins on every purchase and redeem in your next order!</p>
              </div>
              <div className="user-coins">
                <div className="coins-balance">{userCoins}</div>
                <div className="coins-label">Available Coins</div>
              </div>
            </div>
          )}

          <div className="medicines-filters">
            <div className="filter-group">
              <label>Search Products</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, vitamins..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Prices</option>
                <option value="0-100">₹0 - ₹100</option>
                <option value="100-300">₹100 - ₹300</option>
                <option value="300-500">₹300 - ₹500</option>
                <option value="500-1000">₹500+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Source</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Sources</option>
                <option value="local">Local Pharmacy</option>
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
              </select>
            </div>
          </div>

          <div className="medicines-categories">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-icon">
                  <ion-icon name={category.icon}></ion-icon>
                </div>
                <h4>{category.name}</h4>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="loading-products">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  {product.bigDiscount && (
                    <div className="discount-badge">
                      BIG DISCOUNT!
                    </div>
                  )}
                  
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <ion-icon name="medical-outline"></ion-icon>
                    )}
                  </div>

                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-description">{product.description}</p>

                    <div className="product-price">
                      <span className="current-price">₹{product.currentPrice}</span>
                      <span className="original-price">₹{product.originalPrice}</span>
                      <span className="price-discount">{product.discount}% OFF</span>
                    </div>

                    <div className="product-source">
                      <div className={`source-icon ${product.source}`}>
                        {getSourceIcon(product.source)}
                      </div>
                      <span>{getSourceName(product.source)}</span>
                    </div>

                    <div className="coins-reward">
                      <ion-icon name="diamond-outline"></ion-icon>
                      <span>Earn {product.coinsReward} Arovia Coins</span>
                    </div>

                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="buy-now-btn"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="loading-products">
              <ion-icon name="search-outline" style={{fontSize: '4rem', color: '#9ca3af', marginBottom: '16px'}}></ion-icon>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicinesModal;