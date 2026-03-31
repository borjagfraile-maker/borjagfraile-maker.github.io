import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildCities, getPopulationEstimate } from './ciudades.js';
import { ussrSilosData, usaBasesData } from './silos.js';
import { 
    EARTH_RADIUS_VISUAL, geoToVector3, alignToNorth, createCircleOutline, 
    createPortIcon, createStarOutline, createPointedSiloIcon 
} from './iconos.js';
import { initMenus } from './menus.js';
import { haversineDistance, getRandomEnemy, launchMissile, updateFlight } from './misiles.js';

// Configuración escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030318);
scene.fog = new THREE.FogExp2(0x030318, 0.00045);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.7, 0.2, 3.0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.25;
controls.zoomSpeed = 0.9;
controls.enablePan = true;
controls.panSpeed = 0.35;
controls.target.set(0, 0, 0);
controls.minDistance = 1.2;
controls.maxDistance = 4.0;

// Estrellas
const starGeo = new THREE.BufferGeometry();
const starCount = 2800;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPos[i*3] = (Math.random() - 0.5) * 900;
    starPos[i*3+1] = (Math.random() - 0.5) * 600;
    starPos[i*3+2] = (Math.random() - 0.5) * 400 - 120;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xaacdff, size: 0.13, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Segunda capa de estrellas
const starGeo2 = new THREE.BufferGeometry();
const starCount2 = 1800;
const starPos2 = new Float32Array(starCount2 * 3);
for (let i = 0; i < starCount2; i++) {
    starPos2[i*3] = (Math.random() - 0.5) * 1300;
    starPos2[i*3+1] = (Math.random() - 0.5) * 800;
    starPos2[i*3+2] = (Math.random() - 0.5) * 550 - 180;
}
starGeo2.setAttribute('position', new THREE.BufferAttribute(starPos2, 3));
const starMat2 = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.09, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
const stars2 = new THREE.Points(starGeo2, starMat2);
scene.add(stars2);

// Iluminación
const ambient = new THREE.AmbientLight(0x20223a, 0.55);
scene.add(ambient);
const mainLight = new THREE.DirectionalLight(0xfff2e0, 1.1);
mainLight.position.set(4, 3.5, 5);
scene.add(mainLight);
const fillLight = new THREE.PointLight(0x4466aa, 0.5);
fillLight.position.set(-2, 1, -3);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0x88aaff, 0.6);
rimLight.position.set(1.3, 1.5, -2.8);
scene.add(rimLight);

// Tierra
const earthMat = new THREE.MeshStandardMaterial({ color: 0x101a2a, roughness: 0.7, metalness: 0.15, emissive: 0x030714, emissiveIntensity: 0.1 });
const earthSphere = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS_VISUAL, 128, 128), earthMat);
scene.add(earthSphere);
const atmosMat = new THREE.MeshPhongMaterial({ color: 0x7799cc, emissive: 0x112244, transparent: true, opacity: 0.08, side: THREE.BackSide });
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS_VISUAL + 0.008, 96, 96), atmosMat);
scene.add(atmosphere);

// Grupo para fronteras
const bordersGroup = new THREE.Group();
scene.add(bordersGroup);

// Función para añadir ciudad
function createCityIcon(city, isSpecial = false, specialType = null) {
    const pos = geoToVector3(city.lon, city.lat);
    let icon;
    if (isSpecial) {
        icon = createStarOutline(0.0035, 0.0015, 0xffcc66, 5);
    } else {
        let color;
        if (city.side === "ussr") color = 0xcc6666;
        else if (city.side === "usa") color = 0x66aaff;
        else color = 0xffaa66;
        if (city.type === "puerto") icon = createPortIcon(0xff8844, 0.0022);
        else icon = createCircleOutline(0.0022, color, 36);
    }
    icon.position.copy(pos);
    alignToNorth(icon, pos, city.lat, city.lon);
    scene.add(icon);
    const hitMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const hitSphere = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), hitMat);
    hitSphere.position.copy(pos);
    let entityType = "city";
    if (specialType === "commandCenter") entityType = "commandCenter";
    hitSphere.userData = { type: entityType, cityData: city, lineRef: icon, specialType: specialType };
    scene.add(hitSphere);
    return { lineLoop: icon, hitSphere, cityData: city };
}

// Añadir silos
function addSilosFromData(basesArray, siloColor, sideLabel) {
    const items = [];
    basesArray.forEach(base => {
        const numIcons = Math.ceil(base.missiles / 50);
        for (let i = 0; i < numIcons; i++) {
            let latOffset = (Math.random() - 0.5) * 1.5;
            let lonOffset = (Math.random() - 0.5) * 2.0;
            let finalLat = Math.min(70, Math.max(30, base.lat + latOffset));
            let finalLon = Math.min(150, Math.max(-125, base.lon + lonOffset));
            const pos = geoToVector3(finalLon, finalLat);
            const siloIcon = createPointedSiloIcon(0.0025, siloColor);
            siloIcon.position.copy(pos);
            alignToNorth(siloIcon, pos, finalLat, finalLon);
            scene.add(siloIcon);
            const hitMat = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 });
            const hitSphere = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 10), hitMat);
            hitSphere.position.copy(pos);
            hitSphere.userData = {
                type: "silo",
                baseName: base.name,
                missileType: base.type,
                missilesPerIcon: 50,
                totalMissiles: base.missiles,
                side: sideLabel,
                rangeKm: base.rangeKm,
                lineRef: siloIcon,
                originalColor: siloColor
            };
            scene.add(hitSphere);
            items.push({ hitSphere, line: siloIcon, data: hitSphere.userData });
        }
    });
    return items;
}

// Inicializar datos
const allCities = buildCities();
const cityItems = [];
allCities.forEach(city => {
    const isMoscow = (city.name === "Moscú");
    const specialType = isMoscow ? "commandCenter" : null;
    cityItems.push(createCityIcon(city, isMoscow, specialType));
});

// NORAD
const noradPos = geoToVector3(-104.846, 38.742);
const noradStar = createStarOutline(0.0035, 0.0015, 0xffcc66, 5);
noradStar.position.copy(noradPos);
alignToNorth(noradStar, noradPos, 38.742, -104.846);
scene.add(noradStar);
const noradHitSphere = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 }));
noradHitSphere.position.copy(noradPos);
noradHitSphere.userData = { type: "commandCenter", name: "NORAD", lineRef: noradStar, specialType: "commandCenter" };
scene.add(noradHitSphere);
const starGlow = new THREE.PointLight(0xffaa55, 0.2, 0.4);
starGlow.position.copy(noradPos);
scene.add(starGlow);
window.starGlow = starGlow; // Para que menus.js pueda acceder

// Silos
const siloItemsUSSR = addSilosFromData(ussrSilosData, 0xcc5555, "ussr");
const siloItemsUSA = addSilosFromData(usaBasesData, 0xbcbcbc, "usa");
const allSiloItems = [...siloItemsUSSR, ...siloItemsUSA];
window.allSiloItems = allSiloItems;

// Menús e interacciones
const menuHandler = initMenus();

// Recolectar todos los objetos clickeables
const hoverableObjects = [...cityItems.map(c => c.hitSphere), noradHitSphere, ...allSiloItems.map(s => s.hitSphere)];

// Raycaster para hover
const raycasterHover = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();

function onMouseMove(event) {
    mouseVec.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouseVec.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycasterHover.setFromCamera(mouseVec, camera);
    const intersects = raycasterHover.intersectObjects(hoverableObjects);
    if (intersects.length) {
        const hit = intersects[0].object;
        const data = hit.userData;
        if (data) {
            if (menuHandler.getCurrentHovered() === data) return;
            menuHandler.resetHighlight();
            menuHandler.setCurrentHovered(data);
            if (!menuHandler.getSelectedSilo()) {
                menuHandler.applyHover(data);
            } else {
                if (data.lineRef) data.lineRef.scale.set(1.4, 1.4, 1);
                if (data.type === 'commandCenter' && data.name === "NORAD") starGlow.intensity = 0.7;
            }
        } else {
            menuHandler.resetHighlight();
            if (!menuHandler.getSelectedSilo()) {
                document.getElementById('hoverCityName').textContent = "—";
                document.getElementById('hoverSubInfo').innerHTML = "Pasa el cursor sobre un icono";
            }
        }
    } else {
        menuHandler.resetHighlight();
        if (!menuHandler.getSelectedSilo()) {
            document.getElementById('hoverCityName').textContent = "—";
            document.getElementById('hoverSubInfo').innerHTML = "Pasa el cursor sobre un icono";
        }
    }
}
window.addEventListener('mousemove', onMouseMove);

// Clic
function onClickHandler(event) {
    mouseVec.x = (event.clientX/renderer.domElement.clientWidth)*2-1;
    mouseVec.y = -(event.clientY/renderer.domElement.clientHeight)*2+1;
    const clickRaycaster = new THREE.Raycaster();
    clickRaycaster.setFromCamera(mouseVec, camera);
    const hits = clickRaycaster.intersectObjects(hoverableObjects);
    if(hits.length) {
        const data = hits[0].object.userData;
        if(data.type === 'city') {
            const enemy = getRandomEnemy(data.cityData, allCities);
            if(enemy) launchMissile(data.cityData, enemy, scene, document.getElementById('missileStatus'));
            else document.getElementById('missileStatus').innerHTML = "⚠️ Sin objetivos enemigos";
            if(menuHandler.getSelectedSilo()) menuHandler.clearFixedSilo();
        } else if(data.type === 'silo') {
            menuHandler.setFixedSilo(data);
        }
    } else {
        if(menuHandler.getSelectedSilo()) menuHandler.clearFixedSilo();
    }
}
window.addEventListener('click', onClickHandler);

// Cargar fronteras
const ussrSet = new Set(["Russia","Russian Federation","Ukraine","Belarus","Moldova","Lithuania","Latvia","Estonia","Georgia","Armenia","Azerbaijan","Kazakhstan","Uzbekistan","Turkmenistan","Kyrgyzstan","Tajikistan"]);
function addBorder(ring, color) {
    if(!ring||ring.length<2) return;
    const points=[];
    for(let [lon,lat] of ring) if(isFinite(lon)&&isFinite(lat)) points.push(geoToVector3(lon,lat));
    if(points.length<2) return;
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    bordersGroup.add(new THREE.Line(geom, new THREE.LineBasicMaterial({color})));
}
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(r=>r.json())
    .then(data=>{
        data.features.forEach(f=>{
            const name = f.properties?.ADMIN||f.properties?.name||"";
            const isUSSR = ussrSet.has(name);
            const col = isUSSR ? 0xcc5555 : 0x6e8bcb;
            const geom = f.geometry;
            if(!geom) return;
            const coords = geom.coordinates;
            if(geom.type==="Polygon") coords.forEach(r=>addBorder(r,col));
            else if(geom.type==="MultiPolygon") coords.forEach(p=>p.forEach(r=>addBorder(r,col)));
        });
        document.getElementById('loader').style.opacity='0';
        setTimeout(()=>document.getElementById('loader').style.visibility='hidden',800);
    })
    .catch(()=>{
        document.getElementById('loader').innerHTML='⚠️ FRONTERAS SIMBÓLICAS';
        setTimeout(()=>document.getElementById('loader').style.opacity='0',2000);
    });

// Animación de estrellas
function animateStars() {
    stars.rotation.y+=0.0002;
    stars2.rotation.y-=0.00012;
    requestAnimationFrame(animateStars);
}
animateStars();

// Bucle de renderizado
let lastTime = performance.now()/1000;
function renderLoop() {
    requestAnimationFrame(renderLoop);
    const now = performance.now()/1000;
    if (window.missileActive) updateFlight(now, scene, document.getElementById('missileStatus'), document.getElementById('timerDisplay'));
    controls.update();
    renderer.render(scene,camera);
}
renderLoop();

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});

// Mensaje inicial
document.getElementById('missileStatus').innerHTML = "🎯 SILOS ICBM HISTÓRICOS (URSS 1.400, USA 1.054) | 200+ ciudades globales | Clic en ciudad → misil | Clic en silo → fija menú";