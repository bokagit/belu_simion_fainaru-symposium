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
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    iframe.title = 'Art, Freedom of Expression and Dialogue — YouTube livestream';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    videoShell.replaceChildren(iframe);
  }
}
