class Dropdown {
    constructor(inputId, options) {
        this.input = document.getElementById(inputId);
        this.options = options;
        this.input.placeholder = inputId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        this.setupDropdown();
    }

    setupDropdown() {
        this.input.readOnly = true;

        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown-container';
        this.input.parentNode.appendChild(dropdownContainer);

        dropdownContainer.appendChild(this.input);

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'dropdown-search';
        searchInput.placeholder = 'Search...';

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dropdown-options';

        dropdownMenu.appendChild(searchInput);
        dropdownMenu.appendChild(optionsContainer);
        dropdownContainer.appendChild(dropdownMenu);

        this.input.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-container').forEach(container => {
                container.classList.remove('active');
            });
            dropdownContainer.classList.add('active');
            dropdownMenu.classList.add('active');
            searchInput.focus();
        });

        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterOptions(searchTerm, optionsContainer);
        });

        this.filterOptions('', optionsContainer);
    }

    filterOptions(searchTerm, container) {
        container.innerHTML = '';
        const filteredOptions = this.options.filter(option =>
            option.toLowerCase().includes(searchTerm)
        );

        filteredOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'dropdown-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => {
                this.input.value = option;
                container.parentNode.classList.remove('active');
            });
            container.appendChild(optionElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const locationResponse = await fetch('../public/options/car_IN_Location_values.txt');
        const locationText = await locationResponse.text();
        const locationOptions = locationText.split('\n').filter(location => location.trim());

        const brandResponse = await fetch('../public/options/car_IN_Brand_values.txt');
        const brandText = await brandResponse.text();
        const brandOptions = brandText.split('\n').filter(brand => brand.trim());

        const fuelResponse = await fetch('../public/options/car_IN_Fuel_Type_values.txt');
        const fuelText = await fuelResponse.text();
        const fuelOptions = fuelText.split('\n').filter(fuel => fuel.trim());

        const ownerResponse = await fetch('../public/options/car_IN_Owner_Type_values.txt');
        const ownerText = await ownerResponse.text();
        const ownerOptions = ownerText.split('\n').filter(owner => owner.trim());

        const transmissionResponse = await fetch('../public/options/car_IN_Transmission_values.txt');
        const transmissionText = await transmissionResponse.text();
        const transmissionOptions = transmissionText.split('\n').filter(transmission => transmission.trim());

        new Dropdown('location', locationOptions);
        new Dropdown('brand', brandOptions);
        new Dropdown('fuel_type', fuelOptions);
        new Dropdown('owner_type', ownerOptions);
        new Dropdown('transmission', transmissionOptions);
    } catch (error) {
        console.error('Error loading dropdown options:', error);
    }
});

document.getElementById('prediction-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const inputs = this.querySelectorAll('input[required]');
    let isValid = true;
    let brand = document.getElementById('brand').value
    let year = document.getElementById('year').value
    let location = document.getElementById('location').value
    let kilometers = document.getElementById('kilometers').value
    let fuel_type = document.getElementById('fuel_type').value
    let transmission = document.getElementById('transmission').value
    let owner_type = document.getElementById('owner_type').value
    let mileage = document.getElementById('mileage').value
    let engine = document.getElementById('engine').value
    let power = document.getElementById('power').value
    let seats = document.getElementById('seats').value
    const price = await fetchingalldata(brand, year, location, kilometers, fuel_type, transmission, owner_type, mileage, engine, power, seats)
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.parentElement.classList.add('error');
        }
    });

    if (!isValid) {
        return;
    }
    const result = document.getElementById('result');
    const gifNumber = Math.floor(Math.random() * 4) + 1;
    const gifPath = `../public/Media/car/car_${gifNumber}.gif`;

    document.getElementById('prediction-gif').src = gifPath;
    document.querySelector('.price-value').textContent =  Number.parseInt(price).toFixed(2) +"Lakhs";

    result.classList.add('show');
    result.style.animation = 'fadeInUp 0.5s ease forwards';
});

document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

document.querySelector('.remove-btn').addEventListener('click', function () {
    document.querySelectorAll('.input-group input').forEach(input => {
        input.value = '';
        input.parentElement.classList.remove('focused');
    });

    const result = document.getElementById('result');
    result.classList.remove('show');
});




const arrowButton = document.querySelector('.Arrow');
const iconsList = document.querySelector('.icons');

arrowButton.addEventListener('click', () => {
    iconsList.classList.toggle('open');
    iconsList.classList.toggle('closed');
});

document.addEventListener("DOMContentLoaded", function () {
    const primarySection = document.querySelector('.primary-section');
    const secondarySection = document.querySelector('.secondary-section');
    const primaryElements = document.querySelector('.primary-elements');
    const secondaryElements = document.querySelector('.secondary-elements');

    const servicesDropdown = document.querySelector('.services-dropdown');
    const companyDropdown = document.querySelector('.company-dropdown');
    const servicesLink = document.querySelector('.serv');
    const companyLink = document.querySelector('.comp');

    function showDropdown(dropdown) {
        dropdown.style.display = 'block';
        dropdown.classList.add('show');
        dropdown.classList.remove('hide');
    }

    function hideDropdown(dropdown) {
        dropdown.classList.add('hide');
        dropdown.classList.remove('show');

        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300);
    }

    primaryElements.style.display = 'block';
    secondaryElements.style.display = 'none';

    primarySection.addEventListener('mouseenter', function () {
        primaryElements.style.display = 'block';
        secondaryElements.style.display = 'none';
    });

    secondarySection.addEventListener('mouseenter', function () {
        secondaryElements.style.display = 'block';
        primaryElements.style.display = 'none';
    });

    servicesDropdown.addEventListener('mouseleave', function () {
        hideDropdown(servicesDropdown);
    });

    servicesLink.addEventListener('mouseenter', function (event) {
        showDropdown(servicesDropdown);
        hideDropdown(companyDropdown);
    });

    companyLink.addEventListener('mouseenter', function (event) {
        showDropdown(companyDropdown);
        hideDropdown(servicesDropdown);
    });

    servicesDropdown.addEventListener('mouseleave', function () {
        hideDropdown(servicesDropdown);
    });

    companyDropdown.addEventListener('mouseleave', function () {
        hideDropdown(companyDropdown);
    });
});




document.addEventListener('DOMContentLoaded', function () {

    let expand = false;


    document.querySelector(".Arrow").addEventListener('click', function () {

        expand = !expand;

        document.querySelectorAll(".Icon-items").forEach(function (item) {
            const iconName = item.querySelector('.icon-name');
            const nameText = item.getAttribute('data-name');

            if (iconName.style.display === "none" || iconName.style.display === ' ') {
                iconName.textContent = nameText;
                iconName.style.display = 'inline-block';
            } else {
                iconName.style.display = 'none';
            }


        })

        document.querySelector(".Arrow").style.transform = expand ? 'rotate(0deg)' : 'rotate(180deg)';

    })

});

document.addEventListener('DOMContentLoaded', function () {

    const dateRangeButtons = document.querySelectorAll('.date-range-button');
    const showFullGraphBtn = document.getElementById('show-full-graph');

    dateRangeButtons.forEach(button => {
        button.addEventListener('click', () => {
            dateRangeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    showFullGraphBtn.addEventListener('click', () => {
    });

});

//loading animation  -------------------------
function restartCubeAnimation() {
    const cube = document.querySelector('.cube');
    const cubeEdges = cube.querySelectorAll('.cube-edge');
    cubeEdges.forEach(edge => {
        const clone = edge.cloneNode(true);
        edge.parentNode.replaceChild(clone, edge);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(restartCubeAnimation, 11600);
});

//     
let pricing;
const loading = document.getElementById('loading')
const background = document.getElementById('background')
async function fetchingalldata(brand, year, location, kilometers, fuel_type, transmission, owner_type, mileage, engine, power, seats) {
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    loading.style.marginTop='500px'
    background.style.zIndex = '-999'
    background.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/car/IN', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ brand, year, location, kilometers, fuel_type, transmission, owner_type, mileage, engine, power, seats })
        });
        const data = await response.json();
        pricing = data.value
        console.log(pricing)
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            background.style.zIndex = '999'
            background.style.filter = 'none'
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return pricing;
}










