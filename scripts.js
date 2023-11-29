function mostrarProfesion(carta) {
  const frontal = carta.querySelector('.frontal');
  const trasera = carta.querySelector('.trasera');
  const sound = trasera.querySelector('.sound');

  // Ajustar la velocidad de la animación
  frontal.style.transition = 'transform 0.3s';
  trasera.style.transition = 'transform 0.3s';

  if (frontal.style.transform === 'rotateY(-180deg)') {
    frontal.style.transform = 'rotateY(0deg)';
    trasera.style.transform = 'rotateY(180deg)';
    sound.play(); // Reproducir sonido inmediatamente al inicio de la animación
  } else {
    frontal.style.transform = 'rotateY(-180deg)';
    trasera.style.transform = 'rotateY(0deg)';
    setTimeout(() => sound.play(), 300); // Reproducir sonido después de 300ms (ajustable)
  }
}


function moverImagen() {
  const imagen = document.querySelector('.imagen-conductora');
  const audioArranque = document.getElementById('audio-arranque');

  imagen.style.transform = 'translateX(-200%)'; // Ajusta el porcentaje según sea necesario
  audioArranque.play(); // Reproduce el audio

  setTimeout(function() {
    window.location.href = 'profesiones.html'; // Redirige al usuario después de la animación
  }, 2000); // Ajusta el tiempo según la duración de la transición en CSS o la duración del audio
}



function reproducirSonido(boton) {
  const carta = boton.parentElement;
  const textoProfesion = carta.querySelector('p').textContent;

  traducirTexto(textoProfesion, function (textoTraducido) {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();

    // Configurar el objeto de sintetizador de voz
    utterance.text = textoTraducido;
    utterance.lang = 'en-US'; // Establecer el idioma a inglés

    synthesis.speak(utterance); // Reproducir audio de la traducción
  });
}

