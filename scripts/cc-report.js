import fs from "fs";
const path="cc-tower-report.json";
if(!fs.existsSync(path)){ console.error("No cc-tower-report.json"); process.exit(1); }
const data=JSON.parse(fs.readFileSync(path,"utf8"));
console.log("==== CC TOWER REPORT ====");
console.log(JSON.stringify(data,null,2));
if(!data.ok) process.exit(1);
