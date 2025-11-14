document.addEventListener('DOMContentLoaded', function() {
    // Datos simulados (en producción vendrían de una API)
    const statsData = {
        universities: 30,
        programs: 30,
        cities: 40
    };

    const teamData = [
        {
            name: "Nicolas Daza Redondo",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "Con ganas de acabar el semetre hoy mismo.",
            initial: "N",
            color: "#031254ff"
        },
        {
            name: "Ivan Felipe Baquero Morales",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "Ha tenido días mejores pero sigue adelante",
            initial: "I",
            color: "#000000ff"
        },
        {
            name: "Daniel Ricardo Ballen Rueda",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "",
            initial: "D",
            color: "#1e3af3ff"
        },
        {
            name: "Cristian Manuel Rivera Trujillo",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "",
            initial: "C",
            color: "#f52020ff"
        },
        {
            name: "Angie Valentina Gasca Novoa",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "",
            initial: "A",
            color: "#ff4d00ff"
        },
        {
            name: "Angie Dayana Retiz Guerrero",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "",
            initial: "A",
            color: "#07f623ff"
        },
        {
            name: "Lucas Guzman Quijano",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "",
            initial: "L",
            color: "#07f6deff"
        },
        {
            name: "Manuel Felipe Galeano Barragan",
            role: "Estudiante De sexto semestre de Ingeniería de Sistemas",
            bio: "",
            initial: "M",
            color: "#551b1bff"
        }
        
    ];

    // Animación de contadores
    function animateCounters() {
        const options = {
            duration: 2000,
            easing: 'easeOutExpo',
            round: 1
        };

        anime({
            targets: '#universityCount',
            innerHTML: [0, statsData.universities],
            ...options
        });

        anime({
            targets: '#programCount',
            innerHTML: [0, statsData.programs],
            ...options,
            delay: 300
        });

        anime({
            targets: '#cityCount',
            innerHTML: [0, statsData.cities],
            ...options,
            delay: 600
        });
    }

    // Renderizar equipo
    function renderTeam() {
        const teamContainer = document.getElementById('teamMembers');
        teamContainer.innerHTML = '';

        teamData.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = `team-card fade-in delay-${index}`;
            card.innerHTML = `
                <div class="team-img" style="background: linear-gradient(135deg, ${member.color}, ${shadeColor(member.color, -20)})">
                    <span>${member.initial}</span>
                </div>
                <div class="team-info">
                    <h4 class="team-name">${member.name}</h4>
                    <div class="team-role">${member.role}</div>
                    <p class="team-bio">${member.bio}</p>
                </div>
            `;
            teamContainer.appendChild(card);
        });
    }

    // Helper para oscurecer colores
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3), 16);
        let G = parseInt(color.substring(3,5), 16);
        let B = parseInt(color.substring(5,7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  

        const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }

    // Efecto de aparición al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('fade-in-visible');
            }
        });
    };

    // Inicialización
    animateCounters();
    renderTeam();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar una vez al cargar

    const paginas = {
        "index.html": "Inicio",
        "aboutus.html": "Sobre Nosotros",
        "universitylist.html": "Buscar Universidades",
        "university-form.html": "Registrar Universidad",
        "carrerasforms.html": "Carreras",
        "users-form.html": "Usuarios"
    };

    // Detectar la página actual
    const url = window.location.pathname.split("/").pop() || "index.html";

    // Construir breadcrumb
    let breadcrumb = ["Inicio"]; // Siempre empieza en Inicio

    if (paginas[url] && paginas[url] !== "Inicio") {
        breadcrumb.push(paginas[url]);
    }

    // Texto final
    const texto = "Ver " + breadcrumb.join(", ");

    // Insertar en el enlace
    const backLink = document.getElementById("backLink");
    backLink.innerHTML = '<span class="arrow">‹</span> ' + texto;

    // Hacer que el link regrese a la página anterior lógica
    if (breadcrumb.length > 1) {
        backLink.href = "index.html"; // puedes personalizar si quieres que vaya siempre al inicio
    } else {
        backLink.style.display = "none"; // Ocultar en Inicio
    }

});