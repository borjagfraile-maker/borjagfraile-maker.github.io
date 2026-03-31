// Datos de ciudades globales, URSS y USA
export const globalCitiesPorts = [
    ["Londres",51.5074,-0.1278,"Reino Unido",true],
    ["París",48.8566,2.3522,"Francia",false],
    // ... (todos los datos originales)
];

export const ussrCitiesData = [
    "Moscú",55.7558,37.6173,
    "San Petersburgo",59.9343,30.3351,
    // ... (todos los datos)
];

export const usCitiesData = [
    "Nueva York",40.7128,-74.0060,
    "Los Ángeles",34.0522,-118.2437,
    // ... (todos los datos)
];

// Función para construir arrays de ciudades con tipo
export function buildCities() {
    const globalCities = globalCitiesPorts.map(c => ({
        name: c[0], lat: c[1], lon: c[2], country: c[3],
        type: c[4] ? "puerto" : "interior", side: "global"
    }));

    const ussrCities = [];
    for (let i = 0; i < ussrCitiesData.length; i += 3) {
        const name = ussrCitiesData[i];
        let type = "interior";
        if (["San Petersburgo","Odesa","Vladivostok","Kaliningrado","Novorossiysk","Sevastopol"].includes(name))
            type = "puerto";
        ussrCities.push({ name, lat: ussrCitiesData[i+1], lon: ussrCitiesData[i+2], side: "ussr", type, country: "URSS" });
    }

    const usCities = [];
    for (let i = 0; i < usCitiesData.length; i += 3) {
        const name = usCitiesData[i];
        let type = "interior";
        if (["Nueva York","Los Ángeles","San Diego","Seattle","Boston","Miami","Nueva Orleans","Baltimore","Portland"].includes(name))
            type = "puerto";
        usCities.push({ name, lat: usCitiesData[i+1], lon: usCitiesData[i+2], side: "usa", type, country: "EE.UU." });
    }

    return [...ussrCities, ...usCities, ...globalCities];
}

// Estimación de población
export function getPopulationEstimate(cityName, side) {
    const majorCities = ["Moscú", "Nueva York", "Los Ángeles", "Londres", "París", "Tokio", "Pekín", "Shanghái", "São Paulo", "Mumbai", "El Cairo", "Ciudad de México"];
    if (majorCities.includes(cityName)) return "~8-12M";
    if (cityName === "Chicago" || cityName === "Houston" || cityName === "Berlín" || cityName === "Madrid") return "~2.5-4M";
    if (side === "ussr") return "~1-2M";
    if (side === "usa") return "~500k-1.5M";
    return "~500k-2M";
}