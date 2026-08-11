import fs from 'node:fs';

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

function collectNamedExportMethods(source) {
  const detected = new Set();

  const namedExportPattern = /export\s*\{([\s\S]*?)\}(?:\s*from\s*["'][^"']+["'])?\s*;?/g;

  for (const match of source.matchAll(namedExportPattern)) {
    const exportList = match[1] ?? '';

    for (const entry of exportList.split(',')) {
      const normalized = entry.trim();

      if (!normalized) {
        continue;
      }

      const aliasMatch = normalized.match(
        /^(?:[A-Za-z_$][\w$]*\s+as\s+)?(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/,
      );

      if (aliasMatch?.[1]) {
        detected.add(aliasMatch[1]);
      }
    }
  }

  return detected;
}

export function detectRouteMethodsFromSource(source) {
  if (typeof source !== 'string') {
    throw new TypeError('route source must be a string');
  }

  const detected = new Set();

  const directPatterns = [
    /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g,
    /export\s+const\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*=/g,
    /export\s+let\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*=/g,
    /export\s+var\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*=/g,
  ];

  for (const pattern of directPatterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) {
        detected.add(match[1]);
      }
    }
  }

  for (const method of collectNamedExportMethods(source)) {
    detected.add(method);
  }

  return HTTP_METHODS.filter((method) => detected.has(method));
}

export function detectRouteMethods(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new TypeError('route file path must be a non-empty string');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`route file does not exist: ${filePath}`);
  }

  return detectRouteMethodsFromSource(fs.readFileSync(filePath, 'utf8'));
}
