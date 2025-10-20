import CampaignForm from "../../../components/ads/CampaignForm";
export const dynamic = "force-dynamic";
export default function NewCampaignPage(){
  return (
    <div style={{padding:24}}>
      <h1 style={{marginTop:0}}>Create Campaign</h1>
      <CampaignForm />
    </div>
  );
}
