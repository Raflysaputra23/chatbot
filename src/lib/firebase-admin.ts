import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.NEXT_PUBLIC_TYPE,
      project_id: process.env.NEXT_PUBLIC_PROJECTID,
      private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEYID,
      private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY,
      client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      client_id: process.env.NEXT_PUBLIC_CLIENTID,
      auth_uri: process.env.NEXT_PUBLIC_AUTH_URI,
      token_uri: process.env.NEXT_PUBLIC_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
      client_x509_cert_url: process.env.NEXT_PUBLIC_CLIENT_URL,
      universe_domain: process.env.NEXT_PUBLIC_UNIVERSE_DOMAIN,
    } as admin.ServiceAccount),
  });
}

export const adminAuth = admin.auth();
