window.lumoraTrack = async function(type, props){
  try{ await fetch("/api/analytics/track", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ type, props }) }); }catch{}
};
