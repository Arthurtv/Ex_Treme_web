// 🔧 Firebase config
    const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    async function loadMovies() {
      const grid = document.getElementById("movieGrid");
      const snapshot = await db.collection("movies").orderBy("last_updated", "desc").get();

      snapshot.forEach(doc => {
        const movie = doc.data();
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${movie.poster}" alt="Poster">
          <div class="info">
            <h3>${movie.title}</h3>
            <span>${movie.year} • ⭐ ${movie.rating}</span>
          </div>
        `;
        card.onclick = () => showModal(movie);
        grid.appendChild(card);
      });
    }

    function showModal(movie) {
      document.getElementById("modalTitle").innerText = movie.title;
      document.getElementById("modalYear").innerText = movie.year;
      document.getElementById("modalGenres").innerText = movie.genres.join(", ");
      document.getElementById("modalRuntime").innerText = movie.runtime;
      document.getElementById("modalRating").innerText = movie.rating;
      document.getElementById("modalOverview").innerText = movie.overview;
      document.getElementById("modalLink").href = movie.player_link;
      document.getElementById("movieModal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("movieModal").style.display = "none";
    }

    loadMovies();