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

document.addEventListener('DOMContentLoaded', function () {
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


document.querySelector('.filter-icon').addEventListener('click', function () {
  const filterBox = document.getElementById('filterBox');
  filterBox.style.display = filterBox.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', function () {
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

  filterIcon.addEventListener('click', function () {
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
    button.addEventListener('click', function () {
      this.classList.toggle('selected');
    });
  });

  clearFiltersBtn.addEventListener('click', function () {
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




//graph comparing -------------------------------

//choosing random three value from trending
let i0;
let i1;
let i2;
do {
  i0 = Math.floor(Math.random() * 14);
  i1 = Math.floor(Math.random() * 14);
  i2 = Math.floor(Math.random() * 14);
} while (i0 === i1 || i0 === i2 || i1 === i2)
console.log(i0, i1, i2)
//graph1----------------------------------------------------------------------
const graph1comp1 = document.getElementById('graph1comp1')
const graph1comp2 = document.getElementById('graph1comp2')
const graph1comp3 = document.getElementById('graph1comp3')
const perati = document.getElementById('perati')
const volumess = document.getElementById('volumess')
const beta = document.getElementById('beta')
const cprice = document.getElementById('cprice')
//---------------------------------------------------------------------------------
//graph2-------------------------------------------------------------------
const graph2comp1 = document.getElementById('graph2comp1')
const graph2comp2 = document.getElementById('graph2comp2')
const graph2comp3 = document.getElementById('graph2comp3')
const peratii = document.getElementById('peratii')
const volumeess = document.getElementById('volumeess')
const betaa = document.getElementById('betaa')
const clprice = document.getElementById('clprice')
//graph3----------------------------------------------------------
const graph3comp1 = document.getElementById('graph3comp1')
const graph3comp2 = document.getElementById('graph3comp2')
const graph3comp3 = document.getElementById('graph3comp3')
const pera = document.getElementById('pera')
const vomes = document.getElementById('vomes')
const betaaa = document.getElementById('betaaa')
const cloprice = document.getElementById('cloprice')
//---------------------------------------------------------
const ticker1 = document.getElementById('ticker1')
const company1 = document.getElementById('company1')
const companyprice1 = document.getElementById('companyprice1')
const companypercent1 = document.getElementById('companypercent1')

const ticker2 = document.getElementById('ticker2')
const company2 = document.getElementById('company2')
const companyprice2 = document.getElementById('companyprice2')
const companypercent2 = document.getElementById('companypercent2')

const ticker3 = document.getElementById('ticker3')
const company3 = document.getElementById('company3')
const companyprice3 = document.getElementById('companyprice3')
const companypercent3 = document.getElementById('companypercent3')

const ticker4 = document.getElementById('ticker4')
const company4 = document.getElementById('company4')
const companyprice4 = document.getElementById('companyprice4')
const companypercent4 = document.getElementById('companypercent4')

const ticker5 = document.getElementById('ticker5')
const company5 = document.getElementById('company5')
const companyprice5 = document.getElementById('companyprice5')
const companypercent5 = document.getElementById('companypercent5')

const ticker6 = document.getElementById('ticker6')
const company6 = document.getElementById('company6')
const companyprice6 = document.getElementById('companyprice6')
const companypercent6 = document.getElementById('companypercent6')

const ticker7 = document.getElementById('ticker7')
const company7 = document.getElementById('company7')
const companyprice7 = document.getElementById('companyprice7')
const companypercent7 = document.getElementById('companypercent7')

const ticker8 = document.getElementById('ticker8')
const company8 = document.getElementById('company8')
const companyprice8 = document.getElementById('companyprice8')
const companypercent8 = document.getElementById('companypercent8')

const ticker9 = document.getElementById('ticker9')
const company9 = document.getElementById('company9')
const companyprice9 = document.getElementById('companyprice9')
const companypercent9 = document.getElementById('companypercent9')

const ticker10 = document.getElementById('ticker10')
const company10 = document.getElementById('company10')
const companyprice10 = document.getElementById('companyprice10')
const companypercent10 = document.getElementById('companypercent10')

const ticker11 = document.getElementById('ticker11')
const company11 = document.getElementById('company11')
const companyprice11 = document.getElementById('companyprice11')
const companypercent11 = document.getElementById('companypercent11')

const ticker12 = document.getElementById('ticker12')
const company12 = document.getElementById('company12')
const companyprice12 = document.getElementById('companyprice12')
const companypercent12 = document.getElementById('companypercent12')

const ticker13 = document.getElementById('ticker13')
const company13 = document.getElementById('company13')
const companyprice13 = document.getElementById('companyprice13')
const companypercent13 = document.getElementById('companypercent13')

const ticker14 = document.getElementById('ticker14')
const company14 = document.getElementById('company14')
const companyprice14 = document.getElementById('companyprice14')
const companypercent14 = document.getElementById('companypercent14')

const ticker15 = document.getElementById('ticker15')
const company15 = document.getElementById('company15')
const companyprice15 = document.getElementById('companyprice15')
const companypercent15 = document.getElementById('companypercent15')

function fetchingjson() {
  fetch("./public/json/sorted_stock_data.json")
    .then((res) => {
      if (!res.ok) {
        console.log(res.status)
      }
      return res.json();
    })
    .then((data) => {
      console.log(data[0].Price)
      ticker1.innerText = data[0].Ticker
      company1.innerText = data[0].Company_Name || data[0].Ticker
      companyprice1.innerText = "$" + data[0].Price
      const vals = String(data[0]['Change %'])
      if (vals.substring(0, 1) === '-') {
        companypercent1.style.color = 'red'
      }
      companypercent1.innerText = data[0]['Change %'].toFixed(2) + "%"

      ticker2.innerText = data[1].Ticker
      company2.innerText = data[1].Company_Name || data[1].Ticker
      companyprice2.innerText = "$" + data[1].Price
      const val = String(data[1]['Change %'])
      if (val.substring(0, 1) === '-') {
        companypercent2.style.color = 'red'
      }
      companypercent2.innerText = data[1]['Change %'].toFixed(2) + "%"

      ticker3.innerText = data[2].Ticker
      company3.innerText = data[2].Company_Name || data[2].Ticker
      companyprice3.innerText = "$" + data[2].Price
      const va = String(data[2]['Change %'])
      if (va.substring(0, 1) === '-') {
        companypercent3.style.color = 'red'
      }
      companypercent3.innerText = data[2]['Change %'].toFixed(2) + "%"

      ticker4.innerText = data[3].Ticker
      company4.innerText = data[3].Company_Name || data[3].Ticker
      companyprice4.innerText = "$" + data[3].Price
      const v = String(data[3]['Change %'])
      if (v.substring(0, 1) === '-') {
        companypercent4.style.color = 'red'
      }
      companypercent4.innerText = data[3]['Change %'].toFixed(2) + "%"

      ticker5.innerText = data[4].Ticker
      company5.innerText = data[4].Company_Name || data[4].Ticker
      companyprice5.innerText = "$" + data[4].Price
      const vs = String(data[4]['Change %'])
      if (vs.substring(0, 1) === '-') {
        companypercent5.style.color = 'red'
      }
      companypercent5.innerText = data[4]['Change %'].toFixed(2) + "%"

      ticker6.innerText = data[5].Ticker
      company6.innerText = data[5].Company_Name || data[5].Ticker
      companyprice6.innerText = "$" + data[5].Price
      const vsi = String(data[5]['Change %'])
      if (vsi.substring(0, 1) === '-') {
        companypercent6.style.color = 'red'
      }
      companypercent6.innerText = data[5]['Change %'].toFixed(2) + "%"

      ticker7.innerText = data[6].Ticker
      company7.innerText = data[6].Company_Name || data[6].Ticker
      companyprice7.innerText = "$" + data[6].Price
      const vsii = String(data[6]['Change %'])
      if (vsii.substring(0, 1) === '-') {
        companypercent7.style.color = 'red'
      }
      companypercent7.innerText = data[6]['Change %'].toFixed(2) + "%"

      ticker8.innerText = data[7].Ticker
      company8.innerText = data[7].Company_Name || data[7].Ticker
      companyprice8.innerText = "$" + data[7].Price
      const vsiii = String(data[7]['Change %'])
      if (vsiii.substring(0, 1) === '-') {
        companypercent8.style.color = 'red'
      }
      companypercent8.innerText = data[7]['Change %'].toFixed(2) + "%"

      ticker9.innerText = data[8].Ticker
      company9.innerText = data[8].Company_Name || data[8].Ticker
      companyprice9.innerText = "$" + data[8].Price
      const vu = String(data[8]['Change %'])
      if (vu.substring(0, 1) === '-') {
        companypercent9.style.color = 'red'
      }
      companypercent9.innerText = data[8]['Change %'].toFixed(2) + "%"

      ticker10.innerText = data[9].Ticker
      company10.innerText = data[9].Company_Name || data[9].Ticker
      companyprice10.innerText = "$" + data[9].Price
      const vuu = String(data[9]['Change %'])
      if (vuu.substring(0, 1) === '-') {
        companypercent10.style.color = 'red'
      }
      companypercent10.innerText = data[9]['Change %'].toFixed(2) + "%"

      ticker11.innerText = data[10].Ticker
      company11.innerText = data[10].Company_Name || data[10].Ticker
      companyprice11.innerText = "$" + data[10].Price
      const vuus = String(data[10]['Change %'])
      if (vuus.substring(0, 1) === '-') {
        companypercent11.style.color = 'red'
      }
      companypercent11.innerText = data[10]['Change %'].toFixed(2) + "%"

      ticker12.innerText = data[11].Ticker
      company12.innerText = data[11].Company_Name || data[11].Ticker
      companyprice12.innerText = "$" + data[11].Price
      const vuuss = String(data[11]['Change %'])
      if (vuuss.substring(0, 1) === '-') {
        companypercent12.style.color = 'red'
      }
      companypercent12.innerText = data[11]['Change %'].toFixed(2) + "%"

      ticker13.innerText = data[12].Ticker
      company13.innerText = data[12].Company_Name || data[12].Ticker
      companyprice13.innerText = "$" + data[12].Price
      const vuss = String(data[12]['Change %'])
      if (vuss.substring(0, 1) === '-') {
        companypercent13.style.color = 'red'
      }
      companypercent13.innerText = data[12]['Change %'].toFixed(2) + "%"

      ticker14.innerText = data[13].Ticker
      company14.innerText = data[13].Company_Name || data[13].Ticker
      companyprice14.innerText = "$" + data[13].Price
      const vss = String(data[13]['Change %'])
      if (vss.substring(0, 1) === '-') {
        companypercent14.style.color = 'red'
      }
      companypercent14.innerText = data[13]['Change %'].toFixed(2) + "%"

      ticker15.innerText = data[14].Ticker
      company15.innerText = data[14].Company_Name || data[14].Ticker
      companyprice15.innerText = "$" + data[14].Price
      const vussi = String(data[14]['Change %'])
      if (vussi.substring(0, 1) === '-') {
        companypercent15.style.color = 'red'
      }
      companypercent15.innerText = data[14]['Change %'].toFixed(2) + "%"
      //-------setting values on graph1------------------------------------------
      graph1comp1.innerText = data[i0].Ticker
      graph1comp2.innerText = data[i1].Ticker
      graph1comp3.innerText = data[i2].Ticker

      //initial rendering-----------------------------------------
      perati.innerText = data[i0].PE_Ratio != null ? ("$" + (data[i0].PE_Ratio).toFixed(2)) : "undefined";
      var nums = data[i0].Volume;
      volumess.innerText = nums != null ? nums.toLocaleString() : "undefined";
      beta.innerText = data[i0].Beta != null ? data[i0].Beta : "undefined"
      cprice.innerText = data[i0].Price != null ? "$" + data[i0].Price : "undefined"

      //clicking of first button from any of the button
      graph1comp1.addEventListener('click', () => {
        perati.innerText = data[i0].PE_Ratio != null ? ("$" + (data[i0].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i0].Volume;
        volumess.innerText = nums != null ? nums.toLocaleString() : "undefined";
        beta.innerText = data[i0].Beta != null ? data[i0].Beta : "undefined"
        cprice.innerText = data[i0].Price != null ? "$" + data[i0].Price : "undefined"
      })

      //clicking of second button data rendering-----------------
      graph1comp2.addEventListener('click', () => {
        perati.innerText = data[i1].PE_Ratio != null ? ("$" + (data[i1].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i1].Volume;
        volumess.innerText = nums != null ? nums.toLocaleString() : "undefined";
        beta.innerText = data[i1].Beta != null ? data[i1].Beta : "undefined"
        cprice.innerText = data[i1].Price != null ? "$" + data[i1].Price : "undefined"
      })

      //clicking of third button data rendering------------------------------
      graph1comp3.addEventListener('click', () => {
        perati.innerText = data[i2].PE_Ratio != null ? ("$" + (data[i2].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i2].Volume;
        volumess.innerText = nums != null ? nums.toLocaleString() : "undefined";
        beta.innerText = data[i2].Beta != null ? data[i2].Beta : "undefined"
        cprice.innerText = data[i2].Price != null ? "$" + data[i2].Price : "undefined"
      })
      //-------setting values on graph2------------------------------------------
      graph2comp1.innerText = data[i0].Ticker
      graph2comp2.innerText = data[i1].Ticker
      graph2comp3.innerText = data[i2].Ticker

      //initial rendering-----------------------------------------
      peratii.innerText = data[i0].PE_Ratio != null ? ("$" + (data[i0].PE_Ratio).toFixed(2)) : "undefined";
      var nums = data[i0].Volume;
      volumeess.innerText = nums != null ? nums.toLocaleString() : "undefined";
      betaa.innerText = data[i0].Beta != null ? data[i0].Beta : "undefined"
      clprice.innerText = data[i0].Price != null ? "$" + data[i0].Price : "undefined"

      //clicking of first button from any of the button
      graph2comp1.addEventListener('click', () => {
        peratii.innerText = data[i0].PE_Ratio != null ? ("$" + (data[i0].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i0].Volume;
        volumeess.innerText = nums != null ? nums.toLocaleString() : "undefined";
        betaa.innerText = data[i0].Beta != null ? data[i0].Beta : "undefined"
        clprice.innerText = data[i0].Price != null ? "$" + data[i0].Price : "undefined"
      })

      //clicking of second button from any of the button
      graph2comp2.addEventListener('click', () => {
        peratii.innerText = data[i1].PE_Ratio != null ? ("$" + (data[i1].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i1].Volume;
        volumeess.innerText = nums != null ? nums.toLocaleString() : "undefined";
        betaa.innerText = data[i1].Beta != null ? data[i1].Beta : "undefined"
        clprice.innerText = data[i1].Price != null ? "$" + data[i1].Price : "undefined"
      })

      //clicking of third button from any of the button
      graph2comp3.addEventListener('click', () => {
        peratii.innerText = data[i2].PE_Ratio != null ? ("$" + (data[i2].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i2].Volume;
        volumeess.innerText = nums != null ? nums.toLocaleString() : "undefined";
        betaa.innerText = data[i2].Beta != null ? data[i2].Beta : "undefined"
        clprice.innerText = data[i2].Price != null ? "$" + data[i2].Price : "undefined"
      })

      //-------setting values on graph2------------------------------------------
      graph3comp1.innerText = data[i0].Ticker
      graph3comp2.innerText = data[i1].Ticker
      graph3comp3.innerText = data[i2].Ticker

      //initial rendering-----------------------------------------
      pera.innerText = data[i0].PE_Ratio != null ? ("$" + (data[i0].PE_Ratio).toFixed(2)) : "undefined";
      var nums = data[i0].Volume;
      vomes.innerText = nums != null ? nums.toLocaleString() : "undefined";
      betaaa.innerText = data[i0].Beta != null ? data[i0].Beta : "undefined"
      cloprice.innerText = data[i0].Price != null ? "$" + data[i0].Price : "undefined"

      //clicking of first button from any of the button
      graph3comp1.addEventListener('click', () => {
        pera.innerText = data[i0].PE_Ratio != null ? ("$" + (data[i0].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i0].Volume;
        vomes.innerText = nums != null ? nums.toLocaleString() : "undefined";
        betaaa.innerText = data[i0].Beta != null ? data[i0].Beta : "undefined"
        cloprice.innerText = data[i0].Price != null ? "$" + data[i0].Price : "undefined"
      })

      //clicking of second button from any of the button
      graph3comp2.addEventListener('click', () => {
        pera.innerText = data[i1].PE_Ratio != null ? ("$" + (data[i1].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i1].Volume;
        vomes.innerText = nums != null ? nums.toLocaleString() : "undefined";
        betaaa.innerText = data[i1].Beta != null ? data[i1].Beta : "undefined"
        cloprice.innerText = data[i1].Price != null ? "$" + data[i1].Price : "undefined"
      })

      //clicking of second button from any of the button
      graph3comp3.addEventListener('click', () => {
        pera.innerText = data[i2].PE_Ratio != null ? ("$" + (data[i2].PE_Ratio).toFixed(2)) : "undefined";
        var nums = data[i2].Volume;
        vomes.innerText = nums != null ? nums.toLocaleString() : "undefined";
        betaaa.innerText = data[i2].Beta != null ? data[i2].Beta : "undefined"
        cloprice.innerText = data[i2].Price != null ? "$" + data[i2].Price : "undefined"
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

document.addEventListener("DOMContentLoaded", function () {
  fetchingjson();
});
//-----------------------------------------------------------

