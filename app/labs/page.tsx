
import LabsStudio from "@/components/labs/studio";
export const dynamic = "force-dynamic";
export default function LabsPage(){
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lumora Labs</h1>
      <LabsStudio />
    </main>
  );
}
