(function() {
  const audio = document.getElementById('background-music');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-toggle');

  if (!audio) return;

  // Restaurar volumen guardado
  const savedVolume = localStorage.getItem('age-nexus-volume');
  if (savedVolume !== null) {
    audio.volume = Number(savedVolume) / 100;
    if (volumeSlider) volumeSlider.value = savedVolume;
  } else {
    audio.volume = 0.3; // 30% por defecto
  }

  // Cambiar volumen cuando el usuario mueve el slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      audio.volume = volume;
      localStorage.setItem('age-nexus-volume', e.target.value);
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    const updateMuteIcon = () => {
      muteBtn.textContent = audio.muted ? '🔇' : '🔊';
    };

    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      updateMuteIcon();
    });

    updateMuteIcon();
  }

  // Intentar reproducir automáticamente (algunos navegadores lo bloquean)
  audio.play().catch(() => {
    // Si falla, el usuario puede hacer clic en la página para activar el audio
    document.addEventListener('click', () => {
      audio.play();
    }, { once: true });
  });
})();
