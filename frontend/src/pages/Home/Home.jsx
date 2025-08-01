import React, { useEffect, useState } from 'react'; // Importamos useState también

const Card = ({ icon, title, description, animationDelay }) => {
    // Estado local para controlar si el ratón está sobre la tarjeta
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section
            className="p-8 bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 opacity-0"
            data-scroll-fade-in
            data-animation-delay={animationDelay} // Prop para el delay de la animación de scroll
            onMouseEnter={() => setIsHovered(true)}  // Cuando el ratón entra
            onMouseLeave={() => setIsHovered(false)} // Cuando el ratón sale
        >
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center gap-3">
                {icon} {title}
            </h2>
            {/* El párrafo se muestra condicionalmente o con clases de transición */}
            <p className={`text-light-text-secondary dark:text-dark-text-secondary leading-relaxed ${isHovered ? 'card-content-visible' : 'card-content-hidden'}`}>
                {description}
            </p>
        </section>
    );
};


const Home = () => {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6
        };

        const scrollElements = document.querySelectorAll('[data-scroll-fade-in]');

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.animationDelay || '0';
                    entry.target.style.animationDelay = `${delay}ms`;
                    entry.target.classList.add('animate-fade-in');
                    entry.target.classList.remove('opacity-0');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        scrollElements.forEach(el => {
            el.classList.add('opacity-0');
            observer.observe(el);
        });

        const headerElements = document.querySelectorAll('.header-animate-on-load');
        headerElements.forEach(el => {
            el.classList.add('animate-fade-in');
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (

        <section className="w-full text-center p-12 md:p-12 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl animate-fade-in animation-delay-100">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in animation-delay-100">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    ¡Domina el Código: Tu Viaje de Programación Comienza Aquí!
                </span>
            </h1>

            <p className="text-xl md:text-2xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto animate-fade-in animation-delay-200">
                Sumérgete en un universo donde la lógica se encuentra con la creatividad y cada línea de código abre las puertas a un sinfín de posibilidades...
            </p>

            <article className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 mt-12">
                <Card
                    icon="👨‍💻"
                    title="Aprende de Forma Interactiva"
                    description="Explora tutoriales interactivos cuidadosamente diseñados..."
                    animationDelay="0"
                />
                <Card
                    icon="⚒️"
                    title="Practica con Proyectos Reales"
                    description="Pon en acción tus conocimientos resolviendo desafíos reales..."
                    animationDelay="200"
                />
                <Card
                    icon="🌎"
                    title="Colabora y Crece en Comunidad"
                    description="Forma parte de una comunidad vibrante y apasionada..."
                    animationDelay="400"
                />
            </article>

            <footer className="text-center max-w-3xl mx-auto">
                <p className="text-lg text-light-text dark:text-dark-text mb-6 animate-fade-in animation-delay-600">
                    Te invitamos a explorar las diversas secciones de nuestra plataforma...
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary italic animate-fade-in animation-delay-800">
                    Recuerda: cada línea de código que escribes es un paso decisivo...
                </p>
            </footer>
        </section>


    );
};

export default Home;