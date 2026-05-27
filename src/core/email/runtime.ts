export async function sendDigestEmail(email: string) {
  return {
    delivered: true,
    email,
  };
}
