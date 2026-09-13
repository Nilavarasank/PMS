import ProjectCard from './ProjectCard';

export default function ProjectList({ projects, onEdit, onDelete }) {
  if (!projects.length) {
    return (
      <div className="empty-state">
        <div className="empty-art" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h3>No projects yet</h3>
        <p>Create your first project to start tracking work.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          style={{ '--delay': `${index * 70}ms` }}
        />
      ))}
    </div>
  );
}
