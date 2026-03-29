/* ============================================
   NB DISTILLERS — TASTING ROOM APP ENGINE
   ============================================ */

const App = (() => {
    // ==================== STATE ====================
    const state = {
        name: '',
        mood: '',
        flavours: [],
        style: '',
        bases: [],
        occasion: '',
        intensity: 50, // 0-100
        currentScreen: 'screen-welcome'
    };

    // ==================== PRODUCT DATABASE ====================
    const products = [
        {
            id: 'red-admiral-vodka',
            name: 'Red Admiral Vodka',
            type: 'Premium Craft Vodka',
            category: 'vodka',
            price: '$29.75',
            color: '#c8d8e8',
            gradient: 'linear-gradient(135deg, #e0e8f0, #a8c0d8)',
            bottleColor: '#d0dce8',
            description: 'Handcrafted small-batch vodka, ultra-smooth with a clean, crisp finish. Distilled from Ontario grain with a grain-to-glass approach.',
            flavourProfile: { clean: 90, citrus: 30, herbal: 20, sweet: 15, spice: 10, floral: 10, smoky: 0, coffee: 0, fruity: 15 },
            moods: ['relaxed', 'celebratory', 'curious'],
            styles: ['neat', 'cocktail', 'mixed', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'],
            intensityRange: [10, 50],
            image: 'https://nbdistillers.com/wp-content/uploads/2021/01/Untitled-design-56-1-707x942.png',
            cocktail: { name: 'Red Admiral Mule', emoji: '\u{1F943}', recipe: 'Red Admiral Vodka, ginger beer, fresh lime, ice' },
            matchReasons: {
                clean: 'Perfectly clean and crisp profile',
                default: 'Smooth and versatile — a true crowd-pleaser'
            }
        },
        {
            id: 'red-admiral-cardamom',
            name: 'Red Admiral Cardamom Vodka',
            type: 'Spiced Craft Vodka (Unsweetened)',
            category: 'vodka',
            price: '$34.95',
            color: '#d8c8a8',
            gradient: 'linear-gradient(135deg, #e8dcc0, #c8b090)',
            bottleColor: '#d8c8a8',
            description: 'An exotic twist on our classic vodka, infused with real cardamom. Unsweetened for a sophisticated, aromatic spirit with warm spice notes.',
            flavourProfile: { spice: 90, floral: 60, clean: 50, herbal: 40, citrus: 25, sweet: 20, smoky: 10, coffee: 5, fruity: 10 },
            moods: ['adventurous', 'curious'],
            styles: ['neat', 'cocktail', 'surprise'],
            occasions: ['date', 'explore', 'friends'],
            intensityRange: [30, 70],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/DSC_7552-Cardamom-front_SB_8.22.22-1.png',
            cocktail: { name: 'Cardamom Chai Fizz', emoji: '\u{2728}', recipe: 'Cardamom Vodka, chai syrup, soda water, star anise' },
            matchReasons: {
                spice: 'Rich cardamom warmth matches your spice love',
                floral: 'Aromatic cardamom brings beautiful floral notes',
                default: 'A unique spiced vodka unlike anything you\'ve tried'
            }
        },
        {
            id: 'impresso-coffee-vodka',
            name: 'Impresso Espresso Coffee Vodka',
            type: 'Coffee-Infused Vodka',
            category: 'vodka',
            price: '$45.00',
            color: '#3d2b1f',
            gradient: 'linear-gradient(135deg, #5c3d2e, #2a1810)',
            bottleColor: '#4a3020',
            description: 'Bold espresso meets ultra-smooth vodka. Deep, roasted coffee character with a velvety finish — perfect for espresso martinis and after-dinner sipping.',
            flavourProfile: { coffee: 95, sweet: 60, smoky: 40, spice: 30, clean: 20, herbal: 15, citrus: 5, floral: 5, fruity: 10 },
            moods: ['relaxed', 'celebratory', 'curious'],
            styles: ['neat', 'cocktail', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'],
            intensityRange: [50, 90],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/Impresso-Espresso_Edit-707x1455.png',
            cocktail: { name: 'Espresso Martini', emoji: '\u{2615}', recipe: 'Impresso Vodka, fresh espresso, coffee liqueur, vanilla syrup' },
            matchReasons: {
                coffee: 'Deep espresso character — your coffee match made in heaven',
                sweet: 'Rich, velvety sweetness with roasted depth',
                smoky: 'Bold, roasted intensity with smoky undertones',
                default: 'Our most indulgent spirit — rich, bold, unforgettable'
            }
        },
        {
            id: 'rose-city-gin',
            name: 'Rose City Gin',
            type: 'Craft Botanical Gin',
            category: 'gin',
            price: '$34.95',
            color: '#a8d8c8',
            gradient: 'linear-gradient(135deg, #b8e8d8, #88c0a8)',
            bottleColor: '#98d0b8',
            description: 'A beautifully balanced botanical gin with classic juniper backbone. Named for Welland\'s Rose City heritage, with botanicals that celebrate the Niagara region.',
            flavourProfile: { herbal: 85, floral: 65, citrus: 60, clean: 50, spice: 30, fruity: 25, sweet: 15, smoky: 5, coffee: 0 },
            moods: ['adventurous', 'relaxed', 'curious'],
            styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['date', 'friends', 'explore'],
            intensityRange: [25, 65],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/Rose-City-Gin-New-Bottle.png',
            cocktail: { name: 'Rose City G&T', emoji: '\u{1F33F}', recipe: 'Rose City Gin, premium tonic, cucumber, juniper berries' },
            matchReasons: {
                herbal: 'Complex botanicals match your herbal palate',
                citrus: 'Bright citrus-forward gin with botanical depth',
                floral: 'Fragrant botanicals perfectly suit your floral preference',
                default: 'A classic craft gin with Niagara character'
            }
        },
        {
            id: 'rose-city-hibiscus-gin',
            name: 'Rose City & Hibiscus Flavoured Gin',
            type: 'Hibiscus-Infused Gin',
            category: 'gin',
            price: '$34.95',
            color: '#c86080',
            gradient: 'linear-gradient(135deg, #d87898, #a84860)',
            bottleColor: '#c86878',
            description: 'Stunning pink gin infused with real hibiscus flowers. Floral, fruity, and absolutely gorgeous — as beautiful to look at as it is to drink.',
            flavourProfile: { floral: 95, fruity: 75, sweet: 50, citrus: 45, herbal: 40, clean: 30, spice: 15, smoky: 0, coffee: 0 },
            moods: ['celebratory', 'adventurous', 'relaxed'],
            styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['date', 'celebration', 'friends', 'explore'],
            intensityRange: [20, 60],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/RoseCity_Edit-707x1059.png',
            cocktail: { name: 'Hibiscus Sunset Spritz', emoji: '\u{1F338}', recipe: 'Hibiscus Gin, prosecco, elderflower syrup, edible flowers' },
            matchReasons: {
                floral: 'Hibiscus-infused — the ultimate floral spirit',
                fruity: 'Beautiful berry and fruit notes from real hibiscus',
                sweet: 'Naturally sweet floral character with gorgeous colour',
                default: 'A stunning, Instagram-worthy gin experience'
            }
        },
        {
            id: 'liquid-gold-whisky',
            name: 'Liquid Gold Whisky',
            type: 'Premium Blended Whisky',
            category: 'whisky',
            price: '$34.95',
            color: '#d4924c',
            gradient: 'linear-gradient(135deg, #e0a860, #b87830)',
            bottleColor: '#d4924c',
            description: 'Our signature whisky — rich, golden, and warming. A masterful blend with notes of caramel, vanilla, and oak. Small-batch crafted by Master Distiller Ian Smiley.',
            flavourProfile: { sweet: 75, smoky: 60, spice: 55, herbal: 30, citrus: 15, clean: 15, floral: 10, coffee: 20, fruity: 20 },
            moods: ['relaxed', 'curious', 'celebratory'],
            styles: ['neat', 'cocktail', 'mixed', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'],
            intensityRange: [40, 85],
            image: 'https://nbdistillers.com/wp-content/uploads/2021/01/Untitled-design-53-707x942.png',
            cocktail: { name: 'Gold Old Fashioned', emoji: '\u{1F947}', recipe: 'Liquid Gold Whisky, orange bitters, demerara syrup, orange peel' },
            matchReasons: {
                sweet: 'Caramel and vanilla richness matches your sweet tooth',
                smoky: 'Oak-aged smokiness with golden warmth',
                spice: 'Warming spice notes with a smooth finish',
                default: 'Our signature — liquid gold in every sense'
            }
        },
        {
            id: 'liquid-gold-wine-whisky',
            name: 'Liquid Gold Wine Whisky',
            type: 'Wine-Finished Whisky (Limited Edition)',
            category: 'whisky',
            price: '$39.99',
            color: '#8b3050',
            gradient: 'linear-gradient(135deg, #a04060, #6b2040)',
            bottleColor: '#8b3050',
            description: 'Limited edition whisky finished in wine barrels. A fusion of whisky tradition and Niagara wine country — rich, fruity, with deep berry and oak complexity.',
            flavourProfile: { fruity: 80, sweet: 70, smoky: 45, spice: 40, herbal: 25, floral: 20, citrus: 15, coffee: 10, clean: 10 },
            moods: ['adventurous', 'celebratory', 'curious'],
            styles: ['neat', 'cocktail', 'surprise'],
            occasions: ['date', 'celebration', 'explore'],
            intensityRange: [45, 90],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/LIquidGold_Edit-707x1329.png',
            cocktail: { name: 'Niagara Sour', emoji: '\u{1F347}', recipe: 'Wine Whisky, lemon juice, red wine float, egg white' },
            matchReasons: {
                fruity: 'Wine-barrel finish brings incredible fruit depth',
                sweet: 'Rich, wine-kissed sweetness — utterly unique',
                smoky: 'Wine barrel complexity meets smoky character',
                default: 'Limited edition — a rare fusion of whisky and wine'
            }
        },
        {
            id: 'chak-de-whisky',
            name: 'Chak De Whisky',
            type: 'Indian-Inspired Craft Whisky',
            category: 'whisky',
            price: '$34.95',
            color: '#c08040',
            gradient: 'linear-gradient(135deg, #d89850, #a06828)',
            bottleColor: '#c88848',
            description: 'A bold tribute to Indian whisky tradition, crafted in Ontario. Warm spice, rich character, and a spirit that celebrates diversity and cultural fusion.',
            flavourProfile: { spice: 85, sweet: 55, smoky: 50, herbal: 35, coffee: 20, citrus: 15, fruity: 15, floral: 10, clean: 10 },
            moods: ['adventurous', 'celebratory', 'curious'],
            styles: ['neat', 'mixed', 'cocktail', 'surprise'],
            occasions: ['friends', 'celebration', 'explore'],
            intensityRange: [50, 95],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/10/chak-de-Go-For-It_Edit-707x942.png',
            cocktail: { name: 'Masala Smash', emoji: '\u{1F525}', recipe: 'Chak De Whisky, muddled ginger, honey syrup, lemon, mint' },
            matchReasons: {
                spice: 'Bold spice-forward character matches your palate perfectly',
                smoky: 'Rich, warming smokiness with cultural depth',
                sweet: 'Warm sweetness with Indian spice tradition',
                default: 'A cultural celebration in a glass — bold and unforgettable'
            }
        },
        {
            id: 'chak-de-rum',
            name: 'Chak De Rum',
            type: 'Premium Craft Rum',
            category: 'rum',
            price: '$34.95',
            color: '#a05038',
            gradient: 'linear-gradient(135deg, #c06848, #804028)',
            bottleColor: '#a85840',
            description: 'A spirited craft rum with tropical warmth and rich character. Sweet, aromatic, and perfect for sipping or mixing into your favourite rum cocktails.',
            flavourProfile: { sweet: 80, fruity: 65, spice: 50, smoky: 30, herbal: 20, citrus: 25, coffee: 15, floral: 10, clean: 10 },
            moods: ['celebratory', 'adventurous', 'relaxed'],
            styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['friends', 'celebration', 'explore', 'date'],
            intensityRange: [35, 80],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/11/Chak_De_Edit_Nov.png',
            cocktail: { name: 'Chak De Daiquiri', emoji: '\u{1F334}', recipe: 'Chak De Rum, fresh lime, simple syrup, tropical bitters' },
            matchReasons: {
                sweet: 'Rich, tropical sweetness — a rum lover\'s dream',
                fruity: 'Beautiful fruit character with Caribbean warmth',
                spice: 'Spiced warmth with a smooth, spirited finish',
                default: 'Tropical warmth crafted in the heart of Ontario'
            }
        }
    ];

    // ==================== ARCHETYPES ====================
    const archetypes = {
        'The Alchemist': {
            desc: 'You have an experimental soul — drawn to complexity, bold flavours, and the unexpected. You don\'t just drink a spirit, you deconstruct it. Every sip is a discovery.',
            traits: ['adventurous', 'spice', 'smoky', 'coffee'],
            color: '#D4924C'
        },
        'The Botanist': {
            desc: 'Your palate is a garden — you\'re drawn to floral elegance, herbal depth, and nature\'s aromatics. You appreciate subtlety and the art of distillation.',
            traits: ['curious', 'floral', 'herbal', 'citrus'],
            color: '#4CA8A0'
        },
        'The Connoisseur': {
            desc: 'You appreciate the finer things. Rich, warming, and nuanced — you savour every moment. Your taste is refined and your standards are high.',
            traits: ['relaxed', 'sweet', 'smoky', 'neat'],
            color: '#C9A84C'
        },
        'The Socialite': {
            desc: 'Life is a celebration, and you\'re at the centre. You bring energy to every room and love spirits that match your vibrant, joyful personality.',
            traits: ['celebratory', 'fruity', 'sweet', 'cocktail'],
            color: '#C4606A'
        },
        'The Pioneer': {
            desc: 'You blaze your own trail. Bold, unconventional, and fearless — you\'re drawn to spirits with character and stories worth telling.',
            traits: ['adventurous', 'smoky', 'spice', 'neat'],
            color: '#8B6CC4'
        },
        'The Purist': {
            desc: 'Clean, crisp, and honest. You believe the best spirits need nothing added. You value craftsmanship and the beauty of simplicity.',
            traits: ['relaxed', 'clean', 'citrus', 'neat'],
            color: '#6CA8C4'
        }
    };

    // ==================== INIT ====================
    function init() {
        initAmbientCanvas();
        initParticles();
        initSlider();
        initNameInput();
    }

    // ==================== AMBIENT BACKGROUND ====================
    function initAmbientCanvas() {
        const canvas = document.getElementById('ambientCanvas');
        const ctx = canvas.getContext('2d');
        let w, h, blobs;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function createBlobs() {
            blobs = [
                { x: w * 0.2, y: h * 0.3, r: 300, vx: 0.3, vy: 0.2, color: 'rgba(201, 168, 76, 0.04)' },
                { x: w * 0.7, y: h * 0.6, r: 350, vx: -0.2, vy: 0.3, color: 'rgba(196, 96, 106, 0.03)' },
                { x: w * 0.5, y: h * 0.8, r: 280, vx: 0.15, vy: -0.25, color: 'rgba(139, 108, 196, 0.03)' },
            ];
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            blobs.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;
                if (b.x < -b.r || b.x > w + b.r) b.vx *= -1;
                if (b.y < -b.r || b.y > h + b.r) b.vy *= -1;

                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                grad.addColorStop(0, b.color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            });
            requestAnimationFrame(draw);
        }

        resize();
        createBlobs();
        draw();
        window.addEventListener('resize', () => { resize(); createBlobs(); });
    }

    // ==================== PARTICLES ====================
    function initParticles() {
        const container = document.getElementById('particles');
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (6 + Math.random() * 6) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
            p.style.opacity = 0;
            container.appendChild(p);
        }
    }

    // ==================== SLIDER ====================
    function initSlider() {
        const track = document.getElementById('sliderTrack');
        const thumb = document.getElementById('sliderThumb');
        const fill = document.getElementById('sliderFill');
        if (!track) return;

        let dragging = false;

        function updateSlider(clientX) {
            const rect = track.getBoundingClientRect();
            let pct = (clientX - rect.left) / rect.width;
            pct = Math.max(0, Math.min(1, pct));
            state.intensity = Math.round(pct * 100);
            thumb.style.left = (pct * 100) + '%';
            fill.style.width = (pct * 100) + '%';

            const label = document.getElementById('intensityValue');
            if (pct < 0.33) label.textContent = 'Gentle & Light';
            else if (pct < 0.66) label.textContent = 'Balanced & Smooth';
            else label.textContent = 'Bold & Intense';
        }

        thumb.addEventListener('touchstart', (e) => { dragging = true; e.preventDefault(); });
        track.addEventListener('touchstart', (e) => {
            dragging = true;
            updateSlider(e.touches[0].clientX);
        });
        document.addEventListener('touchmove', (e) => {
            if (dragging) { updateSlider(e.touches[0].clientX); e.preventDefault(); }
        }, { passive: false });
        document.addEventListener('touchend', () => { dragging = false; });

        // Mouse support
        thumb.addEventListener('mousedown', () => { dragging = true; });
        track.addEventListener('mousedown', (e) => { dragging = true; updateSlider(e.clientX); });
        document.addEventListener('mousemove', (e) => { if (dragging) updateSlider(e.clientX); });
        document.addEventListener('mouseup', () => { dragging = false; });
    }

    // ==================== NAME INPUT ====================
    function initNameInput() {
        const input = document.getElementById('userName');
        const btn = document.getElementById('nameBtn');
        if (!input) return;

        input.addEventListener('input', () => {
            btn.disabled = input.value.trim().length < 1;
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim().length >= 1) {
                submitName();
            }
        });
    }

    // ==================== SCREEN NAVIGATION ====================
    let transitioning = false;
    let transitionQueue = null;

    function goToScreen(screenId) {
        if (transitioning) {
            transitionQueue = screenId;
            return;
        }

        const current = document.getElementById(state.currentScreen);
        const next = document.getElementById(screenId);
        if (!next || current === next) return;

        transitioning = true;

        if (current) {
            current.classList.add('exit');
            current.classList.remove('active');
        }

        setTimeout(() => {
            if (current) current.classList.remove('exit');
            next.classList.add('active');
            state.currentScreen = screenId;
            transitioning = false;

            // Focus text input if name screen
            if (screenId === 'screen-name') {
                setTimeout(() => {
                    const input = document.getElementById('userName');
                    if (input) input.focus();
                }, 300);
            }

            // Process queued transition
            if (transitionQueue) {
                const queued = transitionQueue;
                transitionQueue = null;
                setTimeout(() => goToScreen(queued), 100);
            }
        }, 500);
    }

    // ==================== USER ACTIONS ====================
    function startJourney() {
        goToScreen('screen-name');
    }

    function submitName() {
        const input = document.getElementById('userName');
        state.name = input.value.trim();
        if (state.name.length < 1) return;
        goToScreen('screen-mood');
    }

    function selectOption(el, key) {
        const parent = el.closest('.options-grid');
        parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        state[key] = el.dataset.value;

        // Auto-advance after a short delay
        setTimeout(() => {
            const screenMap = {
                mood: 'screen-flavour',
                style: 'screen-base',
                occasion: 'screen-intensity'
            };
            if (screenMap[key]) goToScreen(screenMap[key]);
        }, 500);
    }

    function togglePill(el, key) {
        const maxSelections = 3;
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
            state.flavours = state.flavours.filter(f => f !== el.dataset.value);
        } else {
            if (state.flavours.length >= maxSelections) return;
            el.classList.add('selected');
            state.flavours.push(el.dataset.value);
        }
        document.getElementById('flavourBtn').disabled = state.flavours.length === 0;
    }

    function submitFlavour() {
        if (state.flavours.length === 0) return;
        goToScreen('screen-style');
    }

    function toggleBase(el) {
        const value = el.dataset.value;
        if (value === 'open') {
            // Clear others, select "open"
            el.closest('.options-grid').querySelectorAll('.base-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            state.bases = ['open'];
        } else {
            // Deselect "open" if selected
            const openCard = el.closest('.options-grid').querySelector('[data-value="open"]');
            if (openCard) openCard.classList.remove('selected');
            state.bases = state.bases.filter(b => b !== 'open');

            if (el.classList.contains('selected')) {
                el.classList.remove('selected');
                state.bases = state.bases.filter(b => b !== value);
            } else {
                if (state.bases.length >= 2) return;
                el.classList.add('selected');
                state.bases.push(value);
            }
        }

        // Auto-advance when selection made
        if (state.bases.length > 0) {
            setTimeout(() => goToScreen('screen-occasion'), 600);
        }
    }

    function submitIntensity() {
        goToScreen('screen-generating');
        runGeneratingAnimation();
    }

    // ==================== GENERATING ANIMATION ====================
    function runGeneratingAnimation() {
        const steps = ['genStep1', 'genStep2', 'genStep3', 'genStep4'];
        let i = 0;

        function activateStep() {
            if (i > 0) {
                document.getElementById(steps[i - 1]).classList.remove('active');
                document.getElementById(steps[i - 1]).classList.add('done');
            }
            if (i < steps.length) {
                document.getElementById(steps[i]).classList.add('active');
                i++;
                setTimeout(activateStep, 800);
            } else {
                setTimeout(() => {
                    generateProfile();
                    goToScreen('screen-profile');
                }, 600);
            }
        }

        setTimeout(activateStep, 400);
    }

    // ==================== PROFILE GENERATION ====================
    function generateProfile() {
        // Determine archetype
        const archetype = determineArchetype();
        const recommendations = getRecommendations();
        const flavourDNA = calculateFlavourDNA();

        // Render profile
        renderProfile(archetype, recommendations, flavourDNA);
    }

    function determineArchetype() {
        const scores = {};
        const allTraits = [state.mood, ...state.flavours, state.style];

        for (const [name, arch] of Object.entries(archetypes)) {
            let score = 0;
            allTraits.forEach(trait => {
                if (arch.traits.includes(trait)) score += 10;
            });
            // Intensity bonus
            if (state.intensity > 70 && (name === 'The Alchemist' || name === 'The Pioneer')) score += 5;
            if (state.intensity < 35 && (name === 'The Purist' || name === 'The Botanist')) score += 5;
            if (state.intensity >= 35 && state.intensity <= 70 && name === 'The Connoisseur') score += 5;
            scores[name] = score;
        }

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return { name: sorted[0][0], ...archetypes[sorted[0][0]] };
    }

    function getRecommendations() {
        const scored = products.map(product => {
            let score = 0;

            // Category match
            if (state.bases.includes('open') || state.bases.includes(product.category)) {
                score += 30;
            } else {
                score -= 20;
            }

            // Flavour match
            state.flavours.forEach(f => {
                const val = product.flavourProfile[f] || 0;
                score += val * 0.4;
            });

            // Mood match
            if (product.moods.includes(state.mood)) score += 15;

            // Style match
            if (product.styles.includes(state.style)) score += 10;

            // Occasion match
            if (product.occasions.includes(state.occasion)) score += 10;

            // Intensity match
            const [min, max] = product.intensityRange;
            if (state.intensity >= min && state.intensity <= max) {
                score += 20;
            } else {
                const dist = state.intensity < min ? min - state.intensity : state.intensity - max;
                score -= dist * 0.3;
            }

            // Determine match reason
            let matchReason = product.matchReasons.default;
            let highestFlavour = '';
            let highestVal = 0;
            state.flavours.forEach(f => {
                if (product.flavourProfile[f] > highestVal && product.matchReasons[f]) {
                    highestVal = product.flavourProfile[f];
                    highestFlavour = f;
                }
            });
            if (highestFlavour && product.matchReasons[highestFlavour]) {
                matchReason = product.matchReasons[highestFlavour];
            }

            return { ...product, score, matchReason };
        });

        scored.sort((a, b) => b.score - a.score);

        // Return top 3 with match percentages
        const maxScore = scored[0].score;
        return scored.slice(0, 3).map((p, i) => ({
            ...p,
            matchPercent: Math.min(99, Math.round(75 + (p.score / maxScore) * 24 - i * 3))
        }));
    }

    function calculateFlavourDNA() {
        const dna = {};
        const labels = {
            citrus: 'Citrus', spice: 'Spice', floral: 'Floral', sweet: 'Sweet',
            herbal: 'Herbal', smoky: 'Smoky', coffee: 'Coffee', fruity: 'Fruity', clean: 'Clean'
        };
        const colors = {
            citrus: '#E8C84C', spice: '#D4724C', floral: '#C480A8', sweet: '#D89060',
            herbal: '#6CAC7C', smoky: '#8C7060', coffee: '#6C4830', fruity: '#C46080', clean: '#88B8D0'
        };

        for (const [key, label] of Object.entries(labels)) {
            let val = 0;
            if (state.flavours.includes(key)) val += 60;
            // Intensity modifier
            if (['smoky', 'spice', 'coffee'].includes(key)) val += state.intensity * 0.3;
            else if (['clean', 'citrus', 'floral'].includes(key)) val += (100 - state.intensity) * 0.25;
            else val += 25;

            // Mood modifier
            if (state.mood === 'adventurous' && ['spice', 'smoky'].includes(key)) val += 15;
            if (state.mood === 'relaxed' && ['clean', 'sweet'].includes(key)) val += 15;
            if (state.mood === 'celebratory' && ['sweet', 'fruity'].includes(key)) val += 15;
            if (state.mood === 'curious' && ['herbal', 'floral'].includes(key)) val += 15;

            dna[key] = { label, value: Math.min(98, Math.round(val)), color: colors[key] };
        }

        return dna;
    }

    // ==================== RENDER PROFILE ====================
    function renderProfile(archetype, recommendations, flavourDNA) {
        // Name & archetype
        document.getElementById('profileName').textContent = state.name;
        document.getElementById('profileArchetype').textContent = archetype.name;
        document.getElementById('profileDesc').textContent = archetype.desc;

        // Avatar
        drawAvatar(archetype);

        // DNA bars
        const dnaContainer = document.getElementById('dnaBars');
        dnaContainer.innerHTML = '';
        const sortedDNA = Object.values(flavourDNA).sort((a, b) => b.value - a.value).slice(0, 6);
        sortedDNA.forEach(({ label, value, color }) => {
            const row = document.createElement('div');
            row.className = 'dna-row';
            row.innerHTML = `
                <div class="dna-label">${label}</div>
                <div class="dna-track">
                    <div class="dna-fill" style="background: ${color};" data-width="${value}%"></div>
                </div>
                <div class="dna-value">${value}%</div>
            `;
            dnaContainer.appendChild(row);
        });

        // Animate DNA bars after screen transition
        setTimeout(() => {
            dnaContainer.querySelectorAll('.dna-fill').forEach(fill => {
                fill.style.width = fill.dataset.width;
            });
        }, 800);

        // Recommendations
        const recoContainer = document.getElementById('recoCards');
        recoContainer.innerHTML = '';
        recommendations.forEach((rec, index) => {
            const card = document.createElement('div');
            card.className = 'reco-card';
            card.innerHTML = `
                <div class="reco-bottle" style="background: ${rec.gradient};">
                    <img src="${rec.image}" alt="${rec.name}" class="reco-bottle-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="reco-bottle-inner" style="background: ${rec.bottleColor}; display: none;"></div>
                </div>
                <div class="reco-info">
                    <div class="reco-match">
                        <span class="reco-match-dot"></span>
                        ${rec.matchPercent}% Match
                    </div>
                    <div class="reco-name">${rec.name}</div>
                    <div class="reco-type">${rec.type}</div>
                    <div class="reco-desc">${rec.matchReason}</div>
                    <div class="reco-price">${rec.price}</div>
                    <div class="reco-cocktail">
                        <span class="cocktail-emoji">${rec.cocktail.emoji}</span>
                        <div class="cocktail-info">
                            <span class="cocktail-label">Try it in:</span>
                            <span class="cocktail-name">${rec.cocktail.name}</span>
                            <span class="cocktail-recipe">${rec.cocktail.recipe}</span>
                        </div>
                    </div>
                </div>
            `;
            recoContainer.appendChild(card);
        });
    }

    // ==================== AVATAR CANVAS ====================
    function drawAvatar(archetype) {
        const canvas = document.getElementById('avatarCanvas');
        const ctx = canvas.getContext('2d');
        const size = 280;
        const cx = size / 2;
        const cy = size / 2;

        canvas.width = size * 2; // retina
        canvas.height = size * 2;
        ctx.scale(2, 2);

        // Background circle
        const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 130);
        bgGrad.addColorStop(0, archetype.color + '40');
        bgGrad.addColorStop(0.6, archetype.color + '15');
        bgGrad.addColorStop(1, 'rgba(13,13,13,0.8)');
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = archetype.color + '60';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 128, 0, Math.PI * 2);
        ctx.stroke();

        // Inner geometric pattern based on flavour DNA
        const flavourCount = state.flavours.length || 3;
        const angleStep = (Math.PI * 2) / Math.max(flavourCount * 2, 6);
        const innerR = 40;
        const outerR = 90;

        // Draw petals
        state.flavours.forEach((flavour, i) => {
            const angle = i * (Math.PI * 2 / state.flavours.length) - Math.PI / 2;
            const colors = {
                citrus: '#E8C84C', spice: '#D4724C', floral: '#C480A8', sweet: '#D89060',
                herbal: '#6CAC7C', smoky: '#8C7060', coffee: '#6C4830', fruity: '#C46080', clean: '#88B8D0'
            };
            const color = colors[flavour] || archetype.color;

            // Petal shape
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            const petalGrad = ctx.createLinearGradient(0, -innerR, 0, -outerR);
            petalGrad.addColorStop(0, color + '60');
            petalGrad.addColorStop(1, color + '10');

            ctx.fillStyle = petalGrad;
            ctx.beginPath();
            ctx.moveTo(0, -innerR);
            ctx.bezierCurveTo(30, -innerR - 15, 25, -outerR + 10, 0, -outerR);
            ctx.bezierCurveTo(-25, -outerR + 10, -30, -innerR - 15, 0, -innerR);
            ctx.fill();

            // Petal line
            ctx.strokeStyle = color + '80';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -innerR);
            ctx.lineTo(0, -outerR + 5);
            ctx.stroke();

            ctx.restore();
        });

        // Center orb
        const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
        centerGrad.addColorStop(0, archetype.color);
        centerGrad.addColorStop(0.7, archetype.color + '80');
        centerGrad.addColorStop(1, archetype.color + '00');
        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fill();

        // Intensity ring
        const intensityAngle = (state.intensity / 100) * Math.PI * 2;
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, 110, -Math.PI / 2, -Math.PI / 2 + intensityAngle);
        ctx.stroke();

        // Decorative dots
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = cx + Math.cos(angle) * 105;
            const y = cy + Math.sin(angle) * 105;
            ctx.fillStyle = archetype.color + '30';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mood icon in center
        ctx.fillStyle = '#0D0D0D';
        ctx.font = '600 16px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const moodIcons = { adventurous: '\u2736', relaxed: '\u223F', celebratory: '\u2726', curious: '\u25C7' };
        ctx.fillStyle = '#0D0D0D';
        ctx.font = '24px sans-serif';
        ctx.fillText(moodIcons[state.mood] || '\u2726', cx, cy);
    }

    // ==================== MODAL ====================
    function requestTasting() {
        document.getElementById('tastingModal').classList.add('active');
    }

    function closeModal() {
        document.getElementById('tastingModal').classList.remove('active');
    }

    // ==================== RESTART ====================
    function restart() {
        // Reset state
        state.name = '';
        state.mood = '';
        state.flavours = [];
        state.style = '';
        state.bases = [];
        state.occasion = '';
        state.intensity = 50;

        // Reset all selections
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.gen-step').forEach(el => {
            el.classList.remove('active', 'done');
        });

        // Reset inputs
        const nameInput = document.getElementById('userName');
        if (nameInput) nameInput.value = '';
        const nameBtn = document.getElementById('nameBtn');
        if (nameBtn) nameBtn.disabled = true;
        const flavourBtn = document.getElementById('flavourBtn');
        if (flavourBtn) flavourBtn.disabled = true;

        // Reset slider
        const thumb = document.getElementById('sliderThumb');
        const fill = document.getElementById('sliderFill');
        const label = document.getElementById('intensityValue');
        if (thumb) thumb.style.left = '50%';
        if (fill) fill.style.width = '50%';
        if (label) label.textContent = 'Balanced';

        // Reset DNA bars
        document.querySelectorAll('.dna-fill').forEach(f => f.style.width = '0');

        goToScreen('screen-welcome');
    }

    // ==================== BOOT ====================
    document.addEventListener('DOMContentLoaded', init);

    // ==================== PUBLIC API ====================
    return {
        startJourney,
        submitName,
        selectOption,
        togglePill,
        submitFlavour,
        toggleBase,
        submitIntensity,
        requestTasting,
        closeModal,
        restart
    };
})();
