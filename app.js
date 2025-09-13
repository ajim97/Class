async function getVapidPublicKey() {
  const res = await fetch("/vapidPublicKey");
  const { key } = await res.json();
  return key;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

document.getElementById("enable").onclick = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return alert("Permission denied");

  const reg = await navigator.serviceWorker.register("/service-worker.js");
  const key = await getVapidPublicKey();
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key)
  });

  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub)
  });

  alert("Subscribed ✅");
};
