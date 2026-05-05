"use client";

import { useState, useEffect, useCallback } from "react";
import { Profile, Skills, Category } from "@/types";

const categories: Category[] = ["frontend", "mobile", "backend", "tools"];

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skills | null>(null);
  const [skillInputs, setSkillInputs] = useState<Record<Category, string>>({
    frontend: "",
    mobile: "",
    backend: "",
    tools: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    const [profileRes, skillsRes] = await Promise.all([
      fetch("/api/admin/profile"),
      fetch("/api/admin/skills"),
    ]);
    setProfile(await profileRes.json());
    setSkills(await skillsRes.json());
  }, []);

  const saveProfile = useCallback(async () => {
    if (!profile) return;

    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    showSaved();
  }, [profile]);

  const saveSkills = useCallback(async () => {
    if (!skills) return;

    await fetch("/api/admin/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skills),
    });

    showSaved();
  }, [skills]);

  const showSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const addSkill = useCallback(
    (category: Category) => {
      const input = skillInputs[category];
      if (!input.trim() || !skills) return;
      if (skills[category].includes(input.trim())) return;

      setSkills({
        ...skills,
        [category]: [...skills[category], input.trim()],
      });
      setSkillInputs({ ...skillInputs, [category]: "" });
    },
    [skillInputs, skills]
  );

  const removeSkill = useCallback(
    (category: Category, skill: string) => {
      if (!skills) return;

      setSkills({
        ...skills,
        [category]: skills[category].filter((s) => s !== skill),
      });
    },
    [skills]
  );

  if (!profile || !skills) {
    return <p className="admin-loading">Loading...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page__title">Settings</h1>
        {saved && <span className="admin-page__saved">Saved!</span>}
      </div>

      {/* Profile Section */}
      <div className="glass admin-form">
        <h2 className="admin-form__title">Profile & Contact</h2>

        <div className="admin-form__grid">
          <div className="form-group">
            <label htmlFor="settings-name">Name</label>
            <input
              id="settings-name"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-title">Title</label>
            <input
              id="settings-title"
              value={profile.title}
              onChange={(e) =>
                setProfile({ ...profile, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-level">Level</label>
            <select
              id="settings-level"
              value={profile.level}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  level: e.target.value as Profile["level"],
                })
              }
            >
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="settings-email">Email</label>
            <input
              id="settings-email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-github">GitHub URL</label>
            <input
              id="settings-github"
              value={profile.github}
              onChange={(e) =>
                setProfile({ ...profile, github: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-linkedin">LinkedIn URL</label>
            <input
              id="settings-linkedin"
              value={profile.linkedin}
              onChange={(e) =>
                setProfile({ ...profile, linkedin: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="settings-bio">Bio</label>
          <textarea
            id="settings-bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
          />
        </div>

        <button onClick={saveProfile} className="btn btn--primary">
          Save Profile
        </button>
      </div>

      {/* Skills Sections */}
      {categories.map((category) => (
        <div key={category} className="glass admin-form">
          <h2 className="admin-form__title admin-form__title--capitalize">
            {category} Skills
          </h2>

          <div className="admin-form__tags-input">
            <input
              value={skillInputs[category]}
              onChange={(e) =>
                setSkillInputs({ ...skillInputs, [category]: e.target.value })
              }
              placeholder={`Add ${category} skill...`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(category);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addSkill(category)}
              className="btn btn--secondary"
            >
              Add
            </button>
          </div>

          <div className="tags">
            {skills[category].map((skill) => (
              <span key={skill} className="tag tag--removable">
                {skill}
                <button
                  onClick={() => removeSkill(category, skill)}
                  className="tag__remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <button onClick={saveSkills} className="btn btn--primary btn--mt">
            Save Skills
          </button>
        </div>
      ))}
    </div>
  );
}
