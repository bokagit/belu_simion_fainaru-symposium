const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    navigation.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

const videoShell = document.querySelector('.video-shell');

if (videoShell) {
  const configuredId = videoShell.dataset.youtubeVideoId?.trim();
  const queryId = new URLSearchParams(window.location.search).get('youtube')?.trim();
  const videoId = queryId || configuredId;

  if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;
    iframe.id = 'symposium-player';
    iframe.title = 'Art, Freedom of Expression and Dialogue — YouTube livestream';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    videoShell.replaceChildren(iframe);
    setupChapters(iframe, videoShell);
  }
}

// Clickable speaker chapters: jump the embedded video to each speaker
function setupChapters(iframe, videoShell) {
  const buttons = Array.from(document.querySelectorAll('.chapter[data-time]'));
  if (!buttons.length) return;
  let player = null;
  let pending = null;

  const jump = (seconds) => {
    player.seekTo(seconds, true);
    player.playVideo();
  };

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(iframe, {
      events: {
        onReady: () => {
          if (pending !== null) jump(pending);
          pending = null;
        },
      },
    });
  };
  const api = document.createElement('script');
  api.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(api);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const seconds = Number(button.dataset.time);
      if (player && typeof player.seekTo === 'function') jump(seconds);
      else pending = seconds;
      videoShell.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  window.setInterval(() => {
    if (!player || typeof player.getCurrentTime !== 'function') return;
    const now = player.getCurrentTime();
    let current = null;
    buttons.forEach((button) => {
      if (Number(button.dataset.time) <= now + 1) current = button;
    });
    buttons.forEach((button) => button.classList.toggle('is-active', button === current));
  }, 1000);
}
