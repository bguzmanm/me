---
layout: ../../layouts/MarkdownPostLayout.astro
title: EduScout, por qué construí una plataforma de empleo docente
author: Brian Guzmán
description: "En este artículo te cuento qué me motivó a construir EduScout, y cómo lo hice: el scraping, la arquitectura, y cómo la mantengo en producción con costo $0 al mes."
image:
    url: /me/assets/images/docente.jpg
    alt: "EduScout"
pubDate: 2026-09-18
tags: ["eduscout", "trabajo", "docente", "universidad", "instituto profesional"]
---
Este año cumplí 50.

En mi rubro, eso significa que las puertas se cierran silenciosamente. No hay un letrero que diga "no contratamos personas de tu edad", pero lo sientes en cada proceso que no avanza, en cada llamada que nunca llega. Les pasó a quienes nos precedieron, y les pasa a muchos profesionales y técnicos de mi generación. Están transitando a la docencia por necesidad más que por vocación, y eso no es un problema en sí mismo — lo problemático es que el sistema para encontrar esas oportunidades es un caos.

Para postular a un cargo docente en una universidad o institución de educación superior, lo primero es encontrar dónde se publican las ofertas. Dicen que "el primer paso es el más difícil" — y aquí pareciera que se esfuerzan en que así ocurra. Hay que recorrerlas, revisarlas y decidir si calza con tu perfil profesional, todo a mano, institución por institución. Al cabo de un par de horas terminas con una docena de pestañas abiertas.

Hace unos meses me "tomé la molestia" de recopilar fuentes de publicación de ofertas académicas. Me quedé con 12, con formatos completamente distintos: la UChile tiene su portal, la Católica tiene el suyo, Inacap usa trabajando.cl, Duoc usa hiringup.com, Santo Tomás tiene una sección en su web propia. Cada una elige su propia estrategia — y en algunos casos, su propia falta de estrategia.

Cada semana que un docente no ve una convocatoria a tiempo es una oportunidad perdida — para él y para la institución que busca talento.

Y ese es el problema que EduScout resuelve.
## ¿Qué es EduScout?
EduScout es una plataforma web que recopila automáticamente las ofertas de cargos docentes de educación superior en Chile y las presenta en un solo lugar: con búsqueda, conteos por institución y categorías, y un diseño pensado para que encuentres rápido lo que te interesa.

Imagina poder buscar "profesor de ingeniería en Santiago" y ver resultados de la UC, la USM, la UAI y Duoc en una sola vista, con links directos a cada convocatoria. Eso es EduScout.
## El desafío técnico: scraping de 12 fuentes reales
El corazón del proyecto es un sistema de scraping que recorre periódicamente cada una de las 12 fuentes de datos y extrae las ofertas publicadas. Pero no es tan simple como hacer un `fetch` y parsear el HTML.

Cada sitio es un mundo:
- Algunas universidades usan portales modernos con APIs internas que se pueden consumir directamente.
- Otras publican las ofertas en páginas estáticas con HTML sucio, inconsistente y con formato libre.
- Varias usan plataformas de terceros (trabajando.cl, laborum.com) con paginación y filtros propios.
- El contenido de cada oferta varía enormemente: desde una línea de texto hasta descripciones completas con requisitos, plazos y documentos adjuntos.

Todo ese HTML se sanitiza, se normaliza y se almacena en una base de datos. La arquitectura es NestJS en el backend con un scheduler de tareas que controla cuándo y cómo se ejecuta cada scraping.
## Lanzar sin gastar: la filosofía de costo $0
Uno de los principios de EduScout era no depender de un presupuesto para funcionar. La infraestructura en producción cuesta literalmente $0 al mes:

- **Hosting**: Oracle Cloud Always Free — una instancia ARM Ampere A1 con 2 OCPU y 12 GB de RAM, suficiente para el stack completo.
- **Dominio**: `eduscout.cl` registrado en nic.cl (~$10.000 CLP al año, el único costo real del proyecto).
- **DNS**: Cloudflare en modo DNS only, con TLS gratuito vía Let's Encrypt.
- **Frontend y Backend**: desplegados en el mismo VPS con Docker Compose y nginx. Sin Vercel, sin servicios managed — todo corre en una sola máquina.
- **CI/CD**: GitHub Actions construye imágenes Docker multi-arquitectura (amd64 + arm64), las publica en GHCR, y un timer systemd en el VPS las actualiza automáticamente cada 5 minutos.

Todo está provisionado con Terraform. El deploy es un push a `main` que en minutos está corriendo en producción.
## Los problemas que nadie te cuenta
No todo fue sencillo. Algunos de los desafíos más interesantes:

**Capacidad de la instancia free**: Oracle Cloud ~~la mayoría de las veces~~ a veces no tiene capacidad disponible en la región Santiago (que tiene un solo Availability Domain). La solución fue un script de retry que reintenta `terraform apply` cada 15 minutos hasta conseguir el recurso, y varios *doritos* después lo conseguimos.

**Scraping desde IP de datacenter**: Las IPs de Oracle (AS31898) pueden ser bloqueadas por WAFs y servicios anti-bot. La región Santiago resuelve el problema geográfico (la IP es chilena), pero la reputación de datacenter sigue siendo un riesgo. Para eso existe un plan B: un fallback que ejecuta el scraping desde una IP residencial vía Tailscale si alguna fuente bloquea la IP del servidor.

**Deploys seguros sin downtime**: Las migraciones de base de datos corren en el entrypoint del contenedor backend antes de arrancar la aplicación, de forma idempotente. Si algo falla, el contenedor no levanta y el servicio anterior sigue corriendo.
## Lo que viene
EduScout ya está en producción en [eduscout.cl](https://eduscout.cl). La infraestructura funciona, el scraping recorre las 12 fuentes y el stack está desplegado en Oracle Cloud.

En el futuro, la plataforma incluirá perfiles de postulantes con upload de CV y match inteligente entre candidatos y ofertas.
## ¿Por qué lo comparto?
Creo que hay una historia aquí que vale la pena contar: un proyecto con un problema real, una solución técnica pequeña pero interesante, y la restricción de funcionar sin presupuesto. No es un side project más — es una herramienta que puede ayudar a docentes chilenos a encontrar oportunidades que de otra forma se perderían.

Si trabajas en educación superior en Chile, o conoces a alguien que lo haga, te invito a probarlo hoy en [eduscout.cl](https://eduscout.cl). Y si tienes ideas, feedback o quieres colaborar, este es un proyecto abierto a contribuciones.