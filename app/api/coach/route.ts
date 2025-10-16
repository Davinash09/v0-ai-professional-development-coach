import { convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { z } from "zod"
import { catalog, type PDResource, type Workshop, type Tool as PDTool, type BestPractice } from "@/data/resources"

export const maxDuration = 60

function matchesProfile(
  item: PDResource,
  {
    gradeLevel,
    subjects,
    pedagogyInterests,
  }: {
    gradeLevel?: string
    subjects?: string
    pedagogyInterests?: string[]
  },
) {
  const subj = (subjects || "").toLowerCase()
  const subjMatch =
    item.subjects.includes("All") || subj.length === 0 || item.subjects.some((s) => subj.includes(s.toLowerCase()))

  const gradeMatch = !gradeLevel || item.grades.includes(gradeLevel as any)

  const pedagogyMatch =
    !pedagogyInterests || pedagogyInterests.length === 0 || item.pedagogy.some((p) => pedagogyInterests.includes(p))

  return subjMatch && gradeMatch && pedagogyMatch
}

const searchWorkshops = tool({
  description: "Search relevant PD workshops based on subject, grade, and pedagogy interests.",
  inputSchema: z.object({
    gradeLevel: z.string().optional(),
    subjects: z.string().optional(),
    pedagogyInterests: z.array(z.string()).optional(),
    maxResults: z.number().min(1).max(10).default(5),
  }),
  execute: async (input) => {
    const filtered = catalog.filter((c): c is Workshop => c.type === "workshop" && matchesProfile(c, input))
    const top = filtered.slice(0, input.maxResults)
    return top
  },
})

const recommendTools = tool({
  description: "Recommend classroom tools given goals and constraints.",
  inputSchema: z.object({
    goals: z.string().optional(),
    constraints: z.string().optional(),
    gradeLevel: z.string().optional(),
    subjects: z.string().optional(),
    pedagogyInterests: z.array(z.string()).optional(),
    maxResults: z.number().min(1).max(10).default(5),
  }),
  execute: async (input) => {
    const filtered = catalog.filter((c): c is PDTool => c.type === "tool" && matchesProfile(c, input))
    // naive rerank: prefer tools matching constraints keywords
    const cons = (input.constraints || "").toLowerCase()
    const scored = filtered
      .map((t) => ({
        t,
        score:
          (input.goals?.length ? 1 : 0) +
          (cons && t.cost === "free" ? 1 : 0) +
          (cons.includes("limited devices") && t.useCases.includes("discourse") ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .map((s) => s.t)

    return scored.slice(0, input.maxResults)
  },
})

const bestPractices = tool({
  description: "List best practices aligned to pedagogy and grade level.",
  inputSchema: z.object({
    gradeLevel: z.string().optional(),
    pedagogyInterests: z.array(z.string()).optional(),
    maxResults: z.number().min(1).max(10).default(5),
  }),
  execute: async (input) => {
    const filtered = catalog.filter((c): c is BestPractice => c.type === "best-practice" && matchesProfile(c, input))
    return filtered.slice(0, input.maxResults)
  },
})

const buildImplementationPlan = tool({
  description: "Create a week-by-week implementation plan using selected items.",
  inputSchema: z.object({
    weeks: z.number().min(1).max(8).default(4),
    focus: z.string().optional().describe("High-level focus (e.g., inquiry routines, PBL launch)"),
  }),
  execute: async ({ weeks, focus }) => {
    const outline = Array.from({ length: weeks }).map((_, i) => ({
      week: i + 1,
      goal: i === 0 ? "Baseline + quick win" : `Iterate and deepen practice ${i}`,
      activities: ["Plan mini-lesson", "Use one recommended tool", "Collect formative evidence", "Reflect and adjust"],
      timeEstimateMins: 90,
      focus: focus || (i === 0 ? "Onboarding and classroom routines" : "Extend and scaffold"),
    }))
    return outline
  },
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-5",
    messages: convertToModelMessages(messages),
    maxOutputTokens: 1200,
    tools: {
      searchWorkshops,
      recommendTools,
      bestPractices,
      buildImplementationPlan,
    },
    system: [
      "You are an agentic Professional Development coach for educators.",
      "Always tailor suggestions to the user's provided profile context if present under 'Context:'.",
      "When helpful, call tools to retrieve concrete workshops, tools, and best practices from the local catalog.",
      "Cite titles and providers, and include URLs when making recommendations.",
      "Prefer free options when constraints or equity are mentioned.",
      "Offer concise, actionable guidance. Use bullet points and short paragraphs.",
    ].join("\n"),
  })

  return result.toUIMessageStreamResponse()
}
