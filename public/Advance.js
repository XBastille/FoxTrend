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
    new SearchDropdown('add_multiple_graph');
});


Papa.parse("/public/csv_1/stock_data_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const xarray = [];
        const yarray = [];
        const customdata = [];


        results.data.forEach(row => {
            xarray.push(row['Date']);
            yarray.push(parseFloat(row['Close']));
            customdata.push({
                Open: parseFloat(row['Open']).toFixed(2),
                High: parseFloat(row['High']).toFixed(2),
                Low: parseFloat(row['Low']).toFixed(2),
                Volume: parseInt(row['Volume']),
            })
        });


        //DATA ONLOAD


        const tarce1 = [{
            x: xarray,
            y: [],
            customdata: customdata,
            mode: "lines+markers",
            type: "scatter",
            name: val,
            fill: "tozeroy",
            fillgradient: {
                type: 'vertical',
                colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(96,0,147,1)']],
            },
            line: {
                width: 2
            },
            marker: {
                size: 3,
                color: "#7834a8"
            },
            hovertemplate:
                val + '<br>' +
                'Date: %{x}<br>' +
                'Close: %{y}<br>' +
                `Open: %{customdata.Open}<br>` +
                `High: %{customdata.High}<br>` +
                `Low: %{customdata.Low}<br>` +
                `Volume: %{customdata.Volume}<br>` +
                '<extra></extra>',
        }];



        //LAYOUT ONLOAD



        const layout = {
            xaxis: {
                range: [xarray[0], xarray[xarray.length - 1]], title: {
                    text: "Date",
                    font: {
                        color: "white"
                    }
                },
                tickfont: {
                    color: "white"
                }
            },
            yaxis: {
                range: [0, Math.max(...yarray) + 20], title: {
                    font: {
                        color: "white"
                    }
                },
                tickfont: {
                    color: "white"
                }
            },
            colorway: ['#7834a8'],
            plot_bgcolor: "black",
            paper_bgcolor: "black",
            hoverlabel: {
                bgcolor: "black"
            }
        };


        //PLOTLING THE GRAPH AND ANIMATING IT WITH REQUEST ANIMATION FRAME



        Plotly.newPlot("myplot", tarce1, layout);
        let i = 0; let id;
        function animate() {
            if (i < xarray.length) {
                Plotly.extendTraces("myplot", {
                    x: [[xarray[i]]],
                    y: [[yarray[i]]]
                }, [0])
                i++;
                id = requestAnimationFrame(animate);
            }
        }
        animate();


        const stp = document.getElementById("stp");
        stp.addEventListener("click", func);
        function func() {
            Plotly.react("myplot", [{
                x: xarray,
                y: yarray,
                customdata: customdata,
                mode: "lines",
                type: "scatter",
                fill: "tozeroy",
                fillgradient: {
                    type: 'vertical',
                    colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(96,0,147,1)']],
                },
                line: {
                    width: 2
                },
                hovertemplate:    //HOVERING TEMPLATE
                    val + '<br>' +
                    'Date: %{x}<br>' +
                    'Close: %{y}<br>' +
                    `Open: %{customdata.Open}<br>` +
                    `High: %{customdata.High}<br>` +
                    `Low: %{customdata.Low}<br>` +
                    `Volume: %{customdata.Volume}<br>` +
                    '<extra></extra>',
            }], layout)
            cancelAnimationFrame(id);
        }
    }
});


//ONCLICK SECOND GRAPH ADDED ON THE SCREEN
let start, end;
let addmulti = ''
const add_multiple_graph = document.getElementById('add_multiple_graph');
add_multiple_graph.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const val = (add_multiple_graph.value)
        addmulti = val;
        add_multiple_graph.value = ''
        const dates = new Date();
        if (find_button === 'onemonth') {
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
            start = day + "-" + month + "-" + year
            end = day + "-" + months + "-" + years
        }
        if (find_button === 'threemonth') {
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
            start = day + "-" + month + "-" + year
            end = day + "-" + months + "-" + year
        }

        if (find_button === 'ytd') {
            let day = dates.getDate();
            let months = dates.getMonth() + 1
            let year = dates.getFullYear();
            console.log(1 + "-" + 1 + "-" + year)
            console.log(day + "-" + months + "-" + year)
            start = 1 + "-" + 1 + "-" + year
            end = day + "-" + months + "-" + year
        }

        if (find_button === 'oneyear') {
            let months = dates.getMonth() + 1
            let day = dates.getDate()
            let year = dates.getFullYear() - 1
            let years = dates.getFullYear()
            console.log(day + "-" + months + "-" + year)
            console.log(day + "-" + months + "-" + years)
            start = day + "-" + months + "-" + year
            end = day + "-" + months + "-" + years
        }
        if (find_button === 'fiveyear') {
            let months = dates.getMonth() + 1
            let day = dates.getDate()
            let year = dates.getFullYear() - 5
            let years = dates.getFullYear()
            console.log(day + "-" + months + "-" + year)
            console.log(day + "-" + months + "-" + years)
            start = day + "-" + months + "-" + year
            end = day + "-" + months + "-" + years
        }
        if (find_button === 'max') {
            let months = dates.getMonth() + 1
            let day = dates.getDate()
            let year = dates.getFullYear() - 5
            let years = dates.getFullYear()
            console.log(day + "-" + months + "-" + 1950)
            console.log(day + "-" + months + "-" + years)
            start = day + "-" + months + "-" + 1950
            end = day + "-" + months + "-" + years
        }
        if (find_button === 'customcalender') {
            const fromMonth = document.querySelector('.from-calendar .month-select').value;
            const fromYear = document.querySelector('.from-calendar .year-select').value;
            const fromDay = document.querySelector('.from-calendar .calendar-body .selected')?.textContent;

            const toMonth = document.querySelector('.to-calendar .month-select').value;
            const toYear = document.querySelector('.to-calendar .year-select').value;
            const toDay = document.querySelector('.to-calendar .calendar-body .selected')?.textContent;
            const startingmonth = Number(fromMonth) + 1;
            const endingmonth = Number(toMonth) + 1;
            start = fromDay + '-' + startingmonth + '-' + fromYear
            end = toDay + '-' + endingmonth + '-' + toYear
        }

        loading.style.display = 'flex'
        loading.style.zIndex = '999'
        myplot.style.zIndex = '-999'
        myplot.style.filter = 'blur(30px)'
        const searchbar = 'searchbar'
        const calender = 'false'
        try {
            const response = await fetch('/Advance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ val, start, end, searchbar, calender })
            });
            const data = await response.json();
            console.log(data)
            if (data.sucess === 'true') {
                loading.style.display = 'none'
                loading.style.zIndex = '-999'
                myplot.style.zIndex = '999'
                myplot.style.filter = 'none'
                fus();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
})

// const second = document.getElementById("second")
// second.addEventListener("click", fus);
let i = 2;
function fus() {
    Papa.parse("/public/csv_1/stock_data_" + `${i}` + ".csv", {
        download: true,
        header: true,
        complete: function (results) {
            const xa = [];
            const ya = [];
            const customdata = [];


            results.data.forEach(row => {
                xa.push(row['Date']);
                ya.push(parseFloat(row['Close']));
                customdata.push({
                    Open: parseFloat(row['Open']).toFixed(2),
                    High: parseFloat(row['High']).toFixed(2),
                    Low: parseFloat(row['Low']).toFixed(2),
                    Volume: parseInt(row['Volume']),
                })
            });


            const tarce2 = [{
                x: xa,
                y: ya,
                customdata: customdata,
                mode: "lines",
                name: addmulti,
                type: "scatter",
                line: {
                    width: 2
                },
                hovertemplate:
                    addmulti + '<br>' +
                    'Date: %{x}<br>' +
                    'Close: %{y}<br>' +
                    `Open: %{customdata.Open}<br>` +
                    `High: %{customdata.High}<br>` +
                    `Low: %{customdata.Low}<br>` +
                    `Volume: %{customdata.Volume}<br>` +
                    '<extra></extra>',
            }];


            Plotly.addTraces("myplot", tarce2);
            i++;
        }


    });


}




//BOILENGER BAND GRAPH--------------------------------------
Papa.parse("/public/csv_1/technical_indicators_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const xarray = [];
        const upperBand = [];
        const lowerBand = [];

        results.data.forEach(row => {
            if (row['Bollinger_hband'] && row['Bollinger_lband']) {
                xarray.push(row['Date']);
                upperBand.push(parseFloat(row['Bollinger_hband']));
                lowerBand.push(parseFloat(row['Bollinger_lband']));
            }
        });

        const boilenger = document.getElementById("boilenger");
        let bollingerTraces = [];
        let bollingerVisible = false;

        boilenger.addEventListener('click', () => {
            if (!bollingerVisible) {
                const traces = [{
                    x: xarray,
                    y: upperBand,
                    name: val + ' Upper Band',
                    mode: "lines+markers",
                    type: "scatter",
                    line: { width: 2, color: "blue" },
                    marker: {
                        size: 3,
                        color: "blue"
                    },
                    hovertemplate:
                        val + '<br>' +
                        'Date: %{x}<br>' +
                        'Upper Band: %{y:.2f}<br>' +
                        '<extra></extra>',
                    hoverlabel: {
                        bgcolor: "blue"
                    },
                    yaxis: 'y1'
                }, {
                    x: xarray,
                    y: lowerBand,
                    name: val + ' Lower Band',
                    mode: "lines+markers",
                    type: "scatter",
                    line: { width: 2, color: "blue" },
                    marker: {
                        size: 3,
                        color: "blue"
                    },
                    hovertemplate:
                        val + '<br>' +
                        'Date: %{x}<br>' +
                        'Lower Band: %{y:.2f}<br>' +
                        '<extra></extra>',
                    hoverlabel: {
                        bgcolor: "blue"
                    },
                    fill: 'tonexty',
                    yaxis: 'y1'
                }];


                const maxBand = Math.max(...upperBand);
                const minBand = Math.min(...lowerBand);
                const currentYRange = myplot.layout.yaxis.range;
                const newYRange = [
                    Math.min(currentYRange[0], minBand),
                    Math.max(currentYRange[1], maxBand)
                ];

                Plotly.update("myplot", {}, {
                    yaxis: { range: newYRange }
                });

                Plotly.addTraces("myplot", traces);
                bollingerTraces = [myplot.data.length - 2, myplot.data.length - 1];
                boilenger.textContent = "Remove Bollinger Bands";
                bollingerVisible = true;
            } else {
                Plotly.deleteTraces("myplot", bollingerTraces);
                boilenger.textContent = "Add Bollinger Bands";
                bollingerVisible = false;
            }
        });
    }
});








//RSI MARK
// --------------------------------------------------------------------------------------------------------------------------------------
Papa.parse("/public/csv_1/technical_indicators_1.csv", {
    download: true,
    header: true,
    complete: function (results) {
        const xarray = [];
        const RSI = [];

        results.data.forEach(row => {
            xarray.push(row['Date']);
            RSI.push(parseFloat(row['RSI']));
        });

        const rsii = document.getElementById("rsi");
        let rsiVisible = false;

        rsii.addEventListener('click', () => {
            if (!rsiVisible) {
                const rsilayout = {
                    xaxis: {
                        range: [xarray[0], xarray[xarray.length - 1]],
                        title: {
                            text: "Date",
                            font: { color: "white" }
                        },
                        tickfont: { color: "white" }
                    },
                    yaxis: {
                        range: [0, 100],
                        title: {
                            text: "RSI",
                            font: { color: "white" }
                        },
                        tickfont: { color: "white" }
                    },
                    colorway: ['#7834a8'],
                    plot_bgcolor: "black",
                    paper_bgcolor: "black",
                };

                const rsitrace = [{
                    x: xarray,
                    y: RSI,
                    mode: "lines",
                    type: "scatter",
                    line: { width: 2 }
                }];

                Plotly.newPlot("rsigraph", rsitrace, rsilayout);

                // Add overbought/oversold lines
                const ys = new Array(xarray.length).fill(70);
                const ysi = new Array(xarray.length).fill(30);

                Plotly.addTraces("rsigraph", [{
                    x: xarray,
                    y: ys,
                    mode: "lines",
                    type: "scatter",
                    name: "overbought (70)",
                    line: { color: "red", width: 2 }
                }, {
                    x: xarray,
                    y: ysi,
                    mode: "lines",
                    type: "scatter",
                    name: "oversold (30)",
                    line: { color: "red", width: 2 }
                }]);

                document.getElementById("rsigraph").style.display = "block";
                rsii.textContent = "Remove RSI";
                rsiVisible = true;
            } else {
                document.getElementById("rsigraph").style.display = "none";
                rsii.textContent = "Add RSI";
                rsiVisible = false;
            }
        });
    }
});



// MACD Implementation
const macd = document.getElementById('macd');
let macdTraces = [];
let macdVisible = false;


macd.addEventListener('click', () => {
    if (!macdVisible) {
        Papa.parse("/public/csv_1/technical_indicators_1.csv", {
            download: true,
            header: true,
            complete: function (results) {
                const xarray = [];
                const MACD = [];
                const MACDsignal = [];
                const MACDhistogramabove = new Array(results.data.length).fill(null);
                const MACDhistogrambelow = new Array(results.data.length).fill(null);


                results.data.forEach((row, index) => {
                    xarray.push(row['Date']);
                    MACD.push(row['MACD']);
                    MACDsignal.push(row['MACD_signal']);
                    const histo_value = row['MACD_histogram'];
                    if (histo_value > 0) {
                        MACDhistogramabove[index] = (histo_value);
                    } else {
                        MACDhistogrambelow[index] = (histo_value);
                    }
                });


                Plotly.addTraces("myplot", [{
                    x: xarray,
                    y: MACD,
                    mode: "lines",
                    type: "scatter",
                    name: "MACD",
                    line: { width: 2, color: "yellow" }
                }, {
                    x: xarray,
                    y: MACDsignal,
                    mode: "lines",
                    type: "scatter",
                    name: "MACDsignals",
                    line: { width: 2, color: "blue" }
                }, {
                    x: xarray,
                    y: MACDhistogramabove,
                    type: "bar",
                    name: "MACDhistogramabove",
                    marker: { color: "green" }
                }, {
                    x: xarray,
                    y: MACDhistogrambelow,
                    type: "bar",
                    name: "MACDhistogrambelow",
                    marker: { color: "red" }
                }]);


                macdTraces = [
                    myplot.data.length - 4,
                    myplot.data.length - 3,
                    myplot.data.length - 2,
                    myplot.data.length - 1
                ];
                macd.textContent = "Remove MACD";
                macdVisible = true;
            }
        });
    } else {
        Plotly.deleteTraces("myplot", macdTraces);
        macd.textContent = "Add MACD";
        macdVisible = false;
    }
});
//----------------------------------------------------------------------------------------------------------------------

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
                find_button = 'customcalender'
                const calendar = 'true'
                const searchbar = 'nosearch'
                console.log(start, end)
                loading.style.display = 'flex'
                loading.style.zIndex = '999'
                myplot.style.zIndex = '-999'
                myplot.style.filter = 'blur(30px)'
                try {
                    const response = await fetch('/Advance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ val, start, end, calendar, searchbar })
                    });
                    const data = await response.json();
                    console.log(data)
                    if (data.sucess === 'true') {
                        loading.style.display = 'none'
                        loading.style.zIndex = '-999'
                        myplot.style.zIndex = '999'
                        myplot.style.filter = 'none'
                        graphing();
                        i = 2;
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
/*close rsi graph */

const RSIGRAPH = document.getElementById('rsigraph');
const cross = document.getElementById('cross');

cross.addEventListener('click', () => {
    RSIGRAPH.style.display = 'block';
})




/*dropdown menu*/

const addButton = document.getElementById("addButton");
const dropdownMenu = document.getElementById("dropdownMenu")

addButton.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
})

document.addEventListener('click', (event) => {
    if (!addButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

/*adding indicators*/

const RSI = document.getElementById("RSI");
const MACD = document.getElementById("MACD");
const BOLL = document.getElementById("boll");

const BAND = document.getElementById("band");
const IND = document.getElementById("ind");
const STRN = document.getElementById("strn");

IND.addEventListener('click', () => {
    RSI.style.display = 'block';
    RSI.style.display = 'flex';
    IND.style.color = 'white';
})

BAND.addEventListener('click', () => {
    BOLL.style.display = 'block';
    BOLL.style.display = 'flex';
    BAND.style.color = 'white';
})

STRN.addEventListener('click', () => {
    MACD.style.display = 'block';
    MACD.style.display = 'flex';
    STRN.style.color = 'white';
})


/*dustbin implementation */

const imgboll = document.getElementById("imgboll");
const imgrsi = document.getElementById("imgrsi");
const imgmacd = document.getElementById("imgmacd");

imgboll.addEventListener("click", () => {
    BOLL.style.display = 'none';
    BAND.style.color = 'gray';
})

imgrsi.addEventListener("click", () => {
    RSI.style.display = 'none';
    IND.style.color = 'gray';
})


imgmacd.addEventListener("click", () => {
    MACD.style.display = 'none';
    STRN.style.color = 'gray';
})

/*icon dropdown hover */

const infodropdown = document.getElementById('infodropdown');
const infodropdown1 = document.getElementById('infodropdown1');
const infodropdown2 = document.getElementById('infodropdown2');
const infodropdown3 = document.getElementById('infodropdown3');

const Price = document.getElementById('price');
const boll = document.getElementById('boll');
const rsi = document.getElementById('RSI');
const Macd = document.getElementById('MACD');

Price.addEventListener('mouseover', () => {
    infodropdown.style.display = 'block';
})

Price.addEventListener('mouseout', () => {
    infodropdown.style.display = 'none';
})

boll.addEventListener('mouseover', () => {
    infodropdown1.style.display = 'block';
})

boll.addEventListener('mouseout', () => {
    infodropdown1.style.display = 'none';
})

rsi.addEventListener('mouseover', () => {
    infodropdown2.style.display = 'block';
})

rsi.addEventListener('mouseout', () => {
    infodropdown2.style.display = 'none';
})

Macd.addEventListener('mouseover', () => {
    infodropdown3.style.display = 'block';
})

Macd.addEventListener('mouseout', () => {
    infodropdown3.style.display = 'none';
})

/*view continer of disclousre*/

const Viewcont = document.querySelector('.viewcont');
const disclosure = document.querySelector('.Disclosure');
const closeDisclosure = document.getElementById('closeDisclosure');


disclosure.addEventListener('click', () => {
    Viewcont.style.display = 'block';
    /*  body.classList.add('blurred'); */
})

closeDisclosure.addEventListener('click', () => {
    Viewcont.style.display = 'none';
    /*  body.classList.remove('blurred'); */
})



const compadvance = document.getElementById('compadvance')
const compadvanceprice = document.getElementById('compadvanceprice')
const aapl=document.getElementById('aapl')

//connecting the data wiht json file like comany name
let val = '';
async function companaming() {
    try {
        const res = await fetch('/public/graph.json')
        if (!res.ok) {
            console.log(res.status)
            return;
        }
        const data = await res.json();
        val = data.symbol
        compadvance.innerText = data.shortName
        compadvanceprice.innerText = "$" + data.currentPrice
        const priceChange = data.currentPrice - data.previousClose;
        const priceChangeElement = document.getElementById('priceChangeValue');
        const sign = priceChange >= 0 ? '+' : '-';
        priceChangeElement.innerText = `(${sign}$${Math.abs(priceChange).toFixed(2)})`;
        priceChangeElement.style.color = priceChange >= 0 ? 'green' : 'red';
        aapl.innerText="Predict "+data.symbol
        console.log(data.shortName)
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    companaming();
});

function graphing() {
    Papa.parse("/public/csv_1/stock_data_1.csv", {
        download: true,
        header: true,
        complete: function (results) {
            const xarray = [];
            const yarray = [];
            const customdata = [];


            results.data.forEach(row => {
                xarray.push(row['Date']);
                yarray.push(parseFloat(row['Close']));
                customdata.push({
                    Open: parseFloat(row['Open']).toFixed(2),
                    High: parseFloat(row['High']).toFixed(2),
                    Low: parseFloat(row['Low']).toFixed(2),
                    Volume: parseInt(row['Volume']),
                })
            });


            //DATA ONLOAD


            const tarce1 = [{
                x: xarray,
                y: [],
                customdata: customdata,
                mode: "lines",
                type: "scatter",
                name: val,
                fill: "tozeroy",
                fillgradient: {
                    type: 'vertical',
                    colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(96,0,147,1)']],
                },
                line: {
                    width: 2
                },
                hovertemplate:
                    val + '<br>' +
                    'Date: %{x}<br>' +
                    'Close: %{y}<br>' +
                    `Open: %{customdata.Open}<br>` +
                    `High: %{customdata.High}<br>` +
                    `Low: %{customdata.Low}<br>` +
                    `Volume: %{customdata.Volume}<br>` +
                    '<extra></extra>',
            }];


            //LAYOUT ONLOAD



            const layout = {
                xaxis: {
                    range: [xarray[0], xarray[xarray.length - 1]], title: {
                        text: "Date",
                        font: {
                            color: "white"
                        }
                    },
                    tickfont: {
                        color: "white"
                    }
                },
                yaxis: {
                    range: [0, Math.max(...yarray) + 20], title: {
                        font: {
                            color: "white"
                        }
                    },
                    tickfont: {
                        color: "white"
                    }
                },
                colorway: ['#7834a8'],
                plot_bgcolor: "black",
                paper_bgcolor: "black",
                hoverlabel: {
                    bgcolor: "black"
                }
            };


            //PLOTLING THE GRAPH AND ANIMATING IT WITH REQUEST ANIMATION FRAME



            Plotly.newPlot("myplot", tarce1, layout);
            let i = 0; let id;
            function animate() {
                if (i < xarray.length) {
                    Plotly.extendTraces("myplot", {
                        x: [[xarray[i]]],
                        y: [[yarray[i]]]
                    }, [0])
                    i++;
                    id = requestAnimationFrame(animate);
                }
            }
            animate();


            const stp = document.getElementById("stp");
            stp.addEventListener("click", func);
            function func() {
                Plotly.react("myplot", [{
                    x: xarray,
                    y: yarray,
                    customdata: customdata,
                    mode: "lines",
                    name: val,
                    type: "scatter",
                    fill: "tozeroy",
                    fillgradient: {
                        type: 'vertical',
                        colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(96,0,147,1)']],
                    },
                    line: {
                        width: 2
                    },
                    hovertemplate:    //HOVERING TEMPLATE
                        val + '<br>' +
                        'Date: %{x}<br>' +
                        'Close: %{y}<br>' +
                        `Open: %{customdata.Open}<br>` +
                        `High: %{customdata.High}<br>` +
                        `Low: %{customdata.Low}<br>` +
                        `Volume: %{customdata.Volume}<br>` +
                        '<extra></extra>',
                }], layout)
                cancelAnimationFrame(id);
            }
        }
    });

}

let find_button = 'onemonth';

//ONE-WEEK
const oneweek = document.getElementById('oneweek')
oneweek.addEventListener('click', async () => {
    ;
    //starting Date----------------------------------------------------------------------------------
    var endsmonth;
    var currentDate = new Date();
    var last = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toUTCString();
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
    var endsyear = first.substring(12, 16)
    const end = (endsday + '-' + endsmonth + '-' + endsyear);
    find_button = 'oneweek'
    const calender = 'true'
    const searchbar = 'nosearch'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })
        });
        const data = await response.json();
        console.log(data)
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2;
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
    let years = dates.getFullYear();
    if (month === 0) {
        year = year - 1;
        month = 12
        months = 1;
    }
    const start = day + "-" + month + "-" + year
    const end = day + "-" + months + "-" + years
    find_button = 'onemonth'
    const calender = 'true'
    const searchbar = 'nosearch'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })
        });
        const data = await response.json();
        console.log(data)
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2;
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
    console.log(day + "-" + months + "-" + years)
    const start = day + "-" + month + "-" + year
    const end = day + "-" + months + "-" + years
    find_button = 'threemonth';
    const calender = 'true';
    const searchbar = 'nosearch'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })

        });

        const data = await response.json();
        console.log(data);
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2;
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
    find_button = 'ytd'
    const calender = 'true'
    const searchbar = 'nosearch'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })
        });
        const data = await response.json();
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2
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
    find_button = 'oneyear';
    const searchbar = 'nosearch'
    const calender = 'true'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })
        });
        const data = await response.json();
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2;
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
    find_button = 'fiveyear'
    const calender = 'true'
    const searchbar = 'nosearch'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })
        });
        const data = await response.json();
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2;
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
    find_button = 'max'
    const calender = "true"
    const searchbar = 'nosearch'
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    myplot.style.zIndex = '-999'
    myplot.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/Advance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ val, start, end, calender, searchbar })
        });
        const data = await response.json();
        if (data.sucess === 'true') {
            loading.style.display = 'none'
            loading.style.zIndex = '-999'
            myplot.style.zIndex = '999'
            myplot.style.filter = 'none'
            graphing();
            i = 2;
        }
    } catch (error) {
        console.error('Error:', error);
    }
})
