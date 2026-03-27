// menuManager.js
// Gestiona los menús flotantes, hover y selección de silos

export function initMenuManager({
    hoverableObjects,
    allSiloItems,
    scene,
    camera,
    renderer,
    getPopulationEstimate,
    starGlow
}) {
    // Elementos del DOM
    const hoverPanel = document.getElementById('hoverInfoPanel');
    const hoverNameEl = document.getElementById('hoverCityName');
    const hoverSubEl = document.getElementById('hoverSubInfo');
    const closeFixedBtn = document.getElementById('closeFixedBtn');

    // Estado interno
    let currentHovered = null;
    let selectedSilo = null;

    // Funciones auxiliares
    function resetHighlight() {
        if (!currentHovered) return;
        if (currentHovered.lineRef) {
            currentHovered.lineRef.scale.set(1, 1, 1);
            if (currentHovered.type === 'city') {
                let originalColor;
                if (currentHovered.cityData.side === "ussr") originalColor = 0xcc6666;
                else if (currentHovered.cityData.side === "usa") originalColor = 0x66aaff;
                else originalColor = 0xffaa66;
                if (currentHovered.cityData.type !== "puerto" && currentHovered.lineRef.material) {
                    currentHovered.lineRef.material.color.setHex(originalColor);
                }
            } else if (currentHovered.type === 'commandCenter') {
                currentHovered.lineRef.material.color.setHex(0xffcc66);
                if (currentHovered.name === "NORAD" && starGlow) starGlow.intensity = 0.2;
            } else if (currentHovered.type === 'silo') {
                currentHovered.lineRef.material.color.setHex(currentHovered.originalColor);
            }
        }
        currentHovered = null;
    }

    function updateHoverPanelForCity(city, isPuerto) {
        const population = getPopulationEstimate(city.name, city.side);
        let sideText = "";
        if (city.side === "ussr") sideText = "🔴 URSS";
        else if (city.side === "usa") sideText = "🔵 EE.UU.";
        else sideText = "🌍 Global";
        const tipoTexto = isPuerto ? "PUERTO" : "CIUDAD";
        hoverNameEl.textContent = city.name;
        hoverSubEl.innerHTML = `${tipoTexto} · ${sideText}<br>📍 ${city.country || "Territorio"}<br>👥 Población: ${population}<br>🖱️ Clic para lanzar misil`;
    }

    function updateHoverPanelForCommandCenter(name) {
        hoverNameEl.textContent = name;
        hoverSubEl.innerHTML = `⭐ CENTRO DE MANDO<br>Instalación estratégica principal`;
    }

    function updateHoverPanelForSilo(siloData) {
        hoverNameEl.textContent = `${siloData.baseName} (${siloData.side === "ussr" ? "URSS" : "USA"})`;
        hoverSubEl.innerHTML = `🗼 Grupo ICBM: ${siloData.baseName}<br>📦 Tipo: ${siloData.missileType}<br>💣 Misiles: ${siloData.totalMissiles}<br>📡 Alcance: ${siloData.rangeKm} km`;
    }

    function applyHover(obj) {
        if (!obj) return;
        if (obj.type === 'city') {
            const city = obj.cityData;
            if (obj.lineRef && !(city.type === "puerto")) obj.lineRef.scale.set(1.4, 1.4, 1);
            updateHoverPanelForCity(city, city.type === "puerto");
        } else if (obj.type === 'commandCenter') {
            if (obj.lineRef) obj.lineRef.scale.set(1.5, 1.5, 1);
            obj.lineRef.material.color.setHex(0xffdd99);
            if (obj.name === "NORAD" && starGlow) starGlow.intensity = 0.7;
            const name = obj.name || (obj.cityData ? obj.cityData.name : "Centro de Mando");
            updateHoverPanelForCommandCenter(name);
        } else if (obj.type === 'silo') {
            if (obj.lineRef) obj.lineRef.scale.set(1.5, 1.5, 1);
            obj.lineRef.material.color.setHex(0xffffff);
            updateHoverPanelForSilo(obj);
        }
    }

    // Función pública para fijar un silo
    function setFixedSilo(siloData) {
        selectedSilo = siloData;
        updateHoverPanelForSilo(siloData);
        hoverPanel.classList.add('fixed');
        closeFixedBtn.style.display = 'block';
        if (siloData.lineRef) {
            allSiloItems.forEach(item => {
                if (item.line !== siloData.lineRef) {
                    item.line.material.color.setHex(item.data.originalColor);
                    item.line.scale.set(1, 1, 1);
                }
            });
            siloData.lineRef.material.color.setHex(0xffaa88);
            siloData.lineRef.scale.set(1.5, 1.5, 1);
        }
    }

    function clearFixedSilo() {
        if (selectedSilo && selectedSilo.lineRef) {
            selectedSilo.lineRef.material.color.setHex(selectedSilo.originalColor);
            selectedSilo.lineRef.scale.set(1, 1, 1);
        }
        selectedSilo = null;
        hoverPanel.classList.remove('fixed');
        closeFixedBtn.style.display = 'none';
        // Simular un movimiento de mouse para resetear el panel si es necesario
        const fakeEvent = new MouseEvent('mousemove', { clientX: window.innerWidth/2, clientY: window.innerHeight/2 });
        window.dispatchEvent(fakeEvent);
    }

    closeFixedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearFixedSilo();
    });

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
                if (currentHovered === data) return;
                resetHighlight();
                currentHovered = data;
                if (!selectedSilo) {
                    applyHover(data);
                } else {
                    if (data.lineRef) data.lineRef.scale.set(1.4, 1.4, 1);
                    if (data.type === 'commandCenter' && data.name === "NORAD" && starGlow) starGlow.intensity = 0.7;
                }
            } else {
                resetHighlight();
                if (!selectedSilo) {
                    hoverNameEl.textContent = "—";
                    hoverSubEl.innerHTML = "Pasa el cursor sobre un icono";
                }
            }
        } else {
            resetHighlight();
            if (!selectedSilo) {
                hoverNameEl.textContent = "—";
                hoverSubEl.innerHTML = "Pasa el cursor sobre un icono";
            }
        }
    }

    window.addEventListener('mousemove', onMouseMove);

    // Función para manejar el clic (será llamada desde el script principal)
    function handleClick(event) {
        mouseVec.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouseVec.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        const clickRaycaster = new THREE.Raycaster();
        clickRaycaster.setFromCamera(mouseVec, camera);
        const hits = clickRaycaster.intersectObjects(allSiloItems.map(s => s.hitSphere));
        if (hits.length) {
            const data = hits[0].object.userData;
            if (data.type === 'silo') {
                setFixedSilo(data);
                return true; // evento manejado
            }
        }
        return false; // no manejado, que lo procese el script principal
    }

    // Devolvemos las funciones que necesita el script principal
    return {
        clearFixedSilo,
        handleClick
    };
}