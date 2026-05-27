export function mapProfileToFeedWeights(profile:any){
  return {
    watch: profile?.interests?.watch || 0,
    skip: profile?.interests?.skip || 0,
    youtube: profile?.interests?.youtube || 0,
    video: profile?.interests?.video || 0,
    embed: profile?.interests?.embed || 0,
  };
}
