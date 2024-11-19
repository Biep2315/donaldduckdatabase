// script.js

// data ophalen
let data = null;

fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error. status: ${response.status}`);
        }
        return response.json();
    })
    .then(jsonData => {
        data = jsonData;
        loadYears();
        loadWeeks();
        filterData();
    })
    .catch(error => {
        console.error('Er is een fout opgetreden bij het ophalen van de JSON:', error);
    });



// Functie om de jaaropties te laden
function loadYears() {
    const yearSelect = document.getElementById("jaar");
    const years = Object.keys(data.weekblad);
    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Functie om de weekopties te laden
function loadWeeks() {
    const weekSelect = document.getElementById("week");
    weekSelect.innerHTML = "<option value='Alle'>Alle</option>";  // Reset de weken

    // Voeg de weken 1 t/m 52 toe
    for (let week = 1; week <= 52; week++) {
        const option = document.createElement("option");
        option.value = week;
        option.textContent = `Week ${week}`;
        weekSelect.appendChild(option);
    }
}

// Functie om de tabel te filteren en weer te geven
function filterData() {
    const jaar = document.getElementById("jaar").value;
    const week = document.getElementById("week").value;
    const locatie = document.getElementById("locatie").value.toLowerCase();
    const beschadigd = document.getElementById("beschadigd").value;

    const tableBody = document.getElementById("donaldDuckTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Leeg de tabel

    let filteredData = [];

    // Filter de data
    for (const year in data.weekblad) {
        // Filter op jaar als het niet "Alle" is
        if (jaar !== "Alle" && year !== jaar) continue;

        for (const w in data.weekblad[year]) {
            // Filter op week als het niet "Alle" is
            if (week !== "Alle" && w !== week) continue;

            data.weekblad[year][w].forEach(item => {
                const [isDamaged, location, remarks, serialNr] = item;

                if (beschadigd !== "Alle" && (beschadigd === "Ja" ? !isDamaged : isDamaged)) {
                    return;
                }


                if (locatie && !location.toLowerCase().includes(locatie)) {
                    return;
                }

                filteredData.push([year, w, isDamaged ? "Ja" : "Nee", location, remarks, serialNr]);
            });
        }
    }

    filteredData.sort((a, b) => b[0] - a[0] || b[1] - a[1]);

    // Vul de tabel met de gefilterde gegevens
    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    // Update de teller
    const resultCount = document.getElementById("resultCount");
    resultCount.textContent = `Aantal resultaten: ${filteredData.length}`;
}


// script.js
function toggleMenu() {
    const menu = document.getElementById('filtersContainer');
    menu.classList.toggle('open'); // Toggle de 'open' klasse om het menu in en uit te schuiven
}

// Scroll naar boven functie
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Zorg voor een vloeiende overgang naar de top
    });
}

// Het knopje weergeven/verbergen op basis van scrollpositie
window.onscroll = function() {
    var scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Als we naar beneden scrollen, toon de knop, anders verberg hem
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};



