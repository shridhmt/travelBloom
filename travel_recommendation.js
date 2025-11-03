// Load reusable header
async function loadHeader() {
  const headerContainer = document.getElementById("header");
  const response = await fetch("header.html");
  const headerHTML = await response.text();
  headerContainer.innerHTML = headerHTML;

  // Highlight active link
  const path = window.location.pathname.split("/").pop();
  if (path.includes("about")) document.getElementById("nav-about").classList.add("active");
  else if (path.includes("contact")) document.getElementById("nav-contact").classList.add("active");
  else document.getElementById("nav-home").classList.add("active");

  // Attach search listeners after header loads
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);
  if (clearBtn) clearBtn.addEventListener("click", clearResults);
}

let allRecommendations = [];

async function loadRecommendations() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

    allRecommendations = [
      ...(data.beaches || []),
      ...(data.temples || []),
      ...data.countries.flatMap(c => c.cities || []),
    ];

    if (document.getElementById("results")) renderResults(allRecommendations);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderResults(list) {
  const resultsContainer = document.getElementById("results");
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  if (list.length === 0) {
    resultsContainer.innerHTML = `<p class="fade-in">No results found.</p>`;
    return;
  }

  list.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" />
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}

function handleSearch() {
  const keyword = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
  const resultsContainer = document.getElementById("results");
  if (!resultsContainer) return;

  if (!keyword) {
    renderResults(allRecommendations);
    return;
  }

  const filtered = allRecommendations.filter(
    item =>
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
  );

  renderResults(filtered);
}

function clearResults() {
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  renderResults(allRecommendations);
}

// Initialize header + data
loadHeader().then(loadRecommendations);
