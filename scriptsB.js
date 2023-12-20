let profesionMostrada = false;
let mostrandoReversos = false;
sessionStorage.setItem('profesionAleatoria', null);

const profesiones = [
  "Policía", "Bibliotecario", "Agricultora", "Portero", "Mecánica", "Científica",
  "Veterinaria", "Médico", "Frutero", "Piloto", "Arqueóloga", "Payaso", "Periodista",
  "Bombero", "Conductor", "Cocinero", "Peluquera", "Pintor", "Astronauta",
  "Arquitecta"
];

const imagenes = [
  "images/policia.jpg",
  "images/bibliotecario.png",
  "images/agricultora.png",
  "images/portero.png",
  "images/mecanica.png",
  "images/cientifica.jpg",
  "images/veterinaria.avif",
  "images/medico.jpg",
  "images/frutero.png",
  "images/piloto.jpg",
  "images/arqueologa.png",
  "images/payaso.avif",
  "images/periodista.avif",
  "images/bombero.avif",
  "images/conductor.png",
  "images/cocinero.png",
  "images/peluquero.jpg",
  "images/pintor.png",
  "images/astronauta.avif",
  "images/arquitecta.png"
];

function hacerPregunta() {
  // Generar un índice aleatorio basado en la longitud del array de profesiones
  mostrarAmigos();
  const indiceAleatorio = Math.floor(Math.random() * profesiones.length);
  sessionStorage.setItem('profesionAleatoria', profesiones[indiceAleatorio]);
  sessionStorage.setItem('imagenAleatoria', imagenes[indiceAleatorio]);
  const mensaje = `Busca un(a) ${profesiones[indiceAleatorio]}.`;
  document.getElementById('mensajeAcierto').style.background = "none";
  document.getElementById('mensajeFallo').innerText = "";
  document.getElementById('mensajeAcierto').innerText = "";
  //document.getElementById('mensajeFallo').style.display = 'none'; // Oculta el mensaje de fallo
  //document.getElementById('mensajeAcierto').style.display = 'none'; // Oculta el mensaje de fallo

  mostrarPregunta('mensajeProfesion', mensaje);
  mostrarImagen(imagenes[indiceAleatorio]);
  profesionMostrada = true; // Se muestra la profesión
}

function ocultarMensajes() {
  const mensajes = document.querySelectorAll('.mensaje');
  mensajes.forEach(mensaje => {
    mensaje.style.display = 'none'; // Oculta todos los mensajes
  });
  profesionMostrada = false; // Reinicia el estado de la profesión mostrada
}

function mostrarImagen(imagenSrc) {
  const imagenProfesion = document.getElementById("imagenProfesion");
  imagenProfesion.src = imagenSrc;
  imagenProfesion.style.display = 'block';
}

function mostrarPregunta(elementoId, mensaje) {
  const mensajeElemento = document.getElementById(elementoId);
  mensajeElemento.innerHTML = mensaje;
  mensajeElemento.style.display = 'block';
}

function mostrarMensaje(elementoId, mensaje) {
  const mensajeElemento = document.getElementById(elementoId);
  mensajeElemento.innerHTML = mensaje;
  mensajeElemento.style.display = 'block';
}


function mostrarMensajeAcierto() {
if (sessionStorage.getItem('profesionAleatoria') != 'null'){
	  mostrarMensaje('mensajeAcierto', '¡Has acertado!');
	  document.getElementById('mensajeAcierto').style.background = "darkseagreen";
	  document.getElementById('mensajeFallo').style.display = 'none'; // Oculta el mensaje de fallo
	  const audioExito = document.getElementById('audioExito');

	  audioExito.play();
   }
}

function mostrarMensajeFallo() {
  if (sessionStorage.getItem('profesionAleatoria') != 'null'){
	  mostrarMensaje('mensajeFallo', 'Oh no, inténtalo otra vez');
	  document.getElementById('mensajeAcierto').style.display = 'none'; // Oculta el mensaje de fallo
  }
}

// Función para manejar la interacción del usuario al hacer clic en una carta
function verificarProfesionCarta(profesionCarta) {
  const profesionAleatoria = sessionStorage.getItem('profesionAleatoria');

  if (profesionCarta === profesionAleatoria) {
    mostrarMensajeAcierto();
  } else {
    mostrarMensajeFallo();
  }
}

document.getElementById('botonPregunta').addEventListener('click', function() {
  if (!profesionMostrada) {
    hacerPregunta();
  } else {
    ocultarMensajes();
  }
});

function mostrarProfesion(carta) {
  const frontal = carta.querySelector('.frontal');
  const trasera = carta.querySelector('.trasera');
  const profesionCarta = trasera.querySelector('p').textContent;
  verificarProfesionCarta(profesionCarta);
  const sound = trasera.querySelector('.sound');

  if (frontal.style.transform === 'rotateY(-180deg)') {
    frontal.style.transform = 'rotateY(0deg)';
    trasera.style.transform = 'rotateY(180deg)';
  } else {
    frontal.style.transform = 'rotateY(-180deg)';
    trasera.style.transform = 'rotateY(0deg)';
	
    // Verificar si el atributo 'data-src' existe antes de cargar el audio
    if (sound.hasAttribute('data-src')) {
      const audioSrc = sound.getAttribute('data-src');
      sound.setAttribute('src', audioSrc);
      sound.removeAttribute('data-src');
    }
    sound.play();
  }
}

function mostrarAmigos(){
	const cartas = document.querySelectorAll('.carta');
	cartas.forEach(carta => {
      const frontal = carta.querySelector('.frontal');
      const trasera = carta.querySelector('.trasera');
      frontal.style.transform = 'rotateY(0deg)';
      trasera.style.transform = 'rotateY(180deg)';
	});
}

function alternarCartas() {
  const cartas = document.querySelectorAll('.carta');
  const titulo = document.getElementById('titulo');
  const btn = document.getElementById('alternarBtn');

  if (!mostrandoReversos) {
    // Mostrar los reversos
    cartas.forEach(carta => {
      const frontal = carta.querySelector('.frontal');
      const trasera = carta.querySelector('.trasera');
      frontal.style.transform = 'rotateY(-180deg)';
      trasera.style.transform = 'rotateY(0deg)';
    });
    titulo.textContent = 'Descubre los amigos';
    btn.textContent = 'Mostrar Amigos';
    mostrandoReversos = true;
  } else {
    // Mostrar los anversos
    cartas.forEach(carta => {
      const frontal = carta.querySelector('.frontal');
      const trasera = carta.querySelector('.trasera');
      frontal.style.transform = 'rotateY(0deg)';
      trasera.style.transform = 'rotateY(180deg)';
    });
    titulo.textContent = 'Descubre las Profesiones';
    btn.textContent = 'Mostrar Profesiones';
    mostrandoReversos = false;
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

window.addEventListener('load', () => {
  // Eliminar la profesión almacenada al cargar la página
  sessionStorage.removeItem('profesionAleatoria');
});


