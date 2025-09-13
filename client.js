const publicVapidKey = "BJFH66uMOe78T9fZFpKLQXxrfApBSWkzbt5oxzu43_I_0buXgVilAzim-RSLtSeuQMEetQAToAZzIXq737rS-o8";

if ("serviceWorker" in navigator) {
  document.getElementById("subscribe").addEventListener("click", async () => {
    const register = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" }
    });

    alert("You are subscribed!");
  });
} else {
  alert("Service Worker not supported in this browser.");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
