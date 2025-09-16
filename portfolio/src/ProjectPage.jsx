// src/ProjectPage.jsx
import { useParams, Link } from 'react-router-dom';
import { projectsData } from './projectsData';
import './ProjectPage.css'; // We will create this file next

export default function ProjectPage() {
  const { projectId } = useParams();
  const project = projectsData.find(p => p.id === projectId);

  // Handle case where project is not found
  if (!project) {
    return (
      <div className="project-page">
        <h2>Project Not Found</h2>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  return (
    <main className="project-page">
      <div className="project-header">
        <h1>{project.title}</h1>
        <Link to="/" className="back-button">← Back to All Projects</Link>
      </div>

      {/* Overview */}
      <section className="project-section">
        <p className="project-overview">{project.overview}</p>
        <div className="project-links">
          <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="project-link-button">View Repository</a>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Key Features */}
      <section className="project-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {project.features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.image ? (
                <img src={feature.image} alt={feature.title} className="feature-image" />
              ) : (
                <div className="feature-image-placeholder"></div>
              )}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Tech Stack */}
      <section className="project-section">
        <h2>Tech Stack & Decisions</h2>
        <div className="tech-stack-grid">
          {project.techStack.map(tech => (
            <div key={tech.name} className="tech-card">
              <h4>{tech.name}</h4>
              <p>{tech.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Challenges and Lessons Learned */}
      <section className="project-section">
        <h2>Challenges & Lessons Learned</h2>
        {project.challenges.map((item, index) => (
          <div key={index} className="challenge-card">
            <h4>{item.challenge}</h4>
            <p><strong>Solution:</strong> {item.solution}</p>
            <p><strong>Learned:</strong> {item.learned}</p>
          </div>
        ))}
      </section>

    </main>
  );
}
