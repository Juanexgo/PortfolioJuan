"use client";

import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  tags: [],
  image: "",
  github: "",
  live: "",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyProject);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = useCallback(async () => {
    const response = await fetch("/api/admin/projects");
    const data = await response.json();
    setProjects(data);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...formData, id: editing.id } : formData;

      await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      resetForm();
      fetchProjects();
    },
    [formData, editing, fetchProjects]
  );

  const resetForm = useCallback(() => {
    setEditing(null);
    setShowForm(false);
    setFormData(emptyProject);
    setTagInput("");
  }, []);

  const handleEdit = useCallback((project: Project) => {
    setEditing(project);
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags,
      image: project.image,
      github: project.github || "",
      live: project.live || "",
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this project?")) return;

      await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      fetchProjects();
    },
    [fetchProjects]
  );

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
      setTagInput("");
    }
  }, [tagInput, formData]);

  const removeTag = useCallback(
    (tag: string) => {
      setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    },
    [formData]
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page__title">Projects</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn btn--primary"
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className="glass admin-form">
          <h2 className="admin-form__title">
            {editing ? "Edit Project" : "New Project"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-form__grid">
              <div className="form-group">
                <label htmlFor="project-title">Title</label>
                <input
                  id="project-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-image">Image URL</label>
                <input
                  id="project-image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://placehold.co/600x400"
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-github">GitHub URL</label>
                <input
                  id="project-github"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="project-live">Live URL</label>
                <input
                  id="project-live"
                  value={formData.live}
                  onChange={(e) =>
                    setFormData({ ...formData, live: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="admin-form__tags-input">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn btn--secondary"
                >
                  Add
                </button>
              </div>
              <div className="tags">
                {formData.tags.map((tag) => (
                  <span key={tag} className="tag tag--removable">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="tag__remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="btn btn--primary">
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn--secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {projects.map((project) => (
          <div key={project.id} className="glass admin-list__item">
            <div className="admin-list__content">
              <img
                src={project.image}
                alt={project.title}
                className="admin-list__image"
              />
              <div className="admin-list__details">
                <h3 className="admin-list__title">{project.title}</h3>
                <p className="admin-list__description">
                  {project.description.slice(0, 100)}...
                </p>
                <div className="tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag tag--small">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-list__actions">
              <button
                onClick={() => handleEdit(project)}
                className="btn btn--secondary btn--sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="btn btn--danger btn--sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
