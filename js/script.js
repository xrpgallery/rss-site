document.addEventListener("DOMContentLoaded", () => {
    const feedForm = document.getElementById("feedForm");
    const feedList = document.getElementById("feedList");

    const feeds = JSON.parse(localStorage.getItem("feeds")) || [];

    // Render feeds
    function renderFeeds() {
        feedList.innerHTML = "";
        feeds.forEach((feed, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>Title:</strong> ${feed.title}<br>
                <strong>Link:</strong> <a href="${feed.link}" target="_blank">${feed.link}</a><br>
                <strong>Webhook:</strong> <a href="${feed.webhook}" target="_blank">${feed.webhook}</a><br>
                <strong>Schedule:</strong> Every ${feed.schedule} hours
                <button data-index="${index}" class="deleteBtn">Delete</button>
            `;
            feedList.appendChild(li);
        });
    }

    // Add new feed
    feedForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("feedTitle").value;
        const link = document.getElementById("feedLink").value;
        const webhook = document.getElementById("webhookLink").value;
        const schedule = document.getElementById("schedule").value;

        feeds.push({ title, link, webhook, schedule });
        localStorage.setItem("feeds", JSON.stringify(feeds));

        renderFeeds();
        feedForm.reset();
    });

    // Delete feed
    feedList.addEventListener("click", (e) => {
        if (e.target.classList.contains("deleteBtn")) {
            const index = e.target.dataset.index;
            feeds.splice(index, 1);
            localStorage.setItem("feeds", JSON.stringify(feeds));
            renderFeeds();
        }
    });

    renderFeeds();
});
