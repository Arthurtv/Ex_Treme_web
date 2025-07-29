// ✅ Firebase Config direto do HTML
const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
  storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.env.FIREBASE_APP_ID,
};

// 🔧 Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 📦 Carrega os filmes do Firestore
async function loadMovies() {
  const grid = document.getElementById("movieGrid");
  grid.innerHTML = "<p>Carregando filmes...</p>";

  try {
    const snapshot = await db.collection("movies").orderBy("last_updated", "desc").get();
    grid.innerHTML = "";

    if (snapshot.empty) {
      grid.innerHTML = "<p>Nenhum filme encontrado.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const movie = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}">
        <div class="info">
          <h3>${movie.title}</h3>
          <span>${movie.year} • ⭐ ${movie.rating}</span>
        </div>
      `;
      card.onclick = () => showModal(movie);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar filmes:", error);
    grid.innerHTML = "<p>Erro ao carregar filmes.</p>";
  }
}

// 🎬 Mostra o modal com detalhes
function showModal(movie) {
  document.getElementById("modalTitle").innerText = movie.title;
  document.getElementById("modalYear").innerText = movie.year;
  document.getElementById("modalGenres").innerText = movie.genres?.join(", ") || "Desconhecido";
  document.getElementById("modalRuntime").innerText = movie.runtime || "N/A";
  document.getElementById("modalRating").innerText = movie.rating;
  document.getElementById("modalOverview").innerText = movie.overview;
  document.getElementById("modalLink").href = movie.player_link;
  document.getElementById("movieModal").style.display = "flex";
}

// ❌ Fecha o modal
function closeModal() {
  document.getElementById("movieModal").style.display = "none";
}

// Listener do botão de fechar
document.getElementById("closeModal").addEventListener("click", closeModal);

// ▶️ Inicia o carregamento
loadMovies();
