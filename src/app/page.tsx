import ThemeToggle from '../components/theme-toggle';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="w-44">
          <ThemeToggle />
        </div>
      </header>

      <p className="mt-4">
        Root route is working. Go to{' '}
        <a className="text-blue-600 underline" href="/dashboard">
          Dashboard
        </a>
        .
      </p>
    </main>
  );
}
