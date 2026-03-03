(function() {
  const audio = document.getElementById('background-music');
  const muteBtn = document.getElementById('mute-toggle');

  if (!audio || !muteBtn) return;

  // Use a low fixed volume and restore mute state from storage
  audio.volume = 0.1; // nivel bajo fijo
  const savedMuted = localStorage.getItem('age-nexus-muted');
  if (savedMuted === 'true') {
    audio.muted = true;
    muteBtn.textContent = '🔇';
  } else {
    audio.muted = false;
    muteBtn.textContent = '🔊';
  }

  // Alternar mute/unmute cuando se hace clic en el botón
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    localStorage.setItem('age-nexus-muted', audio.muted);
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  });

  // Intentar reproducir automáticamente (algunos navegadores lo bloquean)
  audio.play().catch(() => {
    // Si falla, el usuario puede hacer clic en la página para activar el audio
    document.addEventListener('click', () => {
      audio.play();
    }, { once: true });
  });
})();
