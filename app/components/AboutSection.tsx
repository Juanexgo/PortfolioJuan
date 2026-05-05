import experienceData from "@/data/experience.json";
import skillsData from "@/data/skills.json";
import { Experience, Category } from "@/types";

function SkillGroup({ category, skills }: { category: string; skills: string[] }) {
  return (
    <div className="skill-group">
      <h4 className="skill-group__heading">{category}</h4>
      <div className="skill-group__tags">
        {skills.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div className="timeline-item glass">
      <div className="timeline-item__header">
        <time className="timeline-item__period">{experience.period}</time>
        <span className="badge">{experience.company}</span>
        {experience.type && <span className="badge">{experience.type}</span>}
      </div>
      <div className="timeline-item__body">
        <h4 className="timeline-item__role">{experience.role}</h4>
        <p className="timeline-item__description">{experience.description}</p>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const skills = skillsData as Record<Category, string[]>;

  return (
    <section id="about" className="section section--about">
      <div className="container">
        <h2 className="section__title">About Me</h2>
        <p className="section__subtitle">
          Passionate developer with a focus on clean code and user experience
        </p>

        <div className="about-grid">
          <div className="glass about-grid__bio">
            <p className="about-grid__text">
              I&apos;m a Mid-level developer with experience building web and mobile applications. I specialize in creating performant, accessible, and visually appealing digital experiences.
            </p>
            <p className="about-grid__text">
              My journey spans from network infrastructure and IT support to full-stack development. I&apos;m always exploring new technologies and frameworks to build better solutions.
            </p>
          </div>

          <div className="glass about-grid__skills">
            <h3 className="about-grid__skills-heading">Skills & Technologies</h3>
            {Object.entries(skills).map(([category, skillsList]) => (
              <SkillGroup
                key={category}
                category={category}
                skills={skillsList}
              />
            ))}
          </div>
        </div>

        <div className="experience-section">
          <h3 className="experience-section__heading">Experience</h3>
          <div className="timeline">
            {experienceData.map((exp) => (
              <ExperienceItem key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
