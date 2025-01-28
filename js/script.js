document.addEventListener("DOMContentLoaded", () => {
    const newFeedBtn = document.getElementById("newFeedBtn");
    const feedList = document.getElementById("feedList");

    // Load feeds from localStorage or initialize an empty array
    let feeds = JSON.parse(localStorage.getItem("feeds")) || [];

    // Save feeds to localStorage
    function saveFeeds() {
        localStorage.setItem("feeds", JSON.stringify(feeds));
    }

    // Render feeds on the page
    function renderFeeds() {
        feedList.innerHTML = ""; // Clear existing list
        feeds.forEach((feed, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="feed-title">${feed.title}</span>
                <a href="${feed.link}" target="_blank" class="feed-link">${feed.link}</a>
                <a href="${feed.webhook}" target="_blank" class="webhook-link">${feed.webhook ? "Webhook" : "No Webhook"}</a>
                <span class="status ${feed.status ? 'on' : 'off'}">${feed.status ? 'On' : 'Off'}</span>
                <button class="toggle-btn" data-index="${index}">${feed.status ? 'Disable' : 'Enable'}</button>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            feedList.appendChild(li);
        });
    }

    // Add new feed
    newFeedBtn.addEventListener("click", () => {
        const title = prompt("Enter Feed Title:");
        const link = prompt("Enter Feed Link (URL):");
        const webhook = prompt("Enter Webhook URL (Make.com):");

        if (title && link) {
            feeds.push({ title, link, webhook, status: true });
            saveFeeds();
            renderFeeds();
        } else {
            alert("Title and URL are required.");
        }
    });

    // Handle edit, delete, and toggle status actions
    feedList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        
        if (e.target.classList.contains("edit-btn")) {
            const newTitle = prompt("Edit Feed Title:", feeds[index].title);
            const newLink = prompt("Edit Feed Link (URL):", feeds[index].link);
            const newWebhook = prompt("Edit Webhook URL:", feeds[index].webhook || "");

            if (newTitle && newLink) {
                feeds[index].title = newTitle;
                feeds[index].link = newLink;
                feeds[index].webhook = newWebhook;
                saveFeeds();
                renderFeeds();
            } else {
                alert("Title and URL are required.");
            }

        } else if (e.target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this feed?")) {
                feeds.splice(index, 1);
                saveFeeds();
                renderFeeds();
            }

        } else if (e.target.classList.contains("toggle-btn")) {
            feeds[index].status = !feeds[index].status;
            saveFeeds();
            renderFeeds();
        }
    });

    renderFeeds(); // Populate feeds on page load
});
