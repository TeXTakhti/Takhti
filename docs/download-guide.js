(() => {
  const dialog = document.getElementById('installation-guide');
  if (!dialog) return;
  const video = document.getElementById('installation-video');
  const guides = {
    mac: { title: 'Install Takhti on Mac', duration: '54-second walkthrough · shown at 2× speed', video: 'mac-install.mp4', poster: 'mac-poster.jpg', steps: ['Download the Mac installer from GitHub.', 'Open the DMG and run Install Takhti.pkg.', 'Open Takhti and follow setup for any missing dependencies.'], note: 'Apple silicon · macOS 11+. The app is not Apple-notarized; macOS may ask you to allow it in System Settings → Privacy & Security.' },
    windows: { title: 'Install Takhti on Windows', duration: '38-second walkthrough · shown at 2.5× speed · download wait shortened', video: 'windows-install.mp4', poster: 'windows-poster.jpg', steps: ['Download the Windows installer from GitHub.', 'Run the setup .exe and follow the installation steps.', 'Open Takhti. Install native Windows TeX Live separately if needed.'], note: 'Windows 10/11 x64. The installer is unsigned, so Windows may show a security prompt. Native TeX Live is a separate download.' }
  };
  const downloads = {};
  const base = 'assets/installation/';
  let returnFocus = null;
  function openGuide(platform, anchor) {
    const guide = guides[platform];
    if (!guide) return;
    if (typeof dialog.showModal !== 'function') { window.location.href = base + guide.video + '?v=20261116-short'; return; }
    returnFocus = anchor || document.activeElement;
    document.getElementById('installation-title').textContent = guide.title;
    document.getElementById('installation-duration').textContent = guide.duration;
    document.getElementById('installation-note').textContent = guide.note;
    const steps = document.getElementById('installation-steps'); steps.replaceChildren();
    for (const text of guide.steps) { const li = document.createElement('li'); li.textContent = text; steps.append(li); }
    const download = document.getElementById('installation-download');
    download.href = downloads[platform]; download.textContent = 'Download for ' + (platform === 'mac' ? 'Mac' : 'Windows') + ' via GitHub ↓';
    video.poster = base + guide.poster; video.src = base + guide.video + '?v=20261116-short'; video.muted = true;
    if (!dialog.open) dialog.showModal();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {});
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
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { video.pause(); video.removeAttribute('src'); video.load(); if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true}); });
})();
