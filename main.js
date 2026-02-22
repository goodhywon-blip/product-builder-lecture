const generateBtn = document.getElementById('generate-btn');
const menuSetsContainer = document.getElementById('menu-sets');
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const menuArtImage = document.getElementById('menu-art-image');
const menuArtTitle = document.getElementById('menu-art-title');
const menuArtTags = document.getElementById('menu-art-tags');
const menuArtNote = document.getElementById('menu-art-note');
const imageCache = new Map();
let latestImageRequest = 0;

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
    { name: 'Kimchi Fried Rice', tags: ['Korean', 'Quick', 'Spicy'], imageQuery: 'Kimchi Fried Rice', fallbackIngredient: 'Rice' },
    { name: 'Soy Garlic Chicken', tags: ['Korean', 'Crispy'], imageQuery: 'Chicken', fallbackIngredient: 'Chicken' },
    { name: 'Bibimbap Bowl', tags: ['Korean', 'Balanced'], imageQuery: 'Bibimbap', fallbackIngredient: 'Beef' },
    { name: 'Tteokbokki & Fish Cake', tags: ['Street', 'Spicy'], imageQuery: 'Tteokbokki', fallbackIngredient: 'Rice' },
    { name: 'Miso Ramen', tags: ['Japanese', 'Warm'], imageQuery: 'Ramen', fallbackIngredient: 'Noodles' },
    { name: 'Sushi Set', tags: ['Japanese', 'Light'], imageQuery: 'Sushi', fallbackIngredient: 'Salmon' },
    { name: 'Beef Pho', tags: ['Vietnamese', 'Broth'], imageQuery: 'Pho', fallbackIngredient: 'Beef' },
    { name: 'Banh Mi Sandwich', tags: ['Vietnamese', 'Quick'], imageQuery: 'Banh Mi', fallbackIngredient: 'Bread' },
    { name: 'Pad Thai', tags: ['Thai', 'Sweet-Savory'], imageQuery: 'Pad Thai', fallbackIngredient: 'Noodles' },
    { name: 'Green Curry & Rice', tags: ['Thai', 'Coconut'], imageQuery: 'Green Curry', fallbackIngredient: 'Coconut' },
    { name: 'Margherita Pizza', tags: ['Italian', 'Cheesy'], imageQuery: 'Margherita Pizza', fallbackIngredient: 'Cheese' },
    { name: 'Pasta Aglio e Olio', tags: ['Italian', 'Simple'], imageQuery: 'Pasta', fallbackIngredient: 'Pasta' },
    { name: 'Bulgogi Lettuce Wraps', tags: ['Korean', 'Grill'], imageQuery: 'Bulgogi', fallbackIngredient: 'Beef' },
    { name: 'Salmon Poke Bowl', tags: ['Hawaiian', 'Fresh'], imageQuery: 'Poke', fallbackIngredient: 'Salmon' },
    { name: 'Chicken Caesar Salad', tags: ['Light', 'Classic'], imageQuery: 'Caesar Salad', fallbackIngredient: 'Lettuce' },
    { name: 'Steak & Veggies', tags: ['Hearty', 'Protein'], imageQuery: 'Steak', fallbackIngredient: 'Beef' },
    { name: 'Tofu Stir-Fry', tags: ['Vegetarian', 'Quick'], imageQuery: 'Stir Fry', fallbackIngredient: 'Tofu' },
    { name: 'Mushroom Risotto', tags: ['Italian', 'Comfort'], imageQuery: 'Risotto', fallbackIngredient: 'Mushroom' },
    { name: 'Shrimp Tacos', tags: ['Mexican', 'Zesty'], imageQuery: 'Shrimp Tacos', fallbackIngredient: 'Shrimp' },
    { name: 'Burrito Bowl', tags: ['Mexican', 'Filling'], imageQuery: 'Burrito', fallbackIngredient: 'Rice' }
];

function buildMealDbUrl(query) {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodedQuery}`;
}

function getIngredientImage(ingredient) {
    if (!ingredient) {
        return '';
    }
    const normalized = ingredient.trim().replace(/\s+/g, '_').toLowerCase();
    return `https://www.themealdb.com/images/ingredients/${normalized}-medium.png`;
}

async function getMenuImageUrl(menu) {
    if (imageCache.has(menu.name)) {
        return imageCache.get(menu.name);
    }

    const query = menu.imageQuery || menu.name;
    const response = await fetch(buildMealDbUrl(query));
    const data = await response.json();
    let imageUrl = '';

    if (data && Array.isArray(data.meals) && data.meals.length > 0) {
        const exactMatch = data.meals.find(meal => meal.strMeal.toLowerCase().includes(query.toLowerCase()));
        imageUrl = (exactMatch || data.meals[0]).strMealThumb;
    }

    if (!imageUrl) {
        imageUrl = getIngredientImage(menu.fallbackIngredient);
    }

    if (imageUrl) {
        imageCache.set(menu.name, imageUrl);
    }

    return imageUrl;
}

async function updateSelectedMenu(menu, card) {
    menuArtTitle.textContent = menu.name;
    menuArtTags.innerHTML = '';
    menu.tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'menu-tag';
        tagEl.textContent = tag;
        menuArtTags.appendChild(tagEl);
    });
    menuArtNote.textContent = 'Loading menu photo...';
    menuArtImage.classList.add('is-loading');
    menuArtImage.removeAttribute('src');

    const requestId = ++latestImageRequest;
    try {
        const imageUrl = await getMenuImageUrl(menu);
        if (requestId !== latestImageRequest) {
            return;
        }
        if (imageUrl) {
            menuArtImage.src = imageUrl;
            menuArtImage.alt = `${menu.name} photo`;
            menuArtNote.textContent = 'Photo loaded from TheMealDB.';
        } else {
            menuArtNote.textContent = 'No photo found for this menu.';
        }
    } catch (error) {
        if (requestId === latestImageRequest) {
            menuArtNote.textContent = 'Unable to load photo. Please try another menu.';
        }
    } finally {
        if (requestId === latestImageRequest) {
            menuArtImage.classList.remove('is-loading');
        }
    }

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

const form = document.getElementById('partner-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
    const submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(message, isError = false) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? '#b3261e' : '';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        setStatus('전송 중입니다...');

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                form.reset();
                setStatus('문의가 정상적으로 접수되었습니다. 곧 연락드릴게요!');
            } else {
                const data = await response.json().catch(() => null);
                const errorMessage = data?.errors?.[0]?.message || '전송에 실패했습니다. 다시 시도해주세요.';
                setStatus(errorMessage, true);
            }
        } catch (error) {
            setStatus('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', true);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    });
}
