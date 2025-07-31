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

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 header-animate-on-load">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-light-primary to-light-danger dark:from-dark-primary dark:to-dark-danger">
                    ¡Domina el Código: Tu Viaje de Programación Comienza Aquí!
                </span>
            </h1>
            <p className="text-xl md:text-2xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto header-animate-on-load" style={{ animationDelay: '100ms' }}>
                Sumérgete en un universo donde la lógica se encuentra con la creatividad y cada línea de código abre las puertas a un sinfín de posibilidades. Nuestra plataforma está meticulosamente diseñada para acompañarte en cada paso, desde tus primeros algoritmos hasta la construcción de proyectos desafiantes que te preparan para las exigencias del mundo real. Con recursos interactivos, una comunidad vibrante y un enfoque en el aprendizaje práctico, transformarás tu curiosidad en una habilidad invaluable.
            </p>


            <article className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                {/* Usamos el nuevo componente Card aquí */}
                <Card
                    icon="👨‍💻"
                    title="Aprende de Forma Interactiva"
                    description="Explora tutoriales interactivos cuidadosamente diseñados para hacer que cada concepto sea cristalino y directamente aplicable. Desde los fundamentos esenciales de la programación hasta las tecnologías emergentes más demandadas, cada lección está estructurada para que no solo entiendas la lógica detrás del código, sino que también fomentes un aprendizaje sólido y duradero. Nuestros módulos incluyen ejemplos de código en vivo, cuestionarios y explicaciones claras para consolidar tu conocimiento."
                    animationDelay="0"
                />
                <Card
                    icon="⚒️"
                    title="Practica con Proyectos Reales"
                    description="Pon en acción tus conocimientos resolviendo desafíos reales y desarrollando proyectos prácticos que simulan escenarios profesionales. Desde ejercicios guiados que refuerzan conceptos clave hasta retos creativos que te exigen pensar de forma innovadora, tendrás innumerables oportunidades para afinar tus habilidades. Gana la confianza necesaria para enfrentar problemas complejos con soluciones elegantes y eficientes, construyendo un portafolio robusto en el proceso."
                    animationDelay="200"
                />
                <Card
                    icon="🌎"
                    title="Colabora y Crece en Comunidad"
                    description="Forma parte de una comunidad vibrante y apasionada por el desarrollo, donde podrás compartir tus avances, recibir retroalimentación constructiva y colaborar en proyectos conjuntos. Nuestro foro y canales de comunicación son espacios donde cada intercambio de conocimiento te impulsa a crecer, te conecta con mentores y compañeros, y te permite descubrir nuevas perspectivas. Aquí, tu pasión por el código se multiplica al compartirla con otros."
                    animationDelay="400"
                />
            </article>

            <footer className="text-center max-w-3xl mx-auto">
                <p className="text-lg text-light-text dark:text-dark-text mb-6 opacity-0" data-scroll-fade-in data-animation-delay="600">
                    Te invitamos a explorar las diversas secciones de nuestra plataforma utilizando la barra de navegación superior. Descubre la riqueza de recursos que hemos preparado para catapultar tu carrera en la programación. Cada módulo, cada desafío y cada interacción está diseñado pensando en tu éxito.
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary italic opacity-0" data-scroll-fade-in data-animation-delay="800">
                    Recuerda: cada línea de código que escribes es un paso decisivo hacia tus sueños y objetivos profesionales. **¡Sigue adelante con determinación y nunca dejes de aprender!** 🚀
                </p>
            </footer>
        </section>

    );
};

export default Home;