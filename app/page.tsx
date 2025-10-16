import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl px-6 py-10 rounded-lg bg-card border">
        <h1 className="text-2xl font-semibold text-pretty">Agentic AI PD Coach</h1>
        <p className="mt-2 text-muted-foreground">
          A professional development coach that suggests workshops, tools, and best practices to enhance student
          engagement.
        </p>
        <div className="mt-6">
          <Link
            href="/coach"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2"
          >
            Open the Coach
          </Link>
        </div>
      </div>
    </main>
  )
}
