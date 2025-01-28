document.addEventListener("DOMContentLoaded", () => {
    const newFeedBtn = document.getElementById("newFeedBtn");
    const feedList = document.getElementById("feedList");

    // Load feeds from localStorage
    let feeds = JSON.parse(localStorage.getItem("feeds")) || [];

    function saveFeeds() {
        localStorage.setItem("feeds", JSON.stringify(feeds));
    }

    function renderFeeds() {
        feedList.innerHTML = ""; // Clear existing list
        feeds.forEach((feed, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="feed-title">${feed.title}</span>
                <a href="${feed.link}" target="_blank" class="feed-link">Go to Feed</a>
                <span class="status ${feed.status ? 'on' : 'off'}">${feed.status ? 'On' : 'Off'}</span>
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

        if (title && link) {
            feeds.push({ title, link, status: true });
            saveFeeds();
            renderFeeds();
        }
    });

    // Edit or Delete a feed
    feedList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-btn")) {
            const newTitle = prompt("Edit Feed Title:", feeds[index].title);
            const newLink = prompt("Edit Feed Link (URL):", feeds[index].link);

            if (newTitle && newLink) {
                feeds[index].title = newTitle;
                feeds[index].link = newLink;
                saveFeeds();
                renderFeeds();
            }
        } else if (e.target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this feed?")) {
                feeds.splice(index, 1);
                saveFeeds();
                renderFeeds();
            }
        }
    });

    renderFeeds(); // Populate feeds on page load
});
