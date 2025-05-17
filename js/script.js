// Main JavaScript for Search Engine functionality
console.log("Bevel (C) Starry Systems 2025. Authored by Ben H.");
console.log("Starting DOM!");

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResultsSection = document.getElementById(
        "search-results-section",
    );
    const loadingIndicator = document.getElementById("loading-indicator");
    const featuresSection = document.getElementById("features-section");
    const clearSearchBtn = document.getElementById("clear-search");
    const resultsTitle = document.getElementById("results-title");
    const quickLinks = document.querySelectorAll(".quick-link");

    // Debug logging
    console.log("DOM loaded and search elements initialized");

    // Function to execute search (redirects to Google CSE results page)
    function executeSearch(query) {
        if (!query || query.trim() === "") {
            return;
        }

        console.log("Executing search for:", query);

        // Set the search input value
        searchInput.value = query;

        // Submit the form (will open in new tab)
        searchForm.submit();
    }

    // We don't need to handle form submission anymore as the Google CSE handles it
    // Instead, let's observe when searches happen and show/hide sections accordingly

    // Setup an observer for when search results appear
    const observer = new MutationObserver((mutations) => {
        if (
            document.querySelector(
                ".gsc-results-wrapper-visible, .gsc-results-wrapper-overlay",
            )
        ) {
            // Results are visible, make sure our containers are properly set
            featuresSection.style.display = "none";
            searchResultsSection.style.display = "block";
            loadingIndicator.style.display = "none";
        }
    });

    // Start observing once the Google CSE is loaded
    window.addEventListener("load", () => {
        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true });
        console.log("Google CSE loaded, observer started.");
    });

    // Handle quick link clicks
    quickLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const query = this.getAttribute("data-search");

            // Find the Google CSE input and set the query
            const gscInput = document.querySelector(".gsc-input");
            if (gscInput) {
                // Set the input value
                gscInput.value = query;

                // Find and click the search button
                const gscButton = document.querySelector(
                    ".gsc-search-button button, .gsc-search-button-v2",
                );
                if (gscButton) {
                    // Hide features section and show loading
                    featuresSection.style.display = "none";
                    loadingIndicator.style.display = "block";

                    // Click the button
                    gscButton.click();

                    // Update the results title
                    searchResultsSection.style.display = "block";
                    resultsTitle.textContent = `Search Results for: "${query}"`;

                    // Scroll to results
                    setTimeout(() => {
                        loadingIndicator.style.display = "none";
                        searchResultsSection.scrollIntoView({
                            behavior: "smooth",
                        });
                    }, 1000);
                }
            }
        });
    });

    // Handle clear search button
    clearSearchBtn.addEventListener("click", function () {
        // Clear Google CSE input if it exists
        const gscInput = document.querySelector(".gsc-input");
        if (gscInput) {
            gscInput.value = "";
        }

        // Hide results section with animation
        searchResultsSection.classList.add("fade-out");

        setTimeout(() => {
            searchResultsSection.style.display = "none";
            searchResultsSection.classList.remove("fade-out");

            // Show features section again
            featuresSection.style.display = "block";
            featuresSection.classList.add("fade-in");

            setTimeout(() => {
                featuresSection.classList.remove("fade-in");
            }, 500);
        }, 500);
    });

    // Handle Google CSE initialization callback
    window.__gcse = window.__gcse || {};
    window.__gcse.callback = function () {
        // This function is called when the CSE has been initialized
        googleSearchInitialized = true;

        // Check if we have a pending query to execute
        if (window.__gcse.pendingQuery) {
            console.log("Executing pending query:", window.__gcse.pendingQuery);
            executeSearch(window.__gcse.pendingQuery);
            window.__gcse.pendingQuery = null;
        } else {
            // Check if we need to execute a search on page load (e.g., from URL parameters)
            const urlParams = new URLSearchParams(window.location.search);
            const queryParam = urlParams.get("q");

            if (queryParam) {
                executeSearch(queryParam);
            }
        }
    };

    // Function to handle keyboard shortcuts
    function handleKeyboardShortcuts(e) {
        // Focus on search input when / is pressed and not already focused in an input
        if (
            e.key === "/" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
        ) {
            e.preventDefault();
            // Focus on Google CSE input
            const gscInput = document.querySelector(".gsc-input");
            if (gscInput) {
                gscInput.focus();
            }
        }

        // Clear search with Escape key when focused on Google search input
        const gscInput = document.querySelector(".gsc-input");
        if (e.key === "Escape" && document.activeElement === gscInput) {
            clearSearchBtn.click();
            console.log("CSE Bar cleared.");
        }
    }

    // Add keyboard shortcut listener
    document.addEventListener("keydown", handleKeyboardShortcuts);

    // We no longer need focus animation for the custom search input
    // as we're now using the Google CSE search input

    // Ensure responsive behavior for Google CSE
    window.addEventListener("resize", function () {
        // Adjust Google CSE container if needed
        const cseContainer = document.querySelector(".gsc-control-cse");
        if (cseContainer) {
            cseContainer.style.width = "100%";
        }
    });

    // Helper function to handle search errors
    function handleSearchError() {
        loadingIndicator.style.display = "none";
        searchResultsSection.style.display = "block";

        // Display error message
        console.log("Error Detected! Serving alert-warning to user...");
        document.getElementById("search-results").innerHTML = `
            <div class="alert alert-warning" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Sorry, there was a problem with your search. Please try again.
            </div>
        
        `;
    }

    // Setup observer to detect when Google CSE has loaded results
    const observeGoogleResults = () => {
        const observer = new MutationObserver((mutations) => {
            const resultsContainer = documenst.querySelector(
                ".gsc-results-wrapper-overlay, .gsc-results-wrapper-visible",
            );
            if (resultsContainer) {
                loadingIndicator.style.display = "none";
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    };

    // Start observing once the page is fully loaded
    window.addEventListener("load", observeGoogleResults);
    console.log("Page fully loaded! Dropping observeGoogleResults!");
});
