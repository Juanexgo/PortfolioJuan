"use client";

import { useState, useEffect, useCallback } from "react";
import { Experience } from "@/types";

const emptyExperience: Omit<Experience, "id"> = {
  role: "",
  company: "",
  period: "",
  type: "",
  description: "",
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyExperience);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = useCallback(async () => {
    const response = await fetch("/api/admin/experience");
    const data = await response.json();
    setExperiences(data);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...formData, id: editing.id } : formData;

      await fetch("/api/admin/experience", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      resetForm();
      fetchExperiences();
    },
    [formData, editing, fetchExperiences]
  );

  const resetForm = useCallback(() => {
    setEditing(null);
    setShowForm(false);
    setFormData(emptyExperience);
  }, []);

  const handleEdit = useCallback((exp: Experience) => {
    setEditing(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      type: exp.type,
      description: exp.description,
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this experience?")) return;

      await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
      fetchExperiences();
    },
    [fetchExperiences]
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page__title">Experience</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn btn--primary"
        >
          + Add Experience
        </button>
      </div>

      {showForm && (
        <div className="glass admin-form">
          <h2 className="admin-form__title">
            {editing ? "Edit Experience" : "New Experience"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-form__grid">
              <div className="form-group">
                <label htmlFor="exp-role">Role</label>
                <input
                  id="exp-role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exp-company">Company</label>
                <input
                  id="exp-company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exp-period">Period</label>
                <input
                  id="exp-period"
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  placeholder="2023 - Present"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exp-type">Type</label>
                <select
                  id="exp-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as Experience["type"] })
                  }
                >
                  <option value="">Select type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="exp-description">Description</label>
              <textarea
                id="exp-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
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

      <div className="admin-list admin-list--simple">
        {experiences.map((exp) => (
          <div key={exp.id} className="glass admin-list__item">
            <div className="admin-list__details">
              <div className="timeline-item__header">
                <time className="timeline-item__period">{exp.period}</time>
                <span className="badge">{exp.company}</span>
                {exp.type && <span className="badge">{exp.type}</span>}
              </div>
              <h3 className="admin-list__title">{exp.role}</h3>
              <p className="admin-list__description">{exp.description}</p>
            </div>

            <div className="admin-list__actions">
              <button
                onClick={() => handleEdit(exp)}
                className="btn btn--secondary btn--sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
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
