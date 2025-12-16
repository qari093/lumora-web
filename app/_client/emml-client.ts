"use client";

export async function fetchEmmlIndices() {
  const r = await fetch("/api/emml/indices");
  return r.json();
}
export async function fetchEmmlHeat() {
  const r = await fetch("/api/emml/heat");
  return r.json();
}
export async function fetchEmmlAssets() {
  const r = await fetch("/api/emml/assets");
  return r.json();
}
