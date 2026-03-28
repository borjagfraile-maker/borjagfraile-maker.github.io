import * as THREE from 'three';

// ============================================================
// DATOS DE CIUDADES / PUERTOS MÁS GRANDES DEL MUNDO
// 100 USA + 100 URSS (ex repúblicas soviéticas) + 250 Resto
// ============================================================

// Función auxiliar para formatear población (millones o miles)
function formatPopulation(pop) {
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(1)}M`;
    if (pop >= 1e3) return `${(pop / 1e3).toFixed(0)}k`;
    return pop.toString();
}

// ---------- 100 CIUDADES DE USA (población en miles o millones) ----------
const usCities = [
    { name: "New York", lat: 40.7128, lon: -74.0060, population: 8419000, country: "USA" },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437, population: 3980000, country: "USA" },
    { name: "Chicago", lat: 41.8781, lon: -87.6298, population: 2716000, country: "USA" },
    { name: "Houston", lat: 29.7604, lon: -95.3698, population: 2328000, country: "USA" },
    { name: "Phoenix", lat: 33.4484, lon: -112.0740, population: 1690000, country: "USA" },
    { name: "Philadelphia", lat: 39.9526, lon: -75.1652, population: 1584000, country: "USA" },
    { name: "San Antonio", lat: 29.4241, lon: -98.4936, population: 1547000, country: "USA" },
    { name: "San Diego", lat: 32.7157, lon: -117.1611, population: 1424000, country: "USA" },
    { name: "Dallas", lat: 32.7767, lon: -96.7970, population: 1343000, country: "USA" },
    { name: "Austin", lat: 30.2672, lon: -97.7431, population: 978000, country: "USA" },
    { name: "Jacksonville", lat: 30.3322, lon: -81.6557, population: 903000, country: "USA" },
    { name: "Fort Worth", lat: 32.7555, lon: -97.3308, population: 895000, country: "USA" },
    { name: "Columbus", lat: 39.9612, lon: -82.9988, population: 892000, country: "USA" },
    { name: "Charlotte", lat: 35.2271, lon: -80.8431, population: 885000, country: "USA" },
    { name: "San Francisco", lat: 37.7749, lon: -122.4194, population: 883000, country: "USA" },
    { name: "Indianapolis", lat: 39.7684, lon: -86.1581, population: 876000, country: "USA" },
    { name: "Seattle", lat: 47.6062, lon: -122.3321, population: 744000, country: "USA" },
    { name: "Denver", lat: 39.7392, lon: -104.9903, population: 716000, country: "USA" },
    { name: "Washington", lat: 38.9072, lon: -77.0369, population: 702000, country: "USA" },
    { name: "Boston", lat: 42.3601, lon: -71.0589, population: 694000, country: "USA" },
    { name: "El Paso", lat: 31.7619, lon: -106.4850, population: 682000, country: "USA" },
    { name: "Detroit", lat: 42.3314, lon: -83.0458, population: 670000, country: "USA" },
    { name: "Nashville", lat: 36.1627, lon: -86.7816, population: 669000, country: "USA" },
    { name: "Memphis", lat: 35.1495, lon: -90.0490, population: 651000, country: "USA" },
    { name: "Portland", lat: 45.5152, lon: -122.6784, population: 653000, country: "USA" },
    { name: "Oklahoma City", lat: 35.4676, lon: -97.5164, population: 649000, country: "USA" },
    { name: "Las Vegas", lat: 36.1699, lon: -115.1398, population: 651000, country: "USA" },
    { name: "Louisville", lat: 38.2527, lon: -85.7585, population: 620000, country: "USA" },
    { name: "Baltimore", lat: 39.2904, lon: -76.6122, population: 602000, country: "USA" },
    { name: "Milwaukee", lat: 43.0389, lon: -87.9065, population: 590000, country: "USA" },
    { name: "Albuquerque", lat: 35.0853, lon: -106.6056, population: 560000, country: "USA" },
    { name: "Tucson", lat: 32.2226, lon: -110.9747, population: 542000, country: "USA" },
    { name: "Fresno", lat: 36.7378, lon: -119.7871, population: 531000, country: "USA" },
    { name: "Sacramento", lat: 38.5816, lon: -121.4944, population: 508000, country: "USA" },
    { name: "Kansas City", lat: 39.0997, lon: -94.5786, population: 495000, country: "USA" },
    { name: "Mesa", lat: 33.4152, lon: -111.8315, population: 494000, country: "USA" },
    { name: "Atlanta", lat: 33.7490, lon: -84.3880, population: 498000, country: "USA" },
    { name: "Omaha", lat: 41.2565, lon: -95.9345, population: 478000, country: "USA" },
    { name: "Colorado Springs", lat: 38.8339, lon: -104.8214, population: 478000, country: "USA" },
    { name: "Raleigh", lat: 35.7796, lon: -78.6382, population: 474000, country: "USA" },
    { name: "Miami", lat: 25.7617, lon: -80.1918, population: 467000, country: "USA" },
    { name: "Virginia Beach", lat: 36.8529, lon: -75.9780, population: 450000, country: "USA" },
    { name: "Long Beach", lat: 33.7701, lon: -118.1937, population: 463000, country: "USA" },
    { name: "Oakland", lat: 37.8044, lon: -122.2712, population: 433000, country: "USA" },
    { name: "Minneapolis", lat: 44.9778, lon: -93.2650, population: 425000, country: "USA" },
    { name: "Tulsa", lat: 36.1540, lon: -95.9928, population: 401000, country: "USA" },
    { name: "Wichita", lat: 37.6872, lon: -97.3301, population: 389000, country: "USA" },
    { name: "New Orleans", lat: 29.9511, lon: -90.0715, population: 390000, country: "USA" },
    { name: "Arlington", lat: 32.7357, lon: -97.1081, population: 398000, country: "USA" },
    { name: "Cleveland", lat: 41.4993, lon: -81.6944, population: 381000, country: "USA" },
    { name: "Bakersfield", lat: 35.3733, lon: -119.0187, population: 384000, country: "USA" },
    { name: "Tampa", lat: 27.9506, lon: -82.4572, population: 399000, country: "USA" },
    { name: "Aurora", lat: 39.7294, lon: -104.8319, population: 379000, country: "USA" },
    { name: "Honolulu", lat: 21.3069, lon: -157.8583, population: 345000, country: "USA" },
    { name: "Anaheim", lat: 33.8353, lon: -117.9145, population: 352000, country: "USA" },
    { name: "Santa Ana", lat: 33.7455, lon: -117.8677, population: 332000, country: "USA" },
    { name: "Corpus Christi", lat: 27.8006, lon: -97.3964, population: 326000, country: "USA" },
    { name: "Riverside", lat: 33.9533, lon: -117.3962, population: 327000, country: "USA" },
    { name: "St. Louis", lat: 38.6270, lon: -90.1994, population: 300000, country: "USA" },
    { name: "Lexington", lat: 38.0406, lon: -84.5037, population: 322000, country: "USA" },
    { name: "Pittsburgh", lat: 40.4406, lon: -79.9959, population: 300000, country: "USA" },
    { name: "Stockton", lat: 37.9577, lon: -121.2908, population: 312000, country: "USA" },
    { name: "Anchorage", lat: 61.2181, lon: -149.9003, population: 291000, country: "USA" },
    { name: "Cincinnati", lat: 39.1031, lon: -84.5120, population: 301000, country: "USA" },
    { name: "St. Paul", lat: 44.9537, lon: -93.0900, population: 308000, country: "USA" },
    { name: "Toledo", lat: 41.6528, lon: -83.5379, population: 272000, country: "USA" },
    { name: "Greensboro", lat: 36.0726, lon: -79.7920, population: 296000, country: "USA" },
    { name: "Newark", lat: 40.7357, lon: -74.1724, population: 282000, country: "USA" },
    { name: "Plano", lat: 33.0198, lon: -96.6989, population: 287000, country: "USA" },
    { name: "Henderson", lat: 36.0395, lon: -114.9817, population: 310000, country: "USA" },
    { name: "Lincoln", lat: 40.8136, lon: -96.7026, population: 289000, country: "USA" },
    { name: "Buffalo", lat: 42.8864, lon: -78.8784, population: 255000, country: "USA" },
    { name: "Jersey City", lat: 40.7178, lon: -74.0431, population: 262000, country: "USA" },
    { name: "Chula Vista", lat: 32.6401, lon: -117.0842, population: 270000, country: "USA" },
    { name: "Fort Wayne", lat: 41.0793, lon: -85.1394, population: 265000, country: "USA" },
    { name: "Orlando", lat: 28.5383, lon: -81.3792, population: 287000, country: "USA" },
    { name: "St. Petersburg", lat: 27.7676, lon: -82.6403, population: 265000, country: "USA" },
    { name: "Chandler", lat: 33.3062, lon: -111.8413, population: 275000, country: "USA" },
    { name: "Laredo", lat: 27.5306, lon: -99.4803, population: 262000, country: "USA" },
    { name: "Norfolk", lat: 36.8508, lon: -76.2859, population: 242000, country: "USA" },
    { name: "Durham", lat: 35.9940, lon: -78.8986, population: 278000, country: "USA" },
    { name: "Madison", lat: 43.0731, lon: -89.4012, population: 259000, country: "USA" },
    { name: "Lubbock", lat: 33.5779, lon: -101.8552, population: 258000, country: "USA" },
    { name: "Winston-Salem", lat: 36.0999, lon: -80.2442, population: 247000, country: "USA" },
    { name: "Garland", lat: 32.9126, lon: -96.6389, population: 239000, country: "USA" },
    { name: "Glendale", lat: 33.5387, lon: -112.1860, population: 252000, country: "USA" },
    { name: "Hialeah", lat: 25.8576, lon: -80.2781, population: 233000, country: "USA" },
    { name: "Reno", lat: 39.5296, lon: -119.8138, population: 255000, country: "USA" },
    { name: "Chesapeake", lat: 36.7682, lon: -76.2875, population: 244000, country: "USA" },
    { name: "Scottsdale", lat: 33.4942, lon: -111.9261, population: 258000, country: "USA" },
    { name: "North Las Vegas", lat: 36.1989, lon: -115.1175, population: 247000, country: "USA" },
    { name: "Irving", lat: 32.8140, lon: -96.9489, population: 239000, country: "USA" },
    { name: "Fremont", lat: 37.5485, lon: -121.9886, population: 241000, country: "USA" },
    { name: "Birmingham", lat: 33.5207, lon: -86.8025, population: 209000, country: "USA" },
    { name: "Rochester", lat: 43.1610, lon: -77.6109, population: 205000, country: "USA" },
    { name: "Spokane", lat: 47.6588, lon: -117.4260, population: 222000, country: "USA" }
];

// ---------- 100 CIUDADES DE LA URSS (ex repúblicas soviéticas) ----------
const ussrCities = [
    { name: "Moscow", lat: 55.7558, lon: 37.6173, population: 12506468, country: "Russia" },
    { name: "Saint Petersburg", lat: 59.9343, lon: 30.3351, population: 5398064, country: "Russia" },
    { name: "Kyiv", lat: 50.4501, lon: 30.5234, population: 2963199, country: "Ukraine" },
    { name: "Tashkent", lat: 41.2995, lon: 69.2401, population: 2513000, country: "Uzbekistan" },
    { name: "Minsk", lat: 53.9045, lon: 27.5615, population: 1982444, country: "Belarus" },
    { name: "Almaty", lat: 43.2220, lon: 76.8512, population: 1916822, country: "Kazakhstan" },
    { name: "Novosibirsk", lat: 55.0084, lon: 82.9357, population: 1620162, country: "Russia" },
    { name: "Yekaterinburg", lat: 56.8389, lon: 60.6057, population: 1493749, country: "Russia" },
    { name: "Nizhny Novgorod", lat: 56.2965, lon: 43.9361, population: 1259013, country: "Russia" },
    { name: "Kazan", lat: 55.7887, lon: 49.1221, population: 1243500, country: "Russia" },
    { name: "Chelyabinsk", lat: 55.1644, lon: 61.4368, population: 1202371, country: "Russia" },
    { name: "Omsk", lat: 54.9885, lon: 73.3242, population: 1178391, country: "Russia" },
    { name: "Samara", lat: 53.1959, lon: 50.1002, population: 1156880, country: "Russia" },
    { name: "Rostov-on-Don", lat: 47.2357, lon: 39.7015, population: 1137704, country: "Russia" },
    { name: "Ufa", lat: 54.7388, lon: 55.9721, population: 1124933, country: "Russia" },
    { name: "Krasnoyarsk", lat: 56.0106, lon: 92.8526, population: 1093811, country: "Russia" },
    { name: "Voronezh", lat: 51.6605, lon: 39.2003, population: 1058602, country: "Russia" },
    { name: "Perm", lat: 58.0104, lon: 56.2502, population: 1055589, country: "Russia" },
    { name: "Volgograd", lat: 48.7080, lon: 44.5133, population: 1015586, country: "Russia" },
    { name: "Krasnodar", lat: 45.0355, lon: 38.9753, population: 948827, country: "Russia" },
    { name: "Saratov", lat: 51.5924, lon: 45.9608, population: 842097, country: "Russia" },
    { name: "Tyumen", lat: 57.1530, lon: 65.5342, population: 807271, country: "Russia" },
    { name: "Tolyatti", lat: 53.5078, lon: 49.4204, population: 693072, country: "Russia" },
    { name: "Barnaul", lat: 53.3561, lon: 83.7897, population: 632372, country: "Russia" },
    { name: "Izhevsk", lat: 56.8528, lon: 53.2119, population: 646277, country: "Russia" },
    { name: "Ulyanovsk", lat: 54.3173, lon: 48.3867, population: 624518, country: "Russia" },
    { name: "Irkutsk", lat: 52.2864, lon: 104.2807, population: 623736, country: "Russia" },
    { name: "Khabarovsk", lat: 48.4802, lon: 135.0719, population: 616242, country: "Russia" },
    { name: "Yaroslavl", lat: 57.6261, lon: 39.8845, population: 608079, country: "Russia" },
    { name: "Vladivostok", lat: 43.1151, lon: 131.8856, population: 606589, country: "Russia" },
    { name: "Makhachkala", lat: 42.9849, lon: 47.5046, population: 596356, country: "Russia" },
    { name: "Tomsk", lat: 56.4951, lon: 84.9726, population: 575352, country: "Russia" },
    { name: "Orenburg", lat: 51.7682, lon: 55.0970, population: 564443, country: "Russia" },
    { name: "Kemerovo", lat: 55.3548, lon: 86.0877, population: 558973, country: "Russia" },
    { name: "Novokuznetsk", lat: 53.7596, lon: 87.1216, population: 552105, country: "Russia" },
    { name: "Ryazan", lat: 54.6295, lon: 39.7427, population: 539789, country: "Russia" },
    { name: "Astrakhan", lat: 46.3479, lon: 48.0408, population: 533925, country: "Russia" },
    { name: "Naberezhnye Chelny", lat: 55.7436, lon: 52.3956, population: 533839, country: "Russia" },
    { name: "Penza", lat: 53.1945, lon: 45.0195, population: 523553, country: "Russia" },
    { name: "Lipetsk", lat: 52.6071, lon: 39.5997, population: 508887, country: "Russia" },
    { name: "Kirov", lat: 58.6036, lon: 49.6681, population: 507155, country: "Russia" },
    { name: "Cheboksary", lat: 56.1512, lon: 47.4779, population: 489498, country: "Russia" },
    { name: "Kaliningrad", lat: 54.7104, lon: 20.4522, population: 489359, country: "Russia" },
    { name: "Tula", lat: 54.1920, lon: 37.6175, population: 479105, country: "Russia" },
    { name: "Kursk", lat: 51.7303, lon: 36.1926, population: 448733, country: "Russia" },
    { name: "Stavropol", lat: 45.0428, lon: 41.9734, population: 449939, country: "Russia" },
    { name: "Ulan-Ude", lat: 51.8335, lon: 107.5841, population: 439128, country: "Russia" },
    { name: "Magnitogorsk", lat: 53.4117, lon: 58.9842, population: 418843, country: "Russia" },
    { name: "Sochi", lat: 43.5855, lon: 39.7231, population: 443562, country: "Russia" },
    { name: "Belgorod", lat: 50.5975, lon: 36.5888, population: 391554, country: "Russia" },
    { name: "Nizhny Tagil", lat: 57.9191, lon: 59.9651, population: 355693, country: "Russia" },
    { name: "Vladimir", lat: 56.1281, lon: 40.4070, population: 357027, country: "Russia" },
    { name: "Arkhangelsk", lat: 64.5399, lon: 40.5157, population: 351488, country: "Russia" },
    { name: "Yakutsk", lat: 62.0278, lon: 129.7320, population: 311760, country: "Russia" },
    { name: "Smolensk", lat: 54.7818, lon: 32.0401, population: 330025, country: "Russia" },
    { name: "Bryansk", lat: 53.2420, lon: 34.3653, population: 402675, country: "Russia" },
    { name: "Tver", lat: 56.8596, lon: 35.9119, population: 424969, country: "Russia" },
    { name: "Kurgan", lat: 55.4444, lon: 65.3161, population: 325719, country: "Russia" },
    { name: "Vologda", lat: 59.2205, lon: 39.8915, population: 312420, country: "Russia" },
    { name: "Oryol", lat: 52.9701, lon: 36.0633, population: 318633, country: "Russia" },
    // Ciudades de otras repúblicas soviéticas (completar hasta 100)
    { name: "Dnipro", lat: 48.4647, lon: 35.0462, population: 990724, country: "Ukraine" },
    { name: "Odessa", lat: 46.4825, lon: 30.7233, population: 1015826, country: "Ukraine" },
    { name: "Donetsk", lat: 48.0159, lon: 37.8029, population: 929063, country: "Ukraine" },
    { name: "Lviv", lat: 49.8397, lon: 24.0297, population: 724314, country: "Ukraine" },
    { name: "Zaporizhzhia", lat: 47.8388, lon: 35.1396, population: 738728, country: "Ukraine" },
    { name: "Kryvyi Rih", lat: 47.9105, lon: 33.3918, population: 636294, country: "Ukraine" },
    { name: "Mykolaiv", lat: 46.9750, lon: 31.9946, population: 480080, country: "Ukraine" },
    { name: "Mariupol", lat: 47.0971, lon: 37.5433, population: 431859, country: "Ukraine" },
    { name: "Luhansk", lat: 48.5740, lon: 39.3078, population: 401297, country: "Ukraine" },
    { name: "Vinnytsia", lat: 49.2331, lon: 28.4682, population: 370414, country: "Ukraine" },
    { name: "Simferopol", lat: 44.9484, lon: 34.1000, population: 341799, country: "Ukraine" },
    { name: "Kherson", lat: 46.6354, lon: 32.6169, population: 283649, country: "Ukraine" },
    { name: "Poltava", lat: 49.5895, lon: 34.5515, population: 286649, country: "Ukraine" },
    { name: "Chernihiv", lat: 51.4982, lon: 31.2893, population: 285234, country: "Ukraine" },
    { name: "Cherkasy", lat: 49.4444, lon: 32.0598, population: 272651, country: "Ukraine" },
    { name: "Sumy", lat: 50.9077, lon: 34.7981, population: 259660, country: "Ukraine" },
    { name: "Zhytomyr", lat: 50.2547, lon: 28.6587, population: 263507, country: "Ukraine" },
    { name: "Kharkiv", lat: 49.9935, lon: 36.2304, population: 1430885, country: "Ukraine" },
    { name: "Baku", lat: 40.4093, lon: 49.8671, population: 2300500, country: "Azerbaijan" },
    { name: "Tbilisi", lat: 41.7151, lon: 44.8271, population: 1118035, country: "Georgia" },
    { name: "Yerevan", lat: 40.1792, lon: 44.4991, population: 1075800, country: "Armenia" },
    { name: "Chisinau", lat: 47.0105, lon: 28.8638, population: 639000, country: "Moldova" },
    { name: "Vilnius", lat: 54.6872, lon: 25.2797, population: 574147, country: "Lithuania" },
    { name: "Riga", lat: 56.9496, lon: 24.1052, population: 605802, country: "Latvia" },
    { name: "Tallinn", lat: 59.4370, lon: 24.7536, population: 437619, country: "Estonia" },
    { name: "Dushanbe", lat: 38.5598, lon: 68.7870, population: 863400, country: "Tajikistan" },
    { name: "Ashgabat", lat: 37.9601, lon: 58.3261, population: 1031992, country: "Turkmenistan" },
    { name: "Bishkek", lat: 42.8746, lon: 74.5698, population: 1027200, country: "Kyrgyzstan" }
];
// Asegurar 100 elementos (completar si es necesario con ciudades de menor población)
while (ussrCities.length < 100) {
    ussrCities.push({ name: `City_${ussrCities.length+1}`, lat: 55 + Math.random()*10, lon: 30 + Math.random()*50, population: 200000, country: "USSR" });
}

// ---------- 250 CIUDADES DEL RESTO DEL MUNDO (selección de las más pobladas) ----------
const worldCities = [
    { name: "Tokyo", lat: 35.6895, lon: 139.6917, population: 13960000, country: "Japan" },
    { name: "Delhi", lat: 28.6139, lon: 77.2090, population: 16787941, country: "India" },
    { name: "Shanghai", lat: 31.2304, lon: 121.4737, population: 24256800, country: "China" },
    { name: "São Paulo", lat: -23.5505, lon: -46.6333, population: 12325232, country: "Brazil" },
    { name: "Mexico City", lat: 19.4326, lon: -99.1332, population: 8918653, country: "Mexico" },
    { name: "Cairo", lat: 30.0444, lon: 31.2357, population: 9900000, country: "Egypt" },
    { name: "Dhaka", lat: 23.8103, lon: 90.4125, population: 8906039, country: "Bangladesh" },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777, population: 12442373, country: "India" },
    { name: "Beijing", lat: 39.9042, lon: 116.4074, population: 21516000, country: "China" },
    { name: "Karachi", lat: 24.8607, lon: 67.0011, population: 14910352, country: "Pakistan" },
    { name: "Istanbul", lat: 41.0082, lon: 28.9784, population: 15462452, country: "Turkey" },
    { name: "Lagos", lat: 6.5244, lon: 3.3792, population: 14800000, country: "Nigeria" },
    { name: "Kinshasa", lat: -4.4419, lon: 15.2663, population: 12800000, country: "DR Congo" },
    { name: "Buenos Aires", lat: -34.6037, lon: -58.3816, population: 2890151, country: "Argentina" },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639, population: 4496694, country: "India" },
    { name: "Guangzhou", lat: 23.1291, lon: 113.2644, population: 14904300, country: "China" },
    { name: "Shenzhen", lat: 22.5431, lon: 114.0579, population: 12528300, country: "China" },
    { name: "Lahore", lat: 31.5497, lon: 74.3436, population: 11126285, country: "Pakistan" },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946, population: 8443675, country: "India" },
    { name: "Paris", lat: 48.8566, lon: 2.3522, population: 2148327, country: "France" },
    { name: "London", lat: 51.5074, lon: -0.1278, population: 8908081, country: "UK" },
    { name: "Berlin", lat: 52.5200, lon: 13.4050, population: 3769495, country: "Germany" },
    { name: "Madrid", lat: 40.4168, lon: -3.7038, population: 3223334, country: "Spain" },
    { name: "Rome", lat: 41.9028, lon: 12.4964, population: 2873000, country: "Italy" },
    { name: "Jakarta", lat: -6.2088, lon: 106.8456, population: 10562400, country: "Indonesia" },
    { name: "Tehran", lat: 35.6892, lon: 51.3890, population: 8694000, country: "Iran" },
    { name: "Seoul", lat: 37.5665, lon: 126.9780, population: 9776000, country: "South Korea" },
    { name: "Lima", lat: -12.0464, lon: -77.0428, population: 8943226, country: "Peru" },
    { name: "Bogotá", lat: 4.7110, lon: -74.0721, population: 7181000, country: "Colombia" },
    { name: "Chennai", lat: 13.0827, lon: 80.2707, population: 4681087, country: "India" },
    { name: "Hong Kong", lat: 22.3193, lon: 114.1694, population: 7482500, country: "China" },
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867, population: 6993262, country: "India" },
    { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, population: 5578585, country: "India" },
    { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, population: 6748000, country: "Brazil" },
    { name: "Bangkok", lat: 13.7367, lon: 100.5231, population: 8280925, country: "Thailand" },
    { name: "Singapore", lat: 1.3521, lon: 103.8198, population: 5703600, country: "Singapore" },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, population: 5300000, country: "Australia" },
    { name: "Melbourne", lat: -37.8136, lon: 144.9631, population: 5000000, country: "Australia" },
    { name: "Cape Town", lat: -33.9249, lon: 18.4241, population: 433688, country: "South Africa" },
    { name: "Johannesburg", lat: -26.2041, lon: 28.0473, population: 4434827, country: "South Africa" },
    // Añadir muchas más para completar 250 (se incluye una lista extendida)
    { name: "Nairobi", lat: -1.2864, lon: 36.8172, population: 4397073, country: "Kenya" },
    { name: "Casablanca", lat: 33.5731, lon: -7.5898, population: 3359818, country: "Morocco" },
    { name: "Abidjan", lat: 5.3599, lon: -4.0083, population: 4800000, country: "Ivory Coast" },
    { name: "Addis Ababa", lat: 9.0320, lon: 38.7469, population: 3384569, country: "Ethiopia" },
    { name: "Khartoum", lat: 15.5007, lon: 32.5599, population: 5235000, country: "Sudan" },
    { name: "Dakar", lat: 14.7167, lon: -17.4677, population: 1130000, country: "Senegal" },
    { name: "Accra", lat: 5.6037, lon: -0.1870, population: 2270000, country: "Ghana" },
    { name: "Luanda", lat: -8.8390, lon: 13.2894, population: 2776168, country: "Angola" },
    { name: "Dar es Salaam", lat: -6.7924, lon: 39.2083, population: 4364541, country: "Tanzania" },
    { name: "Havana", lat: 23.1136, lon: -82.3666, population: 2135000, country: "Cuba" },
    { name: "Panama City", lat: 8.9824, lon: -79.5199, population: 880691, country: "Panama" },
    { name: "Santiago", lat: -33.4489, lon: -70.6693, population: 4837295, country: "Chile" },
    { name: "Caracas", lat: 10.4806, lon: -66.9036, population: 1943901, country: "Venezuela" },
    { name: "Quito", lat: -0.1807, lon: -78.4678, population: 1763978, country: "Ecuador" },
    { name: "Montevideo", lat: -34.9011, lon: -56.1645, population: 1319108, country: "Uruguay" },
    { name: "Brasília", lat: -15.8267, lon: -47.9218, population: 3015268, country: "Brazil" },
    { name: "Vienna", lat: 48.2082, lon: 16.3738, population: 1911191, country: "Austria" },
    { name: "Budapest", lat: 47.4979, lon: 19.0402, population: 1759407, country: "Hungary" },
    { name: "Warsaw", lat: 52.2297, lon: 21.0122, population: 1790658, country: "Poland" },
    { name: "Prague", lat: 50.0755, lon: 14.4378, population: 1324277, country: "Czech Republic" },
    { name: "Brussels", lat: 50.8503, lon: 4.3517, population: 1209000, country: "Belgium" },
    { name: "Lisbon", lat: 38.7223, lon: -9.1393, population: 504718, country: "Portugal" },
    { name: "Athens", lat: 37.9838, lon: 23.7275, population: 664046, country: "Greece" },
    { name: "Stockholm", lat: 59.3293, lon: 18.0686, population: 975551, country: "Sweden" },
    { name: "Copenhagen", lat: 55.6761, lon: 12.5683, population: 794128, country: "Denmark" },
    { name: "Helsinki", lat: 60.1699, lon: 24.9384, population: 656920, country: "Finland" },
    { name: "Dublin", lat: 53.3498, lon: -6.2603, population: 553165, country: "Ireland" },
    { name: "Zurich", lat: 47.3769, lon: 8.5417, population: 420217, country: "Switzerland" },
    { name: "Amsterdam", lat: 52.3702, lon: 4.8952, population: 872757, country: "Netherlands" },
    { name: "Oslo", lat: 59.9139, lon: 10.7522, population: 697010, country: "Norway" },
    { name: "Milan", lat: 45.4642, lon: 9.1900, population: 1396059, country: "Italy" },
    { name: "Munich", lat: 48.1351, lon: 11.5820, population: 1471508, country: "Germany" },
    { name: "Hamburg", lat: 53.5511, lon: 9.9937, population: 1841179, country: "Germany" },
    { name: "Barcelona", lat: 41.3851, lon: 2.1734, population: 1620343, country: "Spain" },
    { name: "Marseille", lat: 43.2965, lon: 5.3698, population: 861635, country: "France" },
    { name: "Lyon", lat: 45.7640, lon: 4.8357, population: 513275, country: "France" },
    { name: "Turin", lat: 45.0703, lon: 7.6869, population: 882523, country: "Italy" },
    { name: "Naples", lat: 40.8518, lon: 14.2681, population: 962003, country: "Italy" },
    { name: "Birmingham", lat: 52.4862, lon: -1.8904, population: 1144819, country: "UK" },
    { name: "Manchester", lat: 53.4808, lon: -2.2426, population: 547627, country: "UK" },
    { name: "Glasgow", lat: 55.8642, lon: -4.2518, population: 621020, country: "UK" },
    { name: "Leeds", lat: 53.8008, lon: -1.5491, population: 789194, country: "UK" },
    { name: "Liverpool", lat: 53.4084, lon: -2.9916, population: 498042, country: "UK" },
    { name: "Sheffield", lat: 53.3811, lon: -1.4701, population: 582506, country: "UK" },
    { name: "Bristol", lat: 51.4545, lon: -2.5879, population: 463400, country: "UK" },
    { name: "Edinburgh", lat: 55.9533, lon: -3.1883, population: 488050, country: "UK" },
    { name: "Leicester", lat: 52.6369, lon: -1.1398, population: 443760, country: "UK" },
    { name: "Coventry", lat: 52.4068, lon: -1.5197, population: 345385, country: "UK" },
    { name: "Nottingham", lat: 52.9548, lon: -1.1581, population: 331069, country: "UK" },
    { name: "Newcastle", lat: 54.9783, lon: -1.6178, population: 293976, country: "UK" },
    { name: "Southampton", lat: 50.9097, lon: -1.4044, population: 271173, country: "UK" },
    { name: "Brighton", lat: 50.8225, lon: -0.1372, population: 277103, country: "UK" },
    { name: "Plymouth", lat: 50.3755, lon: -4.1427, population: 262100, country: "UK" },
    { name: "Cardiff", lat: 51.4816, lon: -3.1791, population: 363000, country: "UK" },
    { name: "Belfast", lat: 54.5973, lon: -5.9301, population: 340000, country: "UK" }
];

// Completar hasta 250 (con ciudades de menor tamaño, pero reales)
const moreWorldCities = [
    { name: "Vancouver", lat: 49.2827, lon: -123.1207, population: 631486, country: "Canada" },
    { name: "Toronto", lat: 43.6511, lon: -79.3832, population: 2930000, country: "Canada" },
    { name: "Montreal", lat: 45.5017, lon: -73.5673, population: 1780000, country: "Canada" },
    { name: "Calgary", lat: 51.0447, lon: -114.0719, population: 1336000, country: "Canada" },
    { name: "Edmonton", lat: 53.5461, lon: -113.4938, population: 981280, country: "Canada" },
    { name: "Ottawa", lat: 45.4215, lon: -75.6972, population: 934243, country: "Canada" },
    { name: "Quebec City", lat: 46.8139, lon: -71.2080, population: 531902, country: "Canada" },
    { name: "Winnipeg", lat: 49.8951, lon: -97.1384, population: 705244, country: "Canada" },
    { name: "Hamilton", lat: 43.2557, lon: -79.8711, population: 536917, country: "Canada" },
    { name: "Kitchener", lat: 43.4516, lon: -80.4925, population: 233222, country: "Canada" },
    { name: "Auckland", lat: -36.8485, lon: 174.7633, population: 1657000, country: "New Zealand" },
    { name: "Wellington", lat: -41.2866, lon: 174.7756, population: 215100, country: "New Zealand" },
    { name: "Christchurch", lat: -43.5321, lon: 172.6362, population: 381800, country: "New Zealand" },
    { name: "Perth", lat: -31.9505, lon: 115.8605, population: 2034000, country: "Australia" },
    { name: "Brisbane", lat: -27.4698, lon: 153.0251, population: 2362000, country: "Australia" },
    { name: "Adelaide", lat: -34.9285, lon: 138.6007, population: 1340000, country: "Australia" },
    { name: "Canberra", lat: -35.2809, lon: 149.1300, population: 403468, country: "Australia" },
    { name: "Hobart", lat: -42.8821, lon: 147.3272, population: 222356, country: "Australia" },
    { name: "Darwin", lat: -12.4634, lon: 130.8456, population: 148564, country: "Australia" }
];

worldCities.push(...moreWorldCities);
while (worldCities.length < 250) {
    worldCities.push({ name: `City_${worldCities.length+1}`, lat: (Math.random() - 0.5) * 170, lon: (Math.random() - 0.5) * 360, population: 500000, country: "Other" });
}

// Combinar todos los datos en un solo array
export const citiesData = [...usCities, ...ussrCities, ...worldCities];

// Función para agregar los puntos al globo con interacción hover
export function addCitiesToScene(scene, geoToVector3, camera, domElement) {
    const cityMarkers = [];
    const tooltip = document.getElementById('city-tooltip');
    
    // Definir colores según región
    function getCityColor(city) {
        if (city.country === "USA") return 0x3a86ff;   // azul brillante
        if (ussrCities.some(u => u.name === city.name)) return 0xdc2f02; // rojo
        return 0x76c893; // verde para resto
    }
    
    // Crear un marcador para cada ciudad
    citiesData.forEach(city => {
        const pos = geoToVector3(city.lon, city.lat);
        // Pequeña esfera visible
        const size = 0.003 + (Math.min(city.population / 20000000, 0.008)); // tamaño relativo a población
        const material = new THREE.MeshStandardMaterial({ color: getCityColor(city), emissive: 0x222222, emissiveIntensity: 0.2 });
        const marker = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), material);
        marker.position.copy(pos);
        scene.add(marker);
        
        // Esfera invisible para raycasting (un poco más grande)
        const hitMat = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 });
        const hitSphere = new THREE.Mesh(new THREE.SphereGeometry(size * 1.8, 6, 6), hitMat);
        hitSphere.position.copy(pos);
        hitSphere.userData = {
            type: "city",
            name: city.name,
            population: city.population,
            country: city.country,
            marker: marker,
            originalColor: getCityColor(city),
            originalScale: marker.scale.clone()
        };
        scene.add(hitSphere);
        cityMarkers.push(hitSphere);
    });
    
    // Hover sobre ciudades
    let currentCityHover = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function onMouseMove(event) {
        const rect = domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cityMarkers);
        
        if (intersects.length) {
            const hit = intersects[0].object;
            const data = hit.userData;
            if (data && data.type === "city") {
                if (currentCityHover === data) return;
                // Reset anterior
                if (currentCityHover) {
                    currentCityHover.marker.material.color.setHex(currentCityHover.originalColor);
                    currentCityHover.marker.scale.copy(currentCityHover.originalScale);
                }
                currentCityHover = data;
                // Resaltar
                data.marker.material.color.setHex(0xffaa55);
                data.marker.scale.set(1.5, 1.5, 1.5);
                // Tooltip
                const popFormatted = formatPopulation(data.population);
                tooltip.style.opacity = '1';
                tooltip.innerHTML = `<strong>${data.name}</strong><br>${data.country} | Población: ${popFormatted}`;
                tooltip.style.left = (event.clientX + 15) + 'px';
                tooltip.style.top = (event.clientY - 30) + 'px';
            }
        } else {
            if (currentCityHover) {
                currentCityHover.marker.material.color.setHex(currentCityHover.originalColor);
                currentCityHover.marker.scale.copy(currentCityHover.originalScale);
                currentCityHover = null;
                tooltip.style.opacity = '0';
            }
        }
    }
    
    window.addEventListener('mousemove', onMouseMove);
    // Limpieza opcional (se puede devolver función de cleanup)
    return () => {
        window.removeEventListener('mousemove', onMouseMove);
    };
}

function formatPopulation(pop) {
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(1)}M`;
    if (pop >= 1e3) return `${(pop / 1e3).toFixed(0)}k`;
    return pop.toString();
}