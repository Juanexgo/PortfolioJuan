import projectsData from "@/data/projects.json";
import { Project } from "@/types";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card glass">
      <div className="project-card__image">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="project-card__overlay">
          <div className="project-card__links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link"
              >
                Code
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link"
              >
                Live
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section section--projects">
      <div className="container">
        <h2 className="section__title">Featured Projects</h2>
        <p className="section__subtitle">
          A selection of recent work and personal projects
        </p>
        <div className="projects-grid">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
