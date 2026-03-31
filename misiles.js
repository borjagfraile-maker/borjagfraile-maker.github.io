import * as THREE from 'three';
import { geoToVector3, EARTH_RADIUS_VISUAL } from './iconos.js';

let missileActive = false;
let dashLineObj = null;
let activeExplosion = null;
let currentMission = null;

export function haversineDistance(lon1, lat1, lon2, lat2) {
    const toRad = d => d * Math.PI/180;
    const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function getRandomEnemy(baseCity, allCities) {
    let enemyList = [];
    if (baseCity.side === "ussr") enemyList = allCities.filter(c => c.side === "usa" || c.side === "global");
    else if (baseCity.side === "usa") enemyList = allCities.filter(c => c.side === "ussr" || c.side === "global");
    else enemyList = allCities.filter(c => c.side === "ussr" || c.side === "usa");
    if(enemyList.length === 0) return null;
    return enemyList[Math.floor(Math.random()*enemyList.length)];
}

export function launchMissile(startCity, targetCity, scene, statusElement) {
    if(missileActive) {
        if(dashLineObj) scene.remove(dashLineObj);
        missileActive=false;
    }
    const startVec = geoToVector3(startCity.lon, startCity.lat).normalize();
    const endVec = geoToVector3(targetCity.lon, targetCity.lat).normalize();
    const totalAngle = startVec.angleTo(endVec);
    const distKm = haversineDistance(startCity.lon, startCity.lat, targetCity.lon, targetCity.lat);
    const V_MAX_KMS = 25000/3600, T_ACCEL = 240, ACCEL = V_MAX_KMS/T_ACCEL, DIST_ACCEL = 0.5*ACCEL*T_ACCEL*T_ACCEL;
    const totalTime = distKm <= DIST_ACCEL ? Math.sqrt(2*distKm/ACCEL) : T_ACCEL + (distKm-DIST_ACCEL)/V_MAX_KMS;
    const points = [];
    for (let i=0; i<=240; i++) {
        const frac = i/240;
        const angle = totalAngle*frac, sinTot = Math.sin(totalAngle);
        const w1 = Math.sin(totalAngle-angle)/sinTot, w2 = Math.sin(angle)/sinTot;
        const dir = new THREE.Vector3().copy(startVec).multiplyScalar(w1).add(endVec.clone().multiplyScalar(w2)).normalize();
        points.push(dir.multiplyScalar(1.0 + (EARTH_RADIUS_VISUAL * 0.1) * 4 * frac * (1 - frac)));
    }
    const vertices = [];
    for (let i=0; i<points.length-1; i++) if(i%2===0) vertices.push(points[i].x, points[i].y, points[i].z, points[i+1].x, points[i+1].y, points[i+1].z);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    const dashLine = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: 0xffaa66 }));
    if(dashLineObj) scene.remove(dashLineObj);
    dashLineObj = dashLine;
    scene.add(dashLineObj);
    const startTime = performance.now()/1000;
    missileActive = true;
    currentMission = { startCity, targetCity, totalTime, startTime, points, totalDistKm: distKm };
    const enemyFlag = startCity.side === "ussr" ? "🇺🇸 USA" : (startCity.side === "usa" ? "🇷🇺 URSS" : "🌍 ENEMIGO GLOBAL");
    statusElement.innerHTML = `🚀 LANZAMIENTO: ${startCity.name} → ${targetCity.name} (${enemyFlag})<br>📡 Distancia: ${Math.floor(distKm)} km`;
}

export function updateFlight(nowSec, scene, statusElement, timerElement) {
    if(!missileActive||!currentMission) return;
    const elapsed = nowSec - currentMission.startTime;
    const total = currentMission.totalTime;
    if(elapsed>=total) {
        missileActive=false;
        const impactPos = geoToVector3(currentMission.targetCity.lon, currentMission.targetCity.lat);
        const group = new THREE.Group();
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.028,18,18), new THREE.MeshStandardMaterial({ color:0xffaa66, emissive:0xff4422, emissiveIntensity:2.0 }));
        group.add(core);
        const ringMat = new THREE.MeshBasicMaterial({ color:0xff8844, transparent:true, opacity:0.9, side:THREE.DoubleSide });
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.05,0.14,24), ringMat);
        ring.rotation.x = Math.PI/2;
        group.add(ring);
        group.position.copy(impactPos);
        scene.add(group);
        activeExplosion = group;
        setTimeout(() => {
            if(activeExplosion) scene.remove(activeExplosion);
            activeExplosion = null;
        }, 2000);
        statusElement.innerHTML = `💥 IMPACTO en ${currentMission.targetCity.name}`;
        if(dashLineObj) scene.remove(dashLineObj);
        dashLineObj=null;
        currentMission=null;
        return;
    }
    const frac = Math.min(1, elapsed/total);
    const visibleCount = Math.floor(frac * currentMission.points.length)+1;
    const vertices = [];
    for (let i=0; i<visibleCount-1; i++) if(i%2===0) vertices.push(currentMission.points[i].x, currentMission.points[i].y, currentMission.points[i].z, currentMission.points[i+1].x, currentMission.points[i+1].y, currentMission.points[i+1].z);
    const newGeom = new THREE.BufferGeometry();
    newGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    if(dashLineObj) scene.remove(dashLineObj);
    dashLineObj = new THREE.LineSegments(newGeom, new THREE.LineBasicMaterial({ color: 0xffaa66 }));
    scene.add(dashLineObj);
    const remaining = Math.max(0,total-elapsed);
    const remMin=Math.floor(remaining/60), remSec=Math.floor(remaining%60);
    statusElement.innerHTML = `🚀 TRAYECTORIA: ${currentMission.startCity.name} → ${currentMission.targetCity.name}<br>⏱️ restante ${remMin}:${remSec.toString().padStart(2,'0')}`;
    const elMin=Math.floor(elapsed/60), elSec=Math.floor(elapsed%60);
    timerElement.innerHTML = `⏱️ Tiempo: ${elMin}:${elSec.toString().padStart(2,'0')} / ${Math.floor(total/60)}:${Math.floor(total%60).toString().padStart(2,'0')}`;
}