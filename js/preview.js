function getPdfEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
  }
  if (url.includes('docs.google.com')) {
    return url.replace(/\/edit(\?.*)?$/, '/preview');
  }
  return url;
}

function openPdfModal(f) {
  const modal = $('pdfModal');
  $('modalFilename').textContent = f.n;
  $('modalSubject').textContent = f.s || 'PDF';
  $('modalExternal').href = f.u;
  $('modalDownload').href = f.u;
  
  const embedUrl = getPdfEmbedUrl(f.u);
  $('pdfFrame').src = embedUrl;
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const modal = $('pdfModal');
  modal.classList.remove('open');
  $('pdfFrame').src = 'about:blank';
  document.body.style.overflow = '';
}

function setupPdfModal() {
  const closeBtn = $('modalClose');
  const modal = $('pdfModal');
  if (closeBtn) closeBtn.onclick = closePdfModal;
  if (modal) {
    modal.onclick = e => {
      if (e.target === modal) closePdfModal();
    };
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closePdfModal();
    }
  });
}
