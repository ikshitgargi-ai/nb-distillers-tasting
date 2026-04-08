/* ============================================
   NB DISTILLERS — TASTING ROOM APP ENGINE
   Complete rebuild: bulletproof nav, camera,
   photo avatar, mobile-first touch support
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
        intensity: 50,
        photoData: null,     // base64 photo from camera
        hasPhoto: false
    };

    // Screen order for navigation
    const SCREENS = [
        'screen-welcome',
        'screen-name',
        'screen-mood',
        'screen-flavour',
        'screen-style',
        'screen-base',
        'screen-occasion',
        'screen-intensity',
        'screen-camera',
        'screen-generating',
        'screen-profile'
    ];

    let currentScreenId = 'screen-welcome';
    let isTransitioning = false;
    let cameraStream = null;

    // ==================== PRODUCT DATABASE ====================
    const products = [
        {
            id: 'red-admiral-vodka', name: 'Red Admiral Vodka', type: 'Premium Craft Vodka',
            category: 'vodka', price: '$29.75',
            gradient: 'linear-gradient(135deg, #e0e8f0, #a8c0d8)', bottleColor: '#d0dce8',
            description: 'Handcrafted small-batch vodka, ultra-smooth with a clean, crisp finish.',
            flavourProfile: { clean: 90, citrus: 30, herbal: 20, sweet: 15, spice: 10, floral: 10, smoky: 0, coffee: 0, fruity: 15 },
            moods: ['relaxed', 'celebratory', 'curious'], styles: ['neat', 'cocktail', 'mixed', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'], intensityRange: [10, 50],
            image: 'https://nbdistillers.com/wp-content/uploads/2021/01/Untitled-design-56-1-707x942.png',
            cocktail: { name: 'Red Admiral Mule', emoji: '\u{1F943}', recipe: 'Red Admiral Vodka, ginger beer, fresh lime, ice' },
            matchReasons: { clean: 'Perfectly clean and crisp profile', default: 'Smooth and versatile \u2014 a true crowd-pleaser' }
        },
        {
            id: 'red-admiral-cardamom', name: 'Red Admiral Cardamom Vodka', type: 'Spiced Craft Vodka (Unsweetened)',
            category: 'vodka', price: '$34.95',
            gradient: 'linear-gradient(135deg, #e8dcc0, #c8b090)', bottleColor: '#d8c8a8',
            description: 'An exotic twist infused with real cardamom. Unsweetened, sophisticated, aromatic.',
            flavourProfile: { spice: 90, floral: 60, clean: 50, herbal: 40, citrus: 25, sweet: 20, smoky: 10, coffee: 5, fruity: 10 },
            moods: ['adventurous', 'curious'], styles: ['neat', 'cocktail', 'surprise'],
            occasions: ['date', 'explore', 'friends'], intensityRange: [30, 70],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/DSC_7552-Cardamom-front_SB_8.22.22-1.png',
            cocktail: { name: 'Cardamom Chai Fizz', emoji: '\u{2728}', recipe: 'Cardamom Vodka, chai syrup, soda water, star anise' },
            matchReasons: { spice: 'Rich cardamom warmth matches your spice love', floral: 'Aromatic cardamom brings beautiful floral notes', default: 'A unique spiced vodka unlike anything you\'ve tried' }
        },
        {
            id: 'impresso-coffee-vodka', name: 'Impresso Espresso Coffee Vodka', type: 'Coffee-Infused Vodka',
            category: 'vodka', price: '$45.00',
            gradient: 'linear-gradient(135deg, #5c3d2e, #2a1810)', bottleColor: '#4a3020',
            description: 'Bold espresso meets ultra-smooth vodka. Deep roasted coffee with a velvety finish.',
            flavourProfile: { coffee: 95, sweet: 60, smoky: 40, spice: 30, clean: 20, herbal: 15, citrus: 5, floral: 5, fruity: 10 },
            moods: ['relaxed', 'celebratory', 'curious'], styles: ['neat', 'cocktail', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'], intensityRange: [50, 90],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/Impresso-Espresso_Edit-707x1455.png',
            cocktail: { name: 'Espresso Martini', emoji: '\u{2615}', recipe: 'Impresso Vodka, fresh espresso, coffee liqueur, vanilla syrup' },
            matchReasons: { coffee: 'Deep espresso character \u2014 your coffee match', sweet: 'Rich, velvety sweetness with roasted depth', smoky: 'Bold, roasted intensity with smoky undertones', default: 'Our most indulgent spirit \u2014 rich, bold, unforgettable' }
        },
        {
            id: 'rose-city-gin', name: 'Rose City Gin', type: 'Craft Botanical Gin',
            category: 'gin', price: '$34.95',
            gradient: 'linear-gradient(135deg, #b8e8d8, #88c0a8)', bottleColor: '#98d0b8',
            description: 'Beautifully balanced botanical gin with classic juniper backbone.',
            flavourProfile: { herbal: 85, floral: 65, citrus: 60, clean: 50, spice: 30, fruity: 25, sweet: 15, smoky: 5, coffee: 0 },
            moods: ['adventurous', 'relaxed', 'curious'], styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['date', 'friends', 'explore'], intensityRange: [25, 65],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/Rose-City-Gin-New-Bottle.png',
            cocktail: { name: 'Rose City G&T', emoji: '\u{1F33F}', recipe: 'Rose City Gin, premium tonic, cucumber, juniper berries' },
            matchReasons: { herbal: 'Complex botanicals match your herbal palate', citrus: 'Bright citrus-forward gin with botanical depth', floral: 'Fragrant botanicals suit your floral preference', default: 'A classic craft gin with Niagara character' }
        },
        {
            id: 'rose-city-hibiscus-gin', name: 'Rose City & Hibiscus Gin', type: 'Hibiscus-Infused Gin',
            category: 'gin', price: '$34.95',
            gradient: 'linear-gradient(135deg, #d87898, #a84860)', bottleColor: '#c86878',
            description: 'Stunning pink gin infused with real hibiscus. Floral, fruity, gorgeous.',
            flavourProfile: { floral: 95, fruity: 75, sweet: 50, citrus: 45, herbal: 40, clean: 30, spice: 15, smoky: 0, coffee: 0 },
            moods: ['celebratory', 'adventurous', 'relaxed'], styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['date', 'celebration', 'friends', 'explore'], intensityRange: [20, 60],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/RoseCity_Edit-707x1059.png',
            cocktail: { name: 'Hibiscus Sunset Spritz', emoji: '\u{1F338}', recipe: 'Hibiscus Gin, prosecco, elderflower syrup, edible flowers' },
            matchReasons: { floral: 'Hibiscus-infused \u2014 the ultimate floral spirit', fruity: 'Beautiful berry notes from real hibiscus', sweet: 'Naturally sweet floral character', default: 'A stunning, Instagram-worthy gin experience' }
        },
        {
            id: 'liquid-gold-whisky', name: 'Liquid Gold Whisky', type: 'Premium Blended Whisky',
            category: 'whisky', price: '$34.95',
            gradient: 'linear-gradient(135deg, #e0a860, #b87830)', bottleColor: '#d4924c',
            description: 'Our signature whisky \u2014 rich, golden, warming. Caramel, vanilla, and oak.',
            flavourProfile: { sweet: 75, smoky: 60, spice: 55, herbal: 30, citrus: 15, clean: 15, floral: 10, coffee: 20, fruity: 20 },
            moods: ['relaxed', 'curious', 'celebratory'], styles: ['neat', 'cocktail', 'mixed', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'], intensityRange: [40, 85],
            image: 'https://nbdistillers.com/wp-content/uploads/2021/01/Untitled-design-53-707x942.png',
            cocktail: { name: 'Gold Old Fashioned', emoji: '\u{1F947}', recipe: 'Liquid Gold Whisky, orange bitters, demerara syrup, orange peel' },
            matchReasons: { sweet: 'Caramel and vanilla richness matches your palate', smoky: 'Oak-aged smokiness with golden warmth', spice: 'Warming spice notes with a smooth finish', default: 'Our signature \u2014 liquid gold in every sense' }
        },
        {
            id: 'liquid-gold-wine-whisky', name: 'Liquid Gold Wine Whisky', type: 'Wine-Finished Whisky (Limited Edition)',
            category: 'whisky', price: '$39.99',
            gradient: 'linear-gradient(135deg, #a04060, #6b2040)', bottleColor: '#8b3050',
            description: 'Limited edition finished in wine barrels. Whisky meets Niagara wine country.',
            flavourProfile: { fruity: 80, sweet: 70, smoky: 45, spice: 40, herbal: 25, floral: 20, citrus: 15, coffee: 10, clean: 10 },
            moods: ['adventurous', 'celebratory', 'curious'], styles: ['neat', 'cocktail', 'surprise'],
            occasions: ['date', 'celebration', 'explore'], intensityRange: [45, 90],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/09/LIquidGold_Edit-707x1329.png',
            cocktail: { name: 'Niagara Sour', emoji: '\u{1F347}', recipe: 'Wine Whisky, lemon juice, red wine float, egg white' },
            matchReasons: { fruity: 'Wine-barrel finish brings incredible fruit depth', sweet: 'Rich, wine-kissed sweetness \u2014 utterly unique', smoky: 'Wine barrel complexity meets smoky character', default: 'Limited edition \u2014 a rare fusion of whisky and wine' }
        },
        {
            id: 'chak-de-whisky', name: 'Chak De Whisky', type: 'Indian-Inspired Craft Whisky',
            category: 'whisky', price: '$34.95',
            gradient: 'linear-gradient(135deg, #d89850, #a06828)', bottleColor: '#c88848',
            description: 'Bold tribute to Indian whisky tradition, crafted in Ontario.',
            flavourProfile: { spice: 85, sweet: 55, smoky: 50, herbal: 35, coffee: 20, citrus: 15, fruity: 15, floral: 10, clean: 10 },
            moods: ['adventurous', 'celebratory', 'curious'], styles: ['neat', 'mixed', 'cocktail', 'surprise'],
            occasions: ['friends', 'celebration', 'explore'], intensityRange: [50, 95],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/10/chak-de-Go-For-It_Edit-707x942.png',
            cocktail: { name: 'Masala Smash', emoji: '\u{1F525}', recipe: 'Chak De Whisky, muddled ginger, honey syrup, lemon, mint' },
            matchReasons: { spice: 'Bold spice-forward character matches your palate', smoky: 'Rich, warming smokiness with cultural depth', sweet: 'Warm sweetness with Indian spice tradition', default: 'A cultural celebration in a glass \u2014 bold and unforgettable' }
        },
        {
            id: 'chak-de-rum', name: 'Chak De Rum', type: 'Premium Craft Rum',
            category: 'rum', price: '$34.95',
            gradient: 'linear-gradient(135deg, #c06848, #804028)', bottleColor: '#a85840',
            description: 'Spirited craft rum with tropical warmth and rich character.',
            flavourProfile: { sweet: 80, fruity: 65, spice: 50, smoky: 30, herbal: 20, citrus: 25, coffee: 15, floral: 10, clean: 10 },
            moods: ['celebratory', 'adventurous', 'relaxed'], styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['friends', 'celebration', 'explore', 'date'], intensityRange: [35, 80],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/11/Chak_De_Edit_Nov.png',
            cocktail: { name: 'Chak De Daiquiri', emoji: '\u{1F334}', recipe: 'Chak De Rum, fresh lime, simple syrup, tropical bitters' },
            matchReasons: { sweet: 'Rich, tropical sweetness \u2014 a rum lover\'s dream', fruity: 'Beautiful fruit character with Caribbean warmth', spice: 'Spiced warmth with a smooth, spirited finish', default: 'Tropical warmth crafted in the heart of Ontario' }
        }
    ];

    // ==================== ARCHETYPES ====================
    const archetypes = {
        'The Alchemist':  { desc: 'You have an experimental soul \u2014 drawn to complexity, bold flavours, and the unexpected. Every sip is a discovery.', traits: ['adventurous', 'spice', 'smoky', 'coffee'], color: '#D4924C' },
        'The Botanist':   { desc: 'Your palate is a garden \u2014 drawn to floral elegance, herbal depth, and nature\'s aromatics. You appreciate subtlety.', traits: ['curious', 'floral', 'herbal', 'citrus'], color: '#4CA8A0' },
        'The Connoisseur': { desc: 'You appreciate the finer things. Rich, warming, and nuanced \u2014 you savour every moment with refined taste.', traits: ['relaxed', 'sweet', 'smoky', 'neat'], color: '#C9A84C' },
        'The Socialite':  { desc: 'Life is a celebration and you\'re at the centre. You love spirits that match your vibrant, joyful personality.', traits: ['celebratory', 'fruity', 'sweet', 'cocktail'], color: '#C4606A' },
        'The Pioneer':    { desc: 'You blaze your own trail. Bold, unconventional, fearless \u2014 drawn to spirits with character and stories worth telling.', traits: ['adventurous', 'smoky', 'spice', 'neat'], color: '#8B6CC4' },
        'The Purist':     { desc: 'Clean, crisp, and honest. You believe the best spirits need nothing added. You value craftsmanship and simplicity.', traits: ['relaxed', 'clean', 'citrus', 'neat'], color: '#6CA8C4' }
    };

    // ==================== INIT ====================
    function init() {
        initAmbientCanvas();
        initParticles();
        initSlider();
        initNameInput();
    }

    // ==================== SCREEN NAVIGATION (BULLETPROOF) ====================
    function goToScreen(targetId) {
        if (isTransitioning) return;
        if (targetId === currentScreenId) return;

        const currentEl = document.getElementById(currentScreenId);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        isTransitioning = true;

        // Fade out current
        if (currentEl) {
            currentEl.style.opacity = '0';
            currentEl.style.pointerEvents = 'none';
        }

        // After fade out, swap screens
        setTimeout(() => {
            if (currentEl) {
                currentEl.classList.remove('active');
                currentEl.style.opacity = '';
                currentEl.style.pointerEvents = '';
            }

            // Activate target
            targetEl.classList.add('active');
            currentScreenId = targetId;

            // Special actions on screen enter
            if (targetId === 'screen-name') {
                setTimeout(() => {
                    const input = document.getElementById('userName');
                    if (input) input.focus();
                }, 400);
            }
            if (targetId === 'screen-camera') {
                startCamera();
            }
            if (targetId === 'screen-generating') {
                runGeneratingAnimation();
            }

            // Unlock after animation settles
            setTimeout(() => {
                isTransitioning = false;
            }, 400);
        }, 350);
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
        // Deselect siblings
        const parent = el.closest('.options-grid');
        parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        state[key] = el.dataset.value;

        // Auto-advance after visual feedback
        const nextMap = {
            mood: 'screen-flavour',
            style: 'screen-base',
            occasion: 'screen-intensity'
        };
        if (nextMap[key]) {
            setTimeout(() => goToScreen(nextMap[key]), 600);
        }
    }

    function togglePill(el) {
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
        const grid = el.closest('.options-grid');

        if (value === 'open') {
            grid.querySelectorAll('.base-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            state.bases = ['open'];
        } else {
            const openCard = grid.querySelector('[data-value="open"]');
            if (openCard) openCard.classList.remove('selected');
            state.bases = state.bases.filter(b => b !== 'open');

            if (el.classList.contains('selected')) {
                el.classList.remove('selected');
                state.bases = state.bases.filter(b => b !== value);
                return; // Don't auto-advance on deselect
            } else {
                if (state.bases.length >= 2) return;
                el.classList.add('selected');
                state.bases.push(value);
            }
        }

        if (state.bases.length > 0) {
            setTimeout(() => goToScreen('screen-occasion'), 700);
        }
    }

    function submitIntensity() {
        goToScreen('screen-camera');
    }

    // ==================== CAMERA ====================
    async function startCamera() {
        const video = document.getElementById('cameraFeed');
        const preview = document.getElementById('photoPreview');
        const captureBtn = document.getElementById('captureBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const useBtn = document.getElementById('usePhotoBtn');

        // Reset UI
        video.style.display = 'block';
        preview.style.display = 'none';
        captureBtn.style.display = '';
        retakeBtn.style.display = 'none';
        useBtn.style.display = 'none';

        try {
            if (cameraStream) {
                cameraStream.getTracks().forEach(t => t.stop());
            }
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
            });
            video.srcObject = cameraStream;
        } catch (err) {
            console.log('Camera not available:', err);
            // If camera fails, just show a skip-friendly UI
            video.style.display = 'none';
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
    }

    function capturePhoto() {
        const video = document.getElementById('cameraFeed');
        const canvas = document.getElementById('photoCanvas');
        const preview = document.getElementById('photoPreview');

        // Capture frame
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Center-crop the video
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const cropSize = Math.min(vw, vh);
        const sx = (vw - cropSize) / 2;
        const sy = (vh - cropSize) / 2;

        ctx.save();
        ctx.translate(size, 0);
        ctx.scale(-1, 1); // Mirror
        ctx.drawImage(video, sx, sy, cropSize, cropSize, 0, 0, size, size);
        ctx.restore();

        state.photoData = canvas.toDataURL('image/jpeg', 0.85);
        state.hasPhoto = true;

        // Show preview
        preview.src = state.photoData;
        preview.style.display = 'block';
        video.style.display = 'none';
        document.getElementById('captureBtn').style.display = 'none';
        document.getElementById('retakeBtn').style.display = '';
        document.getElementById('usePhotoBtn').style.display = '';

        stopCamera();
    }

    function retakePhoto() {
        state.photoData = null;
        state.hasPhoto = false;
        startCamera();
    }

    function usePhoto() {
        stopCamera();
        goToScreen('screen-generating');
    }

    function skipPhoto() {
        state.photoData = null;
        state.hasPhoto = false;
        stopCamera();
        goToScreen('screen-generating');
    }

    // ==================== GENERATING ANIMATION ====================
    function runGeneratingAnimation() {
        const steps = ['genStep1', 'genStep2', 'genStep3', 'genStep4'];
        // Reset all steps
        steps.forEach(s => {
            const el = document.getElementById(s);
            if (el) el.classList.remove('active', 'done');
        });

        let i = 0;
        function activateStep() {
            if (i > 0) {
                const prev = document.getElementById(steps[i - 1]);
                if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
            }
            if (i < steps.length) {
                const cur = document.getElementById(steps[i]);
                if (cur) cur.classList.add('active');
                i++;
                setTimeout(activateStep, 700);
            } else {
                setTimeout(() => {
                    generateProfile();
                    goToScreen('screen-profile');
                }, 500);
            }
        }
        setTimeout(activateStep, 300);
    }

    // ==================== PROFILE GENERATION ====================
    function generateProfile() {
        const archetype = determineArchetype();
        const recommendations = getRecommendations();
        const flavourDNA = calculateFlavourDNA();
        renderProfile(archetype, recommendations, flavourDNA);
    }

    function determineArchetype() {
        const scores = {};
        const allTraits = [state.mood, ...state.flavours, state.style];
        for (const [name, arch] of Object.entries(archetypes)) {
            let score = 0;
            allTraits.forEach(trait => { if (arch.traits.includes(trait)) score += 10; });
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
            if (state.bases.includes('open') || state.bases.includes(product.category)) score += 30;
            else score -= 20;
            state.flavours.forEach(f => { score += (product.flavourProfile[f] || 0) * 0.4; });
            if (product.moods.includes(state.mood)) score += 15;
            if (product.styles.includes(state.style)) score += 10;
            if (product.occasions.includes(state.occasion)) score += 10;
            const [min, max] = product.intensityRange;
            if (state.intensity >= min && state.intensity <= max) score += 20;
            else score -= Math.abs(state.intensity < min ? min - state.intensity : state.intensity - max) * 0.3;

            let matchReason = product.matchReasons.default;
            let highestVal = 0;
            state.flavours.forEach(f => {
                if ((product.flavourProfile[f] || 0) > highestVal && product.matchReasons[f]) {
                    highestVal = product.flavourProfile[f];
                    matchReason = product.matchReasons[f];
                }
            });
            return { ...product, score, matchReason };
        });
        scored.sort((a, b) => b.score - a.score);
        const maxScore = scored[0].score;
        return scored.slice(0, 3).map((p, i) => ({
            ...p,
            matchPercent: Math.min(99, Math.round(75 + (p.score / maxScore) * 24 - i * 3))
        }));
    }

    function calculateFlavourDNA() {
        const dna = {};
        const labels = { citrus: 'Citrus', spice: 'Spice', floral: 'Floral', sweet: 'Sweet', herbal: 'Herbal', smoky: 'Smoky', coffee: 'Coffee', fruity: 'Fruity', clean: 'Clean' };
        const colors = { citrus: '#E8C84C', spice: '#D4724C', floral: '#C480A8', sweet: '#D89060', herbal: '#6CAC7C', smoky: '#8C7060', coffee: '#6C4830', fruity: '#C46080', clean: '#88B8D0' };
        for (const [key, label] of Object.entries(labels)) {
            let val = 0;
            if (state.flavours.includes(key)) val += 60;
            if (['smoky', 'spice', 'coffee'].includes(key)) val += state.intensity * 0.3;
            else if (['clean', 'citrus', 'floral'].includes(key)) val += (100 - state.intensity) * 0.25;
            else val += 25;
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
        document.getElementById('profileName').textContent = state.name;
        document.getElementById('profileArchetype').textContent = archetype.name;
        document.getElementById('profileDesc').textContent = archetype.desc;

        drawAvatar(archetype);

        // DNA bars
        const dnaContainer = document.getElementById('dnaBars');
        dnaContainer.innerHTML = '';
        const sortedDNA = Object.values(flavourDNA).sort((a, b) => b.value - a.value).slice(0, 6);
        sortedDNA.forEach(({ label, value, color }) => {
            const row = document.createElement('div');
            row.className = 'dna-row';
            row.innerHTML = `<div class="dna-label">${label}</div><div class="dna-track"><div class="dna-fill" style="background:${color};" data-width="${value}%"></div></div><div class="dna-value">${value}%</div>`;
            dnaContainer.appendChild(row);
        });
        setTimeout(() => {
            dnaContainer.querySelectorAll('.dna-fill').forEach(fill => { fill.style.width = fill.dataset.width; });
        }, 600);

        // Recommendations
        const recoContainer = document.getElementById('recoCards');
        recoContainer.innerHTML = '';
        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'reco-card';
            card.innerHTML = `
                <div class="reco-bottle" style="background:${rec.gradient};">
                    <img src="${rec.image}" alt="${rec.name}" class="reco-bottle-img" onerror="this.style.display='none';">
                </div>
                <div class="reco-info">
                    <div class="reco-match"><span class="reco-match-dot"></span>${rec.matchPercent}% Match</div>
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
                </div>`;
            recoContainer.appendChild(card);
        });

        // Scroll to top
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) profileContainer.scrollTop = 0;
    }

    // ==================== AVATAR (PHOTO-BASED OR GENERATED) ====================
    function drawAvatar(archetype) {
        const canvas = document.getElementById('avatarCanvas');
        const ctx = canvas.getContext('2d');
        const size = 280;
        const cx = size / 2;
        const cy = size / 2;
        canvas.width = size * 2;
        canvas.height = size * 2;
        ctx.scale(2, 2);

        if (state.hasPhoto && state.photoData) {
            // Photo-based avatar with artistic stylization
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                drawPhotoAvatar(ctx, img, archetype, cx, cy, size);
            };
            img.src = state.photoData;
        } else {
            // Geometric avatar (no photo)
            drawGeometricAvatar(ctx, archetype, cx, cy);
        }
    }

    function drawPhotoAvatar(ctx, img, archetype, cx, cy, size) {
        // Circular clip for photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 120, 0, Math.PI * 2);
        ctx.clip();

        // Draw photo
        ctx.drawImage(img, 0, 0, size, size);

        // Artistic color overlay based on archetype
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = archetype.color + '50';
        ctx.fillRect(0, 0, size, size);

        // Duotone/stylize effect
        ctx.globalCompositeOperation = 'color';
        const gradOverlay = ctx.createRadialGradient(cx, cy, 30, cx, cy, 130);
        gradOverlay.addColorStop(0, 'transparent');
        gradOverlay.addColorStop(1, archetype.color + '35');
        ctx.fillStyle = gradOverlay;
        ctx.fillRect(0, 0, size, size);

        // Add subtle vignette
        ctx.globalCompositeOperation = 'multiply';
        const vignette = ctx.createRadialGradient(cx, cy, 50, cx, cy, 140);
        vignette.addColorStop(0, 'rgba(255,255,255,1)');
        vignette.addColorStop(0.7, 'rgba(200,200,200,1)');
        vignette.addColorStop(1, 'rgba(40,40,40,1)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, size, size);

        ctx.restore();

        // Outer glow ring
        ctx.strokeStyle = archetype.color + '80';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 122, 0, Math.PI * 2);
        ctx.stroke();

        // Second decorative ring
        ctx.strokeStyle = archetype.color + '25';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.stroke();

        // Flavour petals around the photo
        drawFlavourPetals(ctx, archetype, cx, cy, 115, 135);

        // Intensity arc
        const intensityAngle = (state.intensity / 100) * Math.PI * 2;
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, 127, -Math.PI / 2, -Math.PI / 2 + intensityAngle);
        ctx.stroke();

        // Decorative dots
        drawDecoDots(ctx, archetype, cx, cy, 135);
    }

    function drawGeometricAvatar(ctx, archetype, cx, cy) {
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

        // Flavour petals
        drawFlavourPetals(ctx, archetype, cx, cy, 40, 90);

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
        drawDecoDots(ctx, archetype, cx, cy, 105);

        // Mood icon in center
        const moodIcons = { adventurous: '\u2736', relaxed: '\u223F', celebratory: '\u2726', curious: '\u25C7' };
        ctx.fillStyle = '#0D0D0D';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(moodIcons[state.mood] || '\u2726', cx, cy);
    }

    function drawFlavourPetals(ctx, archetype, cx, cy, innerR, outerR) {
        const flavourColors = {
            citrus: '#E8C84C', spice: '#D4724C', floral: '#C480A8', sweet: '#D89060',
            herbal: '#6CAC7C', smoky: '#8C7060', coffee: '#6C4830', fruity: '#C46080', clean: '#88B8D0'
        };
        state.flavours.forEach((flavour, i) => {
            const angle = i * (Math.PI * 2 / state.flavours.length) - Math.PI / 2;
            const color = flavourColors[flavour] || archetype.color;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            const petalGrad = ctx.createLinearGradient(0, -innerR, 0, -outerR);
            petalGrad.addColorStop(0, color + '60');
            petalGrad.addColorStop(1, color + '10');
            ctx.fillStyle = petalGrad;
            ctx.beginPath();
            ctx.moveTo(0, -innerR);
            ctx.bezierCurveTo(25, -innerR - 12, 20, -outerR + 8, 0, -outerR);
            ctx.bezierCurveTo(-20, -outerR + 8, -25, -innerR - 12, 0, -innerR);
            ctx.fill();
            ctx.strokeStyle = color + '80';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -innerR);
            ctx.lineTo(0, -outerR + 5);
            ctx.stroke();
            ctx.restore();
        });
    }

    function drawDecoDots(ctx, archetype, cx, cy, radius) {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            ctx.fillStyle = archetype.color + '30';
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 2, 0, Math.PI * 2);
            ctx.fill();
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
            let pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            state.intensity = Math.round(pct * 100);
            thumb.style.left = (pct * 100) + '%';
            fill.style.width = (pct * 100) + '%';
            const label = document.getElementById('intensityValue');
            if (pct < 0.33) label.textContent = 'Gentle & Light';
            else if (pct < 0.66) label.textContent = 'Balanced & Smooth';
            else label.textContent = 'Bold & Intense';
        }

        // Touch
        track.addEventListener('touchstart', (e) => { dragging = true; updateSlider(e.touches[0].clientX); e.preventDefault(); }, { passive: false });
        thumb.addEventListener('touchstart', (e) => { dragging = true; e.preventDefault(); }, { passive: false });
        document.addEventListener('touchmove', (e) => { if (dragging) { updateSlider(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
        document.addEventListener('touchend', () => { dragging = false; });

        // Mouse
        track.addEventListener('mousedown', (e) => { dragging = true; updateSlider(e.clientX); });
        thumb.addEventListener('mousedown', () => { dragging = true; });
        document.addEventListener('mousemove', (e) => { if (dragging) updateSlider(e.clientX); });
        document.addEventListener('mouseup', () => { dragging = false; });
    }

    // ==================== NAME INPUT ====================
    function initNameInput() {
        const input = document.getElementById('userName');
        const btn = document.getElementById('nameBtn');
        if (!input) return;
        input.addEventListener('input', () => { btn.disabled = input.value.trim().length < 1; });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim().length >= 1) submitName();
        });
    }

    // ==================== AMBIENT BACKGROUND ====================
    function initAmbientCanvas() {
        const canvas = document.getElementById('ambientCanvas');
        const ctx = canvas.getContext('2d');
        let w, h, blobs;
        function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
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
                b.x += b.vx; b.y += b.vy;
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
        resize(); createBlobs(); draw();
        window.addEventListener('resize', () => { resize(); createBlobs(); });
    }

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

    // ==================== MODAL ====================
    function requestTasting() { document.getElementById('tastingModal').classList.add('active'); }
    function closeModal() { document.getElementById('tastingModal').classList.remove('active'); }

    // ==================== RESTART ====================
    function restart() {
        state.name = ''; state.mood = ''; state.flavours = []; state.style = '';
        state.bases = []; state.occasion = ''; state.intensity = 50;
        state.photoData = null; state.hasPhoto = false;
        stopCamera();

        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.gen-step').forEach(el => el.classList.remove('active', 'done'));

        const nameInput = document.getElementById('userName');
        if (nameInput) nameInput.value = '';
        const nameBtn = document.getElementById('nameBtn');
        if (nameBtn) nameBtn.disabled = true;
        const flavourBtn = document.getElementById('flavourBtn');
        if (flavourBtn) flavourBtn.disabled = true;

        const thumb = document.getElementById('sliderThumb');
        const fill = document.getElementById('sliderFill');
        const label = document.getElementById('intensityValue');
        if (thumb) thumb.style.left = '50%';
        if (fill) fill.style.width = '50%';
        if (label) label.textContent = 'Balanced';

        document.querySelectorAll('.dna-fill').forEach(f => f.style.width = '0');

        goToScreen('screen-welcome');
    }

    // ==================== BOOT ====================
    document.addEventListener('DOMContentLoaded', init);

    return {
        startJourney, submitName, selectOption, togglePill, submitFlavour,
        toggleBase, submitIntensity, capturePhoto, retakePhoto, usePhoto,
        skipPhoto, requestTasting, closeModal, restart
    };
})();
