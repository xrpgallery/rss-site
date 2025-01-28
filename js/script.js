document.addEventListener("DOMContentLoaded", () => {
    const newFeedBtn = document.getElementById("newFeedBtn");
    const feedList = document.getElementById("feedList");

    newFeedBtn.addEventListener("click", () => {
        const feedTitle = prompt("Enter Feed Title:");
        if (feedTitle) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="feed-title">${feedTitle}</span>
                <span class="status on">On</span>
                <a href="#" class="feed-link">Feeds</a>
            `;
            feedList.appendChild(li);
        }
    });
});
