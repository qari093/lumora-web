export function scaleCrawler(urls:string[], limit:number=50){
  return urls.slice(0, limit);
}
