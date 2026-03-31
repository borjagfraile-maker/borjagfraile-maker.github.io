import * as THREE from 'three';

export const EARTH_RADIUS_VISUAL = 1.0;

export function geoToVector3(lon, lat) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (-lon) * Math.PI / 180;
    const x = EARTH_RADIUS_VISUAL * Math.sin(phi) * Math.cos(theta);
    const y = EARTH_RADIUS_VISUAL * Math.cos(phi);
    const z = EARTH_RADIUS_VISUAL * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

export function alignToNorth(obj, pos, lat, lon) {
    const radial = pos.clone().normalize();
    let north = new THREE.Vector3(0, 1, 0).clone().sub(radial.clone().multiplyScalar(radial.y));
    if (north.length() < 0.001) north = new THREE.Vector3(1, 0, 0).cross(radial).normalize();
    else north.normalize();
    const east = north.clone().cross(radial).normalize();
    const matrix = new THREE.Matrix4();
    matrix.set(
        east.x, north.x, radial.x, 0,
        east.y, north.y, radial.y, 0,
        east.z, north.z, radial.z, 0,
        0, 0, 0, 1
    );
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
    obj.quaternion.copy(quaternion);
}

export function createCircleOutline(radius, color, pointsCount = 36) {
    const vertices = [];
    for (let i = 0; i <= pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        vertices.push(new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    return new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: color }));
}

export function createPortIcon(color, size = 0.0022) {
    const outerGroup = new THREE.Group();
    const innerGroup = new THREE.Group();
    innerGroup.rotation.z = Math.PI;
    const baseRadius = size;
    const ring = createCircleOutline(baseRadius, color, 24);
    innerGroup.add(ring);
    const mastPoints = [new THREE.Vector3(0, -baseRadius*0.6, 0), new THREE.Vector3(0, baseRadius*0.8, 0)];
    const mastLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(mastPoints), new THREE.LineBasicMaterial({ color: color }));
    innerGroup.add(mastLine);
    const leftHook = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, baseRadius*0.6, 0), new THREE.Vector3(-baseRadius*0.7, baseRadius*0.2, 0)]), new THREE.LineBasicMaterial({ color: color }));
    const rightHook = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, baseRadius*0.6, 0), new THREE.Vector3(baseRadius*0.7, baseRadius*0.2, 0)]), new THREE.LineBasicMaterial({ color: color }));
    innerGroup.add(leftHook, rightHook);
    const topBar = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-baseRadius*0.5, baseRadius*0.85, 0), new THREE.Vector3(baseRadius*0.5, baseRadius*0.85, 0)]), new THREE.LineBasicMaterial({ color: color }));
    innerGroup.add(topBar);
    outerGroup.add(innerGroup);
    return outerGroup;
}

export function createStarOutline(outerRadius, innerRadius, color, points = 5) {
    const vertices = [];
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI * 2) / (points * 2) - Math.PI / 2;
        vertices.push(new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
    }
    vertices.push(vertices[0]);
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color }));
}

export function createPointedSiloIcon(sizeScale = 0.0028, color = 0xbcbcbc) {
    const baseWidth = 0.0009, bodyHeight = 0.0032, extendedHeight = bodyHeight * 1.5, tipHeight = 0.0014;
    const totalHeight = extendedHeight + tipHeight;
    const halfWidth = baseWidth / 2;
    const bottomY = -totalHeight/2, midY = bottomY + extendedHeight, tipY = totalHeight/2;
    const points = [
        new THREE.Vector3(-halfWidth, bottomY, 0),
        new THREE.Vector3(-halfWidth, midY, 0),
        new THREE.Vector3(0, tipY, 0),
        new THREE.Vector3(halfWidth, midY, 0),
        new THREE.Vector3(halfWidth, bottomY, 0),
        new THREE.Vector3(-halfWidth, bottomY, 0)
    ];
    const scale = sizeScale / 0.003;
    const scaledPoints = points.map(p => p.clone().multiplyScalar(scale));
    const geometry = new THREE.BufferGeometry().setFromPoints(scaledPoints);
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color }));
}

// ============================================================================
// NUEVAS ADICIONES: LÓGICA DE COLORES SEGÚN AFILIACIÓN (1980)
// ============================================================================

// Colores definidos según la consigna
export const COLORS = {
    USA: 0x3366ff,      // azul
    USSR: 0xff3333,     // rojo
    NATO: 0x003366,     // azul más oscuro
    WARSAW: 0x8b0000,   // rojo más oscuro
    OTHER: 0xcccccc,    // gris claro
};

// Categorías de países (código ISO 3166-1 alfa-2 → categoría)
// Incluye miembros de OTAN y Pacto de Varsovia en 1980 según datos históricos.
// Puedes ampliarlo según tus necesidades.
export const countryAffiliation = {
    // Estados Unidos
    'US': 'USA',
    // URSS (código SU era el usado, pero actualmente es RU; se usa 'SU' para representar la URSS)
    'SU': 'USSR',
    // OTAN (miembros en 1980)
    'GB': 'NATO', 'FR': 'NATO', 'DE': 'NATO', 'IT': 'NATO', 'NL': 'NATO',
    'BE': 'NATO', 'LU': 'NATO', 'DK': 'NATO', 'NO': 'NATO', 'IS': 'NATO',
    'PT': 'NATO', 'ES': 'NATO', 'GR': 'NATO', 'TR': 'NATO', 'CA': 'NATO',
    // Pacto de Varsovia (miembros en 1980)
    'PL': 'WARSAW', 'CS': 'WARSAW', 'HU': 'WARSAW', 'BG': 'WARSAW',
    'RO': 'WARSAW', 'DD': 'WARSAW', // Alemania Oriental (código DD)
    // Otros países socialistas aliados (opcional, si quieres tratarlos como Pacto de Varsovia)
    'CU': 'WARSAW', // Cuba
    // Resto por defecto será OTHER
};

/**
 * Devuelve la categoría de un país según su código ISO.
 * @param {string} countryCode - Código ISO 3166-1 alfa-2 (ej. 'US', 'GB')
 * @returns {string} 'USA', 'USSR', 'NATO', 'WARSAW' o 'OTHER'
 */
export function getCountryCategory(countryCode) {
    return countryAffiliation[countryCode] || 'OTHER';
}

/**
 * Devuelve el color correspondiente a la categoría de un país.
 * @param {string} countryCode - Código ISO del país
 * @returns {number} Color en formato hexadecimal (0xRRGGBB)
 */
export function getIconColorByCountry(countryCode) {
    const category = getCountryCategory(countryCode);
    switch (category) {
        case 'USA':   return COLORS.USA;
        case 'USSR':  return COLORS.USSR;
        case 'NATO':  return COLORS.NATO;
        case 'WARSAW':return COLORS.WARSAW;
        default:      return COLORS.OTHER;
    }
}

/**
 * Crea un icono de ciudad (estrella) con el color determinado por el país.
 * @param {string} countryCode - Código ISO del país
 * @param {number} outerRadius - Radio exterior de la estrella
 * @param {number} innerRadius - Radio interior
 * @param {number} points - Número de puntas
 * @returns {THREE.Line} Icono de ciudad listo para añadir a la escena
 */
export function createCityIcon(countryCode, outerRadius = 0.008, innerRadius = 0.003, points = 5) {
    const color = getIconColorByCountry(countryCode);
    return createStarOutline(outerRadius, innerRadius, color, points);
}

/**
 * Crea un icono de puerto con el color determinado por el país.
 * @param {string} countryCode - Código ISO del país
 * @param {number} size - Tamaño del icono
 * @returns {THREE.Group} Icono de puerto listo para añadir a la escena
 */
export function createPortIconByCountry(countryCode, size = 0.0022) {
    const color = getIconColorByCountry(countryCode);
    return createPortIcon(color, size);
}