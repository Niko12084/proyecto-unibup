document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo para los programas académicos
    const academicPrograms = [
        {
            id: 1,
            name: "Medicina",
            type: "pregrado",
            duration: "12 semestres",
            degree: "Médico Cirujano",
            description: "Formación integral de médicos con altos estándares éticos y científicos."
        },
        {
            id: 2,
            name: "Derecho",
            type: "pregrado",
            duration: "10 semestres",
            degree: "Abogado",
            description: "Formación en ciencias jurídicas con enfoque en justicia social."
        },
        {
            id: 3,
            name: "Ingeniería Civil",
            type: "pregrado",
            duration: "10 semestres",
            degree: "Ingeniero Civil",
            description: "Formación en diseño, construcción y mantenimiento de infraestructura."
        },
        {
            id: 4,
            name: "Psicología",
            type: "pregrado",
            duration: "10 semestres",
            degree: "Psicólogo",
            description: "Estudio científico del comportamiento humano y procesos mentales."
        },
        {
            id: 5,
            name: "Maestría en Derecho Penal",
            type: "posgrado",
            duration: "4 semestres",
            degree: "Magíster en Derecho Penal",
            description: "Profundización en teoría del delito y sistema penal acusatorio."
        },
        {
            id: 6,
            name: "Especialización en Gerencia de Proyectos",
            type: "posgrado",
            duration: "2 semestres",
            degree: "Especialista en Gerencia de Proyectos",
            description: "Formación en dirección y gestión de proyectos de construcción."
        },
        {
            id: 7,
            name: "Doctorado en Ciencias de la Salud",
            type: "doctorado",
            duration: "8 semestres",
            degree: "Doctor en Ciencias de la Salud",
            description: "Investigación avanzada en problemas de salud pública."
        }
    ];

    const map = L.map('universityMap').setView([4.60971, -74.08175], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const universityMarker = L.marker([4.60971, -74.08175]).addTo(map)
        .bindPopup("<b>Universidad Libre</b><br>Sede Principal Bogotá")
        .openPopup();

    renderPrograms(academicPrograms);

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {

            filterButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');
            
            const filter = this.dataset.filter;
            if(filter === 'all') {
                renderPrograms(academicPrograms);
            } else {
                const filteredPrograms = academicPrograms.filter(program => program.type === filter);
                renderPrograms(filteredPrograms);
            }
        });
    });

    function renderPrograms(programs) {
        const programsGrid = document.querySelector('.programs-grid');
        programsGrid.innerHTML = '';
        
        if(programs.length === 0) {
            programsGrid.innerHTML = '<p class="no-programs">No hay programas disponibles en esta categoría</p>';
            return;
        }
        
        programs.forEach(program => {
            const programCard = document.createElement('div');
            programCard.className = 'program-card fade-in';
            programCard.innerHTML = `
                <span class="program-type ${program.type}">${program.type}</span>
                <h3>${program.name}</h3>
                <p>${program.description}</p>
                <p class="program-duration"><i class="fas fa-clock"></i> ${program.duration}</p>
                <p><strong>Título:</strong> ${program.degree}</p>
                <a href="#" class="program-link">Ver plan de estudios <i class="fas fa-arrow-right"></i></a>
            `;
            programsGrid.appendChild(programCard);
        });
    }

    document.querySelectorAll('.university-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const programSelect = this.querySelector('select');
            
            if(!nameInput.value.trim()) {
                showAlert('Por favor ingresa tu nombre completo', nameInput);
                return;
            }
            
            if(!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                showAlert('Por favor ingresa un correo electrónico válido', emailInput);
                return;
            }
            
            if(!programSelect.value) {
                showAlert('Por favor selecciona un programa de interés', programSelect);
                return;
            }

            showSuccessMessage('Tu solicitud ha sido enviada. Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, element) {
        alert(message);
        if(element) element.focus();
    }

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message fade-in';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        `;
        
        const form = document.querySelector('.contact-form form');
        form.parentNode.insertBefore(successDiv, form.nextSibling);
        
        setTimeout(() => {
            successDiv.classList.add('fade-out');
            setTimeout(() => successDiv.remove(), 500);
        }, 5000);
    }
        const homelink = document.getElementById('homelink');
            if (homelink) {
            homelink.addEventListener('click', function(e) {
                e.preventDefault(); 
                window.location.href = 'index.html';
        });
    }
    


    const style = document.createElement('style');
    style.textContent = `
        .no-programs {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            color: var(--text-light);
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .success-message i {
            font-size: 1.2rem;
        }
        
        .fade-out {
            animation: fadeOut 0.5s ease-out forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
});