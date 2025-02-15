let currentSlide = 0;
const slideWidth = 210; 
const visibleSlides = 5;
const totalSlides = document.querySelectorAll('.company-box').length;
const slider = document.getElementById('slider');

function slide(direction) {
    currentSlide += direction;
    const maxSlide = totalSlides - visibleSlides;

    if (currentSlide < 0) {
        currentSlide = 0; 
    }
    if (currentSlide > maxSlide) {
        currentSlide = maxSlide; 
    }
    slider.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
}



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

const arrowButton = document.querySelector('.Arrow');
const iconsList = document.querySelector('.icons');
arrowButton.addEventListener('click', () => {
    iconsList.classList.toggle('open');
    iconsList.classList.toggle('closed');
});

function changeTab(clickedTab, tabName, boxId) {
    const box = document.getElementById(boxId);
    const tabs = box.querySelectorAll('.tab-button');
    const slider = box.querySelector('.tab-slider');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    
    const index = Array.from(tabs).indexOf(clickedTab);
    slider.style.left = `${index * 33 + 1.5}%`;
    
    console.log(`Switched to tab: ${tabName} in ${boxId}`);
    }
  
document.addEventListener('DOMContentLoaded', function() {
    const percentageCells = document.querySelectorAll('.Market .row:not(:first-child) .cell:nth-child(3)');
    
    percentageCells.forEach(cell => {
        const percentage = parseFloat(cell.textContent);
        const indicator = document.createElement('span');
        indicator.classList.add('trend-indicator');
        
        if (percentage > 0) {
            indicator.textContent = '▲';
            indicator.classList.add('trend-up');
        } else if (percentage < 0) {
            indicator.textContent = '▼';
            indicator.classList.add('trend-down');
        }
        
        cell.appendChild(indicator);
    });
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
  

document.querySelector('.filter-icon').addEventListener('click', function() {
    const filterBox = document.getElementById('filterBox');
    filterBox.style.display = filterBox.style.display === 'none' ? 'block' : 'none';
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const filterIcon = document.querySelector('.filter-icon');
    const filterBox = document.getElementById('filterBox');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceRangeSpan = document.getElementById('priceRange');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const percentageChangeSelect = document.getElementById('percentageChange');
    const sortBySelect = document.getElementById('sortBy');
    const quickFilterButtons = document.querySelectorAll('.quick-filter');
    const customMinInput = document.getElementById('customMin');
    const customMaxInput = document.getElementById('customMax');
    const applyFiltersBtn = document.getElementById('applyFilters');
  
    filterIcon.addEventListener('click', function() {
        filterBox.classList.toggle('show');
        filterBox.classList.toggle('hide');
    });
  
    function updatePriceRange() {
        priceRangeSpan.textContent = `$${minPriceInput.value} - $${maxPriceInput.value}`;
    }
  
    function validatePriceRange() {
      if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
          maxPriceInput.value = minPriceInput.value;
      }
      updatePriceRange();
    }
  
    function validateCustomRange() {
      let min = parseFloat(customMinInput.value);
      let max = parseFloat(customMaxInput.value);
      
      min = Math.max(-100, Math.min(100, min));
      max = Math.max(-100, Math.min(100, max));
      
      if (min > max) {
          max = min;
      } else if (max < min) {
          min = max;
      }
      
      customMinInput.value = min;
      customMaxInput.value = max;
    }
  
    minPriceInput.addEventListener('input', validatePriceRange);
    maxPriceInput.addEventListener('input', validatePriceRange);
    customMinInput.addEventListener('input', validateCustomRange);
    customMaxInput.addEventListener('input', validateCustomRange);
  
    quickFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
  
    clearFiltersBtn.addEventListener('click', function() {
        minPriceInput.value = 0;
        maxPriceInput.value = 1000;
        updatePriceRange();
        percentageChangeSelect.value = '';
        sortBySelect.value = 'priceAsc';
        customMinInput.value = '';
        customMaxInput.value = '';
        quickFilterButtons.forEach(button => button.classList.remove('selected'));
    });
  
    updatePriceRange();
  });

  function makeDraggableAndResizable() {
    const filterBox = document.getElementById('filterBox');
    const filterHeader = filterBox.querySelector('h3'); 
    let isDragging = false;
    let isResizing = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let initialWidth;
    let initialHeight;
    filterHeader.addEventListener('mousedown', startDrag);
    filterBox.addEventListener('mousedown', startResize);
    document.addEventListener('mousemove', handleAction);
    document.addEventListener('mouseup', stopAction);
    function startDrag(e) {
        isDragging = true;
        initialX = e.clientX - filterBox.offsetLeft;
        initialY = e.clientY - filterBox.offsetTop;
        filterBox.classList.add('dragging');
    }

    function startResize(e) {
        const rect = filterBox.getBoundingClientRect();
        const isClickNearEdge = 
            e.clientX > rect.right - 20 && 
            e.clientY > rect.bottom - 20;

        if (isClickNearEdge) {
            isResizing = true;
            initialWidth = filterBox.offsetWidth;
            initialHeight = filterBox.offsetHeight;
            filterBox.classList.add('resizing');
        }
    }
    
function handleAction(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            filterBox.style.left = `${currentX}px`;
            filterBox.style.top = `${currentY}px`;
        }
        else if (isResizing) {
            e.preventDefault();
            const width = initialWidth + (e.clientX - (initialX + initialWidth));
            const height = initialHeight + (e.clientY - (initialY + initialHeight));
            
            filterBox.style.width = `${Math.max(250, width)}px`;
            filterBox.style.height = `${Math.max(300, height)}px`;
        }
    }
  
    function stopAction() {
        isDragging = false;
        isResizing = false;
        filterBox.classList.remove('dragging', 'resizing');
    }
}
  document.addEventListener('DOMContentLoaded', makeDraggableAndResizable);

  const stockData = [
    {
      company: 'TSLA',
      price: 121.2,
      change: 1.26,
      changePercent: 2.35,
      volume: '819.35M',
      marketCap: '15.2B',
      yearChange: 120.5
    },
    {
      company: 'GOOG',
      price: 79.5,
      change: -0.8,
      changePercent: -1.25,
      volume: '551.28M',
      marketCap: '8.4B',
      yearChange: -57.2
    },
    {
      company: 'AAPL',
      price: 74.8,
      change: 4.97,
      changePercent: 6.82,
      volume: '546.65M',
      marketCap: '6.9B',
      yearChange: 28.9
    },
    {
      company: 'META',
      price: 34.5,
      change: -3.23,
      changePercent: -4.15,
      volume: '317.75M',
      marketCap: '3.2B',
      yearChange: -151.3
    },
    {
      company: 'NVDA',
      price: 62.3,
      change: 0.65,
      changePercent: 1.05,
      volume: '288.38M',
      marketCap: '5.1B',
      yearChange: 222.4
    },

{
company: 'AMZN',
price: 102.5,
change: 2.3,
changePercent: 2.29,
volume: '450.12M',
marketCap: '9.8B',
yearChange: 15.7
},
{
company: 'MSFT',
price: 258.7,
change: -1.5,
changePercent: -0.58,
volume: '320.45M',
marketCap: '18.5B',
yearChange: 32.1
},


    
  ];

  function getCompanyInitials(name) {
    return name.split(/\s+/).map(word => word[0]).join('').slice(0, 2);
  }

  function formatChangeValue(value, percent) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  }

  function renderStockRow(stock) {
    const changeClass = stock.change >= 0 ? 'positive' : 'negative';
    const yearChangeClass = stock.yearChange >= 0 ? 'positive' : 'negative';
    
    return `
      <tr onclick="handleRowClick('${stock.company}')">
        <td>
          <div class="company-cell">
            <div class="company-icon">${getCompanyInitials(stock.company)}</div>
            ${stock.company}
          </div>
        </td>
        <td>${stock.price.toFixed(2)}</td>
        <td>
          <div class="change-wrapper ${changeClass}">
            <span class="change-value">${formatChangeValue(stock.change, stock.changePercent)}</span>
            <span class="arrow">${stock.change >= 0 ? '↑' : '↓'}</span>
          </div>
        </td>
        <td class="volume">${stock.volume}</td>
        <td class="market-cap">${stock.marketCap}</td>
        <td class="${yearChangeClass}">
          ${stock.yearChange >= 0 ? '+' : ''}${stock.yearChange.toFixed(1)}%
        </td>
      </tr>
    `;
  }

  document.getElementById('stockTableBody').innerHTML = 
    stockData.map(stock => renderStockRow(stock)).join('');

  document.querySelector('.search-bar-2').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = stockData.filter(stock => 
      stock.company.toLowerCase().includes(searchTerm)
    );
    document.getElementById('stockTableBody').innerHTML = 
      filteredData.map(stock => renderStockRow(stock)).join('');
  });