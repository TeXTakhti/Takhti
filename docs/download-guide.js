(() => {
  const dialog = document.getElementById('installation-guide');
  if (!dialog) return;
  const video = document.getElementById('installation-video');
  const gif = document.getElementById('installation-gif');
  const videoTab = document.getElementById('installation-show-video');
  const gifTab = document.getElementById('installation-show-gif');
  const guides = {
    mac: { title: 'Install Takhti on Mac', duration: '32-second walkthrough · shown at 1.5× speed', video: 'mac-install.mp4', gif: 'mac-install.gif', poster: 'mac-poster.jpg', steps: ['Download the Mac installer from GitHub.', 'Open the DMG and run Install Takhti.pkg.', 'Open Takhti and follow setup for any missing dependencies.'], note: 'Apple silicon · macOS 11+. The app is not Apple-notarized; macOS may ask you to allow it in System Settings → Privacy & Security.' },
    windows: { title: 'Install Takhti on Windows', duration: '62-second walkthrough · shown at 2.5× speed', video: 'windows-install.mp4', gif: 'windows-install.gif', poster: 'windows-poster.jpg', steps: ['Download the Windows installer from GitHub.', 'Run the setup .exe and follow the installation steps.', 'Open Takhti. Install native Windows TeX Live separately if needed.'], note: 'Windows 10/11 x64 · No WSL required. The installer is unsigned, so Windows may show a security prompt. Native TeX Live is a separate download.' }
  };
  const downloads = {};
  const base = 'assets/installation/';
  let selected = null, returnFocus = null;
  function display(format) {
    const showGIF = format === 'gif';
    gif.hidden = !showGIF; video.hidden = showGIF;
    videoTab.setAttribute('aria-pressed', String(!showGIF));
    gifTab.setAttribute('aria-pressed', String(showGIF));
    if (showGIF) { video.pause(); gif.src = base + selected.gif; }
    else { gif.removeAttribute('src'); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {}); }
  }
  function openGuide(platform, anchor) {
    const guide = guides[platform];
    if (!guide) return;
    if (typeof dialog.showModal !== 'function') { window.location.href = base + guide.video; return; }
    returnFocus = anchor || document.activeElement; selected = guide;
    document.getElementById('installation-title').textContent = guide.title;
    document.getElementById('installation-duration').textContent = guide.duration;
    document.getElementById('installation-note').textContent = guide.note;
    const steps = document.getElementById('installation-steps'); steps.replaceChildren();
    for (const text of guide.steps) { const li = document.createElement('li'); li.textContent = text; steps.append(li); }
    const download = document.getElementById('installation-download');
    download.href = downloads[platform]; download.textContent = 'Download for ' + (platform === 'mac' ? 'Mac' : 'Windows') + ' via GitHub ↓';
    document.getElementById('installation-gif-file').href = base + guide.gif;
    video.poster = base + guide.poster; video.src = base + guide.video; video.muted = true;
    gif.alt = guide.title + ': recorded installer download and installation walkthrough';
    if (!dialog.open) dialog.showModal();
    display('video');
  }
  for (const anchor of document.querySelectorAll('a[href*="/releases/download/"]')) {
    const platform = /macOS\.dmg(?:$|\?)/.test(anchor.href) ? 'mac' : /Windows[^/]*\.exe(?:$|\?)/.test(anchor.href) ? 'windows' : null;
    if (!platform) continue;
    downloads[platform] = anchor.href;
    anchor.setAttribute('aria-haspopup', 'dialog');
    anchor.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
      event.preventDefault(); openGuide(platform, anchor);
    });
  }
  for (const button of document.querySelectorAll('[data-install-guide]')) button.addEventListener('click', () => openGuide(button.dataset.installGuide, button));
  document.getElementById('installation-close').addEventListener('click', () => dialog.close());
  videoTab.addEventListener('click', () => display('video'));
  gifTab.addEventListener('click', () => display('gif'));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { video.pause(); video.removeAttribute('src'); video.load(); gif.removeAttribute('src'); if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true}); });
})();
