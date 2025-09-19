import LabsStudio from '@/components/labs/studio';
export const dynamic = 'force-static';
export default function LabsPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Lumora Labs</h1>
      <p className="text-sm text-gray-500 mb-4">AI-powered studio for filters, voices, music, gestures, avatars, translations, and more.</p>
      <LabsStudio />
    </main>
  );
}

