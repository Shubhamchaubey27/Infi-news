const API_KEY = "ebb4f03b65b54b779a16a14c8994ec16";
const url = "https://newsapi.org/v2/everything?q=";

let currentPage = 1;
let currentQuery = "India";
let isFetching = false;

// Fetch news on page load
window.addEventListener("load", () => {
    fetchNews(currentQuery, currentPage);
});

// Reload page function
function reload() {
    window.location.reload();
}

// Fetch news function
async function fetchNews(query, page) {
    if (!query) return alert("Please enter a valid search term!");
    if (isFetching) return;

    isFetching = true;
    try {
        const res = await fetch(`${url}${query}&page=${page}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        
        const data = await res.json();
        if (!data.articles.length) throw new Error("No news articles found!");

        bindData(data.articles);
    } catch (error) {
        console.error(error);
        alert("Failed to fetch news. Please try again later.");
    }
    isFetching = false;
}

// Bind data to cards
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear previous articles if it's a new query
    if (currentPage === 1) {
        cardsContainer.innerHTML = '';
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill news card data
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description || "No description available.";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Handle navigation click
let curSelectedNav = null;
function onNavItemClick(id) {
    currentQuery = id;
    currentPage = 1;
    fetchNews(currentQuery, currentPage);

    // Update active state
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");

    // Close menu on mobile after selection
    navLinks.classList.remove("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return alert("Please enter a search term!");
    
    currentQuery = query;
    currentPage = 1;
    fetchNews(currentQuery, currentPage);

    // Remove active nav highlight
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// News Type Selection (Local / International)
const newsTypeButton = document.getElementById("news-type-button");
newsTypeButton.addEventListener("click", () => {
    const newsType = prompt("Enter 'local' for local news or 'international' for international news:");
    
    if (newsType?.toLowerCase() === 'local') {
        currentQuery = prompt("Please enter your country name:") || "India";
    } else if (newsType?.toLowerCase() === 'international') {
        currentQuery = "international";
    } else {
        alert("Invalid input. Showing news from India by default.");
        currentQuery = "India";
    }

    currentPage = 1;
    fetchNews(currentQuery, currentPage);
});

// Infinite Scroll for Loading More News
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isFetching) {
        currentPage++;
        fetchNews(currentQuery, currentPage);
    }
});

// Mobile Navigation Toggle (Fixed)
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click from reaching document event
    navLinks.classList.toggle("active");
});

// Close menu when clicking outside (Fixed)
document.addEventListener("click", (event) => {
    if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove("active");
    }
});
