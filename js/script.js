document.addEventListener("DOMContentLoaded", () => {
    const newFeedBtn = document.getElementById("newFeedBtn");
    const feedList = document.getElementById("feedList");
    const postListContainer = document.createElement("div");
    postListContainer.id = "postListContainer";
    document.body.appendChild(postListContainer); // Adds the container for displaying posts

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
                <span class="feed-title clickable" data-index="${index}">${feed.title}</span>
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

    // Fetch the last 20 posts from an RSS feed
    async function fetchPosts(feedUrl) {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status !== "ok") throw new Error("Failed to fetch posts");

            return data.items.slice(0, 20); // Return the latest 20 posts
        } catch (error) {
            alert("Error fetching posts: " + error.message);
            return [];
        }
    }

    // Display the last 20 posts
    function displayPosts(feed, posts) {
        postListContainer.innerHTML = `
            <h2>Latest Posts from ${feed.title}</h2>
            <button onclick="document.getElementById('postListContainer').innerHTML = '';">Close</button>
            <ul id="postList">
                ${posts.map((post, index) => `
                    <li>
                        <a href="${post.link}" target="_blank">${post.title}</a>
                        <button class="test-webhook-btn" data-feed="${feed.webhook}" data-title="${post.title}" data-link="${post.link}">Test Webhook</button>
                    </li>
                `).join("")}
            </ul>
        `;

        document.querySelectorAll(".test-webhook-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const webhookUrl = e.target.dataset.feed;
                const postTitle = e.target.dataset.title;
                const postLink = e.target.dataset.link;

                if (webhookUrl) {
                    testWebhook(webhookUrl, postTitle, postLink);
                } else {
                    alert("No webhook URL set for this feed.");
                }
            });
        });
    }

    // Function to send a test webhook
    async function testWebhook(webhookUrl, title, link) {
        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    link: link
                })
            });

            if (response.ok) {
                alert("Webhook sent successfully!");
            } else {
                alert("Webhook failed. Check the URL.");
            }
        } catch (error) {
            alert("Error sending webhook: " + error.message);
        }
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

    // Handle feed actions (Edit, Delete, Toggle)
    feedList.addEventListener("click", async (e) => {
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

        } else if (e.target.classList.contains("feed-title")) {
            const feed = feeds[index];
            const posts = await fetchPosts(feed.link);
            displayPosts(feed, posts);
        }
    });

    renderFeeds(); // Populate feeds on page load
});
