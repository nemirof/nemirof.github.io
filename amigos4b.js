let amigoMostrado = false;
let isMuted = false;
sessionStorage.setItem('amigoAleatorio', null);

const amigos = [
  "Pepa", "Leo", "Luca", "Raquel", "Seren", 
  "Roi", "Ashley", "Álex", "Sara", "Abiel", 
  "Daniel", "Julia", "Mateo", "Alejandro", "Carlos", 
  "Adrián", "Paula", "Mihnea", "Nahia", "Cathaleya"
];

const imagenes = [
  "images/pepa.jpg",
  "images/leoB.jpg",
  "images/luca.jpg",
  "images/raquel.jpg",
  "images/seren.jpg",
  "images/roi.jpg",
  "images/ashley.jpg",
  "images/alex.jpg",
  "images/saraB.jpg",
  "images/abiel.jpg",
  "images/danielB.jpg",
  "images/juliaB.jpg",
  "images/mateoB.jpg",
  "images/alejandro.jpg",
  "images/carlosB.jpg",
  "images/adrian.jpg",
  "images/paula.jpg",
  "images/mihnea.jpg",
  "images/nahia.jpg",
  "images/cathaleya.jpg"
];

function hacerPregunta() {
  // Generar un índice aleatorio basado en la longitud del array de amigos
  mostrarAmigos();
  const indiceAleatorio = Math.floor(Math.random() * amigos.length);
  const nombreAmigo = amigos[indiceAleatorio];
  sessionStorage.setItem('amigoAleatorio', nombreAmigo);
  sessionStorage.setItem('imagenAleatoria', imagenes[indiceAleatorio]);
  const mensaje = `Busca a:`;
  document.getElementById('mensajeAcierto').style.background = "none";
  document.getElementById('mensajeFallo').innerText = "";
  document.getElementById('mensajeAcierto').innerText = "";

  mostrarPregunta('mensajeProfesion', mensaje);
  mostrarNombreGrande(nombreAmigo);
  amigoMostrado = true; // Se muestra el amigo
}

function ocultarMensajes() {
  const mensajes = document.querySelectorAll('.mensaje');
  mensajes.forEach(mensaje => {
    mensaje.style.display = 'none'; // Oculta todos los mensajes
  });
  amigoMostrado = false; // Reinicia el estado
}

function mostrarNombreGrande(nombre) {
  const nombreDiv = document.getElementById("nombreAmigo");
  nombreDiv.innerHTML = nombre;
  nombreDiv.style.display = 'flex';
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
  if (sessionStorage.getItem('amigoAleatorio') != 'null'){
    mostrarMensaje('mensajeAcierto', '¡Has acertado!');
    document.getElementById('mensajeAcierto').style.background = "darkseagreen";
    document.getElementById('mensajeFallo').style.display = 'none';
    const audioExito = document.getElementById('audioExito');

    if (!isMuted) {
      audioExito.play();
    }
    
    // Lanzar confeti cuando acierta
    crearConfeti();
  }
}

function mostrarMensajeFallo() {
  if (sessionStorage.getItem('amigoAleatorio') != 'null'){
    mostrarMensaje('mensajeFallo', 'Oh no, inténtalo otra vez');
    document.getElementById('mensajeAcierto').style.display = 'none';
  }
}

// Función para verificar si el amigo de la carta es el correcto
function verificarAmigoCarta(nombreCarta) {
  const amigoAleatorio = sessionStorage.getItem('amigoAleatorio');

  if (nombreCarta === amigoAleatorio) {
    return true; // Acierto
  } else {
    return false; // Fallo
  }
}

function mostrarAmigo(carta) {
  // Prevenir múltiples clicks rápidos
  if (carta.dataset.flipping === 'true') {
    return;
  }
  
  carta.dataset.flipping = 'true';
  
  const frontal = carta.querySelector('.frontal');
  const traseraExito = carta.querySelector('.trasera-exito');
  const traseraError = carta.querySelector('.trasera-error');
  const nombreCarta = carta.dataset.nombre;
  const esAcierto = verificarAmigoCarta(nombreCarta);

  // Si la carta ya está volteada, volver al frente
  if (frontal.style.transform === 'rotateY(-180deg)') {
    frontal.style.transform = 'rotateY(0deg)';
    traseraExito.style.transform = 'rotateY(180deg)';
    traseraError.style.transform = 'rotateY(180deg)';
    traseraExito.style.display = 'none';
    traseraError.style.display = 'none';
  } else {
    // Voltear la carta
    frontal.style.transform = 'rotateY(-180deg)';
    
    if (esAcierto) {
      // Mostrar carta de éxito
      traseraExito.style.display = 'block';
      traseraError.style.display = 'none';
      traseraExito.style.transform = 'rotateY(0deg)';
      mostrarMensajeAcierto();
    } else {
      // Mostrar carta de error
      traseraError.style.display = 'block';
      traseraExito.style.display = 'none';
      traseraError.style.transform = 'rotateY(0deg)';
      mostrarMensajeFallo();
    }
  }
  
  // Permitir nuevo click después de la animación
  setTimeout(() => {
    carta.dataset.flipping = 'false';
  }, 800);
}

function mostrarAmigos(){
  const cartas = document.querySelectorAll('.carta');
  cartas.forEach(carta => {
    const frontal = carta.querySelector('.frontal');
    const traseraExito = carta.querySelector('.trasera-exito');
    const traseraError = carta.querySelector('.trasera-error');
    frontal.style.transform = 'rotateY(0deg)';
    traseraExito.style.transform = 'rotateY(180deg)';
    traseraError.style.transform = 'rotateY(180deg)';
    traseraExito.style.display = 'none';
    traseraError.style.display = 'none';
  });
}

window.addEventListener('load', () => {
  // Eliminar el amigo almacenado al cargar la página
  sessionStorage.removeItem('amigoAleatorio');
});

// Función para activar/desactivar el sonido
function toggleMute() {
  isMuted = !isMuted;
  const iconoMute = document.getElementById('icono-mute');
  const botonMute = document.querySelector('.boton-mute');
  
  if (isMuted) {
    iconoMute.textContent = '🔇';
    botonMute.classList.add('muted');
    // Detener todos los audios
    document.querySelectorAll('audio').forEach(audio => {
      audio.muted = true;
    });
  } else {
    iconoMute.textContent = '🔊';
    botonMute.classList.remove('muted');
    // Reactivar todos los audios
    document.querySelectorAll('audio').forEach(audio => {
      audio.muted = false;
    });
  }
  
  // Guardar el estado en localStorage
  localStorage.setItem('muteState', isMuted);
}

// Cargar el estado del mute al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
  const savedMuteState = localStorage.getItem('muteState') === 'true';
  if (savedMuteState) {
    isMuted = true;
    toggleMute(); // Aplicar el estado guardado
  }
});

// Función para crear efecto de confeti
function crearConfeti() {
  const colores = ['var(--secondary-color)', 'var(--accent-color)', 'var(--success-color)', 'var(--primary-color)', 'var(--warning-color)'];
  const velocidades = ['rapido', 'lento', 'muy-lento', ''];
  
  // Crear 50 piezas de confeti
  for (let i = 0; i < 50; i++) {
    const confeti = document.createElement('div');
    confeti.className = 'confeti';
    
    // Posición aleatoria en el ancho de la pantalla
    confeti.style.left = Math.random() * window.innerWidth + 'px';
    
    // Velocidad aleatoria
    const velocidadAleatoria = velocidades[Math.floor(Math.random() * velocidades.length)];
    if (velocidadAleatoria) {
      confeti.classList.add(velocidadAleatoria);
    }
    
    // Delay aleatorio para que no caigan todos a la vez
    confeti.style.animationDelay = Math.random() * 2 + 's';
    
    // Añadir al DOM
    document.body.appendChild(confeti);
    
    // Eliminar después de la animación
    setTimeout(() => {
      if (confeti.parentNode) {
        confeti.parentNode.removeChild(confeti);
      }
    }, 6000);
  }
}

// Mejoras para dispositivos touch
document.addEventListener('DOMContentLoaded', function() {
  // Variables para detectar si es un tap o un scroll
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  const maxMoveDistance = 10; // píxeles máximos de movimiento para considerar un tap
  const maxTapDuration = 500; // milisegundos máximos para considerar un tap
  
  // Mejorar los clicks en las cartas
  const cartas = document.querySelectorAll('.carta');
  cartas.forEach(carta => {
    // Capturar posición inicial del touch
    carta.addEventListener('touchstart', function(e) {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    }, { passive: true });
    
    // Al soltar, verificar si fue un tap o un scroll
    carta.addEventListener('touchend', function(e) {
      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();
      
      // Calcular distancia movida
      const moveX = Math.abs(touchEndX - touchStartX);
      const moveY = Math.abs(touchEndY - touchStartY);
      const duration = touchEndTime - touchStartTime;
      
      // Si el movimiento fue pequeño y rápido, es un tap
      if (moveX < maxMoveDistance && moveY < maxMoveDistance && duration < maxTapDuration) {
        e.preventDefault();
        e.stopPropagation();
        mostrarAmigo(this);
      }
      // Si hubo mucho movimiento, es un scroll - no hacer nada
    }, { passive: false });
    
    // Mantener compatibilidad con mouse (desktop)
    carta.addEventListener('click', function(e) {
      // Solo activar si no es un dispositivo táctil
      if (!('ontouchstart' in window)) {
        e.preventDefault();
        e.stopPropagation();
        mostrarAmigo(this);
      }
    });
  });
});
