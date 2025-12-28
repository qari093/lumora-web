export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function html(ts: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Live — Health</title>
</head>
<body>
  <h1>Live — Health</h1>
  <p id="marker">STEP108_HEALTH_HTML</p>
  <p id="ts">${ts}</p>
</body>
</html>`;
}

export function GET() {
  const ts = new Date().toISOString();
  return new Response(html(ts), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-lumora-marker": "STEP108_HEALTH_HTML",
    },
  });
}
