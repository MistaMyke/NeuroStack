// src/App.jsx
// Import necessary hooks from React and the main stylesheet.
import { useState, useEffect, useRef } from 'react';
import './App.css';
// Import the profile picture image.
import profilePic from './assets/react.svg';

// SVG Icon Components
const EmailIcon = () => (
  <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.25l-8 5-8-5V6h16v2.25z"/></svg>
);

const LinkedInIcon = () => (
  <svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
  </svg>
);

const TelegramIcon = () => (
  <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.78 18.65l.28-4.23-7.02-2.42c-1.33-.46-1.33-2.24 0-2.7l18.6-6.92c1.22-.45 2.33.63 1.94 1.92L13.3 18.89c-.34 1.16-1.71 1.53-2.38.61l-1.14-1.85z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485-.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
);

// The main App component.
function App() {
  // State to manage the visibility of the dropdown menu.
  const [menuOpen, setMenuOpen] = useState(false);
  // Ref to get a direct reference to the dropdown DOM element.
  const dropdownRef = useRef(null);

  // Social media links data
  const socialLinks = [
    { name: 'Email', href: 'mailto:your-TheMistaMyke@proton.me', icon: <EmailIcon /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/michael-hermann-cs/', icon: <LinkedInIcon /> },
    { name: 'GitHub', href: 'https://github.com/MistaMyke', icon: <GitHubIcon /> },
    { name: 'Telegram', href: 'https://t.me/TheMistaMyke', icon: <TelegramIcon /> },
    { name: 'Instagram', href: 'https://www.instagram.com/themistamyke/', icon: <InstagramIcon /> },
  ];

  // This effect handles closing the dropdown when a click occurs outside of it.
  useEffect(() => {
    // Function to check if the clicked element is outside the dropdown.
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    // If the menu is open, add an event listener to the document.
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener when the component unmounts or the menu closes.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]); // This effect runs whenever menuOpen changes.

  // This effect handles closing the dropdown when the 'Escape' key is pressed.
  useEffect(() => {
    // Function to check for the 'Escape' key.
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    }

    // Add a keydown event listener to the document.
    document.addEventListener('keydown', handleEscapeKey);
    // Cleanup function to remove the event listener.
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [menuOpen]); // This effect runs whenever menuOpen changes.

  // This function handles clicks on navigation links.
  const handleNavClick = (event, targetId) => {
    event.preventDefault(); // Prevent the default anchor link behavior.
    setMenuOpen(false); // Close the menu.
    
    // Find the target element by its ID.
    const target = document.getElementById(targetId);
    // If the target exists, scroll to it smoothly.
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // The JSX structure of the component.
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
              onClick={() => setMenuOpen(!menuOpen)} // Toggle menu visibility on click.
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="Navigation menu"
            >
              Menu
            </button>
            
            {/* Conditionally render the dropdown content if menuOpen is true. */}
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

        {/* Projects Section */}
        <section id="projects" style={{ minHeight: '150px', paddingTop: '1rem' }}>
          <h2>Projects</h2>
          <div className="projects-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="project-card">
                <div className="project-card-content">
                  <h3>Project {index + 1}</h3>
                  <p>A brief description of the project goes here.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" style={{ minHeight: '150px', paddingTop: '1rem' }}>
          <h2>About Me</h2>
          <p>I’m an aspiring full-stack developer and tech enthusiast, exploring the world of coding, web development, and small-scale tech projects. My journey is all about learning by doing — building tools, experimenting with new technologies, and finding creative ways to solve problems.</p>
          <p>Along the way, I’m also working on building IndigoShield Tech Services, a small tech and cybersecurity venture that helps individuals and small businesses improve their digital security and their online presence. This project gives me hands-on experience turning ideas into real solutions while continuing to grow my skills.</p>
          <p>I’m still learning, but I enjoy taking on challenges, building things from scratch, and sharing my progress as I grow in this ever-evolving field.</p>
        </section>
        <section id="contact" className="contact-section">
          <h2>Contact Me</h2>
          <p>If you’d like to reach out, feel free to connect with me through any of the platforms below:</p>
          <div className="social-icons">
            {socialLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={link.name}
                className="social-icon-link"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Export the App component to be used in other parts of the application.
export default App;
