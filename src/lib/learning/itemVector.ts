export function buildItemVector(item:any){
  return [
    Number(item?.final_score||0),
    item?.media_type === "video" ? 1 : 0,
    item?.media_type === "youtube" ? 1 : 0,
    item?.media_type === "embed" ? 1 : 0
  ];
}
