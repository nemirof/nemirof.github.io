function mostrarProfesion(carta) {
  const frontal = carta.querySelector('.frontal');
  const trasera = carta.querySelector('.trasera');
  const sound = trasera.querySelector('.sound');
  
  if (frontal.style.transform === 'rotateY(-180deg)') {
    frontal.style.transform = 'rotateY(0deg)';
    trasera.style.transform = 'rotateY(180deg)';
  } else {
    frontal.style.transform = 'rotateY(-180deg)';
    trasera.style.transform = 'rotateY(0deg)';
	sound.play();
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



function traducirTexto(texto, callback) {
  const API_KEY = 'AIzaSyDXfSZXSEvSsnTwkJ37ZVmpp_J9Ku3UWSM'; // Reemplaza con tu propia clave de API
  const textoTraducido = '';

  fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&q=${texto}&target=en`
  )
    .then((response) => response.json())
    .then((data) => {
      const textoTraducido = data.data.translations[0].translatedText;
      callback(textoTraducido); // Llamamos a la función de callback con el texto traducido
    })
    .catch((error) => {
      console.error('Error al traducir:', error);
    });
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

