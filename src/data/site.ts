export type Lang = "en" | "es";
export type Localized = { en: string; es: string };

export const copy = (value: Localized, language: Lang) => value[language];

export const business = {
  name: "Big Horn Contracting",
  phoneDisplay: "(505) 555-0148",
  phoneHref: "+15055550148",
  email: "hello@bighorncontracting.example",
  area: "Albuquerque, New Mexico",
  license: "NM license # to be added",
  googleBusinessUrl: "https://www.google.com/maps/search/?api=1&query=Albuquerque+New+Mexico",
};

export type Service = {
  slug: string;
  title: Localized;
  short: Localized;
  intro: Localized;
  image: string;
  alt: Localized;
  included: Localized[];
  faqs: { question: Localized; answer: Localized }[];
  related: string[];
  secondary?: boolean;
};

// All gallery and service imagery is illustrative placeholder imagery, not Big Horn project documentation.
export const services: Service[] = [
  {
    slug: "concrete",
    title: { en: "Concrete", es: "Concreto" },
    short: { en: "Strong foundations for the moments that happen on top of them.", es: "Bases firmes para los momentos que se viven encima de ellas." },
    intro: { en: "From the first step onto your walkway to evenings on your patio, good concrete makes daily life easier. We focus on a clean finish and a solid start.", es: "Desde el primer paso por su sendero hasta las tardes en su patio, el buen concreto mejora la vida diaria. Cuidamos el acabado y una base firme." },
    image: "/images/concrete-patio.jpg",
    alt: { en: "Sunlit finished concrete patio beside a Southwest stucco home, illustrative photo", es: "Patio de concreto terminado junto a una casa de estuco, foto ilustrativa" },
    included: [
      { en: "Driveways and parking pads", es: "Entradas para autos y áreas de estacionamiento" },
      { en: "Patios and outdoor living spaces", es: "Patios y espacios exteriores" },
      { en: "Slabs and foundations", es: "Losas y cimentaciones" },
      { en: "Walkways and steps", es: "Senderos y escalones" },
      { en: "Stamped and decorative finishes", es: "Acabados decorativos y estampados" },
    ],
    faqs: [
      { question: { en: "Can you help me choose a finish?", es: "¿Me pueden ayudar a elegir un acabado?" }, answer: { en: "Yes. We'll talk through the look you want, how the space will be used, and what makes sense for your home.", es: "Sí. Hablaremos del estilo que busca, del uso del espacio y de lo que conviene para su casa." } },
      { question: { en: "Do you offer free concrete estimates?", es: "¿Ofrecen presupuestos gratis para concreto?" }, answer: { en: "Yes. Tell us about your project and we'll arrange a free estimate with a clear scope.", es: "Sí. Cuéntenos su proyecto y coordinaremos un presupuesto gratis con un alcance claro." } },
    ],
    related: ["block", "stucco"],
  },
  {
    slug: "block",
    title: { en: "Block & CMU", es: "Bloque y CMU" },
    short: { en: "Walls with purpose. Built straight, built to stay.", es: "Muros con propósito. Bien alineados y hechos para durar." },
    intro: { en: "A well-built wall can give you privacy, shape your yard, and bring a sense of permanence to your home. We make the details count from the ground up.", es: "Un muro bien hecho puede dar privacidad, definir su jardín y aportar permanencia a su casa. Cuidamos cada detalle desde la base." },
    image: "/images/block-wall.jpg",
    alt: { en: "Precisely laid residential block wall in a desert garden, illustrative photo", es: "Muro residencial de bloques en un jardín desértico, foto ilustrativa" },
    included: [
      { en: "Privacy and perimeter fences", es: "Cercas de privacidad y perimetrales" },
      { en: "Retaining walls", es: "Muros de contención" },
      { en: "Garden and courtyard walls", es: "Muros de jardín y patio" },
      { en: "Block structures and additions", es: "Estructuras y ampliaciones de bloque" },
      { en: "Repairs and matching existing masonry", es: "Reparaciones y trabajos que combinan con la mampostería existente" },
    ],
    faqs: [
      { question: { en: "Can you match an existing wall?", es: "¿Pueden igualar un muro existente?" }, answer: { en: "We can look at your existing block and finish during the estimate and explain the best matching options.", es: "Podemos revisar su bloque y acabado actual durante la visita y explicarle las mejores opciones." } },
      { question: { en: "Do block walls need permits?", es: "¿Los muros de bloque necesitan permisos?" }, answer: { en: "Requirements depend on the wall and the municipality. We'll discuss what applies to your project before work starts.", es: "Depende del muro y del municipio. Hablaremos de los requisitos antes de comenzar." } },
    ],
    related: ["concrete", "stucco"],
  },
  {
    slug: "stucco",
    title: { en: "Stucco", es: "Estuco" },
    short: { en: "A beautiful finish that belongs in the Southwest.", es: "Un acabado hermoso que pertenece al suroeste." },
    intro: { en: "Stucco gives a New Mexico home its warmth and character. Whether you need a fresh finish or a thoughtful repair, we help your exterior feel like home again.", es: "El estuco da calidez y carácter a una casa de Nuevo México. Ya sea un acabado nuevo o una reparación cuidadosa, le ayudamos a renovar su exterior." },
    image: "/images/stucco-home.jpg",
    alt: { en: "Warm cream stucco finish on a Southwest-style home, illustrative photo", es: "Acabado de estuco color crema en una casa estilo suroeste, foto ilustrativa" },
    included: [
      { en: "New stucco applications", es: "Aplicaciones nuevas de estuco" },
      { en: "Stucco repair and patching", es: "Reparaciones y parches de estuco" },
      { en: "Color coats and refreshes", es: "Capas de color y renovaciones" },
      { en: "Traditional and modern textures", es: "Texturas tradicionales y modernas" },
      { en: "Exterior finish guidance", es: "Orientación sobre acabados exteriores" },
    ],
    faqs: [
      { question: { en: "Can you repair a small damaged area?", es: "¿Pueden reparar una zona pequeña dañada?" }, answer: { en: "Often, yes. Send us a photo and we'll let you know the best next step after seeing the area.", es: "A menudo, sí. Envíenos una foto y le diremos el mejor paso después de ver el área." } },
      { question: { en: "Can you help with color and texture?", es: "¿Pueden ayudar con el color y la textura?" }, answer: { en: "Absolutely. We'll walk through options that fit your home and the surrounding finishes.", es: "Por supuesto. Revisaremos opciones que combinen con su casa y sus acabados." } },
    ],
    related: ["block", "concrete"],
  },
  {
    slug: "remodeling",
    title: { en: "Interior Remodeling", es: "Remodelación Interior" },
    short: { en: "Make room for the way you really live.", es: "Haga espacio para la vida que quiere vivir." },
    intro: { en: "Your home should work for your life today. We bring care and clear communication to the rooms you use most, so the result feels right long after the work is done.", es: "Su hogar debe adaptarse a su vida de hoy. Cuidamos las habitaciones que más usa, con comunicación clara y resultados que se sienten bien por mucho tiempo." },
    image: "/images/remodel-kitchen.jpg",
    alt: { en: "Warm remodeled kitchen with wood cabinetry and natural light, illustrative photo", es: "Cocina renovada con gabinetes de madera y luz natural, foto ilustrativa" },
    included: [
      { en: "Kitchen updates", es: "Renovaciones de cocina" },
      { en: "Bathroom updates", es: "Renovaciones de baño" },
      { en: "Flooring", es: "Pisos" },
      { en: "Drywall and finishing", es: "Paneles de yeso y acabados" },
      { en: "Whole-room refreshes", es: "Renovaciones completas de habitaciones" },
    ],
    faqs: [
      { question: { en: "Can we stay in our home during the remodel?", es: "¿Podemos quedarnos en casa durante la remodelación?" }, answer: { en: "That depends on the scope. We'll talk through the schedule, work areas, and how to keep disruption as manageable as possible.", es: "Depende del alcance. Hablaremos del calendario, las áreas de trabajo y cómo reducir las molestias." } },
      { question: { en: "Can we plan the project together as a family?", es: "¿Podemos planear el proyecto en familia?" }, answer: { en: "Of course. We welcome everyone involved in the decision to the conversation.", es: "Claro que sí. Invitamos a todos los que participan en la decisión a conversar." } },
    ],
    related: ["concrete", "stucco"],
  },
  {
    slug: "cleanup-hauling",
    title: { en: "Cleanup & Hauling", es: "Limpieza y Retiro" },
    short: { en: "A little extra help when a project calls for it.", es: "Una ayuda extra cuando su proyecto la necesita." },
    intro: { en: "Sometimes the best first step is clearing the way. Ask us about cleanup and hauling related to your project, or when you need a hand with a space.", es: "A veces el primer paso es despejar el espacio. Pregúntenos por limpieza y retiro de materiales relacionados con su proyecto." },
    image: "/images/concrete-patio.jpg",
    alt: { en: "Clean and ready outdoor space beside a home, illustrative photo", es: "Espacio exterior limpio y listo junto a una casa, foto ilustrativa" },
    included: [
      { en: "Project-related cleanup", es: "Limpieza relacionada con el proyecto" },
      { en: "Junk removal by request", es: "Retiro de objetos por solicitud" },
      { en: "Debris hauling", es: "Retiro de escombros" },
    ],
    faqs: [
      { question: { en: "Is cleanup included in my construction estimate?", es: "¿La limpieza está incluida en mi presupuesto?" }, answer: { en: "We'll explain what cleanup is included in your written scope. Extra hauling can be discussed separately if needed.", es: "Le explicaremos qué limpieza se incluye en su alcance escrito. El retiro adicional puede presupuestarse aparte." } },
    ],
    related: ["concrete", "remodeling"],
    secondary: true,
  },
];

export type Project = {
  id: string;
  category: "concrete" | "block" | "stucco" | "remodeling";
  title: Localized;
  area: Localized;
  image: string;
  alt: Localized;
  before?: string;
  source?: string;
  tall?: boolean;
  placeholder: true;
};

// Replace these illustrative images/captions with permissioned Big Horn project photography before launch.
export const projects: Project[] = [
  { id: "patio", category: "concrete", title: { en: "A patio made for gathering", es: "Un patio para reunirse" }, area: { en: "Albuquerque area", es: "Área de Albuquerque" }, image: "/images/concrete-patio.jpg", alt: { en: "Finished concrete patio with desert landscaping, illustrative project image", es: "Patio de concreto con jardín desértico, imagen ilustrativa" }, tall: true, placeholder: true },
  { id: "wall", category: "block", title: { en: "A little more privacy", es: "Un poco más de privacidad" }, area: { en: "Albuquerque area", es: "Área de Albuquerque" }, image: "/images/block-wall.jpg", alt: { en: "Straight residential block wall in sunlight, illustrative project image", es: "Muro residencial de bloques bajo el sol, imagen ilustrativa" }, placeholder: true },
  { id: "kitchen", category: "remodeling", title: { en: "The heart of the home, renewed", es: "El corazón del hogar, renovado" }, area: { en: "Albuquerque area", es: "Área de Albuquerque" }, image: "/images/remodel-kitchen.jpg", before: "/images/remodel-before.jpg", alt: { en: "Warm remodeled kitchen with walnut cabinetry, illustrative after image", es: "Cocina renovada con gabinetes de nogal, imagen ilustrativa de después" }, tall: true, placeholder: true },
  { id: "stucco", category: "stucco", title: { en: "A fresh Southwest finish", es: "Un nuevo acabado del suroeste" }, area: { en: "Albuquerque area", es: "Área de Albuquerque" }, image: "/images/stucco-home.jpg", alt: { en: "Cream stucco exterior of a Southwest home, illustrative project image", es: "Exterior de estuco crema de una casa del suroeste, imagen ilustrativa" }, placeholder: true },
  { id: "walkway", category: "concrete", title: { en: "A welcoming way home", es: "Una entrada que da la bienvenida" }, area: { en: "Greater Albuquerque", es: "Gran Albuquerque" }, image: "https://images.pexels.com/photos/24419877/pexels-photo-24419877.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200", source: "Pexels / Sharath G.", alt: { en: "Contemporary home driveway and walkway with greenery, stock photo placeholder", es: "Entrada moderna de casa con plantas, foto de archivo ilustrativa" }, placeholder: true },
  { id: "bath", category: "remodeling", title: { en: "A calmer start to the day", es: "Un comienzo más tranquilo" }, area: { en: "Greater Albuquerque", es: "Gran Albuquerque" }, image: "https://images.pexels.com/photos/8146325/pexels-photo-8146325.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200", source: "Pexels / Max Vakhtbovych", alt: { en: "Modern bathroom with a tub and wood details, stock photo placeholder", es: "Baño moderno con tina y detalles de madera, foto de archivo ilustrativa" }, placeholder: true },
];

export const steps: { title: Localized; detail: Localized }[] = [
  { title: { en: "Tell us your idea", es: "Cuéntenos su idea" }, detail: { en: "A quick call or note is all it takes. Tell us what you have in mind and what matters most to you.", es: "Basta una llamada o un mensaje. Cuéntenos qué tiene en mente y qué es lo más importante para usted." } },
  { title: { en: "Get a free estimate", es: "Reciba un presupuesto gratis" }, detail: { en: "We'll learn about your space and the work, then give you an honest estimate with room for questions.", es: "Conoceremos su espacio y el trabajo, y le daremos un presupuesto honesto con tiempo para preguntas." } },
  { title: { en: "Agree on a clear plan", es: "Acordemos un plan claro" }, detail: { en: "You'll know the scope, the next steps, and the price before work begins. No guessing games.", es: "Conocerá el alcance, los siguientes pasos y el precio antes de comenzar. Sin sorpresas." } },
  { title: { en: "We build with care", es: "Construimos con cuidado" }, detail: { en: "We respect your home, keep you in the loop, and pay attention to the details that last.", es: "Respetamos su hogar, le mantenemos informado y cuidamos los detalles que perduran." } },
  { title: { en: "Walk through it together", es: "Revisemos juntos" }, detail: { en: "We'll look at the finished work with you and make sure you feel good about the result.", es: "Revisaremos el trabajo terminado con usted para asegurarnos de que esté contento con el resultado." } },
];

export const areas = ["Albuquerque", "Rio Rancho", "Bernalillo", "Los Lunas", "Belen", "Corrales", "Placitas", "Edgewood", "Moriarty"];

export const sampleReviews = [
  { quote: { en: "They took the time to explain the plan and treated our home with respect. The whole experience felt easy.", es: "Se tomaron el tiempo de explicar el plan y trataron nuestro hogar con respeto. Todo fue sencillo." }, person: { en: "Sample homeowner review", es: "Opinión de ejemplo" }, area: "Albuquerque", rating: 5, placeholder: true },
  { quote: { en: "The finish looks beautiful, and we always knew what was happening next. That peace of mind mattered to us.", es: "El acabado quedó hermoso y siempre supimos qué seguía. Esa tranquilidad fue importante para nosotros." }, person: { en: "Sample homeowner review", es: "Opinión de ejemplo" }, area: "Rio Rancho", rating: 5, placeholder: true },
  { quote: { en: "Clear estimate, careful work, and a team that listened to what our family needed.", es: "Presupuesto claro, trabajo cuidadoso y un equipo que escuchó lo que nuestra familia necesitaba." }, person: { en: "Sample homeowner review", es: "Opinión de ejemplo" }, area: "Albuquerque", rating: 5, placeholder: true },
];

export const faqs = [
  { question: { en: "How soon can I get an estimate?", es: "¿Qué tan pronto puedo recibir un presupuesto?" }, answer: { en: "Send us the basics and we'll respond within one business day. We'll find a time to learn about your project and put together a free estimate.", es: "Envíenos los detalles básicos y responderemos dentro de un día hábil. Coordinaremos una visita para preparar un presupuesto gratis." } },
  { question: { en: "Do you charge for estimates?", es: "¿Cobran por los presupuestos?" }, answer: { en: "No. Estimates are free. We'll explain what is included so you can make a comfortable decision.", es: "No. Los presupuestos son gratis. Le explicaremos qué incluyen para que pueda decidir con tranquilidad." } },
  { question: { en: "Will my project need a permit?", es: "¿Mi proyecto necesitará un permiso?" }, answer: { en: "It depends on the work and your municipality. We'll talk through likely requirements as part of planning and confirm who is responsible before work begins.", es: "Depende del trabajo y del municipio. Hablaremos de los requisitos durante la planificación y confirmaremos quién se encargará antes de empezar." } },
  { question: { en: "How do payments work?", es: "¿Cómo funcionan los pagos?" }, answer: { en: "Payment timing and terms will be written into your project agreement. We won't ask you to guess what comes next.", es: "Los plazos y condiciones de pago quedarán por escrito en su acuerdo. Siempre sabrá qué sigue." } },
  { question: { en: "What about a warranty?", es: "¿Qué pasa con la garantía?" }, answer: { en: "We'll explain any workmanship warranty and product warranties in your written agreement before the project begins. Exact terms depend on the scope and materials.", es: "Le explicaremos la garantía de mano de obra y de los productos en el acuerdo escrito antes de empezar. Los términos dependen del alcance y los materiales." } },
  { question: { en: "Will you clean up when the work is done?", es: "¿Limpiarán al terminar el trabajo?" }, answer: { en: "We respect your space and include job-site cleanup in the agreed project scope. If you need additional hauling, just ask.", es: "Respetamos su espacio e incluimos limpieza del área de trabajo según el alcance acordado. Si necesita retiro adicional, pregúntenos." } },
  { question: { en: "Can my partner join the estimate conversation?", es: "¿Puede mi pareja participar en la conversación?" }, answer: { en: "Please do. Good projects are decided together. Add their name to your request and we'll include them in the follow-up.", es: "Por supuesto. Los buenos proyectos se deciden juntos. Agregue su nombre a la solicitud y los incluiremos en el seguimiento." } },
];