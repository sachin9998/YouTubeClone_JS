const API_KEY = "AIzaSyDH0cbvLDsgbisRlO9XL_lVP89s9zwhzpc";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

/*
    {
        "kind": "youtube#searchListResponse",
        "etag": "Y11Y-7jglo5h1BCzYMK5QxcqO3g",
        "nextPageToken": "CAIQAA",
        "regionCode": "IN",
        "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 2
    },
    "items": [
    {
    "kind": "youtube#searchResult",
    "etag": "cbrNHcDxZC5CIbxXgUeBFqGzQ2w",
    "id": {
        "kind": "youtube#channel",
        "channelId": "UCt2JXOLNxqry7B_4rRZME3Q"
    },
    "snippet": {
        "publishedAt": "2012-08-03T08:37:23Z",
        "channelId": "UCt2JXOLNxqry7B_4rRZME3Q",
        "title": "ICC",
        "description": "This is the official ICC YouTube channel. The ICC is the governing body of international cricket. Our Vision of Success As a ...",
        "thumbnails": {
        "default": {
            "url": "https://yt3.ggpht.com/3K6h6gpMPf4mK9qh6SXTl0W3PLxnOMzUnFHc2lbS9t-ucS-b4JGcR8nW7ja9XDYkHM-kAnijk2c=s88-c-k-c0xffffffff-no-rj-mo"
        },
        "medium": {
            "url": "https://yt3.ggpht.com/3K6h6gpMPf4mK9qh6SXTl0W3PLxnOMzUnFHc2lbS9t-ucS-b4JGcR8nW7ja9XDYkHM-kAnijk2c=s240-c-k-c0xffffffff-no-rj-mo"
        },
        "high": {
            "url": "https://yt3.ggpht.com/3K6h6gpMPf4mK9qh6SXTl0W3PLxnOMzUnFHc2lbS9t-ucS-b4JGcR8nW7ja9XDYkHM-kAnijk2c=s800-c-k-c0xffffffff-no-rj-mo"
        }
        },
        "channelTitle": "ICC",
        "liveBroadcastContent": "upcoming",
        "publishTime": "2012-08-03T08:37:23Z"
    }
    }
    ]
    }
*/

// console.log('rishi');


// --------------------------------------------------------------------------------------------------

// Getting first page videos:-
async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  // console.log(data.items);
  videoList(data.items)
}


const videos = document.getElementById('videos')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')


async function videoList(arrayOfVideos){
  // console.log(arrayOfVideos);
  videos.innerHTML = ""
  processVideos(arrayOfVideos);
 
  // arrayOfVideos.forEach (element => {
  //   // console.log(element.snippet.channelId);

  //   let channelLogo = await getChannelLogo(element.snippet.channelId);

  //   let card = document.createElement('div')
  //   card.id = 'card';
  //   card.innerHTML = `
  //   <div><img class="thumbnail" src="${element.snippet.thumbnails.medium.url}" width="${element.snippet.thumbnails.medium.width}px" height="${element.snippet.thumbnails.medium.height}px" alt="thumbnail"></div>
                
  //   <div class="card-Bottom">
  //       <div class="logo">
  //           <img src="${getChannelLogo(element.snippet.channelId)}" alt="logo">
  //       </div>
        
  //       <div class="p-tags">
  //           <p>${element.snippet.title}</p>
  //           <p>${element.snippet.channelTitle}</p>
  //           <p>${viewCount(getVideoStats(element.id.videoId))}views . ${timeCount(element.snippet.publishTime)}</p>
  //       </div>
  //   </div>
  //   `
  //   videos.appendChild(card);

  //   card.addEventListener('click',(e)=>{
  //     console.log(element.id.videoId);
  //     sessionStorage.setItem("videoIdIs", element.id.videoId);
  //     window.location.href = 'index2.html';
  //   })

  //   // getVideoStats(`${element.id.videoId}`)
  // });
  
  async function processVideos(arrayOfVideos) {
    for (const element of arrayOfVideos) {
      try {
        let channelLogo = await getChannelLogo(element.snippet.channelId);

        let videoStats = await getVideoStats(element.id.videoId); // Assuming getVideoStats is an async function
        let viewsPerVideo = await viewCount(videoStats);
  
        let card = document.createElement('div');
        card.id = 'card';
        card.innerHTML = `
          <div><img class="thumbnail" src="${element.snippet.thumbnails.medium.url}" width="${element.snippet.thumbnails.medium.width}px" height="${element.snippet.thumbnails.medium.height}px" alt="thumbnail"></div>
                      
          <div class="card-Bottom">
              <div class="logo">
                  <img src="${channelLogo}" alt="logo"> <!-- Use the channelLogo variable here -->
              </div>
              
              <div class="p-tags">
                  <p>${element.snippet.title}</p>
                  <p>${element.snippet.channelTitle}</p>
                  <p>${viewsPerVideo} views . ${timeCount(element.snippet.publishTime)}</p>
              </div>
          </div>
        `;
        videos.appendChild(card);
  
        card.addEventListener('click', (e) => {
          console.log(element.id.videoId);
          sessionStorage.setItem("videoIdIs", element.id.videoId);
          window.location.href = 'index2.html';
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

async function viewCount(count){
  if(count > 1000000){
    let million = await count/1000000;
    return Math.ceil(million) + 'M';
  }else{
    let thounsand = await count/1000
    return  Math.ceil(thounsand) + 'K';
  }
}

function timeCount(publishTime) {
  let publishDate = new Date(publishTime);
  let currentDate = new Date();

  let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsGap < secondsPerDay) {
    return `${Math.ceil(secondsGap / (60 * 60))} hrs ago`;
  }
  if (secondsGap < secondsPerWeek) {
    return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
  }
  if (secondsGap < secondsPerMonth) {
    return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
  }

  return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
}

// fetchVideos('',20)

if(searchInput.value == ''){
  fetchVideos('',20)
}

searchBtn.addEventListener('click',()=>{
  if(searchInput.value !== ''){
    let searchResult = searchInput.value;
    fetchVideos(searchResult + '',20)
  }
})


// --------------------------------------------------------------------------------------------------

// Getting video statistics:-

async function getVideoStats(videoId){
    const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
    const data = await response.json();
    // console.log(data);
    return data.items[0].statistics.viewCount
}
// getVideoStats('JhIBqykjzbs')



// --------------------------------------------------------------------------------------------------


// Getting channel information:-
async function getChannelLogo(channelId){
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
    const data = await response.json();
    console.log(data.items[0].snippet.thumbnails.default.url);

    let logoURL = data.items[0].snippet.thumbnails.default.url

    return logoURL

}
// getChannelLogo('UCaAhYJbOJcs_CJ0IAtPOUgw')
// --------------------------------------------------------------------------------------------------




//==================================================================================================

