import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

export default function Navbar({ isAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll logic for the background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminPath = location.pathname.startsWith('/admin');
  const isLoginPath = location.pathname === '/login';

  useEffect(() => {
    if (!isAdminPath && !isLoginPath) {
      document.body.classList.add('has-navbar');
      return () => document.body.classList.remove('has-navbar');
    } else {
      document.body.classList.remove('has-navbar');
    }
  }, [isAdminPath, isLoginPath]);

  // Hide navbar completely on login and admin pages
  if (isLoginPath || isAdminPath) return null;

  const navLinks = [
    { name: 'Menu', href: '/#menu' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Location', to: '/location' },
  ];

  const adminLinks = [
    { name: 'Inventory', href: '/admin/inventory' },
    { name: 'Menu', href: '/admin/menu' },
    { name: 'About', href: '/admin/about' },
    { name: 'Contact', href: '/admin/contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className={`site-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to={isAdminPath ? '/admin' : '/'} className="navbar-brand">
          <div className="brand-icon">Cb</div>
          <span className="brand-text">CantoBox</span>
        </Link>

        <div className="desktop-nav">
          {isAdminPath
            ? adminLinks.map((link) => (
                <Link key={link.name} to={link.href} className="navbar-link">
                  {link.name}
                </Link>
              ))
            : navLinks.map((link) =>
                link.to ? (
                  <Link key={link.name} to={link.to} className="navbar-link">
                    {link.name}
                  </Link>
                ) : (
                  <a key={link.name} href={link.href} className="navbar-link">
                    {link.name}
                  </a>
                )
              )}

          {isAdminPath ? (
            <button type="button" className="admin-portal-link" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to={isAuthenticated ? "/admin" : "/login"} className="admin-portal-link">
              Admin Portal
            </Link>
          )}
        </div>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          {(isAdminPath ? adminLinks : navLinks).map((link) =>
            isAdminPath ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link"
              >
                {link.name}
              </Link>
            ) : link.to ? (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="mobile-nav-link"
              >
                {link.name}
              </a>
            )
          )}
          {isAdminPath ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="mobile-admin-link"
            >
              Logout
            </button>
          ) : (
            <Link 
              to={isAuthenticated ? "/admin" : "/login"} 
              onClick={() => setIsOpen(false)}
              className="mobile-admin-link"
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}