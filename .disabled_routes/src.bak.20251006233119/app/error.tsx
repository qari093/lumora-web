"use client";
import * as Sentry from "@sentry/nextjs";
export default function ErrorBoundary({ error, reset }:{ error:Error & {digest?:string}, reset:()=>void }){
  Sentry.captureException(error);
  return (
    <div style={{padding:20}}>
      <h1>کچھ غلط ہو گیا</h1>
      <p>{error.message}</p>
      <button onClick={reset} style={{padding:"8px 12px",border:"1px solid #333",borderRadius:8}}>دوبارہ کوشش کریں</button>
    </div>
  );
}
