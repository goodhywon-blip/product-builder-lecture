
const generateBtn = document.getElementById('generate-btn');
const menuSetsContainer = document.getElementById('menu-sets');
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
    menus.forEach(menu => {
        const card = document.createElement('div');
        card.className = 'menu-card';

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
    });
}

generateBtn.addEventListener('click', displayMenus);

// Initial generation
displayMenus();
