(async function(){
  async function tick(){
    try{
      await fetch("http://localhost:3000/api/music/reindex",{method:"POST"});
      await fetch("http://localhost:3000/api/trends/ingest",{method:"POST"});
    }catch(_e){}
  }
  await tick();
  setInterval(tick, 10*60*1000);
})();
