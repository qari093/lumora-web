export function validateResponse(items:any[]){
  return Array.isArray(items) ? items : [];
}
