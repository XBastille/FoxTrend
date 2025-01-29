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
        const maritalResponse = await fetch('options/loan_IN_marital_status_values.txt');
        const maritalText = await maritalResponse.text();
        const maritalOptions = maritalText.split('\n').filter(status => status.trim());

        const houseResponse = await fetch('options/loan_IN_house_ownership_values.txt');
        const houseText = await houseResponse.text();
        const houseOptions = houseText.split('\n').filter(house => house.trim());

        const vehicleResponse = await fetch('options/loan_IN_vehicle_ownership_values.txt');
        const vehicleText = await vehicleResponse.text();
        const vehicleOptions = vehicleText.split('\n').filter(vehicle => vehicle.trim());

        new Dropdown('marital_status', maritalOptions);
        new Dropdown('house_ownership', houseOptions);
        new Dropdown('vehicle_ownership', vehicleOptions);
    } catch (error) {
        console.error('Error loading dropdown options:', error);
    }
});
 
document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const inputs = this.querySelectorAll('input[required]');
    let isValid = true;
    
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
    const gifNumber = Math.floor(Math.random() * 2) + 1;
    // For now, always showing approval (1)
    const isApproved = 1;
    const gifPath = isApproved ? `media/loan/loan_${gifNumber}.gif` : `media/loan/not_loan_${gifNumber}.jpg`;
    
    document.getElementById('prediction-gif').src = gifPath;
    document.querySelector('.price-value').textContent = isApproved ? "Congratulations! Your chances of loan approval are HIGH!" : "Sorry, your chances of loan approval are LOW";
    
    result.classList.add('show');
    result.style.animation = 'fadeInUp 0.5s ease forwards';
});
  
  document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
  });
  
  document.querySelector('.remove-btn').addEventListener('click', function() {
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
    
      primarySection.addEventListener('mouseenter', function() {
          primaryElements.style.display = 'block';  
          secondaryElements.style.display = 'none'; 
      });
    
      secondarySection.addEventListener('mouseenter', function() {
          secondaryElements.style.display = 'block'; 
          primaryElements.style.display = 'none';    
      });
    
      servicesDropdown.addEventListener('mouseleave', function() {
          hideDropdown(servicesDropdown);
      });
    
      servicesLink.addEventListener('mouseenter', function(event) {
          showDropdown(servicesDropdown);
          hideDropdown(companyDropdown);
      });
    
      companyLink.addEventListener('mouseenter', function(event) {
          showDropdown(companyDropdown);
          hideDropdown(servicesDropdown);
      });
    
      servicesDropdown.addEventListener('mouseleave', function() {
          hideDropdown(servicesDropdown);
      });
    
      companyDropdown.addEventListener('mouseleave', function() {
          hideDropdown(companyDropdown);
      });
    });
  
    
    
    
    document.addEventListener('DOMContentLoaded', function () {
    
      let expand = false;
      
    
    document.querySelector(".Arrow").addEventListener('click' , function(){
    
      expand = !expand;
    
        document.querySelectorAll(".Icon-items").forEach(function(item){
              const iconName = item.querySelector('.icon-name');
              const nameText = item.getAttribute('data-name');
    
              if(iconName.style.display === "none" || iconName.style.display === ' ') {
                iconName.textContent = nameText;
                iconName.style.display = 'inline-block';
              }else{
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