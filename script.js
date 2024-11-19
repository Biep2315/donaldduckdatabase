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
        console.log(data)
        loadYears();
        loadWeeks();
        filterData();
    })
    .catch(error => {
        console.error('Er is een fout opgetreden bij het ophalen van de JSON:', error);
    });

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

function loadWeeks() {
    const weekSelect = document.getElementById("week");
    weekSelect.innerHTML = "<option value='Alle'>Alle</option>";
    for (let week = 1; week <= 52; week++) {
        const option = document.createElement("option");
        option.value = week;
        option.textContent = `Week ${week}`;
        weekSelect.appendChild(option);
    }
}

function filterData() {
    const jaar = document.getElementById("jaar").value;
    const week = document.getElementById("week").value;
    const locatie = document.getElementById("locatie").value.toLowerCase();
    const beschadigd = document.getElementById("beschadigd").value;

    const tableBody = document.getElementById("donaldDuckTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    let filteredData = [];

    for (const year in data.weekblad) {
        if (jaar !== "Alle" && year !== jaar) continue;

        for (const w in data.weekblad[year]) {
            if (week !== "Alle" && w !== week) continue;

            data.weekblad[year][w].forEach(item => {
                if (
                    (locatie && !item.locatie.toLowerCase().includes(locatie)) ||
                    (beschadigd !== "Alle" && item.beschadigd !== beschadigd)
                ) {
                    return;
                }
                filteredData.push(item);
            });
        }
    }

    filteredData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.jaar}</td>
            <td>${item.week}</td>
            <td>${item.beschadigd}</td>
            <td>${item.locatie}</td>
            <td>${item.opmerkingen}</td>
            <td>${item.serienr}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("resultCount").textContent = `Aantal resultaten: ${filteredData.length}`;
    showScrollToTopButton();
}

function toggleMenu() {
    const menu = document.getElementById("filtersContainer");
    menu.classList.toggle("open");
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showScrollToTopButton() {
    const button = document.getElementById("scrollToTopBtn");
    if (window.scrollY > 100) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

window.addEventListener("scroll", showScrollToTopButton);
