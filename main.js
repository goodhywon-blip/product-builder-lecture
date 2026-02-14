
const generateBtn = document.getElementById('generate-btn');
const menuSetsContainer = document.getElementById('menu-sets');
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const menuArtCanvas = document.getElementById('menu-art-canvas');
const menuArtTitle = document.getElementById('menu-art-title');
const menuArtTags = document.getElementById('menu-art-tags');
const menuArtNote = document.getElementById('menu-art-note');
const menuArtContext = menuArtCanvas.getContext('2d');

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

const menuPool = [
    { name: 'Kimchi Fried Rice', tags: ['Korean', 'Quick', 'Spicy'] },
    { name: 'Soy Garlic Chicken', tags: ['Korean', 'Crispy'] },
    { name: 'Bibimbap Bowl', tags: ['Korean', 'Balanced'] },
    { name: 'Tteokbokki & Fish Cake', tags: ['Street', 'Spicy'] },
    { name: 'Miso Ramen', tags: ['Japanese', 'Warm'] },
    { name: 'Sushi Set', tags: ['Japanese', 'Light'] },
    { name: 'Beef Pho', tags: ['Vietnamese', 'Broth'] },
    { name: 'Banh Mi Sandwich', tags: ['Vietnamese', 'Quick'] },
    { name: 'Pad Thai', tags: ['Thai', 'Sweet-Savory'] },
    { name: 'Green Curry & Rice', tags: ['Thai', 'Coconut'] },
    { name: 'Margherita Pizza', tags: ['Italian', 'Cheesy'] },
    { name: 'Pasta Aglio e Olio', tags: ['Italian', 'Simple'] },
    { name: 'Bulgogi Lettuce Wraps', tags: ['Korean', 'Grill'] },
    { name: 'Salmon Poke Bowl', tags: ['Hawaiian', 'Fresh'] },
    { name: 'Chicken Caesar Salad', tags: ['Light', 'Classic'] },
    { name: 'Steak & Veggies', tags: ['Hearty', 'Protein'] },
    { name: 'Tofu Stir-Fry', tags: ['Vegetarian', 'Quick'] },
    { name: 'Mushroom Risotto', tags: ['Italian', 'Comfort'] },
    { name: 'Shrimp Tacos', tags: ['Mexican', 'Zesty'] },
    { name: 'Burrito Bowl', tags: ['Mexican', 'Filling'] }
];

function getMenuPalette(menu) {
    const name = menu.name.toLowerCase();
    const tags = menu.tags.map(tag => tag.toLowerCase());
    const hasTag = (value) => tags.includes(value);

    if (name.includes('curry')) {
        return { base: '#f4a261', accent: '#e76f51', garnish: '#2a9d8f' };
    }
    if (name.includes('ramen') || name.includes('pho')) {
        return { base: '#d4a373', accent: '#9c6644', garnish: '#2d6a4f' };
    }
    if (name.includes('salad') || hasTag('light')) {
        return { base: '#a7c957', accent: '#386641', garnish: '#6a994e' };
    }
    if (name.includes('pizza') || name.includes('risotto')) {
        return { base: '#f2cc8f', accent: '#e07a5f', garnish: '#81b29a' };
    }
    if (name.includes('taco') || name.includes('burrito')) {
        return { base: '#fcbf49', accent: '#f77f00', garnish: '#2a9d8f' };
    }
    if (name.includes('poke') || name.includes('sushi')) {
        return { base: '#8ecae6', accent: '#219ebc', garnish: '#023047' };
    }
    if (name.includes('kimchi') || name.includes('tteok')) {
        return { base: '#ef476f', accent: '#f78c6b', garnish: '#ffd166' };
    }
    if (name.includes('steak') || hasTag('hearty')) {
        return { base: '#b56576', accent: '#6d597a', garnish: '#355070' };
    }
    return { base: '#bde0fe', accent: '#a2d2ff', garnish: '#588157' };
}

function drawMenuArt(menu) {
    const { base, accent, garnish } = getMenuPalette(menu);
    const ctx = menuArtContext;
    const { width, height } = menuArtCanvas;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(245, 239, 228, 0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(width / 2 + 8, height / 2 + 18, 108, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fdfaf5';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 92, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = accent;
    for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.arc(
            width / 2 + Math.cos(i) * 28,
            height / 2 + Math.sin(i * 1.2) * 20,
            16,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.fillStyle = garnish;
    for (let i = 0; i < 9; i += 1) {
        ctx.beginPath();
        ctx.arc(
            width / 2 + Math.cos(i * 0.9) * 45,
            height / 2 + Math.sin(i * 0.7) * 30,
            4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 28, 0, Math.PI * 2);
    ctx.stroke();
}

function updateSelectedMenu(menu, card) {
    menuArtTitle.textContent = menu.name;
    menuArtTags.innerHTML = '';
    menu.tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'menu-tag';
        tagEl.textContent = tag;
        menuArtTags.appendChild(tagEl);
    });
    menuArtNote.textContent = 'Illustrated plate inspired by today\'s pick.';
    drawMenuArt(menu);

    document.querySelectorAll('.menu-card').forEach(el => {
        el.classList.toggle('is-selected', el === card);
        el.setAttribute('aria-pressed', String(el === card));
    });
}

function getRandomMenus(count) {
    const picks = new Set();
    while (picks.size < count) {
        const index = Math.floor(Math.random() * menuPool.length);
        picks.add(menuPool[index]);
    }
    return Array.from(picks);
}

function displayMenus() {
    menuSetsContainer.innerHTML = '';
    const menus = getRandomMenus(5);
    menus.forEach((menu, index) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-pressed', 'false');

        const title = document.createElement('p');
        title.className = 'menu-title';
        title.textContent = menu.name;

        const meta = document.createElement('div');
        meta.className = 'menu-meta';

        menu.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'menu-tag';
            tagEl.textContent = tag;
            meta.appendChild(tagEl);
        });

        card.appendChild(title);
        card.appendChild(meta);
        menuSetsContainer.appendChild(card);

        const handleSelect = () => updateSelectedMenu(menu, card);
        card.addEventListener('click', handleSelect);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleSelect();
            }
        });

        if (index === 0) {
            updateSelectedMenu(menu, card);
        }
    });
}

generateBtn.addEventListener('click', displayMenus);

// Initial generation
displayMenus();
