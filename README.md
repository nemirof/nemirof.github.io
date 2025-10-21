# nemirof.github.io

Este es el repositorio de mi sitio web personal, alojado en [https://nemirof.github.io](https://nemirof.github.io) a través de GitHub Pages.

## ¿Cómo se actualiza el sitio?

Este proyecto tiene configurado un despliegue automático. El proceso es el siguiente:

1.  **Hacer `push`:** Cuando terminas tus cambios en local, simplemente súbelos a la rama `main`:
    ```bash
    git push origin main
    ```

2.  **Inicio Automático:** Al recibir este `push`, GitHub **inicia automáticamente** un proceso de despliegue (una *GitHub Action*) para construir y publicar el sitio web.

3.  **Esperar el Despliegue:** **¡Importante: Los cambios no son instantáneos!** El proceso de despliegue suele tardar entre 1 y 2 minutos.

### ¿Cómo sé cuándo están listos los cambios?

Puedes monitorizar el estado del despliegue muy fácilmente:

* En la página principal de este repositorio, ve a la pestaña **"Actions"** (Acciones).
* Verás un *workflow* (flujo de trabajo) llamado `pages-build-and-deployment` en la lista.
* Si está en progreso, verás un **icono amarillo (🟡)**.
* Cuando el despliegue termina con éxito, el icono cambiará a un **tic verde (✅)**.

**Una vez que veas el tic verde (✅), tus cambios ya estarán visibles en [https://nemirof.github.io](https://nemirof.github.io)!**
(Cuidado con las mayus/minus)
