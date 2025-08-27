// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import './App.css';
import profilePic from './assets/react.svg';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to dropdown container

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [menuOpen]);

  // Handle navigation clicks (close menu and smooth scroll)
  const handleNavClick = (event, targetId) => {
    event.preventDefault();
    setMenuOpen(false);
    
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="App">
      {/* Top Banner */}
      <header className="banner">
        <div className="banner-left">
          <h1>TheMistaMykes Portfolio</h1>
        </div>

        <div className="banner-right">
          {/* Profile Image */}
          <img 
            src={profilePic} 
            alt="Profile picture of TheMistaMykes" 
            className="profile-pic" 
          />

          {/* Dropdown Navigation */}
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropbtn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="Navigation menu"
            >
              Menu
            </button>
            
            {menuOpen && (
              <nav className="dropdown-content" role="menu">
                <a 
                  href="#projects" 
                  role="menuitem"
                  onClick={(e) => handleNavClick(e, 'projects')}
                >
                  Projects
                </a>
                <a 
                  href="#about" 
                  role="menuitem"
                  onClick={(e) => handleNavClick(e, 'about')}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  role="menuitem"
                  onClick={(e) => handleNavClick(e, 'contact')}
                >
                  Contact
                </a>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <section id="welcome">
          <h2>Welcome to My Portfolio!</h2>
          <p>
            Hi there! This is where your amazing portfolio content will go. 
            Start building out your sections below.
          </p>
        </section>

        {/* Placeholder sections for navigation */}
        <section id="projects" style={{ minHeight: '400px', paddingTop: '2rem' }}>
          <h2>Projects</h2>
          <p>Your awesome projects will be showcased here.</p>
        </section>

        <section id="about" style={{ minHeight: '400px', paddingTop: '2rem' }}>
          <h2>About Me</h2>
          <p>Tell your story here - your background, skills, and what makes you unique.</p>
        </section>

        <section id="contact" style={{ minHeight: '400px', paddingTop: '2rem' }}>
          <h2>Contact</h2>
          <p>Add your contact information and social links here.</p>
        </section>
      </main>
    </div>
  );
}

export default App;