"use client";

import AccessibilityPass from "@/components/lumaspace/AccessibilityPass";
import DashboardLayout from "@/components/lumaspace/DashboardLayout";

export default function AccessibilityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 p-6">
        <header>
          <h1 className="text-lg font-semibold">Accessibility Pass</h1>
          <p className="text-sm text-muted-foreground">
            This system automatically detects and applies user accessibility preferences for a comfortable LumaSpace experience.
          </p>
        </header>

        <section>
          <AccessibilityPass debugTag="lumaspace-accessibility" />
        </section>
      </div>
    </DashboardLayout>
  );
}
