
// Define the custom element for the lotto ball
class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--accent-color);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5em;
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
        `;

        const ball = document.createElement('div');
        ball.setAttribute('class', 'ball');
        ball.textContent = this.getAttribute('number');

        shadow.appendChild(style);
        shadow.appendChild(ball);
    }
}

customElements.define('lotto-ball', LottoBall);

const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}

function displayLottoNumbers() {
    lottoNumbersContainer.innerHTML = '';
    const numbers = generateLottoNumbers();
    numbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
}

generateBtn.addEventListener('click', displayLottoNumbers);

// Initial generation
displayLottoNumbers();
