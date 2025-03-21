const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

let municipios = {};

const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb21pbmdvbXI1QGdtYWlsLmNvbSIsImp0aSI6IjJiOGI3ZWQ4LTNlM2YtNGQ0MC04YTc5LTA1ZGI0ZGM4MzZlMCIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNzQyNTcxNjU5LCJ1c2VySWQiOiIyYjhiN2VkOC0zZTNmLTRkNDAtOGE3OS0wNWRiNGRjODM2ZTAiLCJyb2xlIjoiIn0.tgvQDdOqilMT40DLbLOcq-Tv3tCeaNGV5QFcnWOGlus";

// Mapeo simple de iconos basado en palabras clave del estado del cielo
function obtenerIcono(descripcion) {
    const desc = descripcion.toLowerCase();

    if (desc.includes("tormenta")) return "thunderstorm.svg";
    if (desc.includes("lluvia")) return "rain.svg";
    if (desc.includes("nieve")) return "snow.svg";
    if (desc.includes("nubes") || desc.includes("nuboso")) return "clouds.svg";
    if (desc.includes("despejado") || desc.includes("soleado")) return "clear.svg";
    if (desc.includes("niebla") || desc.includes("bruma")) return "atmosphere.svg";
    if (desc.includes("chubascos")) return "drizzle.svg";

    return "clouds.svg"; // Por defecto
}

// Cargar municipios desde JSON externo con un timeout
async function cargarMunicipios() {
    try {
        const res = await Promise.race([
            fetch('./municipios.json'),
            new Promise((_, reject) => setTimeout(() => reject('Tiempo de espera agotado'), 5000)) // Timeout de 5 segundos
        ]);
        
        if (!res.ok) {
            throw new Error('Error al cargar municipios');
        }

        municipios = await res.json();
        console.log("Municipios cargados", municipios); // Verifica que se cargaron correctamente
    } catch (error) {
        console.error("Error cargando municipios:", error);
    }
}

// Eventos de búsqueda
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(city) {
    const idMunicipio = municipios[city];

    if (!idMunicipio) {
        showNotFound();
        return null;
    }

    try {
        const res1 = await fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${idMunicipio}/?api_key=${apiKey}`);
        const data1 = await res1.json();

        const datosUrl = data1.datos;
        const res2 = await fetch(datosUrl);
        const json = await res2.json();

        return json[0]; // Datos del municipio
    } catch (error) {
        console.error("Error al obtener datos de AEMET:", error);
        showNotFound();
        return null;
    }
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData(city);

    if (!weatherData) return;

    const today = weatherData.prediccion.dia[0];

    // Mostrar secciones correctas
    document.querySelector('.wheater-info').style.display = 'flex';
    document.querySelector('.search-city').style.display = 'none';
    document.querySelector('.not-found').style.display = 'none';

    // Actualizar datos
    document.querySelector('.country-txt').textContent = city;
    document.querySelector('.current-date-txt').textContent = formatFecha(today.fecha);
    document.querySelector('.temp-txt').textContent = `${today.temperatura.maxima} °C`;
    const estado = today.estadoCielo[0].descripcion || "N/A";
    document.querySelector('.condition-txt').textContent = estado;
    document.querySelector('.humidity-value-txt').textContent = `${today.humedadRelativa.maxima}%`;
    document.querySelector('.wind-value-txt').textContent = `${today.viento[0].velocidad} km/h`;

    // Icono
    const iconFile = obtenerIcono(estado);
    document.querySelector('.weather-summary-img').src = `./assets/weather/${iconFile}`;

    // Pronóstico
    const forecastContainer = document.querySelector('.forecast-items-container');
    forecastContainer.innerHTML = '';

    weatherData.prediccion.dia.slice(1, 5).forEach(dia => {
        const desc = dia.estadoCielo[0].descripcion || "";
        const icon = obtenerIcono(desc);

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-txt">${formatFecha(dia.fecha)}</h5>
            <img src="./assets/weather/${icon}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${dia.temperatura.maxima} °C</h5>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

function formatFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { weekday: 'long', day: '2-digit', month: '2-digit' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function showNotFound() {
    document.querySelector('.wheater-info').style.display = 'none';
    document.querySelector('.search-city').style.display = 'none';
    document.querySelector('.not-found').style.display = 'flex';
}

// Cargar municipios al iniciar
window.addEventListener('DOMContentLoaded', async () => {
    await cargarMunicipios();
    console.log("Municipios cargados", municipios); // Verifica que los municipios están cargados correctamente
});
