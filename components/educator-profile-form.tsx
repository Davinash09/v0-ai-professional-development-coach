"use client"

import { useEffect, useState } from "react"

type Profile = {
  name: string
  role: string
  gradeLevel: string
  subjects: string
  pedagogyInterests: string[] // e.g., ["PBL","Inquiry","UDL","Blended"]
  goals: string
  constraints: string
  preferredTools: string
  classroomSetting: string // in-person, online, hybrid
}

const DEFAULT_PROFILE: Profile = {
  name: "",
  role: "Teacher",
  gradeLevel: "Middle School",
  subjects: "",
  pedagogyInterests: ["PBL"],
  goals: "",
  constraints: "",
  preferredTools: "",
  classroomSetting: "in-person",
}

const TAGS = ["PBL", "Inquiry", "UDL", "Blended", "AI Literacy", "Assessment"]

export default function EducatorProfileForm() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const storageKey = "coach.educatorProfile.v1"

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setProfile(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile))
    } catch {}
  }, [profile])

  function toggleTag(tag: string) {
    setProfile((p) => {
      const exists = p.pedagogyInterests.includes(tag)
      return {
        ...p,
        pedagogyInterests: exists ? p.pedagogyInterests.filter((t) => t !== tag) : [...p.pedagogyInterests, tag],
      }
    })
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">Educator Profile</h2>
      <p className="text-sm text-muted-foreground">This context informs the AI coach. You can update anytime.</p>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Name</span>
          <input
            className="px-3 py-2 rounded-md border bg-background"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="Optional"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Role</span>
            <select
              className="px-3 py-2 rounded-md border bg-background"
              value={profile.role}
              onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
            >
              <option>Teacher</option>
              <option>Instructional Coach</option>
              <option>Department Head</option>
              <option>Administrator</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Grade Level</span>
            <select
              className="px-3 py-2 rounded-md border bg-background"
              value={profile.gradeLevel}
              onChange={(e) => setProfile((p) => ({ ...p, gradeLevel: e.target.value }))}
            >
              <option>Elementary</option>
              <option>Middle School</option>
              <option>High School</option>
              <option>Higher Ed</option>
            </select>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Subject Areas</span>
          <input
            className="px-3 py-2 rounded-md border bg-background"
            value={profile.subjects}
            onChange={(e) => setProfile((p) => ({ ...p, subjects: e.target.value }))}
            placeholder="e.g., Math, Science"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Classroom Setting</span>
          <select
            className="px-3 py-2 rounded-md border bg-background"
            value={profile.classroomSetting}
            onChange={(e) => setProfile((p) => ({ ...p, classroomSetting: e.target.value }))}
          >
            <option>in-person</option>
            <option>online</option>
            <option>hybrid</option>
          </select>
        </label>

        <div>
          <span className="text-sm">Pedagogy Interests</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const active = profile.pedagogyInterests.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={[
                    "px-2 py-1 rounded-md border text-sm",
                    active ? "bg-primary text-primary-foreground" : "bg-background",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Goals</span>
          <textarea
            className="px-3 py-2 rounded-md border bg-background min-h-24"
            value={profile.goals}
            onChange={(e) => setProfile((p) => ({ ...p, goals: e.target.value }))}
            placeholder="e.g., Improve inquiry-based engagement in 8th grade science"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Constraints</span>
          <textarea
            className="px-3 py-2 rounded-md border bg-background min-h-20"
            value={profile.constraints}
            onChange={(e) => setProfile((p) => ({ ...p, constraints: e.target.value }))}
            placeholder="e.g., limited devices, 45-min periods, testing window next month"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Preferred Tools</span>
          <input
            className="px-3 py-2 rounded-md border bg-background"
            value={profile.preferredTools}
            onChange={(e) => setProfile((p) => ({ ...p, preferredTools: e.target.value }))}
            placeholder="e.g., Google Classroom, Desmos"
          />
        </label>

        <p className="text-xs text-muted-foreground">Your profile is stored locally in your browser only.</p>
      </div>
    </div>
  )
}
