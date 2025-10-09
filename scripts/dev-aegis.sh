#!/usr/bin/env bash
set -e

# صاف صفائی: پرانا Pages Router aegis ہٹا دیں
rm -f pages/aegis.tsx src/pages/aegis.tsx 2>/dev/null || true

# App Router پیج بنائیں
mkdir -p src/app/aegis
cat > src/app/aegis/page.tsx <<'TSX'
"use client";
import React from "react";
import AegisPrime from "@/components/aegis/AegisPrime";

export default function AegisPage() {
  return (
    <div style={{ width:"100%", height:"100vh", background:"#000" }}>
      <AegisPrime/>
    </div>
  );
}
TSX

# پرانا dev سرور بند کریں اور نیا شروع کریں
pkill -f "next dev" >/dev/null 2>&1 || true
PORT=${PORT:-3000} npx next dev
BASH \
&& chmod +x scripts/dev-aegis.sh \
&& ./scripts/dev-aegis.sh

cd ~/lumora-web \
&& mkdir -p scripts src/app/aegis \
&& cat > scripts/dev-aegis.sh <<'BASH'
#!/usr/bin/env bash
set -e

echo "⚡ Running Aegis setup..."

# پرانے pages router فائل صاف کریں
rm -f pages/aegis.tsx src/pages/aegis.tsx 2>/dev/null || true

# App Router پیج بنائیں
mkdir -p src/app/aegis
cat > src/app/aegis/page.tsx <<'TSX'
"use client";
import React from "react";
import AegisPrime from "@/components/aegis/AegisPrime";

export default function AegisPage() {
  return (
    <div style={{ width:"100%", height:"100vh", background:"#000" }}>
      <AegisPrime/>
    </div>
  );
}
TSX

# پرانا dev سرور بند کریں
pkill -f "next dev" >/dev/null 2>&1 || true

# نیا dev سرور شروع کریں
PORT=${PORT:-3000} npx next dev
BASH \
&& chmod +x scripts/dev-aegis.sh \
&& ./scripts/dev-aegis.sh
cd ~/lumora-web \
&& mkdir -p scripts src/app/aegis \
&& cat > scripts/dev-aegis.sh <<'BASH'
#!/usr/bin/env bash
set -e

echo "⚡ Running Aegis setup..."

# پرانے pages router فائل صاف کریں
rm -f pages/aegis.tsx src/pages/aegis.tsx 2>/dev/null || true

# App Router پیج بنائیں
mkdir -p src/app/aegis
cat > src/app/aegis/page.tsx <<'TSX'
"use client";
import React from "react";
import AegisPrime from "@/components/aegis/AegisPrime";

export default function AegisPage() {
  return (
    <div style={{ width:"100%", height:"100vh", background:"#000" }}>
      <AegisPrime/>
    </div>
  );
}
TSX

# پرانا dev سرور بند کریں
pkill -f "next dev" >/dev/null 2>&1 || true

# نیا dev سرور شروع کریں
PORT=${PORT:-3000} npx next dev
