document.addEventListener('DOMContentLoaded', function () {
  const avatarEdit = document.querySelector('.avatar-edit');
  const avatarPopup = document.querySelector('.avatar-popup');

  if (avatarEdit && avatarPopup) {
    avatarEdit.addEventListener('click', function () {
      console.log('Avatar edit clicked');
      avatarPopup.classList.toggle('show');

      if (avatarPopup.classList.contains('show')) {
        avatarPopup.style.display = 'flex';
        setTimeout(() => avatarPopup.style.opacity = '1', 10);
        console.log('Avatar popup displayed');
      } else {
        avatarPopup.style.opacity = '0';
        setTimeout(() => avatarPopup.style.display = 'none', 500);
        console.log('Avatar popup hidden');
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const selectButton = document.querySelector('.select-button');
  const profileAvatar = document.querySelector('.avatar');
  const avatarPopup = document.querySelector('.avatar-popup');

  const initialSelectedAvatar = document.querySelector('.avatar-option.selected');
  if (initialSelectedAvatar) {
    profileAvatar.src = initialSelectedAvatar.src;
  }

  avatarOptions.forEach(option => {
    option.addEventListener('click', function () {
      avatarOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  selectButton.addEventListener('click', function () {
    const selectedAvatar = document.querySelector('.avatar-option.selected');
    if (selectedAvatar) {
      profileAvatar.src = selectedAvatar.src;
      avatarPopup.style.display = 'none';
    }
  });
});

document.getElementById('aapl').addEventListener('click', () => {
  const popup = document.querySelector('.prediction-popup');
  popup.style.display = 'block';
  setTimeout(() => popup.classList.add('show'), 10);
});

document.querySelector('.prediction-popup .cancel-btn').addEventListener('click', () => {
  const popup = document.querySelector('.prediction-popup');
  popup.classList.remove('show');
  setTimeout(() => popup.style.display = 'none', 300);
});

class SearchDropdown {
  constructor(inputId) {
      this.input = document.getElementById(inputId);
      this.dropdownMenu = document.createElement('div');
      this.dropdownMenu.className = 'search-dropdown-menu';
      this.optionsContainer = document.createElement('div');
      this.optionsContainer.className = 'search-dropdown-options';
      this.dropdownMenu.appendChild(this.optionsContainer);
      this.input.parentElement.appendChild(this.dropdownMenu);
      this.setupDropdown();
  }

  setupDropdown() {
      this.input.addEventListener('click', () => {
          this.dropdownMenu.classList.add('active');
          this.loadOptions('');
      });

      document.addEventListener('click', (e) => {
          if (!this.input.contains(e.target) && !this.dropdownMenu.contains(e.target)) {
              this.dropdownMenu.classList.remove('active');
          }
      });

      this.input.addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          this.loadOptions(searchTerm);
      });
  }

  async loadOptions(searchTerm) {
      try {
          const response = await fetch('/public/textfile/all_ticker.txt');
          const text = await response.text();
          const options = text.split('\n').filter(option => option.trim());

          const filteredOptions = options
              .filter(option => option.toLowerCase().startsWith(searchTerm.toLowerCase()))
              .slice(0, 6);

          this.optionsContainer.innerHTML = '';
          filteredOptions.forEach(option => {
              const optionElement = document.createElement('div');
              optionElement.className = 'search-dropdown-option';
              optionElement.textContent = option;
              optionElement.addEventListener('click', () => {
                  this.input.value = option;
                  this.dropdownMenu.classList.remove('active');
                  const enterEvent = new KeyboardEvent('keypress', {
                      key: 'Enter',
                      code: 'Enter',
                      keyCode: 13,
                      which: 13,
                      bubbles: true
                  });
                  this.input.dispatchEvent(enterEvent);
              });
              this.optionsContainer.appendChild(optionElement);
          });
      } catch (error) {
          console.error('Error loading options:', error);
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SearchDropdown('searching');
});



//prediction-------------------------------------------------
const load = document.getElementById('loading')
const back = document.getElementById('background')
const future_prediction = document.getElementById('future_prediction')
future_prediction.addEventListener('click', async () => {
  //val is the comapany setting
  const days = document.getElementById('days').value
  const trails = document.getElementById('trials').value
  console.log(val, trails, days)
  load.style.display = 'flex'
  load.style.zIndex = '999'
  back.style.zIndex = '-999'
  back.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, days, trails })
    });
    const data = await response.json();
    console.log(data)
    if (data.sucess === 'true') {
      load.style.display = 'none'
      load.style.zIndex = '-999'
      back.style.zIndex = '999'
      back.style.filter = 'none'
      window.location.href = 'predict'
    }
  } catch (error) {
    console.error('Error:', error);
  }
})

document.querySelectorAll('.company-box').forEach(box => {
  box.addEventListener('click', async () => {
    const ticker = box.querySelector('b').textContent;
    const searchBar = document.getElementById('searching');
    searchBar.value = ticker;
    const enterEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true
    });
    searchBar.dispatchEvent(enterEvent);
  });
});
//------------------------------------------------------------


document.addEventListener('DOMContentLoaded', function () {
  const accountItems = document.querySelectorAll('.account-item');

  accountItems.forEach(item => {
    item.addEventListener('click', function () {
      this.classList.toggle('connected');
      const status = this.querySelector('.connection-status');
      if (this.classList.contains('connected')) {
        status.textContent = 'Connected';
      } else {
        status.textContent = 'Not Connected';
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const connectButtons = document.querySelectorAll('.connect-button');

  connectButtons.forEach(button => {
    button.addEventListener('click', function () {
      if (this.classList.contains('loading')) return;

      this.classList.add('loading');
      this.textContent = '';

      setTimeout(() => {
        this.classList.remove('loading');
        if (this.classList.contains('connected')) {
          this.classList.remove('connected');
          this.textContent = 'Connect';
        } else {
          this.classList.add('connected');
          this.textContent = 'Connected';
        }
      }, 2000);
    });
  });
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



document.querySelector(".sum").addEventListener('click', function () {
  const SUMMARY = document.querySelector('.sum');
  const CHART = document.querySelector('.cha');
  const HISTO = document.querySelector('.histo');
  const STAT = document.querySelector('.stat');
  const PRO = document.querySelector('.pro');
  SUMMARY.style.backgroundColor = " rgb(96, 0, 147)";
  HISTO.style.backgroundColor = "black";
  PRO.style.backgroundColor = "black";
  CHART.style.backgroundColor = "black";
  SUMMARY.border = "10px solid rgb(96, 0, 147)";

})

document.querySelector(".cha").addEventListener('click', function () {
  const SUMMARY = document.querySelector('.sum');
  const CHART = document.querySelector('.cha');
  const HISTO = document.querySelector('.histo');
  const STAT = document.querySelector('.stat');
  const PRO = document.querySelector('.pro');
  SUMMARY.style.backgroundColor = "black";
  HISTO.style.backgroundColor = "black";
  STAT.style.backgroundColor = "black";
  PRO.style.backgroundColor = "black";
  CHART.style.backgroundColor = "rgb(96, 0, 147)";
})

document.querySelector(".histo").addEventListener('click', function () {
  const SUMMARY = document.querySelector('.sum');
  const CHART = document.querySelector('.cha');
  const HISTO = document.querySelector('.histo');
  const STAT = document.querySelector('.stat');
  const PRO = document.querySelector('.pro');
  SUMMARY.style.backgroundColor = "black";
  HISTO.style.backgroundColor = "rgb(96, 0, 147)";
  STAT.style.backgroundColor = "black";
  PRO.style.backgroundColor = "black";
  CHART.style.backgroundColor = "black";
})

document.querySelector(".stat").addEventListener('click', function () {
  const SUMMARY = document.querySelector('.sum');
  const CHART = document.querySelector('.cha');
  const HISTO = document.querySelector('.histo');
  const STAT = document.querySelector('.stat');
  const PRO = document.querySelector('.pro');
  SUMMARY.style.backgroundColor = "black";
  HISTO.style.backgroundColor = "black";
  STAT.style.backgroundColor = "rgb(96, 0, 147)";
  PRO.style.backgroundColor = "black";
  CHART.style.backgroundColor = "black";
})

document.querySelector(".pro").addEventListener('click', function () {
  const SUMMARY = document.querySelector('.sum');
  const CHART = document.querySelector('.cha');
  const HISTO = document.querySelector('.histo');
  const STAT = document.querySelector('.stat');
  const PRO = document.querySelector('.pro');
  SUMMARY.style.backgroundColor = "black";
  HISTO.style.backgroundColor = "black";
  STAT.style.backgroundColor = "black";
  PRO.style.backgroundColor = "rgb(96, 0, 147)";
  CHART.style.backgroundColor = "black";
})

function changeReadMore() {
  const morecontent = document.querySelector('.More-content');
  const showMoreBtn = document.querySelector('.show-more-btn');

  if (morecontent.style.display === "none" || morecontent.style.display === " ") {
    morecontent.style.display = "block";
    showMoreBtn.textContent = "Show Less";
  } else {
    morecontent.style.display = 'none';
    showMoreBtn.textContent = 'Show More';
  }
}



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
  const dateRangeBtn = document.getElementById('date-range-btn');
  const calendarPopup = document.getElementById('calendar-popup');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: currentYear - 1979 }, (_, i) => 1980 + i);

  function initializeCalendar(calendar) {
    const monthSelect = calendar.querySelector('.month-select');
    const yearSelect = calendar.querySelector('.year-select');

    months.forEach((month, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = month;
      monthSelect.appendChild(option);
    });

    yearRange.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }

  initializeCalendar(document.querySelector('.from-calendar'));
  initializeCalendar(document.querySelector('.to-calendar'));

  dateRangeBtn.addEventListener('click', () => {
    calendarPopup.style.display = calendarPopup.style.display === 'none' ? 'block' : 'none';
  });

  document.querySelector('.apply-btn').addEventListener('click', async () => {
    const fromMonth = document.querySelector('.from-calendar .month-select').value;
    const fromYear = document.querySelector('.from-calendar .year-select').value;
    const fromDay = document.querySelector('.from-calendar .calendar-body .selected')?.textContent;

    const toMonth = document.querySelector('.to-calendar .month-select').value;
    const toYear = document.querySelector('.to-calendar .year-select').value;
    const toDay = document.querySelector('.to-calendar .calendar-body .selected')?.textContent;

    if (fromDay && toDay) {
      const fromDate = new Date(fromYear, fromMonth, fromDay);
      const toDate = new Date(toYear, toMonth, toDay);

      if (fromDate <= toDate) {
        dateRangeBtn.textContent = `${fromDay}/${Number(fromMonth) + 1}/${fromYear} - ${toDay}/${Number(toMonth) + 1}/${toYear}`;
        calendarPopup.style.display = 'none';
        //calender code
        const startingmonth = Number(fromMonth) + 1;
        const endingmonth = Number(toMonth) + 1;
        const start = fromDay + '-' + startingmonth + '-' + fromYear
        const end = toDay + '-' + endingmonth + '-' + toYear
        console.log(start, end)
        loading.style.display = 'flex'
        loading.style.zIndex = '999'
        myplot.style.zIndex = '-999'
        myplot.style.filter = 'blur(30px)'
        try {
          const response = await fetch('/summary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end })
          });
          const data = await response.json();
          console.log(data)
          if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
          }
        } catch (error) {
          console.error('Error:', error);
        }
        updateGraph(fromDate, toDate);
      }
    }
  });

  document.querySelector('.cancel-btn').addEventListener('click', () => {
    calendarPopup.style.display = 'none';
  });
});

document.querySelector('.apply-btn').addEventListener('click', () => {
  const fromMonth = document.querySelector('.from-calendar .month-select').value;
  const fromYear = document.querySelector('.from-calendar .year-select').value;
  const fromDay = document.querySelector('.from-calendar .calendar-body .selected')?.textContent;

  const toMonth = document.querySelector('.to-calendar .month-select').value;
  const toYear = document.querySelector('.to-calendar .year-select').value;
  const toDay = document.querySelector('.to-calendar .calendar-body .selected')?.textContent;

  if (fromDay && toDay) {
    const fromDate = new Date(fromYear, fromMonth, fromDay);
    const toDate = new Date(toYear, toMonth, toDay);

    if (fromDate <= toDate) {
      dateRangeBtn.textContent = `${fromDay}/${Number(fromMonth) + 1}/${fromYear} - ${toDay}/${Number(toMonth) + 1}/${toYear}`;
      calendarPopup.style.display = 'none';

      updateGraph(fromDate, toDate);
    }
  }
});

function updateCalendarBody(calendar, month, year) {
  const calendarBody = calendar.querySelector('.calendar-body');
  calendarBody.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('button');
    emptyCell.disabled = true;
    calendarBody.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayButton = document.createElement('button');
    dayButton.textContent = day;

    const currentDate = new Date(year, month, day);
    if (currentDate > today) {
      dayButton.disabled = true;
      dayButton.style.opacity = "0.3";
    } else {
      dayButton.addEventListener('click', (e) => {
        calendar.querySelectorAll('.calendar-body button').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
      });
    }

    calendarBody.appendChild(dayButton);
  }
}


document.querySelectorAll('.month-select, .year-select').forEach(select => {
  select.addEventListener('change', (e) => {
    const calendar = e.target.closest('.from-calendar, .to-calendar');
    const month = calendar.querySelector('.month-select').value;
    const year = calendar.querySelector('.year-select').value;
    updateCalendarBody(calendar, parseInt(month), parseInt(year));
  });
});

const now = new Date();
document.querySelectorAll('.from-calendar, .to-calendar').forEach(calendar => {
  calendar.querySelector('.month-select').value = now.getMonth();
  calendar.querySelector('.year-select').value = now.getFullYear();
  updateCalendarBody(calendar, now.getMonth(), now.getFullYear());
});

const aapl = document.getElementById('aapl')
const Company_title = document.getElementById("Company_title");
let Company_price = document.getElementById("Company_price");
let cp = ''
const longsummary = document.getElementById("longsummary");
const prevclose = document.getElementById("prevclose");
const bidprice = document.getElementById("bidprice");
const marketcaps = document.getElementById("marketcaps");
const vols = document.getElementById("vols");
const avgvols = document.getElementById("avgvols");
const opens = document.getElementById("opens");
const epss = document.getElementById("epss");
const fiveweeks = document.getElementById("fiveweeks");
const askss = document.getElementById("askss");
const betaa = document.getElementById("betaa");
const dayssrange = document.getElementById("dayssrange");
const yeilds = document.getElementById("yeilds");
const firstyear = document.getElementById("firstyear");
const traling = document.getElementById("traling");
const exdividend = document.getElementById("exdividend");
let exdividenddate = "";
const d = new Date(exdividenddate * 1000);
const ceoname = document.getElementById("ceoname");
const city_state = document.getElementById("city_state");
const dollar = document.getElementById('dollar')
const percent = document.getElementById('percent')
let val = ''
function fetchjson() {
  fetch("/public/graph.json")
    .then((res) => {
      if (!res.ok) {
        console.log(res.status);
      }
      return res.json();
    })
    .then((data) => {
      val = data.symbol
      Company_title.innerText = data.shortName;
      aapl.innerText = "Predict " + val
      console.log(Company_title)
      Company_price.innerText = "$" + data.currentPrice;
      cp = "$" + data.currentPrice

      const currPrice = data.currentPrice;
      const prevPrice = data.previousClose;

      const priceChange = currPrice - prevPrice
      const percentChange = (priceChange / prevPrice) * 100;

      const sign = priceChange >= 0 ? '+' : '-';
      dollar.innerText = `${sign}$${Math.abs(priceChange).toFixed(2)}`;
      percent.innerText = `(${sign}${Math.abs(percentChange).toFixed(2)}%)`;

      dollar.style.color = priceChange >= 0 ? 'green' : 'red'
      percent.style.color = priceChange >= 0 ? 'green' : 'red'

      longsummary.innerText = data.longBusinessSummary;
      prevclose.innerText = data.previousClose;
      bidprice.innerText = data.bid;
      marketcaps.innerText = (data.marketCap / 1000000000000).toFixed(2) + " T";
      vols.innerText = data.volume;
      avgvols.innerText = data.averageVolume;
      opens.innerText = data.open;
      epss.innerText = data.trailingEps;
      const rangess = data.fiftyTwoWeekLow + " - " + data.fiftyTwoWeekHigh;
      fiveweeks.innerText = rangess;
      const arksmulti = data.ask + " x 100";
      askss.innerText = arksmulti;
      betaa.innerText = data.beta;
      const rangss = data.dayLow + " - " + data.dayHigh;
      dayssrange.innerText = rangss;
      const yeildss = data.dividendRate + " " + "(" + data.dividendYield + "%)";
      yeilds.innerText = yeildss;
      firstyear.innerText = data.targetMeanPrice;
      traling.innerText = data.trailingPE;
      exdividenddate = data.exDividendDate;
      ceoname.innerText = data.companyOfficers[0].name;
      const city = data.city;
      const state = data.state;
      city_state.innerText = city + " , " + state;
    })
    .catch((err) => {
      console.log(err);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  fetchjson();
});



// const dollar = document.getElementById('dollar').innerText
// const percent = document.getElementById('percent').innerText

// console.log(dollar.substring(0, 1))
// if (dollar.substring(0, 1) === '-') {
//   document.getElementById('dollar').style.color = 'red'
// }

// if (dollar.substring(0, 1) === '+') {
//   document.getElementById('dollar').style.color = 'green'
// }

// if (percent.substring(1, 2) === '-') {
//   document.getElementById('percent').style.color = 'red'
// }

// if (percent.substring(1, 2) === '+') {
//   document.getElementById('percent').style.color = 'green'
// }


Papa.parse("/public/stock_data_1.csv", {
  download: true,
  header: true,
  complete: function (results) {
    const xarray = [];
    const yarray = [];

    results.data.forEach((row) => {
      xarray.push(row["Date"]);
      yarray.push(parseFloat(row["Close"]));
    });

    const data = [
      {
        x: xarray,
        y: [],
        mode: "lines",
        type: "scatter",
        fill: "tozeroy",
        fillgradient: {
          type: "vertical",
          colorscale: [
            [0, "rgba(0,0,0,0)"],
            [1, "rgba(96,0,147,1)"],
          ],
        },
        line: {
          width: 2,
        },
        hovertemplate:
          '%{x}' +
          '<extra></extra>',
      },
    ];
    const layout = {
      xaxis: {
        range: [xarray[0], xarray[xarray.length - 1]],
        title: {
          font: {
            color: "white",
          },
        },
        tickfont: {
          color: "white",
        },
        spikedash: "solid",
        spikemode: "toaxis",
        spikecolor: "white",
        spikethickness: 1,

      },
      yaxis: {
        range: [0, Math.max(...yarray) + 20],
        title: {
          font: {
            color: "black",
          },
        },
        tickfont: {
          color: "black",
        },
        tickvals: []
      },
      colorway: ["#7834a8"],
      plot_bgcolor: "black",
      paper_bgcolor: "black",
      hoverlabel: {
        bgcolor: "black",
        bordercolor: "black",
        font: {
          color: "white",
          size: 15,
          lineposition: "closest",
          align: "right"
        },
        hovermode: "x",
        newshape: {
          line: {
            dash: "solid",
            color: "white"
          },
          showlegend: "true"
        },

      }
    };

    Plotly.newPlot("myplot", data, layout);
    let i = 0;
    let id;
    function animate() {
      if (i < xarray.length) {
        Plotly.extendTraces(
          "myplot",
          {
            x: [[xarray[i]]],
            y: [[yarray[i]]],
          },
          [0],
        );
        i++;
        id = requestAnimationFrame(animate);
      }
    }
    animate();

    myplot.on('plotly_hover', (data) => {
      const xvalue = data.points[0].y
      Company_price.innerText = "$" + (xvalue).toFixed(2)
    })

    myplot.on('plotly_unhover', () => {
      Company_price.innerText = cp;
    })


    const stp = document.getElementById("stp");
    stp.addEventListener("click", () => {
      Plotly.react(
        "myplot",
        [
          {
            x: xarray,
            y: yarray,
            mode: "lines",
            type: "scatter",
            fill: "tozeroy",
            fillgradient: {
              type: "vertical",
              colorscale: [
                [0, "rgba(0,0,0,0)"],
                [1, "rgba(96,0,147,1)"],
              ],
            },
            line: {
              width: 2,
            },
            hovertemplate:
              '%{x}' +
              '<extra></extra>',
          },
        ],
        layout,
      );
      cancelAnimationFrame(id);
    });
  },

});


function graphing() {
  Papa.parse("/public/stock_data_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
      const xarray = [];
      const yarray = [];

      results.data.forEach((row) => {
        xarray.push(row["Date"]);
        yarray.push(parseFloat(row["Close"]));
      });

      const data = [
        {
          x: xarray,
          y: [],
          mode: "lines",
          type: "scatter",
          fill: "tozeroy",
          fillgradient: {
            type: "vertical",
            colorscale: [
              [0, "rgba(0,0,0,0)"],
              [1, "rgba(96,0,147,1)"],
            ],
          },
          line: {
            width: 2,
          },
          hovertemplate:
            '%{x}' +
            '<extra></extra>',
        },
      ];
      const layout = {
        xaxis: {
          range: [xarray[0], xarray[xarray.length - 1]],
          title: {
            font: {
              color: "white",
            },
          },
          tickfont: {
            color: "white",
          },
          spikedash: "solid",
          spikemode: "toaxis",
          spikecolor: "white",
          spikethickness: 1,

        },
        yaxis: {
          range: [0, Math.max(...yarray) + 20],
          title: {
            font: {
              color: "black",
            },
          },
          tickfont: {
            color: "black",
          },
          tickvals: []
        },
        colorway: ["#7834a8"],
        plot_bgcolor: "black",
        paper_bgcolor: "black",
        hoverlabel: {
          bgcolor: "black",
          bordercolor: "black",
          font: {
            color: "white",
            size: 15,
            lineposition: "closest",
            align: "right"
          },
          hovermode: "x",
          newshape: {
            line: {
              dash: "solid",
              color: "white"
            },
            showlegend: "true"
          },

        }
      };

      Plotly.newPlot("myplot", data, layout);
      let i = 0;
      let id;
      function animate() {
        if (i < xarray.length) {
          Plotly.extendTraces(
            "myplot",
            {
              x: [[xarray[i]]],
              y: [[yarray[i]]],
            },
            [0],
          );
          i++;
          id = requestAnimationFrame(animate);
        }
      }
      animate();

      myplot.on('plotly_hover', (data) => {
        const xvalue = data.points[0].y
        Company_price.innerText = "$" + (xvalue).toFixed(2)
      })

      myplot.on('plotly_unhover', () => {
        Company_price.innerText = cp;
      })


      const stp = document.getElementById("stp");
      stp.addEventListener("click", () => {
        Plotly.react(
          "myplot",
          [
            {
              x: xarray,
              y: yarray,
              mode: "lines",
              type: "scatter",
              fill: "tozeroy",
              fillgradient: {
                type: "vertical",
                colorscale: [
                  [0, "rgba(0,0,0,0)"],
                  [1, "rgba(96,0,147,1)"],
                ],
              },
              line: {
                width: 2,
              },
              hovertemplate:
                '%{x}' +
                '<extra></extra>',
            },
          ],
          layout,
        );
        cancelAnimationFrame(id);
      });
    },

  });

}

const watch = document.getElementById('watch')
watch.addEventListener('click', () => {
  window.location.href = '/watch'
})

const lists = document.getElementById('lists')
lists.addEventListener('click', () => {
  window.location.href = '/yourList'
})

const profile = document.getElementById('profile')
profile.addEventListener('click', () => {
  window.location.href = '/userprofile'
})


//graph setting 1day,1month extra


//oneday
// const oneday=document.getElementById('oneday')

// if (day === 1) {
//   if (month === 1 || month === 3 || month === 5 || month === 8 || month === 7 || month === 10) {
//     day = 31;
//   }
//   if (month === 0) {
//     day = 31;
//     year = year - 1;
//   }
//   else if (month === 1) {
//     if (year % 4 === 0) {
//       day = 29;
//     }
//     else {
//       day = 28;
//     }
//   }
//   else {
//     day = 30;
//   }
// }

//one will be removed


//ONE-WEEK
const oneweek = document.getElementById('oneweek')
oneweek.addEventListener('click', async () => {
  ;
  //starting Date----------------------------------------------------------------------------------
  var endsmonth;
  var currentDate = new Date();
  var last = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toUTCString();
  console.log(last)
  var first = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 6)).toUTCString();
  const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var firstsday = first.substring(5, 7)
  var month = first.substring(8, 11)
  for (let i = 0; i < monthly.length; i++) {
    if (monthly[i] === month) {
      firstsmonth = (i + 1);
    }
  }
  var firstsyear = first.substring(12, 16)
  const start = (firstsday + '-' + firstsmonth + '-' + firstsyear);
  console.log(start)
  //ending Date----------------------------------------------------------------------------------------
  var endsday = last.substring(5, 7)
  var enmonth = last.substring(8, 11)
  for (let i = 0; i < monthly.length; i++) {
    if (monthly[i] === enmonth) {
      endsmonth = (i + 1);
    }
  }
  var endsyear = last.substring(12, 16)
  console.log(endsyear)
  const end = (endsday + '-' + endsmonth + '-' + endsyear);
  console.log(end)
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    console.log(data)
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }

})

//onemonth(DONE)--------------------------------------------------------------------------------
const onemonth = document.getElementById('onemonth')
onemonth.addEventListener('click', async () => {
  const dates = new Date()
  let month = dates.getMonth()
  let months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear()
  let years = dates.getFullYear()
  if (month === 0) {
    year = year - 1;
    month = 12
    months = 1;
  }
  const start = day + "-" + month + "-" + year
  const end = day + "-" + months + "-" + years
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    console.log(data)
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }

})
//--------------------------------------------------------------------------------------

//three month(DONE)---------------------------------------------------------------------
const loading = document.getElementById('loading')
const myplot = document.getElementById('myplot')
const threemonth = document.getElementById('threemonth')
threemonth.addEventListener('click', async () => {

  const dates = new Date()
  let month = dates.getMonth()
  let months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear()
  let years = dates.getFullYear();
  if (month === 0) {
    year = year - 1;
    month = 12;
  }
  if (month === 1) {
    year = year - 1;
    month = 13
  }

  if (month === 2) {
    year = year - 1;
    month = 14;
  }
  month -= 2;
  console.log(day + "-" + month + "-" + year)
  console.log(day + "-" + months + "-" + year)
  const start = day + "-" + month + "-" + year
  const end = day + "-" + months + "-" + years
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }

})
//----------------------------------------------------------------------------------------------

//year to date(DONE)------------------------------------------------------
const yeartodate = document.getElementById('yeartodate')
yeartodate.addEventListener('click', async () => {
  const dates = new Date();
  let day = dates.getDate();
  let months = dates.getMonth() + 1
  let year = dates.getFullYear();
  console.log(1 + "-" + 1 + "-" + year)
  console.log(day + "-" + months + "-" + year)
  const start = 1 + "-" + 1 + "-" + year
  const end = day + "-" + months + "-" + year
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})
//----------------------------------------------------------------------------------------------------

//oneyear(DONE)-----------------------------------------------------------------------------------------
const oneyear = document.getElementById('oneyear')
oneyear.addEventListener('click', async () => {
  const dates = new Date();
  let months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear() - 1
  let years = dates.getFullYear()
  console.log(day + "-" + months + "-" + year)
  console.log(day + "-" + months + "-" + years)
  const start = day + "-" + months + "-" + year
  const end = day + "-" + months + "-" + years
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})
//-------------------------------------------------------------------------------------

//FIVE-YEAR(DONE)-------------------------------------------------------------------------
const fiveyear = document.getElementById('fiveyear')
fiveyear.addEventListener('click', async () => {
  const dates = new Date();
  let months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear() - 5
  let years = dates.getFullYear()
  console.log(day + "-" + months + "-" + year)
  console.log(day + "-" + months + "-" + years)
  const start = day + "-" + months + "-" + year
  const end = day + "-" + months + "-" + years
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})
//----------------------------------------------------------------------------------------------
//MAX-DATE(DONE)---------------------------------------------------------------------------------
const maxdate = document.getElementById('maxdate')
maxdate.addEventListener('click', async () => {
  const dates = new Date();
  let months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear() - 5
  let years = dates.getFullYear()
  console.log(day + "-" + months + "-" + 1950)
  console.log(day + "-" + months + "-" + years)
  const start = day + "-" + months + "-" + 1950
  const end = day + "-" + months + "-" + years
  loading.style.display = 'flex'
  loading.style.zIndex = '999'
  myplot.style.zIndex = '-999'
  myplot.style.filter = 'blur(30px)'
  try {
    const response = await fetch('/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ val, start, end })
    });
    const data = await response.json();
    if (data.sucess === 'true') {
      loading.style.display = 'none'
      loading.style.zIndex = '-999'
      myplot.style.zIndex = '999'
      myplot.style.filter = 'none'
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})


//search bar to change the company from summary page
const searching = document.getElementById('searching')
const background = document.getElementById('background')
searching.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    val = searching.value
    searching.value = '';
    const dates = new Date()
    let month = dates.getMonth()
    let months = dates.getMonth() + 1
    let day = dates.getDate()
    let year = dates.getFullYear()
    if (month === 0) {
      year = year - 1;
      month = 12
      months = 1;
    }
    const start = day + "-" + month + "-" + year
    const end = day + "-" + months + "-" + year
    loading.style.display = 'flex'
    loading.style.zIndex = '9999'
    background.style.zIndex = '-999'
    background.style.filter = 'blur(20px)'

    try {
      const response = await fetch('/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ val, start, end })
      });
      const data = await response.json();
      console.log(data)
      if (data.sucess === 'true') {
        loading.style.display = 'none'
        loading.style.zIndex = '-999'
        background.style.zIndex = '999'
        background.style.filter = 'none'
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto'; // Re-enable interaction
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
})


//people also watch

const pcomptic1 = document.getElementById('pcomptic1')
const pcompname1 = document.getElementById('pcompname1')
const pcomprice1 = document.getElementById('pcompprice1')
const pcomppercent1 = document.getElementById('pcomppercent1')

const pcomptic2 = document.getElementById('pcomptic2')
const pcompname2 = document.getElementById('pcompname2')
const pcomprice2 = document.getElementById('pcompprice2')
const pcomppercent2 = document.getElementById('pcomppercent2')

const pcomptic3 = document.getElementById('pcomptic3')
const pcompname3 = document.getElementById('pcompname3')
const pcomprice3 = document.getElementById('pcompprice3')
const pcomppercent3 = document.getElementById('pcomppercent3')

const pcomptic4 = document.getElementById('pcomptic4')
const pcompname4 = document.getElementById('pcompname4')
const pcomprice4 = document.getElementById('pcompprice4')
const pcomppercent4 = document.getElementById('pcomppercent4')

const pcomptic5 = document.getElementById('pcomptic5')
const pcompname5 = document.getElementById('pcompname5')
const pcomprice5 = document.getElementById('pcompprice5')
const pcomppercent5 = document.getElementById('pcomppercent5')

const pcomptic6 = document.getElementById('pcomptic6')
const pcompname6 = document.getElementById('pcompname6')
const pcomprice6 = document.getElementById('pcompprice6')
const pcomppercent6 = document.getElementById('pcomppercent6')

const pcomptic7 = document.getElementById('pcomptic7')
const pcompname7 = document.getElementById('pcompname7')
const pcomprice7 = document.getElementById('pcompprice7')
const pcomppercent7 = document.getElementById('pcomppercent7')

const pcomptic8 = document.getElementById('pcomptic8')
const pcompname8 = document.getElementById('pcompname8')
const pcomprice8 = document.getElementById('pcompprice8')
const pcomppercent8 = document.getElementById('pcomppercent8')

const pcomptic9 = document.getElementById('pcomptic9')
const pcompname9 = document.getElementById('pcompname9')
const pcomprice9 = document.getElementById('pcompprice9')
const pcomppercent9 = document.getElementById('pcomppercent9')

const pcomptic10 = document.getElementById('pcomptic10')
const pcompname10 = document.getElementById('pcompname10')
const pcomprice10 = document.getElementById('pcompprice10')
const pcomppercent10 = document.getElementById('pcomppercent10')

function peoplealsowatch() {
  fetch("/public/people_also_watch.json")
    .then((res) => {
      if (!res.ok) {
        console.log(res.status);
      }
      return res.json();
    })
    .then((data) => {
      pcomptic1.innerText = data[0].Ticker
      pcompname1.innerText = data[0].Company_Name
      pcomprice1.innerText = "$" + data[0].Price
      const rprice1 = String(data[0].Price)
      if (rprice1.substring(0, 1) === '-') {
        pcomprice1.style.color = 'red'
      }

      const rpercent1 = String(data[0]['Change %'])
      if (rpercent1.substring(0, 1) === '-') {
        pcomppercent1.style.color = 'red'
      }
      pcomppercent1.innerText = String(data[0]['Change %'].toFixed(2)) + "%"

      pcomptic2.innerText = data[1].Ticker
      pcompname2.innerText = data[1].Company_Name
      pcomprice2.innerText = "$" + data[1].Price
      const rprice2 = String(data[1].Price)
      if (rprice2.substring(0, 1) === '-') {
        pcomprice2.style.color = 'red'
      }

      const rpercent2 = String(data[1]['Change %'])
      if (rpercent2.substring(0, 1) === '-') {
        pcomppercent2.style.color = 'red'
      }
      pcomppercent2.innerText = String(data[1]['Change %'].toFixed(2)) + "%"

      pcomptic3.innerText = data[2].Ticker
      pcompname3.innerText = data[2].Company_Name
      pcomprice3.innerText = "$" + data[2].Price
      const rprice3 = String(data[2].Price)
      if (rprice3.substring(0, 1) === '-') {
        pcomprice3.style.color = 'red'
      }

      const rpercent3 = String(data[2]['Change %'])
      if (rpercent3.substring(0, 1) === '-') {
        pcomppercent3.style.color = 'red'
      }
      pcomppercent3.innerText = String(data[2]['Change %'].toFixed(2)) + "%"

      pcomptic4.innerText = data[3].Ticker
      pcompname4.innerText = data[3].Company_Name
      pcomprice4.innerText = "$" + data[3].Price
      const rprice4 = String(data[3].Price)
      if (rprice4.substring(0, 1) === '-') {
        pcomprice4.style.color = 'red'
      }

      const rpercent4 = String(data[3]['Change %'])
      if (rpercent4.substring(0, 1) === '-') {
        pcomppercent4.style.color = 'red'
      }
      pcomppercent4.innerText = String(data[3]['Change %'].toFixed(2)) + "%"

      pcomptic5.innerText = data[4].Ticker
      pcompname5.innerText = data[4].Company_Name
      pcomprice5.innerText = "$" + data[4].Price
      const rprice5 = String(data[4].Price)
      if (rprice5.substring(0, 1) === '-') {
        pcomprice5.style.color = 'red'
      }

      const rpercent5 = String(data[4]['Change %'])
      if (rpercent5.substring(0, 1) === '-') {
        pcomppercent5.style.color = 'red'
      }
      pcomppercent5.innerText = String(data[4]['Change %'].toFixed(2)) + "%"

      pcomptic6.innerText = data[5].Ticker
      pcompname6.innerText = data[5].Company_Name
      pcomprice6.innerText = "$" + data[5].Price
      const rprice6 = String(data[5].Price)
      if (rprice6.substring(0, 1) === '-') {
        pcomprice6.style.color = 'red'
      }

      const rpercent6 = String(data[5]['Change %'])
      if (rpercent6.substring(0, 1) === '-') {
        pcomppercent6.style.color = 'red'
      }
      pcomppercent6.innerText = String(data[5]['Change %'].toFixed(2)) + "%"

      pcomptic7.innerText = data[6].Ticker
      pcompname7.innerText = data[6].Company_Name
      pcomprice7.innerText = "$" + data[6].Price
      const rprice7 = String(data[6].Price)
      if (rprice7.substring(0, 1) === '-') {
        pcomprice7.style.color = 'red'
      }

      const rpercent7 = String(data[6]['Change %'])
      if (rpercent7.substring(0, 1) === '-') {
        pcomppercent7.style.color = 'red'
      }
      pcomppercent7.innerText = String(data[6]['Change %'].toFixed(2)) + "%"

      pcomptic8.innerText = data[7].Ticker
      pcompname8.innerText = data[7].Company_Name
      pcomprice8.innerText = "$" + data[7].Price
      const rprice8 = String(data[7].Price)
      if (rprice8.substring(0, 1) === '-') {
        pcomprice8.style.color = 'red'
      }

      const rpercent8 = String(data[7]['Change %'])
      if (rpercent8.substring(0, 1) === '-') {
        pcomppercent8.style.color = 'red'
      }
      pcomppercent8.innerText = String(data[7]['Change %'].toFixed(2)) + "%"

      pcomptic9.innerText = data[8].Ticker
      pcompname9.innerText = data[8].Company_Name
      pcomprice9.innerText = "$" + data[8].Price
      const rprice9 = String(data[8].Price)
      if (rprice9.substring(0, 1) === '-') {
        pcomprice9.style.color = 'red'
      }

      const rpercent9 = String(data[8]['Change %'])
      if (rpercent9.substring(0, 1) === '-') {
        pcomppercent9.style.color = 'red'
      }
      pcomppercent9.innerText = String(data[8]['Change %'].toFixed(2)) + "%"

      pcomptic10.innerText = data[9].Ticker
      pcompname10.innerText = data[9].Company_Name
      pcomprice10.innerText = "$" + data[9].Price
      const rprice10 = String(data[9].Price)
      if (rprice10.substring(0, 1) === '-') {
        pcomprice10.style.color = 'red'
      }

      const rpercent10 = String(data[9]['Change %'])
      if (rpercent10.substring(0, 1) === '-') {
        pcomppercent10.style.color = 'red'
      }
      pcomppercent10.innerText = String(data[9]['Change %'].toFixed(2)) + "%"
    })
    .catch((err) => {
      console.log(err);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  peoplealsowatch();
});
