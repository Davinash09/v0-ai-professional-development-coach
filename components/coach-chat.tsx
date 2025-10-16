"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

type Profile = {
  name: string
  role: string
  gradeLevel: string
  subjects: string
  pedagogyInterests: string[]
  goals: string
  constraints: string
  preferredTools: string
  classroomSetting: string
}

export default function CoachChat() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const storageKey = "coach.educatorProfile.v1"

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setProfile(JSON.parse(raw))
    } catch {}
  }, [])

  const contextPrefix = useMemo(() => {
    if (!profile) return ""
    const lines = [
      `Educator Profile`,
      `- Name: ${profile.name || "N/A"}`,
      `- Role: ${profile.role}`,
      `- Grade Level: ${profile.gradeLevel}`,
      `- Subjects: ${profile.subjects || "N/A"}`,
      `- Pedagogy Interests: ${profile.pedagogyInterests.join(", ") || "N/A"}`,
      `- Classroom Setting: ${profile.classroomSetting}`,
      `- Goals: ${profile.goals || "N/A"}`,
      `- Constraints: ${profile.constraints || "N/A"}`,
      `- Preferred Tools: ${profile.preferredTools || "N/A"}`,
    ].join("\n")
    return `Context:\n${lines}\n\n`
  }, [profile])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/coach" }),
  })

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col min-h-[560px]">
      <h2 className="text-lg font-semibold">Coach Chat</h2>
      <p className="text-sm text-muted-foreground">
        Ask for workshops, tools, lesson ideas, or step-by-step plans. The coach will use your profile to personalize
        recommendations.
      </p>

      <div className="mt-4 flex-1 rounded-md border bg-background p-3 overflow-auto" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Example prompts:
            <ul className="list-disc pl-5 mt-2">
              <li>
                Suggest inquiry-based activities for {profile?.gradeLevel || "my grade"}{" "}
                {profile?.subjects || "science"} with limited devices.
              </li>
              <li>
                Recommend PD workshops for {profile?.pedagogyInterests?.join(", ") || "PBL and UDL"} that fit 60
                minutes.
              </li>
              <li>
                Propose 3 tools to increase student discourse in {profile?.subjects || "math"} and how to use them next
                week.
              </li>
            </ul>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="text-sm">
                <strong>{m.role === "user" ? "You" : "Coach"}: </strong>
                {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const value = inputRef.current?.value?.trim()
          if (!value) return

          const composed =
            (contextPrefix ? contextPrefix : "") +
            value +
            "\n\nPlease tailor suggestions tightly to the profile context above, citing which workshop/tool/best-practice matched and why. If useful, make a week-by-week plan with time estimates."

          console.log("[v0] Sending composed message with context:", {
            hasContext: Boolean(contextPrefix),
            messageLength: composed.length,
          })

          sendMessage({ text: composed })
          if (inputRef.current) inputRef.current.value = ""
        }}
      >
        <input
          ref={inputRef}
          name="message"
          className="flex-1 px-3 py-2 rounded-md border bg-background"
          placeholder="Ask the coach..."
          disabled={status === "in_progress"}
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={status === "in_progress"}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2"
        >
          {status === "in_progress" ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  )
}
