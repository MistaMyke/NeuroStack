// Import StrictMode from React to enable additional checks and warnings for its descendants.
import { StrictMode } from 'react'
// Import createRoot from react-dom/client, which is the new API for rendering React applications.
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Import the global stylesheet. These styles will be applied to the entire application.
import './index.css';
// Import the main App component, which is the root component of the application.
import App from './App.jsx';

// Get the root DOM element where the React app will be mounted.
// This element is defined in index.html.
const rootElement = document.getElementById('root');

// Create a root for the React application.
const root = createRoot(rootElement);

// Render the App component into the root.
// StrictMode is a wrapper component that helps you write better React code by highlighting potential problems.
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)