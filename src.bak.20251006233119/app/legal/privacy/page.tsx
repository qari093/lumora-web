export default function Privacy(){
  return <div style={{padding:20}}>
    <h1>Privacy Policy</h1>
    <p>We store account data (email, name), usage analytics, and content you upload. Cookies are used for auth, payments, and CSRF protection.</p>
    <p>Third parties: payment processing (Stripe), error monitoring (Sentry), media storage (S3/R2).</p>
    <p>Request deletion or export: privacy@lumora.app</p>
  </div>;
}
