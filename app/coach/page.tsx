import CoachChat from "@/components/coach-chat"
import EducatorProfileForm from "@/components/educator-profile-form"

export default function CoachPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-pretty">Agentic AI PD Coach for Educators</h1>
          <span className="text-sm text-muted-foreground">Beta</span>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-6 grid gap-6 md:grid-cols-2">
        <EducatorProfileForm />
        <CoachChat />
      </section>
    </main>
  )
}
