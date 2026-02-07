
const generateBtn = document.getElementById('generate-btn');
const lottoSetsContainer = document.getElementById('lotto-sets');
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
}

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayLottoNumbers() {
    lottoSetsContainer.innerHTML = '';
    for (let i = 0; i < 5; i += 1) {
        const numbers = generateLottoNumbers();
        const setList = document.createElement('ul');
        setList.className = 'lotto-set';
        numbers.forEach(number => {
            const item = document.createElement('li');
            item.textContent = number;
            setList.appendChild(item);
        });
        lottoSetsContainer.appendChild(setList);
    }
}

generateBtn.addEventListener('click', displayLottoNumbers);

// Initial generation
displayLottoNumbers();
