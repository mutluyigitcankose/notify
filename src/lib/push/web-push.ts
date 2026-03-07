import webPush from "web-push";

let configured = false;

export function configureWebPush() {
  if (configured) {
    return;
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const contactEmail = process.env.VAPID_CONTACT_EMAIL;

  if (!publicKey || !privateKey || !contactEmail) {
    throw new Error("VAPID anahtarları veya iletişim e-postası eksik.");
  }

  webPush.setVapidDetails(`mailto:${contactEmail}`, publicKey, privateKey);
  configured = true;
}
