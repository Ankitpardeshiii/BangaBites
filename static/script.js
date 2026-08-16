// =========================================================
// BangaBites — Frontend Logic
// =========================================================

const form             = document.getElementById("recommendationForm");
const button           = document.getElementById("recommendButton");
const buttonText       = document.getElementById("buttonText");
const loader           = document.getElementById("loader");
const resultsSection   = document.getElementById("resultsSection");
const resultsCount     = document.getElementById("resultsCount");
const featuredResult   = document.getElementById("featuredResult");
const resultsContainer = document.getElementById("resultsContainer");
const errorMessage     = document.getElementById("errorMessage");
const restaurantInput  = document.getElementById("restaurant");
const suggestionsBox   = document.getElementById("restaurantSuggestions");

// =========================================================
// POPULAR SEARCH CHIPS
// =========================================================
function setRestaurant(name) {
    restaurantInput.value = name;
    suggestionsBox.classList.add("hidden");
    restaurantInput.focus();
}

// =========================================================
// AUTOCOMPLETE
// =========================================================
let searchTimeout;

restaurantInput.addEventListener("input", function () {
    const query = restaurantInput.value.trim();
    clearTimeout(searchTimeout);

    if (query.length < 2) {
        suggestionsBox.innerHTML = "";
        suggestionsBox.classList.add("hidden");
        return;
    }

    searchTimeout = setTimeout(async function () {
        try {
            const res = await fetch(`/api/restaurants?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Search failed");
            const restaurants = await res.json();

            suggestionsBox.innerHTML = "";
            if (!restaurants || restaurants.length === 0) {
                suggestionsBox.classList.add("hidden");
                return;
            }

            restaurants.forEach(function (r) {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.innerHTML = `
                    <strong>${escapeHTML(r.name)}</strong>
                    <span>📍 ${escapeHTML(r.location || "Location unavailable")}</span>
                `;
                item.addEventListener("click", function () {
                    restaurantInput.value = r.name;
                    suggestionsBox.classList.add("hidden");
                    suggestionsBox.innerHTML = "";
                });
                suggestionsBox.appendChild(item);
            });

            suggestionsBox.classList.remove("hidden");
        } catch (err) {
            console.error("Autocomplete error:", err);
            suggestionsBox.classList.add("hidden");
        }
    }, 280);
});

document.addEventListener("click", function (e) {
    if (!restaurantInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.add("hidden");
    }
});

// =========================================================
// FORM SUBMIT
// =========================================================
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const restaurant = restaurantInput.value.trim();
    const location   = document.getElementById("location").value.trim();
    const minRating  = document.getElementById("min_rating").value;
    const maxCost    = document.getElementById("max_cost").value;
    const topN       = document.getElementById("top_n").value;

    if (!restaurant) {
        showError("Please enter a restaurant name to search.");
        return;
    }

    hideError();
    resultsSection.classList.add("hidden");
    featuredResult.innerHTML = "";
    resultsContainer.innerHTML = "";
    setLoading(true);

    try {
        const params = new URLSearchParams();
        params.append("restaurant", restaurant);
        if (location)  params.append("location", location);
        if (minRating) params.append("min_rating", minRating);
        if (maxCost)   params.append("max_cost", maxCost);
        params.append("top_n", topN);

        const res  = await fetch(`/api/recommend?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Unable to fetch recommendations.");

        if (!data.recommendations || data.recommendations.length === 0) {
            showEmptyState();
            return;
        }

        displayResults(data);

    } catch (err) {
        console.error("Recommendation error:", err);
        showError(err.message || "Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
});

// =========================================================
// DISPLAY RESULTS
// =========================================================
function displayResults(data) {
    featuredResult.innerHTML = "";
    resultsContainer.innerHTML = "";

    resultsCount.innerHTML = `Based on your love for <strong>${escapeHTML(data.restaurant)}</strong>.`;

    // #1 — Featured card
    if (data.recommendations.length > 0) {
        featuredResult.appendChild(createFeaturedCard(data.recommendations[0]));
    }

    // Rest — grid cards
    for (let i = 1; i < data.recommendations.length; i++) {
        resultsContainer.appendChild(createRecCard(data.recommendations[i], i));
    }

    resultsSection.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showEmptyState() {
    resultsContainer.innerHTML = `
        <div class="empty-state">
            <i data-lucide="search-x"></i>
            <h3>No perfect matches</h3>
            <p>Try expanding your budget, adjusting the rating threshold, or removing the location filter.</p>
        </div>
    `;
    resultsCount.innerHTML = "";
    resultsSection.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =========================================================
// FEATURED CARD (#1 RESULT)
// =========================================================
function createFeaturedCard(r) {
    const pct = clampScore(r.final_score);

    let reasons = `<div class="feat-reason"><i data-lucide="check-circle-2"></i> Excellent Match</div>`;
    if (r.similarity_score  > 0.8) reasons += `<div class="feat-reason"><i data-lucide="check-circle-2"></i> Highly similar cuisine to your choice</div>`;
    if (r.popularity_score  > 0.8) reasons += `<div class="feat-reason"><i data-lucide="check-circle-2"></i> Extremely popular in Bengaluru</div>`;
    if (r.price_score       > 0.8) reasons += `<div class="feat-reason"><i data-lucide="check-circle-2"></i> Fits perfectly in your budget</div>`;

    const zomato = r.url
        ? `<a href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer" class="feat-btn">View on Zomato <i data-lucide="external-link"></i></a>`
        : "";

    const card = document.createElement("div");
    card.className = "featured-card";
    card.innerHTML = `
        <div class="feat-visual">
            <span class="feat-number">#1</span>
            <i data-lucide="utensils-crossed" class="feat-icon-huge"></i>
        </div>
        <div class="feat-content">
            <div class="feat-match"><i data-lucide="target"></i> ${pct}% MATCH</div>
            <h3 class="feat-title">${escapeHTML(r.name || "Unknown")}</h3>
            <div class="feat-meta">
                <div><i data-lucide="map-pin"></i> ${escapeHTML(r.location || "Location unavailable")}</div>
                <div><i data-lucide="star" style="color:#F59E0B"></i> ${r.rate || "N/A"}</div>
                <div><i data-lucide="indian-rupee"></i> ${r["approx_cost(for two people)"] || "N/A"} for two</div>
            </div>
            <div class="feat-reasons">${reasons}</div>
            ${zomato}
        </div>
    `;
    return card;
}

// =========================================================
// REC CARD
// =========================================================
function createRecCard(r, index) {
    const pct = clampScore(r.final_score);

    const zomato = r.url
        ? `<a href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer" class="rec-zomato">View on Zomato <i data-lucide="external-link"></i></a>`
        : "";

    const card = document.createElement("div");
    card.className = "rec-card";
    card.innerHTML = `
        <div class="rec-top">
            <div>
                <div class="restaurant-rank">#${index + 1} Recommendation</div>
                <h4 class="rec-title">${escapeHTML(r.name || "Unknown")}</h4>
                <div class="rec-location"><i data-lucide="map-pin" style="width:14px;height:14px"></i> ${escapeHTML(r.location || "Location unavailable")}</div>
            </div>
            <div class="score-ring" style="--percentage:${pct}%">
                <span>${pct}%</span>
            </div>
        </div>
        <div class="rec-stats">
            <div class="rec-stat"><i data-lucide="star" style="color:#F59E0B;width:14px;height:14px"></i> ${r.rate || "N/A"}</div>
            <div class="rec-stat"><i data-lucide="indian-rupee" style="width:14px;height:14px"></i> ${r["approx_cost(for two people)"] || "N/A"}</div>
            <div class="rec-stat"><i data-lucide="utensils" style="width:14px;height:14px"></i> ${escapeHTML(r.cuisines || "N/A")}</div>
        </div>
        ${zomato}
    `;
    return card;
}

// =========================================================
// LOADING STATE
// =========================================================
function setLoading(on) {
    button.disabled = on;
    buttonText.textContent = on ? "Finding places..." : "Find My Restaurants";
    loader.classList.toggle("hidden", !on);
}

// =========================================================
// ERROR HANDLING
// =========================================================
function showError(msg) {
    errorMessage.innerHTML = `<i data-lucide="alert-circle"></i> ${msg}`;
    errorMessage.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
}
function hideError() {
    errorMessage.classList.add("hidden");
    errorMessage.innerHTML = "";
}

// =========================================================
// UTILS
// =========================================================
function clampScore(raw) {
    const n = Number(raw || 0);
    return Math.min(Math.max(Math.round(n * 100), 0), 100);
}

function escapeHTML(val) {
    const d = document.createElement("div");
    d.textContent = String(val);
    return d.innerHTML;
}
