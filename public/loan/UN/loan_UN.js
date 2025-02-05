document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('prediction-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        let age = document.getElementById('age').value
        console.log(age)
        let experience = document.getElementById('experience').value
        let income = document.getElementById('income').value
        let family = document.getElementById('family').value
        let ccavg = document.getElementById('ccavg').value
        let education = document.getElementById('education').value
        let mortgage = document.getElementById('mortgage').value
        let cd_account = document.getElementById('cd_account').value
        let credit_card = document.getElementById('credit_card').value
        const price = await fetchingalldatas(age, experience, income, family, ccavg, education, mortgage, cd_account, credit_card)
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
        const isApproved = 0;
        const gifPath = price ? `media/loan/loan_${gifNumber}.gif` : `media/loan/not_loan_${gifNumber}.jpg`;

        document.getElementById('prediction-gif').src = gifPath;
        document.querySelector('.price-value').textContent = price ? "Congratulations! Your chances of loan approval are HIGH!" : "Sorry, your chances of loan approval are LOW";

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

let pricing;
const loading = document.getElementById('loading')
const background = document.getElementById('background')
async function fetchingalldatas(age, experience, income, family, ccavg, education, mortgage, cd_account, credit_card) {
    console.log('aa toh raha h idhar')
    loading.style.display = 'flex'
    loading.style.zIndex = '999'
    loading.style.marginTop = '500px'
    background.style.zIndex = '-999'
    background.style.filter = 'blur(30px)'
    try {
        const response = await fetch('/loan/UN', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ age, experience, income, family, ccavg, education, mortgage, cd_account, credit_card })
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