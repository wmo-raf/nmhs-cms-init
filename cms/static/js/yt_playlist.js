function compare(a, b) {
    if (a.snippet.postion > b.snippet.postion) {
        return 1;
    }
    if (a.snippet.postion < b.snippet.postion) {
        return -1;
    }
    return 0;
}

// Define a function to fetch videos from the playlist using the API key, playlist ID, and optional nextPageToken
function fetchPlaylistVideos(nextPageToken = '') {
    // Construct the URL to fetch videos from the playlist using the API key, playlist ID, and nextPageToken, and sort by position in reverse order
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YT_API_KEY}&order=position&reverse=true&pageToken=${nextPageToken}`;

    // Fetch the videos from the playlist using the constructed URL
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Loop through each video item in the data response and log the title and video ID


            // If a nextPageToken is available, fetch the next page of results
            if (data.nextPageToken) {
                fetchPlaylistVideos(data.nextPageToken);
            } else {

                document.getElementById('youtube_playlist').innerHTML = ''
                
                data.items.slice(Math.max(data.items.length - 3, 1)).sort((a, b) => b.snippet.position - a.snippet.position).forEach(video => {
                    // const videoTitle = item.snippet.title;
                    // const videoId = item.snippet.resourceId.videoId;
                    // const position = item.snippet.position;
                    
                    document.getElementById('youtube_playlist').innerHTML += ` <div class="column is-4 is-full-mobile video-item">
                    <div class="card m-2" style="border-radius: 1em">
                        <div class="card-image">
                            <figure class="image" style="display:flex">
                                <iframe style="flex-grow: 1;" height="200"
                                        src="https://www.youtube.com/embed/${video.snippet.resourceId.videoId}" allowfullscreen>
                                </iframe>
                            </figure>
                        </div>
                        <div class="card-content">
                            <a class="card-tag-float pb-0" style="background-color:rgb(62,142,208); border-radius:var(--border-radius)">
                                <p style="font-size:14px">
                                    <span> ${video.snippet.publishedAt} </span>
                                </p>
                            </a>
                            <a class="card-title pt-5 pb-0">
                                <p style="font-size:15px; font-weight:700;">
                                    ${video.snippet.title}
                                </p>
                            </a>
                        </div>
                    </div>
                </div>`
                });
            }
        })
        .catch(error => console.error(error));
}

// Fetch the first page of results
fetchPlaylistVideos();