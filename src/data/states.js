// Claves INEGI, asociadas por nombre de fuente, nunca por orden ni shapeISO.
// La fuente repite MX-MEX para Distrito Federal y Mexico; normalizamos ambos.
export const states = [
 ['01','Aguascalientes','Aguascalientes'],['02','Baja California','Baja California'],
 ['03','Baja California Sur','Baja California Sur'],['04','Campeche','Campeche'],
 ['05','Coahuila de Zaragoza','Coahuila de Zaragoza'],['06','Colima','Colima'],
 ['07','Chiapas','Chiapas'],['08','Chihuahua','Chihuahua'],['09','Ciudad de México','Distrito Federal'],
 ['10','Durango','Durango'],['11','Guanajuato','Guanajuato'],['12','Guerrero','Guerrero'],
 ['13','Hidalgo','Hidalgo'],['14','Jalisco','Jalisco'],['15','México','Mexico'],
 ['16','Michoacán de Ocampo','Michoacan de Ocampo'],['17','Morelos','Morelos'],
 ['18','Nayarit','Nayarit'],['19','Nuevo León','Nuevo Leon'],['20','Oaxaca','Oaxaca'],
 ['21','Puebla','Puebla'],['22','Querétaro','Queretaro de Arteaga'],['23','Quintana Roo','Quintana Roo'],
 ['24','San Luis Potosí','San Luis Potosi'],['25','Sinaloa','Sinaloa'],['26','Sonora','Sonora'],
 ['27','Tabasco','Tabasco'],['28','Tamaulipas','Tamaulipas'],['29','Tlaxcala','Tlaxcala'],
 ['30','Veracruz de Ignacio de la Llave','Veracruz de Ignacio de la Llave'],['31','Yucatán','Yucatan'],['32','Zacatecas','Zacatecas'],
].map(([code,name,sourceName]) => ({code,name,sourceName,hasStory:code === '21'}));
export const stateByCode = Object.fromEntries(states.map(s => [s.code,s]));
