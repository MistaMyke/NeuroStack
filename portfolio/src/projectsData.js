export const projectsData = [
  {
    id: 'project-1',
    title: 'This Portfolio Website',
    overview: 'A comprehensive personal portfolio built from the ground up to showcase my skills in modern web development. This project serves as a living document of my journey, integrating a clean, futuristic aesthetic with interactive UI elements and a focus on performance and scalability.',
    features: [
      {
        title: 'Glassmorphism UI & Animated Glows',
        description: 'Implemented a semi-transparent, blurred background for key UI elements like the header and panels, creating a modern "glass" effect. This is complemented by subtle, animated glows on interactive elements to provide visual feedback and a dynamic feel.',
        image: '' // Placeholder for a screenshot of the UI
      },
      {
        title: 'Dynamic Client-Side Routing',
        description: 'Utilized React Router to create a seamless single-page application (SPA) experience. This allows for instant navigation between the main page and project detail pages without requiring a full browser reload, enhancing performance and user experience.',
        image: '' // Placeholder for a screenshot showing a different URL
      }
    ],
    techStack: [
      { name: 'React', reason: 'Chosen for its component-based architecture, which allows for reusable and maintainable UI code.' },
      { name: 'Vite', reason: 'Selected for its extremely fast development server (HMR) and optimized production builds.' },
      { name: 'React Router', reason: 'Implemented to handle client-side routing, enabling a smooth, single-page application experience.' },
      { name: 'CSS3', reason: 'Used for advanced styling, including custom animations (keyframes), grid/flexbox layouts, and modern features like backdrop-filter.' }
    ],
    challenges: [
      {
        challenge: 'Achieving a consistent and performant cross-browser "aurora glow" effect.',
        solution: 'The initial CSS `::before` element on the image tag was unreliable. The solution was to create a dedicated wrapper `div` around the image and apply the animated gradient and blur to its pseudo-element, ensuring it rendered correctly and independently.',
        learned: 'The importance of DOM structure in the behavior of CSS pseudo-elements and the utility of wrapper elements for complex styling.'
      }
    ],
    links: {
      live: '#', // Links to the site itself
      repo: 'https://github.com/MistaMyke/NeuroStack'
    }
  },

  // We can add more project objects here later
  {
    id: 'project-2',
    title: 'Project 2',
    description: 'Coming Soon...',
    technologies: [],
    image: ''
  },
  {
    id: 'project-3',
    title: 'Project 3',
    description: 'Coming Soon...',
    technologies: [],
    image: ''
  },
  {
    id: 'project-4',
    title: 'Project 4',
    description: 'Coming Soon...',
    technologies: [],
    image: ''
  },
  {
    id: 'project-5',
    title: 'Project 5',
    description: 'Coming Soon...',
    technologies: [],
    image: ''
  },
  {
    id: 'project-6',
    title: 'Project 6',
    description: 'Coming Soon...',
    technologies: [],
    image: ''
  },
];
