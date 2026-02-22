const URL = 'https://teachablemachine.withgoogle.com/models/DZAlMqduj/';

let model;
let webcam;
let maxPredictions;
let latestPrediction = [];
let isReady = false;

const startBtn = document.getElementById('start-btn');
const playBtn = document.getElementById('play-btn');
const statusEl = document.getElementById('status');
const labelContainer = document.getElementById('label-container');
const playerChoiceEl = document.getElementById('player-choice');
const aiChoiceEl = document.getElementById('ai-choice');
const resultMessageEl = document.getElementById('result-message');
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

function setStatus(message) {
    statusEl.textContent = message;
}

function normalizeLabel(label) {
    if (!label) return '';
    const lower = label.toLowerCase();
    if (lower.includes('rock') || lower.includes('바위')) return '바위';
    if (lower.includes('paper') || lower.includes('보')) return '보';
    if (lower.includes('scissor') || lower.includes('가위')) return '가위';
    return label;
}

function getTopPrediction() {
    if (!latestPrediction.length) return null;
    const best = latestPrediction.reduce((acc, cur) => {
        if (!acc || cur.probability > acc.probability) return cur;
        return acc;
    }, null);
    return best;
}

function updateLabelList(predictions) {
    labelContainer.innerHTML = '';
    predictions.forEach((prediction) => {
        const row = document.createElement('div');
        row.className = 'label-pill';
        const name = document.createElement('span');
        name.textContent = normalizeLabel(prediction.className);
        const prob = document.createElement('span');
        prob.textContent = `${Math.round(prediction.probability * 100)}%`;
        row.appendChild(name);
        row.appendChild(prob);
        labelContainer.appendChild(row);
    });
}

function getRandomChoice() {
    const options = ['가위', '바위', '보'];
    return options[Math.floor(Math.random() * options.length)];
}

function judge(player, ai) {
    if (player === ai) return '비겼어요!';
    if (
        (player === '가위' && ai === '보') ||
        (player === '바위' && ai === '가위') ||
        (player === '보' && ai === '바위')
    ) {
        return '이겼어요!';
    }
    return '졌어요!';
}

async function init() {
    if (isReady) return;
    setStatus('모델을 불러오는 중...');

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    model = await window.tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new window.tmImage.Webcam(320, 320, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    const webcamContainer = document.getElementById('webcam-container');
    webcamContainer.innerHTML = '';
    webcamContainer.appendChild(webcam.canvas);

    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i += 1) {
        const row = document.createElement('div');
        row.className = 'label-pill';
        row.textContent = '-';
        labelContainer.appendChild(row);
    }

    isReady = true;
    playBtn.disabled = false;
    setStatus('준비 완료! 대결을 시작해보세요.');
}

async function loop() {
    if (!webcam) return;
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    if (!model || !webcam) return;
    const prediction = await model.predict(webcam.canvas);
    latestPrediction = prediction;
    updateLabelList(prediction);
}

function startRound() {
    const best = getTopPrediction();
    if (!best) {
        resultMessageEl.textContent = '인식 결과가 없어요. 손 모양을 보여주세요.';
        return;
    }

    const playerChoice = normalizeLabel(best.className);
    const aiChoice = getRandomChoice();
    const result = judge(playerChoice, aiChoice);

    playerChoiceEl.textContent = playerChoice;
    aiChoiceEl.textContent = aiChoice;
    resultMessageEl.textContent = `당신은 ${playerChoice}, AI는 ${aiChoice}. 결과: ${result}`;
}

startBtn.addEventListener('click', () => {
    init().catch((error) => {
        console.error(error);
        setStatus('카메라 접근에 실패했습니다. 브라우저 권한을 확인해주세요.');
    });
});

playBtn.addEventListener('click', startRound);
