(function(){
  if (typeof window==="undefined") return;
  window.createNebulaModule = async function(opts){ return { destroy(){}, opts: opts||null }; };
})();
