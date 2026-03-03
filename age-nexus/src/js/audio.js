(function() {
  const audio = document.getElementById('background-music');
  const volumeSlider = document.getElementById('volume-slider');

  if (!audio || !volumeSlider) return;

  // Restaurar volumen guardado
  const savedVolume = localStorage.getItem('age-nexus-volume');
  if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
    audio.volume = savedVolume / 100;
  } else {
    audio.volume = 0.3; // 30% por defecto
  }

  // Cambiar volumen cuando el usuario mueve el slider
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    localStorage.setItem('age-nexus-volume', e.target.value);
  });

  // Intentar reproducir automáticamente (algunos navegadores lo bloquean)
  audio.play().catch(() => {
    // Si falla, el usuario puede hacer clic en la página para activar el audio
    document.addEventListener('click', () => {
      audio.play();
    }, { once: true });
  });
})();
