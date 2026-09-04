/* ==============================
   CONVITE DE CASAMENTO
   JavaScript
   ============================== */

const weddingDate = new Date("2027-01-24T15:00:00-03:00");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {
    document.getElementById("countdown").innerHTML =
      '<p style="grid-column:1/-1;font-family:var(--serif);font-size:2rem;">Chegou o nosso grande dia! ❤️</p>';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );
  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );
  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ==============================
   MÚSICA
   ============================== */

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");

musicButton.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicButton.classList.add("playing");
      musicIcon.textContent = "Ⅱ";
      musicButton.setAttribute("aria-label", "Pausar música");
    } else {
      music.pause();
      musicButton.classList.remove("playing");
      musicIcon.textContent = "♫";
      musicButton.setAttribute("aria-label", "Tocar música");
    }
  } catch (error) {
    console.log("Não foi possível iniciar a música:", error);
  }
});


/* ==============================
   ANIMAÇÕES AO ROLAR
   ============================== */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2
  }
);

revealElements.forEach((element) => observer.observe(element));


/* ==============================
   LISTA DE PRESENTES
   ============================== */

// Troque o endereço abaixo pelo link real da lista.

/*
const giftButton = document.getElementById("giftButton");

giftButton.addEventListener("click", (event) => {
  event.preventDefault();

  // Exemplo:
  // window.open("https://www.exemplo.com/lista", "_blank");

  alert("Aqui entrará o link da lista de presentes.");


})*/;
