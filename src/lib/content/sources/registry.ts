import { ContentSource } from "../types/source";

export const SOURCE_REGISTRY: ContentSource[] = [

  { id:"nasa", name:"NASA", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:10 },
  { id:"esa", name:"ESA", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:10 },
  { id:"eso", name:"ESO", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:10 },
  { id:"hubble", name:"ESA/Hubble", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:10 },

  { id:"internet-archive", name:"Internet Archive", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:9 },
  { id:"prelinger", name:"Prelinger Archives", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:9 },
  { id:"fedflix", name:"FedFlix", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:9 },

  { id:"loc", name:"Library of Congress", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:9 },
  { id:"smithsonian", name:"Smithsonian", license:"cc0", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:9 },
  { id:"europeana", name:"Europeana", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:8 },

  { id:"open-images", name:"Open Images", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:8 },
  { id:"wikimedia", name:"Wikimedia Commons", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:8 },

  { id:"pexels", name:"Pexels", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:9 },
  { id:"pixabay", name:"Pixabay", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:9 },
  { id:"coverr", name:"Coverr", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:9 },
  { id:"mixkit", name:"Mixkit", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:9 },

  { id:"dareful", name:"Dareful", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:8 },
  { id:"distill", name:"Distill", license:"cc0", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:8 },
  { id:"life-of-vids", name:"Life of Vids", license:"cc0", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:8 },
  { id:"splitshire", name:"SplitShire", license:"cc0", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:8 },

  { id:"pond5", name:"Pond5 PD", license:"public-domain", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },
  { id:"mazwai", name:"Mazwai", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },
  { id:"free-stock-footage", name:"Free Stock Footage Archive", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },
  { id:"beachfront", name:"Beachfront B-Roll", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },
  { id:"cutestock", name:"CuteStockFootage", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },

  { id:"aljazeera", name:"Al Jazeera CC", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:8 },
  { id:"gongu", name:"GongU Madang", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },
  { id:"digitalnz", name:"DigitalNZ", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },

  { id:"noaa", name:"NOAA", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:9 },
  { id:"usgs", name:"USGS", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:9 },

  { id:"pdr", name:"Public Domain Review", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:8 },
  { id:"free-nature", name:"Free Nature Stock", license:"cc0", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:8 },
  { id:"natureclip", name:"NatureClip", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:false, priority:8 },
  { id:"wellcome", name:"Wellcome Collection", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:8 },

  { id:"euscreen", name:"EUscreen", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:7 },
  { id:"padma", name:"Pad.ma", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:7 },

  { id:"vidsplay", name:"Vidsplay", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },
  { id:"videvo", name:"Videvo", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:7 },

  { id:"clacso", name:"CLACSO TV", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:6 },
  { id:"aodl", name:"Africa Online Digital Library", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:6 },

  { id:"libreflix", name:"Libreflix", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:6 },
  { id:"nhk", name:"NHK Creative Library", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:6 },
  { id:"nfsa", name:"NFSA Film Australia", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:false, priority:6 },

  { id:"prasar", name:"Prasar Bharati", license:"public-domain", attributionRequired:false, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:7 },

  { id:"youtube", name:"YouTube Official", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:9 },
  { id:"vimeo", name:"Vimeo CC", license:"cc-by", attributionRequired:true, commercialUse:true, requiresPerItemCheck:true, embedAllowed:true, priority:8 },

  { id:"lumora", name:"Lumora Owned", license:"platform-safe", attributionRequired:false, commercialUse:true, requiresPerItemCheck:false, embedAllowed:true, priority:10 }

];
