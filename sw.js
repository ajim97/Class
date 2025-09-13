self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827310.png"
  });
});
