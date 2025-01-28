// Fetch the last 20 posts from an RSS feed using a CORS proxy
async function fetchPosts(feedUrl) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // Convert the response text into an XML document
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");

        // Extract items (posts) from the RSS feed
        const items = xmlDoc.querySelectorAll("item");
        let posts = [];
        
        items.forEach((item, index) => {
            if (index < 20) { // Limit to last 20 posts
                posts.push({
                    title: item.querySelector("title").textContent,
                    link: item.querySelector("link").textContent
                });
            }
        });

        return posts;
    } catch (error) {
        alert("Error fetching posts: " + error.message);
        return [];
    }
}
