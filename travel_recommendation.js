// // Fetch travel data
// let travelData = {};

// fetch('travel_recommendation_api.json')
//   .then(response => response.json())
//   .then(data => {
//     travelData = data;
//     console.log('Fetched travel data:', travelData);
//   })
//   .catch(error => console.error('Error fetching data:', error));

// // Event listeners
// document.getElementById('searchBtn').addEventListener('click', handleSearch);
// document.getElementById('clearBtn').addEventListener('click', clearResults);

// function handleSearch() {
//   const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
//   const resultsContainer = document.getElementById('results');
//   resultsContainer.innerHTML = '';

//   if (!keyword) {
//     resultsContainer.innerHTML = '<p>Please enter a keyword (beach, temple, or country name).</p>';
//     return;
//   }

//   let results = [];

//   if (keyword.includes('beach')) {
//     results = travelData.beaches || [];
//   } else if (keyword.includes('temple')) {
//     results = travelData.temples || [];
//   } else {
//     const country = (travelData.countries || []).find(c => c.name.toLowerCase() === keyword);
//     if (country) results = country.cities;
//   }

//   if (results.length === 0) {
//     resultsContainer.innerHTML = '<p>No matching recommendations found.</p>';
//     return;
//   }

//   results.forEach(place => {
//     const card = document.createElement('div');
//     card.classList.add('card');
//     card.innerHTML = `
//       <img src="${place.imageUrl}" alt="${place.name}">
//       <div class="info">
//         <h3>${place.name}</h3>
//         <p>${place.description}</p>
//       </div>
//     `;
//     resultsContainer.appendChild(card);
//   });
// }

// function clearResults() {
//   document.getElementById('searchInput').value = '';
//   document.getElementById('results').innerHTML = '';
// }


// let travelData = {};

// // Fetch API data
// fetch('travel_recommendation_api.json')
//   .then(response => response.json())
//   .then(data => {
//     travelData = data;
//     console.log('Fetched travel data:', travelData);
//   })
//   .catch(error => console.error('Error fetching data:', error));

// // Event listeners
// document.getElementById('searchBtn').addEventListener('click', handleSearch);
// document.getElementById('clearBtn').addEventListener('click', clearResults);

// function handleSearch() {
//   const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
//   const resultsContainer = document.getElementById('results');
//   resultsContainer.innerHTML = '';

//   if (!keyword) {
//     resultsContainer.innerHTML = '<p>Please enter a keyword (beach, temple, or country name).</p>';
//     return;
//   }

//   let results = [];

//   if (keyword.includes('beach')) {
//     results = travelData.beaches || [];
//   } else if (keyword.includes('temple')) {
//     results = travelData.temples || [];
//   } else {
//     const country = (travelData.countries || []).find(c => c.name.toLowerCase() === keyword);
//     if (country) results = country.cities;
//   }

//   if (results.length === 0) {
//     resultsContainer.innerHTML = '<p>No matching recommendations found.</p>';
//     return;
//   }

//   results.forEach(place => {
//     const card = document.createElement('div');
//     card.classList.add('card');
//     card.innerHTML = `
//       <img src="${place.imageUrl}" alt="${place.name}">
//       <div class="info">
//         <h3>${place.name}</h3>
//         <p>${place.description}</p>
//         <p><b>Current Time:</b> ${getLocalTime(place.name)}</p>
//       </div>
//     `;
//     resultsContainer.appendChild(card);
//   });
// }

// function clearResults() {
//   document.getElementById('searchInput').value = '';
//   document.getElementById('results').innerHTML = '';
// }

// // Optional: Time by country
// function getLocalTime(placeName) {
//   const timeZones = {
//     australia: 'Australia/Sydney',
//     japan: 'Asia/Tokyo',
//     brazil: 'America/Sao_Paulo',
//     india: 'Asia/Kolkata',
//     cambodia: 'Asia/Phnom_Penh'
//   };

//   const match = Object.keys(timeZones).find(key => placeName.toLowerCase().includes(key));
//   const tz = timeZones[match] || 'UTC';
//   const options = { timeZone: tz, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
//   return new Date().toLocaleTimeString('en-US', options);
// }
let allRecommendations = [];

document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("clearBtn").addEventListener("click", clearResults);

async function loadRecommendations() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

    // Flatten all categories into one array
    allRecommendations = [
      ...(data.beaches || []),
      ...(data.temples || []),
      ...data.countries.flatMap(c => c.cities || []),
    ];

    renderResults(allRecommendations);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderResults(list) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    resultsContainer.appendChild(card);
  });

  if (list.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  }
}

function handleSearch() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();

  if (!keyword) {
    renderResults(allRecommendations);
    return;
  }

  const filtered = allRecommendations.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.description.toLowerCase().includes(keyword)
  );

  renderResults(filtered);
}

function clearResults() {
  document.getElementById("searchInput").value = "";
  renderResults(allRecommendations);
}

// Load all recommendations on page load
loadRecommendations();
