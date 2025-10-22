const popups = [
  { 
    title: "💾 System Alert", 
    message: "Your PC might be infected! Click OK to scan.", 
    image: null 
  },
  { 
    title: "🌈 Free RAM Booster", 
    message: "Add +256MB RAM instantly. Limited offer!", 
    image: "https://i.imgur.com/9bK0k3Q.gif" 
  },
  { 
    title: "🔔 Message from Admin", 
    message: "Don't forget to complete your tasks today!", 
    image: null 
  },
  { 
    title: "🚀 Update Available", 
    message: "Windows XP SP3 Vaporwave Edition is ready to install.", 
    image: "https://i.imgur.com/fyVYvJz.gif" 
  },
];

function createPopup() {
  const popup = popups[Math.floor(Math.random() * popups.length)];

  const div = document.createElement("div");
  div.className = "popup-window";

  div.innerHTML = `
    <div class="popup-header">
      <span>${popup.title}</span>
      <button class="close-btn">X</button>
    </div>
    <div class="popup-body">
      ${popup.image ? `<img src="${popup.image}" alt="popup" />` : ""}
      <p>${popup.message}</p>
      <button class="ok-btn">OK</button>
    </div>
  `;

  document.body.appendChild(div);

  div.querySelector(".close-btn").onclick = () => div.remove();
  div.querySelector(".ok-btn").onclick = () => div.remove();
}

// Cria popups aleatórios a cada 20s
setInterval(() => {
  if (Math.random() < 0.5) createPopup();
}, 20000);
