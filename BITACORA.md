Ruta: "D:\Practicas\SOFTWARE\PWA"

El objetivo de este taller fue crear una PWA que maneje una "Lista de Tareas offline" con ayuda de una IA. 
Para desarrollar esto utilizamos el IDE Visual Studio Code y como IA support utilizamos Claude.   

Comenzamos la conversacion con Claude proporcionando el IDE, los navegadores que utilizamos (
Edge y Chrome) y explicando brevemente los archivos necesarios archivos necesarios (.html, .json, .js) de acuerdo a la clase. Ademas describimos brevemente la PWA.

En esta primera interacion, Claude nos confirmo la estructura de los archivos y nos propuso los siguientes:
index.html - Estructura
styles.css - Estilos
app.js - Logica
service-worker.js
manifest.json - Info para instalar (ficha de identidad)
generate_icons.py - Script generador de iconos (icon-192x192.png y icon-512x512.png 

En base a esos archivos, Claude nos ayudo a definir:

1. Estructura - Archivos base
  Metodología:
    Empezar con lo visual (HTML)
    Explicar cada meta tag crítico
    Mostrar por qué es importante cada archivo

2. Manifest - Metadatos
  Enfoque:
    Explicar cada campo del JSON
3. Service Worker - Offline
4. Registro - Activar la lógica
  Elementos enseñados:
    Dónde registrar (index.html)
    Cuándo registrar (evento 'load')
    Cómo manejar actualizaciones
    Eventos del SW desde la página
5. Instalar - Ver en escritorio
