// Contenido de las 8 lecciones. Lenguaje pensado para niñas y niños de primaria.
// {guide} = personaje elegido, {friend} = el otro personaje.
// who: 'guide' | 'friend'. visual (opcional): 'pictogram' | 'barchart' | 'compare'.
// answer = índice (0-2) de la opción correcta en options.

export const participationData = {
  title: 'Participación en elecciones presidenciales',
  unit: 'de cada 100 personas inscritas en la Lista Nominal que votaron',
  rows: [
    { year: 2012, value: 62.1 },
    { year: 2018, value: 62.4 },
    { year: 2024, value: 59.7 },
  ],
  source: 'Plataforma de los Conteos Censales de Participación Ciudadana 2009–2024 (INE), según la nota de La Razón del 5 de agosto de 2025.',
  sourceUrl: 'https://www.razon.com.mx/mexico/2025/08/05/elecciones-2024-tuvieron-menor-participacion-ine/',
  platformUrl: 'https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/',
  note: 'Estas cifras provienen de la plataforma CCPC y pueden diferir de las de los cómputos oficiales. Verifícalas en la plataforma antes de publicarlas.',
};

export const lessons = [
  {
    id: 1, emoji: '🏫', title: '¿Qué es la democracia?', tagline: 'Decidir juntos y en paz',
    explain: [
      { who: 'guide', text: '¡Hola! Soy {guide}. Hoy vamos a descubrir una palabra muy grande: ¡democracia!' },
      { who: 'friend', text: 'Yo soy {friend}. Democracia quiere decir que las decisiones se toman entre muchas personas, no solo una. Todas y todos podemos opinar.' },
      { who: 'guide', text: 'Imagina que tu salón debe elegir un juego para el recreo. Si solo manda una persona, ¿es justo? ¡Mejor lo decidimos juntos!' },
      { who: 'friend', text: 'También hay reglas: escuchar, respetar y aceptar el resultado, aunque no haya ganado nuestra idea.' },
    ],
    keyIdea: 'Democracia es decidir juntos, escuchando a todas las personas y respetando las reglas.',
    cases: [
      { icon: '🎲', title: 'El juego del recreo', text: 'El grupo propone tres juegos. Cada quien levanta la mano por uno y gana el que tiene más manos. Todos aceptan el resultado.' },
      { icon: '🍕', title: 'La comida de la fiesta', text: 'En casa preguntan a cada persona qué le gusta y eligen algo que guste a la mayoría. También piensan en quien no puede comer algo.' },
      { icon: '🗳️', title: 'Jefa o jefe de grupo', text: 'Se proponen candidatas y candidatos, se vota en secreto y se cuentan los votos frente a todo el grupo.' },
    ],
    mission: 'Hoy, antes de decidir algo con tu familia o tu grupo, pregunta la opinión de una persona más.',
    quiz: [
      { q: '¿Qué significa democracia?', options: ['Que decida una sola persona', 'Que las personas decidan juntas, escuchando a todas', 'Que gane siempre la persona más fuerte'], answer: 1, why: 'En la democracia las decisiones se toman entre muchas personas y todas pueden opinar.' },
      { q: 'En tu salón votan por un juego y gana uno que no era el tuyo. ¿Qué haces en una democracia?', options: ['Acepto el resultado y juego con respeto', 'Me enojo y no juego', 'Pido repetir hasta que gane el mío'], answer: 0, why: 'Aceptar el resultado es parte de la democracia. Mañana podrás proponer tu juego otra vez.' },
      { q: '¿Cuál es un ejemplo de democracia?', options: ['Un adulto decide y nadie puede opinar', 'Alguien esconde información para que gane su idea', 'Mi familia pregunta a todas las personas dónde pasear y elige lo que más prefieren'], answer: 2, why: 'Preguntar a todas las personas y elegir entre todas es decidir de forma democrática.' },
    ],
  },
  {
    id: 2, emoji: '🗣️', title: 'Todas las voces cuentan', tagline: 'Tú también puedes opinar',
    explain: [
      { who: 'guide', text: 'En un grupo hay personas muy distintas: unas hablan fuerte, otras son tímidas y otras se comunican de otras formas.' },
      { who: 'friend', text: 'Por eso en la democracia importa que todas las voces cuenten, ¡también las de niñas y niños! Tienen derecho a opinar sobre lo que les afecta.' },
      { who: 'guide', text: 'Nadie debe quedar fuera por ser niña o niño, hablar otra lengua, tener una discapacidad o vivir lejos.' },
    ],
    keyIdea: 'Todas las personas tienen derecho a opinar y a ser escuchadas, sin discriminación.',
    cases: [
      { icon: '🪑', title: 'Mejorar el patio', text: 'La maestra pide que cada quien escriba una idea en un papelito, para que también opinen quienes son tímidos.' },
      { icon: '🌎', title: 'Otra lengua, la misma voz', text: 'Una compañera habla una lengua indígena. El grupo la invita a explicar su idea y alguien ayuda a traducir.' },
      { icon: '📋', title: 'Consulta infantil y juvenil', text: 'El INE ha organizado consultas en las que niñas, niños y adolescentes expresan su opinión sobre temas que les importan.' },
    ],
    mission: 'Hoy invita a opinar a alguien que casi no habla en el grupo, y escucha sin interrumpir.',
    quiz: [
      { q: 'Una compañera casi nunca habla en el grupo. ¿Qué es mejor?', options: ['Decidir sin ella', 'Burlarse de ella', 'Invitarla a opinar de forma amable'], answer: 2, why: 'Invitar con respeto ayuda a que su voz también cuente.' },
      { q: '¿Quiénes tienen derecho a opinar sobre las cosas que les afectan?', options: ['Todas las personas, incluidas niñas y niños', 'Solo las personas adultas', 'Solo quienes hablan español'], answer: 0, why: 'Niñas y niños también tienen derecho a opinar sobre lo que les afecta.' },
      { q: '¿Por qué es importante que todas las voces cuenten?', options: ['Para que gane la voz más fuerte', 'Porque así las decisiones consideran a más personas y son más justas', 'Para que las reuniones duren más'], answer: 1, why: 'Cuando se escucha a más personas, las decisiones toman en cuenta a más personas.' },
    ],
  },
  {
    id: 3, emoji: '🗳️', title: '¡Vamos a votar!', tagline: 'Un voto libre y secreto',
    explain: [
      { who: 'guide', text: 'Una forma muy importante de participar es votar. Con el voto, la ciudadanía elige a quienes tomarán decisiones, como la presidencia o las diputaciones.' },
      { who: 'friend', text: 'En México pueden votar las personas de 18 años o más que tienen su credencial para votar.' },
      { who: 'guide', text: 'El voto es libre (nadie te obliga), secreto (nadie ve por quién votas) y personal (lo das tú). Cada persona tiene un voto.' },
      { who: 'friend', text: 'Ahora eres niña o niño y aún no votas en elecciones, pero puedes practicar en tu salón y aprender para cuando llegue tu momento.' },
    ],
    keyIdea: 'El voto es libre, secreto y personal. Cada persona tiene un solo voto.',
    cases: [
      { icon: '🏫', title: 'Elección en el salón', text: 'Cada quien dobla su papelito y lo mete a una caja. Nadie ve por quién votó cada persona.' },
      { icon: '👨‍👩‍👧', title: 'Día de elecciones', text: 'Una persona adulta lleva su credencial a la casilla y marca su boleta en un lugar privado.' },
      { icon: '🙅', title: 'Presionar no vale', text: 'Alguien dice: «Vota por mi candidato o no te hablo». Eso no es un voto libre, porque hay presión.' },
    ],
    mission: 'Pregunta a una persona adulta cómo es ir a votar. Pero no preguntes por quién votó: ¡eso es secreto!',
    quiz: [
      { q: '¿Qué significa que el voto sea secreto?', options: ['Que se vota solo de noche', 'Que nadie debe saber por quién votas, salvo que tú quieras contarlo', 'Que solo lo sabe la maestra'], answer: 1, why: 'El voto secreto protege tu libertad: puedes decidir sin miedo.' },
      { q: 'Alguien te dice: «Vota por mi candidato o te quito tu lugar». ¿Eso respeta el voto libre?', options: ['Sí, si es tu amigo', 'Sí, porque lo pidió', 'No, porque te están presionando'], answer: 2, why: 'Un voto libre no puede tener presiones ni amenazas.' },
      { q: 'En México, ¿quiénes pueden votar en las elecciones?', options: ['Personas de 18 años o más con credencial para votar', 'Solo personas de más de 50 años', 'Cualquier persona, sin documentos'], answer: 0, why: 'Para votar se necesita tener 18 años o más y la credencial para votar.' },
    ],
  },
  {
    id: 4, emoji: '🏛️', title: '¿Quién cuida las elecciones?', tagline: 'El INE y las casillas',
    explain: [
      { who: 'guide', text: 'Para que una elección sea justa, alguien debe organizarla y cuidarla. En México, una de esas instituciones es el INE, el Instituto Nacional Electoral.' },
      { who: 'friend', text: 'Cuando hay elecciones se instalan casillas: son los lugares donde la gente vota, como escuelas o parques.' },
      { who: 'guide', text: '¿Sabes quién atiende las casillas? ¡Vecinas y vecinos! Son personas sorteadas y capacitadas por el INE.' },
      { who: 'friend', text: 'Al final del día, los votos se cuentan en la casilla frente a las personas presentes. Así hay más confianza en el resultado.' },
    ],
    keyIdea: 'Las elecciones se organizan con reglas claras, y la ciudadanía ayuda a que sean justas.',
    cases: [
      { icon: '📦', title: 'Contar con testigos', text: 'En tu salón, dos compañeras cuentan los votos en voz alta frente al grupo. Todos pueden verificar.' },
      { icon: '🏫', title: 'Tu escuela, una casilla', text: 'Muchas casillas se instalan en escuelas. Ese día se prepara el lugar para que todas las personas puedan votar con tranquilidad.' },
      { icon: '👀', title: 'Mirar con atención', text: 'Las personas observadoras ciudadanas pueden mirar cómo se desarrolla la jornada para que todo se haga con transparencia.' },
    ],
    mission: 'Pregunta en casa si alguien ha sido funcionaria o funcionario de casilla y qué hizo.',
    quiz: [
      { q: '¿Qué es una casilla?', options: ['Una caja de lápices', 'Un partido político', 'Un lugar donde las personas votan'], answer: 2, why: 'La casilla es el lugar donde se instalan las urnas para que la gente vote.' },
      { q: '¿Quiénes atienden las casillas?', options: ['Ciudadanas y ciudadanos sorteados y capacitados', 'Solo policías', 'Solo candidatas y candidatos'], answer: 0, why: 'Las personas que atienden la casilla son vecinas y vecinos sorteados y capacitados.' },
      { q: '¿Por qué se cuentan los votos frente a otras personas?', options: ['Para presumir', 'Para dar transparencia y confianza', 'Para que todo sea más lento'], answer: 1, why: 'Contar a la vista de todas las personas ayuda a confiar en el resultado.' },
    ],
  },
  {
    id: 5, emoji: '🤝', title: 'Participar es más que votar', tagline: 'Pequeñas acciones, grandes cambios',
    explain: [
      { who: 'guide', text: 'Votar es una forma de participar, pero hay muchas más. Participar es involucrarte para que tu comunidad esté mejor.' },
      { who: 'friend', text: 'Puedes opinar en una consulta, formar parte de un comité en tu escuela, cuidar un parque, ayudar a tus vecinas y vecinos, o informarte bien.' },
      { who: 'guide', text: 'Cuando una persona participa, su voz y su acción pueden cambiar cosas, ¡aunque sean pequeñas!' },
    ],
    keyIdea: 'Participar es involucrarte y cuidar lo que compartimos, no solo en las elecciones.',
    cases: [
      { icon: '🌳', title: 'Cuidar el parque', text: 'Familias de la colonia se organizan para limpiar y plantar árboles en el parque donde juegan.' },
      { icon: '📝', title: 'Una idea para la escuela', text: 'Una niña propone en la reunión del grupo poner un buzón de ideas. Todos votan y se pone en marcha.' },
      { icon: '🍎', title: 'Ayudar a otros', text: 'El grupo organiza una colecta de útiles escolares para compañeras y compañeros que los necesitan.' },
    ],
    mission: 'Elige UNA acción pequeña esta semana: proponer una idea, ayudar a alguien o cuidar un lugar.',
    quiz: [
      { q: 'Además de votar, ¿cuál es otra forma de participar?', options: ['Cuidar un espacio común con vecinas y vecinos', 'No opinar nunca', 'Tirar basura en el parque'], answer: 0, why: 'Cuidar los espacios que compartimos también es participar.' },
      { q: '¿Quiénes pueden participar en su comunidad?', options: ['Solo quienes tienen dinero', 'Cualquier persona, también niñas y niños, de la forma que les corresponde', 'Solo quienes pueden votar'], answer: 1, why: 'Todas las personas pueden participar: con ideas, ayuda y cuidado de su comunidad.' },
      { q: 'Tienes una idea para mejorar el patio. ¿Qué es participar?', options: ['Esperar a que otros lo hagan', 'Quejarse sin hablar con nadie', 'Proponer la idea y ofrecer ayuda'], answer: 2, why: 'Proponer y ayudar convierte una idea en acción.' },
    ],
  },
  {
    id: 6, emoji: '📊', title: 'Los números cuentan historias', tagline: '¿Qué es la participación?',
    explain: [
      { who: 'guide', text: 'Los datos son números que nos ayudan a entender lo que pasa. Por ejemplo: ¿cuántas personas votaron?' },
      { who: 'friend', text: 'A eso se le llama participación: de todas las personas que podían votar, ¿cuántas votaron de verdad? Se dice en porcentaje.' },
      { who: 'guide', text: 'Prueba tú. Mueve la barra y mira qué pasa.', visual: 'pictogram' },
      { who: 'friend', text: 'Con esta idea miramos las elecciones presidenciales. Según la plataforma de Conteos Censales de Participación Ciudadana del INE, en 2012, 2018 y 2024 votaron cerca de 6 de cada 10 personas inscritas.', visual: 'barchart' },
      { who: 'guide', text: 'Fíjate: en 2024 fue un poco menor. Un número no explica por sí solo el porqué. Hay que preguntar y escuchar a las personas.' },
    ],
    keyIdea: 'Participación es cuántas personas, de las que podían votar, sí votaron. Un dato bien explicado cuenta una historia.',
    cases: [
      { icon: '🏫', title: 'Votación del salón', text: 'De 30 compañeras y compañeros, votaron 24. Son 8 de cada 10, o sea, 80 de cada 100: ¡una participación de 80 %!' },
      { icon: '⚽', title: 'Nombre del equipo', text: 'Votaron 20 de 30 niñas y niños. Son 2 de cada 3. Si faltan 10 votos, vale la pena preguntar por qué.' },
      { icon: '📰', title: 'Un número en las noticias', text: 'Cuando oigas un porcentaje, pregunta: ¿de cuántas personas?, ¿de qué año? y ¿quién lo midió?' },
    ],
    mission: 'Haz una mini encuesta con 5 personas y dibuja el resultado con cuadritos de colores.',
    quiz: [
      { q: 'Si de 10 personas votan 5, ¿cuántas serían de cada 100?', options: ['5', '50', '500'], answer: 1, why: '5 de cada 10 es lo mismo que 50 de cada 100, o sea, 50 %.' },
      { q: '¿Qué mide la participación?', options: ['Cuántas casillas hay', 'Cuántos candidatos hay', 'Cuántas personas que podían votar sí votaron'], answer: 2, why: 'La participación compara a quienes votaron con todas las personas que podían votar.' },
      { q: 'Para entender bien un dato, ¿qué conviene preguntar?', options: ['¿Quién lo midió y de qué año es?', '¿De qué color es la gráfica?', 'Nada, hay que creerlo'], answer: 0, why: 'Conocer la fuente y el año ayuda a saber si el dato es confiable y reciente.' },
    ],
  },
  {
    id: 7, emoji: '🗺️', title: 'Cada lugar es distinto', tagline: 'Comparar con cuidado',
    explain: [
      { who: 'guide', text: 'México tiene 32 entidades y miles de comunidades. La participación puede cambiar de un lugar a otro, de un grupo a otro y de un año a otro.' },
      { who: 'friend', text: 'Por eso los datos se comparan: entre lugares, entre mujeres y hombres, entre edades y entre años. Así vemos dónde hace falta más información o apoyo.' },
      { who: 'guide', text: 'Mira este ejemplo de juguete, inventado para practicar: dos colonias.', visual: 'compare' },
      { who: 'friend', text: 'Cuidado: para comparar bien hay que usar la misma medida. No se pueden comparar peras con manzanas. Y un número bajo no quiere decir que a las personas no les importe.' },
      { who: 'guide', text: 'Puedes ver los datos reales de cada entidad en la plataforma del INE, con ayuda de una persona adulta.' },
    ],
    keyIdea: 'Comparar nos ayuda a ver dónde hace falta apoyo. Hay que comparar cosas parecidas y no juzgar a las personas.',
    cases: [
      { icon: '🏘️', title: 'Dos colonias (datos de juguete)', text: 'En Sol votaron 7 de cada 10 y en Luna 4 de cada 10. Una buena pregunta es: ¿qué ayudaría a Luna? ¿Más información, casillas más cerca?' },
      { icon: '🧑‍🤝‍🧑', title: 'Distintos grupos', text: 'Si pocas personas jóvenes participan, se pueden preparar mensajes y actividades pensados para ellas.' },
      { icon: '🔎', title: 'Peras con manzanas', text: 'No es lo mismo una elección presidencial que una intermedia. Antes de comparar, hay que fijarse en qué se está midiendo.' },
    ],
    mission: 'Pregunta a tu familia: ¿qué ayudaría a que más personas de tu comunidad participen?',
    quiz: [
      { q: '¿Para qué sirve comparar la participación entre lugares?', options: ['Para ver dónde hace falta más información o apoyo', 'Para burlarnos de un lugar', 'Para decidir quiénes son mejores personas'], answer: 0, why: 'Comparar ayuda a encontrar dónde apoyar mejor, no a juzgar a las personas.' },
      { q: 'Tienes dos datos medidos de manera distinta. ¿Qué conviene hacer?', options: ['Mezclarlos sin pensar', 'Inventar el dato que falta', 'Compararlos solo si se midieron de la misma forma'], answer: 2, why: 'Para comparar con justicia, los datos deben medirse de la misma manera.' },
      { q: 'En la colonia Sol votaron 7 de cada 10 y en la colonia Luna, 4 de cada 10. ¿Qué podemos decir?', options: ['A la gente de Luna no le importa su colonia', 'En Luna participó menos gente y conviene preguntar por qué', 'Luna ya no puede votar'], answer: 1, why: 'El dato muestra una diferencia, no la causa. Lo mejor es preguntar y escuchar a la comunidad.' },
    ],
  },
  {
    id: 8, emoji: '📣', title: 'Misión: ¡datos con voz!', tagline: 'Cuenta la historia con verdad',
    explain: [
      { who: 'guide', text: '¡Ya sabes muchísimo! Ahora puedes ser mensajera o mensajero de la participación: contarle a más personas, con datos claros y verdaderos.' },
      { who: 'friend', text: 'Un buen mensaje es claro (fácil de entender), veraz (verdadero y con fuente) y amable (invita, no regaña).' },
      { who: 'guide', text: 'Antes de compartir algo pregúntate: ¿quién lo dijo?, ¿de dónde sale el dato?, ¿es reciente? Si no estás segura o seguro, ¡no lo compartas!' },
      { who: 'friend', text: 'Y una cifra sola no basta. Cuenta una historia: a quién le importa y qué puede hacer cada persona.' },
    ],
    keyIdea: 'Comunica con datos claros, verdaderos y con fuente. Invita a participar con respeto.',
    cases: [
      { icon: '📱', title: 'Un mensaje en el chat', text: 'Alguien manda «¡El 90 % ya no quiere votar!» sin decir de dónde sale. Tú pides la fuente antes de compartirlo.' },
      { icon: '🖼️', title: 'Un cartel para la escuela', text: 'Tu equipo dibuja 10 personitas, pinta 6 y escribe: «6 de cada 10 participaron. ¿Y tú? Pregunta, infórmate, participa».' },
      { icon: '🎙️', title: 'Radio escolar', text: 'En 1 minuto cuentas una historia corta: qué es votar, por qué importa y una acción que todos pueden hacer.' },
    ],
    mission: 'Comparte con una persona de tu familia UNA cosa que aprendiste, y dile de dónde viene el dato.',
    quiz: [
      { q: 'Te llega un mensaje que dice «¡El 90 % ya no quiere votar!» sin fuente. ¿Qué haces?', options: ['Lo comparto rápido', 'Cambio el número a 100 %', 'Busco la fuente antes de compartirlo'], answer: 2, why: 'Un dato sin fuente puede ser falso. Verificar protege a las personas de la desinformación.' },
      { q: '¿Cómo es un buen mensaje para invitar a participar?', options: ['Claro, verdadero y respetuoso', 'Con regaños para dar miedo', 'Con datos inventados que asusten'], answer: 0, why: 'Un mensaje claro, veraz y amable invita sin presionar ni engañar.' },
      { q: '¿Qué ayuda a entender mejor un dato?', options: ['Muchos números diminutos', 'Palabras sencillas y un dibujo o gráfica clara', 'Palabras muy difíciles'], answer: 1, why: 'Explicar con palabras sencillas y una imagen clara ayuda a que cualquier persona entienda.' },
    ],
  },
];

export const sources = [
  { label: 'Plataforma de Conteos Censales de Participación Ciudadana 2009–2024 (INE)', url: participationData.platformUrl },
  { label: 'La Razón: Elecciones 2024 tuvieron menor participación (5 ago 2025)', url: participationData.sourceUrl },
];
