class LocationDropdown extends Dropdown {
    constructor(inputId) {
        fetch('options/house_IN_Location_values.txt')
            .then(response => response.text())
            .then(text => {
                const locations = text.split('\n').filter(loc => loc.trim());
                super(inputId, locations);
            });
    }
}

class FeatureToggle {
    constructor(features) {
        this.features = features;
        this.selectedFeatures = new Set();
        this.init();
    }

    init() {
        const container = document.querySelector('.feature-toggles');
        this.features.forEach(feature => {
            const button = document.createElement('button');
            button.className = 'feature-toggle-btn';
            button.textContent = feature;
            button.addEventListener('click', () => this.toggleFeature(feature, button));
            container.appendChild(button);
        });
    }

    toggleFeature(feature, button) {
        const inputsContainer = document.querySelector('.optional-inputs');
        
        if (this.selectedFeatures.has(feature)) {
            this.selectedFeatures.delete(feature);
            button.classList.remove('active');
            document.querySelector(`[data-feature="${feature}"]`)?.remove();
        } else {
            this.selectedFeatures.add(feature);
            button.classList.add('active');
            this.createInputField(feature, inputsContainer);
        }
    }

    createInputField(feature, container) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.dataset.feature = feature;
        
        if (feature === 'Location') {
            new LocationDropdown(feature.toLowerCase());
        } else {
            const input = document.createElement('input');
            input.type = feature.includes('No.') ? 'number' : 'text';
            input.id = feature.toLowerCase().replace(/\s+/g, '_');
            input.required = true;
            
            const label = document.createElement('label');
            label.textContent = feature;
            
            inputGroup.appendChild(input);
            inputGroup.appendChild(label);
        }
        
        container.appendChild(inputGroup);
    }
}

// Initialize map
function initMap() {
    const map = new google.maps.Map(document.getElementById('india-map'), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
        restriction: {
            latLngBounds: {
                north: 35.6745457,
                south: 6.2325274,
                east: 97.395561,
                west: 68.1113787,
            },
            strictBounds: true,
        }
    });

    let marker;
    
    map.addListener('click', (e) => {
        if (marker) marker.setMap(null);
        
        marker = new google.maps.Marker({
            position: e.latLng,
            map: map
        });

        document.getElementById('latitude').value = e.latLng.lat();
        document.getElementById('longitude').value = e.latLng.lng();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize feature toggles
    const featureToggle = new FeatureToggle([
        "Resale", "MaintenanceStaff", "Gymnasium", "SwimmingPool",
        // ... rest of the optional features
    ]);

    // Initialize form handling
    const form = document.getElementById('prediction-form');
    form.addEventListener('submit', handlePrediction);
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