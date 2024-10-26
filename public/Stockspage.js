document.addEventListener('DOMContentLoaded', function () {
  const avatarEdit = document.querySelector('.avatar-edit');
  const avatarPopup = document.querySelector('.avatar-popup');

  avatarEdit.addEventListener('click', function () {
    console.log('Avatar edit clicked');
    if (avatarPopup) {
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
    } else {
      console.log('Avatar popup not found');
    }
  });
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
c = 0;
document.addEventListener('DOMContentLoaded', function () {
  const editButton = document.querySelector('.edit-button');
  const profileForm = document.querySelector('.profile-section');
  const profileFields = document.querySelectorAll('.profile-field');
  const avatarUsername = document.querySelector('.profile-header h1');
  const confirmPasswordField = document.querySelector('.confirm-password');
  const submit_button = document.getElementById('submit_button')
  submit_button.addEventListener('click', (event) => {
    c++;
    if (c % 2 != 0) {
      event.preventDefault()
      const usernames=document.getElementById('username').value
      const emails=document.getElementById('email').value
      event.preventDefault()
      fetch('/userprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({emails})  // Send the name as JSON
      })
        .then(response => response.json())
        .then(data => {
          console.log('Response from server:', data);  // Log server response
        })
        .catch(error => console.error('Error:', error));
    }
    else {
      profileForm.method='POST'
      profileForm.action = "/userprofile"
      profileForm.submit();
      console.log("submitted")
    }
  })


  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function clearError(field) {
    const errorMessage = field.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
    field.querySelectorAll('input').forEach(input => input.classList.remove('error'));
  }

  editButton.addEventListener('click', function () {
    if (this.textContent.trim() === 'Edit Info') {
      profileFields.forEach(field => {
        const span = field.querySelector('span');
        const input = field.querySelector('input');
        if (span && input) {
          span.style.display = 'none';
          input.style.display = 'inline-block';
        }
      });

      confirmPasswordField.style.display = 'flex';
      this.textContent = 'Save Info';
    } else {
      let isValid = true;
      let updatedUsername = '';

      profileFields.forEach(field => {
        clearError(field);
        const span = field.querySelector('span');
        const input = field.querySelector('input');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '12px';

        if (input) {
          if (input.value.trim() === '') {
            isValid = false;
            input.classList.add('error');
            errorMessage.textContent = 'This field cannot be empty';
            field.appendChild(errorMessage);
          } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            errorMessage.textContent = 'Please enter a valid email address';
            field.appendChild(errorMessage);
          } else if (span) {
            span.textContent = input.type === 'password' ? '••••••••' : input.value;
            if (input.type === 'text' && field.querySelector('label').textContent === 'Username:') {
              updatedUsername = input.value;
            }
          }
        }
      });
      const passwordField = document.querySelector('.profile-field input[type="password"]');
      const confirmPasswordInput = document.querySelector('.confirm-password input');
      if (passwordField.value !== confirmPasswordInput.value) {
        isValid = false;
        confirmPasswordInput.classList.add('error');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.color = 'red';
        confirmPasswordInput.parentElement.appendChild(errorMessage);
      }
      if (isValid) {
        profileFields.forEach(field => {
          const span = field.querySelector('span');
          const input = field.querySelector('input');
          if (span && input) {
            input.style.display = 'none';
            span.style.display = 'inline-block';
          }
        });

        if (updatedUsername) {
          avatarUsername.textContent = updatedUsername;
        }

        confirmPasswordField.style.display = 'none';

        this.textContent = 'Edit Info';
      }
    }
  });

  profileFields.forEach(field => {
    const inputs = field.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => clearError(field));
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


let selectedFrom = null;
let selectedTo = null;
let activeInput = null;

const fromBtn = document.getElementById("from-btn");
const toBtn = document.getElementById("to-btn");
const calendarContainer = document.querySelector(".calendar-container");

const currentDate = new Date();
const tomorrow = new Date();
tomorrow.setDate(currentDate.getDate() + 1);

fromBtn.textContent = `${currentDate.toDateString()}`;
toBtn.textContent = `${tomorrow.toDateString()}`;

selectedFrom = currentDate;
selectedTo = tomorrow;

function showCalendar(targetBtn) {
  const btnRect = targetBtn.getBoundingClientRect();
  calendarContainer.style.top = `${btnRect.bottom + window.scrollY}px`;
  calendarContainer.style.left = `${btnRect.left}px`;
  calendarContainer.style.display = "block";
}

fromBtn.addEventListener("click", function () {
  activeInput = "from";
  showCalendar(fromBtn);
});

toBtn.addEventListener("click", function () {
  activeInput = "to";
  showCalendar(toBtn);
});

document.addEventListener("click", function (event) {
  if (!calendarContainer.contains(event.target) && event.target !== fromBtn && event.target !== toBtn) {
    calendarContainer.style.display = "none";
  }
});

let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function updateCalendar() {
  const daysContainer = document.querySelector(".calendar-days");
  daysContainer.innerHTML = "";

  document.querySelector(".current-month").textContent = `${months[currentMonth]} ${currentYear}`;
  document.querySelector(".year").textContent = currentYear;

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const numDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const now = new Date();

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDay = document.createElement("span");
    emptyDay.classList.add("calendar-day", "empty-day");
    daysContainer.appendChild(emptyDay);
  }

  for (let i = 1; i <= numDaysInMonth; i++) {
    const dayButton = document.createElement("button");
    dayButton.classList.add("calendar-day");
    dayButton.textContent = i;

    const thisDate = new Date(currentYear, currentMonth, i);
    if (thisDate > now) {
      dayButton.disabled = true;
      dayButton.style.opacity = 0.5;
    }

    dayButton.addEventListener("click", () => {
      const selectedDate = new Date(currentYear, currentMonth, i).toDateString();

      if (activeInput === "from") {
        selectedFrom = new Date(currentYear, currentMonth, i);
        fromBtn.textContent = `${selectedDate}`;
      } else if (activeInput === "to") {
        selectedTo = new Date(currentYear, currentMonth, i);
        toBtn.textContent = `${selectedDate}`;
      }

      calendarContainer.style.display = "none";
    });

    daysContainer.appendChild(dayButton);
  }
}

document.querySelector(".prev-month").addEventListener("click", () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  updateCalendar();
});

document.querySelector(".next-month").addEventListener("click", () => {
  if (currentYear === currentDate.getFullYear() && currentMonth === currentDate.getMonth()) return;
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  updateCalendar();
});

document.querySelector(".prev-year").addEventListener("click", () => {
  currentYear--;
  updateCalendar();
});

document.querySelector(".next-year").addEventListener("click", () => {
  if (currentYear === currentDate.getFullYear()) return;
  currentYear++;
  updateCalendar();
});

updateCalendar();



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
function fetchjson() {
  fetch("public/AAPL_info.json")
    .then((res) => {
      if (!res.ok) {
        console.log(res.status);
      }
      return res.json();
    })
    .then((data) => {
      Company_title.innerText = data.shortName;
      console.log(Company_title)
      Company_price.innerText = "$" + data.currentPrice;
      cp = "$" + data.currentPrice
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


//historic data ka hai yeh
//------------------------------------------------------------------------------------------------------------
// Papa.parse("/public/stock_data_1.csv", {
//   download: true,
//   skipEmptyLines: true,
//   //Draw from csv file
//   complete: (csv) => {
//     var table = document.getElementById("demo");
//     table.innerHTML = "";

//     for (let row of csv.data) {
//       let tr = table.insertRow();
//       for (let cell of row) {
//         let td = tr.insertCell();
//         td.innerHTML = cell;
//       }
//     }
//   },
// });
//------------------------------------------------------------------------------------------------------------------------
const dollar = document.getElementById('dollar').innerText
const percent = document.getElementById('percent').innerText

console.log(dollar.substring(0, 1))
if (dollar.substring(0, 1) === '-') {
  document.getElementById('dollar').style.color = 'red'
}

if (dollar.substring(0, 1) === '+') {
  document.getElementById('dollar').style.color = 'green'
}

if (percent.substring(1, 2) === '-') {
  document.getElementById('percent').style.color = 'red'
}

if (percent.substring(1, 2) === '+') {
  document.getElementById('percent').style.color = 'green'
}


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