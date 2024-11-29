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

let formdata = {
  username: "",
}

const nhi = "false"
async function handless() {
  try {
    const response = await fetch('/userprofile', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formdata)
    })
    const datas = await response.json()
    console.log(datas)
    return datas.success === 'false' ? 'false' : 'true';
  } catch (error) {
    console.log(error)
  }
}

function formdatas() {
  formdata.username = document.getElementById("username").value.trim()
  console.log(formdata)
}



document.addEventListener('DOMContentLoaded', function () {
  const editButton = document.querySelector('.edit-button');
  const profileForm = document.querySelector('.profile-section');
  const profileFields = document.querySelectorAll('.profile-field');
  const avatarUsername = document.querySelector('.profile-header h1');
  const confirmPasswordField = document.querySelector('.confirm-password');
  const submit_button = document.getElementById('submit_button')
  submit_button.addEventListener('click', async (event) => {
    c++;
    const passwordss = document.getElementById('password').value
    const confirm_passwords = document.getElementById('confirm_password').value
    const emailss = document.getElementById('email').value
    if (c % 2 != 0) {
      event.preventDefault()
      const usernames = document.getElementById('username').value
      const emails = document.getElementById('email').value
      const passwords = document.getElementById('password').value
      const confirm_password = document.getElementById('confirm_password').value
      try {
        const response = await fetch('/userprofile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emails, passwords })
        });
        const data = await response.json();
        console.log('Response from server:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      // event.preventDefault()
      formdatas();
      const result = await handless()
      console.log(result)
      if (result === 'false') {
        event.preventDefault()
        console.log("usernames already exists")
        c = 1;
        return
      }
      if (passwordss !== confirm_passwords) {
        event.preventDefault()
        console.log("equal nhi bsdk")
        c = 1;
        return
      }
      if (!emailss.endsWith("@gmail.com")) {
        event.preventDefault()
        console.log("equal nhi bsdk")
        c = 1;
        return
      }
      profileForm.method = 'POST'
      profileForm.action = "/userprofile"
      profileForm.submit();
      // window.location.reload();
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

document.addEventListener('DOMContentLoaded', function() {
  const dateRangeBtn = document.getElementById('date-range-btn');
  const calendarPopup = document.getElementById('calendar-popup');
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({length: currentYear - 1979}, (_, i) => 1980 + i);

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

//ONE-WEEK
// const oneweek = document.getElementById('oneweek')
// oneweek.addEventListener('click', () => {
//   var curr = new Date;
//   // var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
//   // var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() - 6));

//   var currentDate = new Date();
//   var firstday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toUTCString();
//   var lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 7)).toUTCString();
//   console.log(firstday, lastday)
// })

//onemonth(DONE)--------------------------------------------------------------------------------
const onemonth = document.getElementById('onemonth')
onemonth.addEventListener('click', async () => {
  const dates = new Date()
  const month = dates.getMonth()
  const months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear()
  if (month === 0) {
    year = year - 1;
    month = 12
    months = 1;
  }
  console.log(day + "-" + month + "-" + year)
  console.log(day + "-" + months + "-" + year)
  const start = day + "-" + month + "-" + year
  const end = day + "-" + months + "-" + year
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
      // sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
      // console.log(data.summaryanimation)
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})
//--------------------------------------------------------------------------------------

//three month(DONE)---------------------------------------------------------------------
const threemonth = document.getElementById('threemonth')
threemonth.addEventListener('click', async () => {

  const dates = new Date()
  let month = dates.getMonth()
  let months = dates.getMonth() + 1
  let day = dates.getDate()
  let year = dates.getFullYear()
  if (month === 0) {
    year = year - 1;
  }
  month -= 2;
  console.log(day + "-" + month + "-" + year)
  console.log(day + "-" + months + "-" + year)
  const start = day + "-" + month + "-" + year
  const end = day + "-" + months + "-" + year

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
      // sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
      // console.log(data.summaryanimation)
      // window.location.reload();
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
      // sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
      // console.log(data.summaryanimation)
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
      // sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
      // console.log(data.summaryanimation)
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
      // sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
      // console.log(data.summaryanimation)
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
      // sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
      // console.log(data.summaryanimation)
      graphing();
    }
  } catch (error) {
    console.error('Error:', error);
  }
})
//--------------------------------------------------------------------------------------------------
//checking from calender
// const frombtn = document.getElementById('from-btn')
let start, end;
let startingmonth;
document.addEventListener('calendarUpdated', () => {
  const startmonth = calender_from.substring(4, 7)
  const startdate = calender_from.substring(8, 10)
  const startyear = calender_from.substring(11);
  const mahina = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < mahina.length; i++) {
    if (startmonth === mahina[i]) {
      console.log(i + 1);
      startingmonth = i + 1;
    }

  }
  start = startdate + "-" + startingmonth + "-" + startyear
  end = startdate + "-" + startingmonth + "-" + startyear
  console.log(start)
  console.log(end)

})

const tobtn = document.getElementById('to-btn')



// try {
//   const response = await fetch('/summary', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ val, start, end })
//   });
//   const data = await response.json();
//   console.log(data)
//   if (data.sucess === 'true') {
//     sessionStorage.setItem('summaryData', JSON.stringify(data.summaryanimation));
//     console.log(data.summaryanimation)
//     window.location.href = '/loading';
//   }
// } catch (error) {
//   console.error('Error:', error);
// }