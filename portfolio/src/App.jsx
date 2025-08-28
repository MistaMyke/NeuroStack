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
          {/* Profile Image */}
          <img 
            src={profilePic} 
            alt="Profile picture of TheMistaMykes" 
            className="profile-pic" 
          />
        </div>

        <div className="banner-center">
          <h1>TheMistaMykes Portfolio</h1>
        </div>

        <div className="banner-right">
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
            This space captures my journey as a creator and problem-solver in the tech world. What started as learning the nuts and bolts of code has grown into full-stack projects, business ideas, and creative experiments that push me to keep building and refining.
              </p>
              <p>
            I see this portfolio as both a showcase and a snapshot in time — a place where my skills, projects, and entrepreneurial path all come together. As I grow, this site grows with me, reflecting not just what I can do, but where I’m going.
          </p>
        </section>

        {/* Placeholder sections for navigation */}
        <section id="projects" style={{ minHeight: '150px', paddingTop: '1rem' }}>
          <h2>Projects</h2>
          <p>Welcome to the Projects section — a collection of the work I’m building, experimented with, and learned from along my full-stack development journey. Each project represents a step in my growth as a techproneur, from coding small utilities to building full applications and exploring SaaS concepts. Here, you’ll find both finished works and ongoing experiments, reflecting the process of learning, iterating, and creating solutions across web development, design, and content creation..</p>
          <p>As this portfolio evolves, new projects will be added to showcase the breadth of skills, technologies, and ideas I’m exploring. Think of this space not just as a showcase, but as a window into my journey as a developer, creator, and problem-solver in the digital landscape.</p>
        </section>

        <section id="about" style={{ minHeight: '150px', paddingTop: '1rem' }}>
          <h2>About Me</h2>
          <p>I’m an aspiring full-stack developer and tech enthusiast, exploring the world of coding, web development, and small-scale tech projects. My journey is all about learning by doing — building tools, experimenting with new technologies, and finding creative ways to solve problems.</p>
          <p>Along the way, I’m also working on building IndigoShield Tech Services, a small tech and cybersecurity venture that helps individuals and small businesses improve their digital security and online presence. This project gives me hands-on experience turning ideas into real solutions while continuing to grow my skills.</p>
          <p>I’m still learning, but I enjoy taking on challenges, building things from scratch, and sharing my progress as I grow in this ever-evolving field.</p>
        </section>
<section id="contact" className="contact-section">
  <h2>Contact Me</h2>
  <p>If you’d like to reach out, feel free to connect with me through any of the platforms below:</p>
  <ul className="contact-links">
    <li>
      <a href="#" target="_blank" rel="noopener noreferrer">
        Email
      </a>
    </li>
    <li>
      <a href="#" target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    </li>
    <li>
      <a href="#" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </li>
    <li>
      <a href="#" target="_blank" rel="noopener noreferrer">
        Portfolio Blog / Substack
      </a>
    </li>
  </ul>
</section>
      </main>
    </div>
  );
}

export default App;