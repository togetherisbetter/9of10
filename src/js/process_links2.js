// converts time from format like 1:30:40, 30, 30:2 to seconds
function convert_time_to_seconds(time) {
  let total_seconds = 0;
  if (!time)
    return total_seconds;

  const splitted_time = time.split(':').reverse();
  for (let i = 0; i < splitted_time.length; i++) {
    total_seconds += splitted_time[i] * (60 ** i);
  }
  
  return total_seconds;
}

function listen_to_youtube(each_link, url) {
  const search_params = url.searchParams;
  const time = search_params.get('t');
  const seconds = convert_youtube_time_to_seconds(time);

  // https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
  each_link.addEventListener('click', function(event) { start_youtube_video_since(url, seconds) }, false);
}

function listen_to_links() {
  let links = document.getElementsByTagName('A');
  for (let i = 0; i < links.length; i++) {
    const each_link = links[i];
    const href = each_link.getAttribute('href');
    
    if (!href) {
      each_link.addEventListener('click', function(event) { watch(event); });
    }
  }
}

function start_youtube_video_since(url, seconds) {
  const iframe = document.getElementsByTagName('iframe')[0];
  
  // https://usefulangle.com/post/81/javascript-change-url-parameters
  const new_url = new URL('https://www.youtube.com/embed' + url.pathname);
  let search_params = new_url.searchParams;
  //console.log(seconds)
  search_params.set('start', seconds);
  //search_params.set('start', 0);
  search_params.set('autoplay', 1);
  search_params.set('rel', 0);  // https://www.capturevideoandmarketing.com/blog-news/related-videos-youtube-embeds
  
  // change the search property of the main url
  new_url.search = search_params.toString();
  console.log(new_url.toString())
  // the new url string
  //let new_url = url.toString();
  
  iframe.setAttribute('src', new_url.toString());
}

// https://developers.google.com/youtube/iframe_api_reference
// 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          //height: 'auto',
          //width: '100%',
          videoId: '52OoG1jD6W4',
          playerVars: {
            'playsinline': 1,
            'autoplay': 1,
            'rel': 0,
            'start': 23,
            //'startSeconds': 300
          },
          events: {
            'onReady': onPlayerReady,
            //'onStateChange': onPlayerStateChange
          }
        });
      }
// 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        //event.target.playVideo();
        //seekTo(0)
      }

function loadVideo(video_id) {
  player.loadVideoById(video_id);
  player.stopVideo();
}

function seekTo(start) {
  player.seekTo(start);
  if (player.getPlayerState() !== 1) {
    setTimeout(function(){
      player.seekTo(start);
      player.playVideo();
    }, 500);
  }
}

function watch(event) {
  const watch_since = convert_time_to_seconds(event.target.text.trim());
  seekTo(watch_since);
}

window.onload = function() {
  loadVideo('52OoG1jD6W4');
  listen_to_links();
};