let profesionMostrada = false;
let mostrandoReversos = false;
let isMuted = false;
sessionStorage.setItem('profesionAleatoria', null);

const profesiones = [
  "Policía", "Bibliotecaria", "Deportista", "Informático", "Maestra", "Científica",
  "Veterinaria", "Médico", "Frutera", "Piloto", "Música", "Payaso", "Periodista",
  "Bombero", "Entrenador Personal", "Cocinera", "Peluquero", "Pintora", "Astronauta",
  "Bailarina"
];

const imagenes = [
  "images/policia.jpg",
  "images/bibliotecaria.jpg",
  "images/deportista.jpg",
  "images/informatico.avif",
  "images/maestra.jpg",
  "images/cientifica.jpg",
  "images/veterinaria.avif",
  "images/medico.jpg",
  "images/frutera.jpg",
  "images/piloto.jpg",
  "images/musica.jpg",
  "images/payaso.avif",
  "images/periodista.avif",
  "images/bombero.avif",
  "images/entrenador.jpg",
  "images/cocinera.jpg",
  "images/peluquero.jpg",
  "images/pintora.avif",
  "images/astronauta.avif",
  "images/bailarina.png"
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

	  if (!isMuted) {
	    audioExito.play().catch(e => console.log('Audio play failed:', e));
	  }
	  
	  // Lanzar confeti cuando acierta
	  crearConfeti();
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

// Sistema de seguridad para acceso a páginas con contenido de menores
function solicitarAcceso(pagina) {
  // Verificar si ya tiene acceso autorizado válido
  const accesoAutorizado = sessionStorage.getItem('accesoAutorizado');
  const tiempoAcceso = sessionStorage.getItem('tiempoAcceso');
  const tiempoActual = Date.now();
  const tiempoLimite = 3600000; // 1 hora
  
  if (accesoAutorizado === 'true' && 
      tiempoAcceso && 
      (tiempoActual - parseInt(tiempoAcceso)) <= tiempoLimite) {
    
    // Ya tiene acceso válido, redirigir directamente
    sessionStorage.setItem('tiempoAcceso', tiempoActual.toString()); // Renovar tiempo
    window.location.href = pagina;
    return;
  }
  
  // Crear un modal personalizado para la contraseña
  const modal = document.createElement('div');
  modal.className = 'modal-seguridad';
  modal.innerHTML = `
    <div class="modal-contenido">
      <div class="modal-header">
        <h3>🔒 Acceso Restringido</h3>
        <p>Esta sección contiene contenido educativo con imágenes de menores.</p>
        <p>Por favor, introduce la contraseña para continuar:</p>
      </div>
      <div class="modal-body">
        <input type="password" id="password-input" placeholder="Contraseña..." maxlength="20">
        <div class="modal-buttons">
          <button onclick="verificarPassword('${pagina}')" class="btn-acceder">🔓 Acceder</button>
          <button onclick="cerrarModal()" class="btn-cancelar">❌ Cancelar</button>
        </div>
      </div>
      <div class="modal-footer">
        <p><small>Contenido protegido para uso educativo autorizado</small></p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Enfocar el input de contraseña
  setTimeout(() => {
    document.getElementById('password-input').focus();
  }, 100);
  
  // Permitir Enter para enviar
  document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      verificarPassword(pagina);
    }
  });
}

function verificarPassword(pagina) {
  const password = document.getElementById('password-input').value.toLowerCase().trim();
  const passwordCorrecta = 'pirata';
  
  if (password === passwordCorrecta) {
    // Contraseña correcta - guardar en sessionStorage para esta sesión
    sessionStorage.setItem('accesoAutorizado', 'true');
    sessionStorage.setItem('tiempoAcceso', Date.now().toString());
    
    cerrarModal();
    
    // Mostrar mensaje de éxito antes de redirigir
    mostrarMensajeAcceso('✅ Acceso autorizado. Redirigiendo...', true);
    setTimeout(() => {
      window.location.href = pagina;
    }, 1500);
    
  } else {
    // Contraseña incorrecta
    mostrarMensajeAcceso('❌ Contraseña incorrecta. Inténtalo de nuevo.', false);
    document.getElementById('password-input').value = '';
    document.getElementById('password-input').focus();
  }
}

function mostrarMensajeAcceso(mensaje, exito) {
  const mensajeDiv = document.createElement('div');
  mensajeDiv.className = `mensaje-acceso ${exito ? 'exito' : 'error'}`;
  mensajeDiv.textContent = mensaje;
  document.body.appendChild(mensajeDiv);
  
  setTimeout(() => {
    if (mensajeDiv.parentNode) {
      mensajeDiv.parentNode.removeChild(mensajeDiv);
    }
  }, 3000);
}

function cerrarModal() {
  const modal = document.querySelector('.modal-seguridad');
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}

// Mostrar estado de la sesión de acceso
function mostrarEstadoAcceso() {
  const accesoAutorizado = sessionStorage.getItem('accesoAutorizado');
  const tiempoAcceso = sessionStorage.getItem('tiempoAcceso');
  const tiempoActual = Date.now();
  const tiempoLimite = 3600000; // 1 hora
  
  if (accesoAutorizado === 'true' && 
      tiempoAcceso && 
      (tiempoActual - parseInt(tiempoAcceso)) <= tiempoLimite) {
    
    const tiempoRestante = tiempoLimite - (tiempoActual - parseInt(tiempoAcceso));
    const minutosRestantes = Math.floor(tiempoRestante / 60000);
    
    // Crear indicador de sesión activa
    const indicador = document.createElement('div');
    indicador.className = 'indicador-sesion';
    indicador.innerHTML = `
      <div class="sesion-activa">
        🔓 <span>Sesión activa</span>
        <small>Acceso autorizado (${minutosRestantes}min restantes)</small>
      </div>
    `;
    
    document.body.appendChild(indicador);
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', mostrarEstadoAcceso);
