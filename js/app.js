/* ============================================
   NB DISTILLERS — TASTING ROOM APP
   Full rebuild: navigation, camera, photo avatar,
   food pairings, mobile-first, responsive
   ============================================ */

const App = (() => {
    // ==================== STATE ====================
    const state = {
        name: '',
        mood: '',
        flavours: [],
        pairings: [],
        style: '',
        bases: [],
        occasion: '',
        intensity: 50,
        photoData: null,
        hasPhoto: false
    };

    let currentScreenId = 'screen-welcome';
    let isTransitioning = false;
    let cameraStream = null;

    // ==================== PRODUCT DATABASE ====================
    const products = [
        {
            id: 'red-admiral-vodka', name: 'Red Admiral Vodka', type: 'Premium Craft Vodka',
            category: 'vodka', price: '$29.75',
            gradient: 'linear-gradient(135deg, #e0e8f0, #a8c0d8)', bottleColor: '#d0dce8',
            flavourProfile: { clean: 90, citrus: 30, herbal: 20, sweet: 15, spice: 10, floral: 10, smoky: 0, coffee: 0, fruity: 15 },
            pairingAffinity: { citrus_fruit: 80, berries: 60, apple_pear: 70, almonds: 50, cheese: 40 },
            moods: ['relaxed', 'celebratory', 'curious'], styles: ['neat', 'cocktail', 'mixed', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'], intensityRange: [10, 50],
            image: 'https://nbdistillers.com/wp-content/uploads/2021/01/Untitled-design-56-1-707x942.png',
            cocktail: { name: 'Red Admiral Mule', emoji: '\u{1F943}', recipe: 'Red Admiral Vodka, ginger beer, fresh lime, ice' },
            matchReasons: { clean: 'Perfectly clean and crisp profile', default: 'Smooth and versatile \u2014 a true crowd-pleaser' }
        },
        {
            id: 'red-admiral-cardamom', name: 'Red Admiral Cardamom Vodka', type: 'Spiced Craft Vodka',
            category: 'vodka', price: '$34.95',
            gradient: 'linear-gradient(135deg, #e8dcc0, #c8b090)', bottleColor: '#d8c8a8',
            flavourProfile: { spice: 90, floral: 60, clean: 50, herbal: 40, citrus: 25, sweet: 20, smoky: 10, coffee: 5, fruity: 10 },
            pairingAffinity: { pistachios: 85, cashews: 80, honey: 70, dried_fruit: 75, dark_choc: 50 },
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
            flavourProfile: { coffee: 95, sweet: 60, smoky: 40, spice: 30, clean: 20, herbal: 15, citrus: 5, floral: 5, fruity: 10 },
            pairingAffinity: { dark_choc: 95, walnuts: 85, almonds: 70, honey: 60, cheese: 50 },
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
            flavourProfile: { herbal: 85, floral: 65, citrus: 60, clean: 50, spice: 30, fruity: 25, sweet: 15, smoky: 5, coffee: 0 },
            pairingAffinity: { citrus_fruit: 95, pistachios: 70, cheese: 75, apple_pear: 60, berries: 55 },
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
            flavourProfile: { floral: 95, fruity: 75, sweet: 50, citrus: 45, herbal: 40, clean: 30, spice: 15, smoky: 0, coffee: 0 },
            pairingAffinity: { berries: 95, tropical: 85, apple_pear: 70, honey: 65, cheese: 50 },
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
            flavourProfile: { sweet: 75, smoky: 60, spice: 55, herbal: 30, citrus: 15, clean: 15, floral: 10, coffee: 20, fruity: 20 },
            pairingAffinity: { dark_choc: 85, walnuts: 80, cheese: 90, honey: 75, dried_fruit: 70 },
            moods: ['relaxed', 'curious', 'celebratory'], styles: ['neat', 'cocktail', 'mixed', 'surprise'],
            occasions: ['date', 'friends', 'celebration', 'explore'], intensityRange: [40, 85],
            image: 'https://nbdistillers.com/wp-content/uploads/2021/01/Untitled-design-53-707x942.png',
            cocktail: { name: 'Gold Old Fashioned', emoji: '\u{1F947}', recipe: 'Liquid Gold Whisky, orange bitters, demerara syrup, orange peel' },
            matchReasons: { sweet: 'Caramel and vanilla richness matches your palate', smoky: 'Oak-aged smokiness with golden warmth', spice: 'Warming spice notes with a smooth finish', default: 'Our signature \u2014 liquid gold in every sense' }
        },
        {
            id: 'liquid-gold-wine-whisky', name: 'Liquid Gold Wine Whisky', type: 'Wine-Finished Whisky (Limited)',
            category: 'whisky', price: '$39.99',
            gradient: 'linear-gradient(135deg, #a04060, #6b2040)', bottleColor: '#8b3050',
            flavourProfile: { fruity: 80, sweet: 70, smoky: 45, spice: 40, herbal: 25, floral: 20, citrus: 15, coffee: 10, clean: 10 },
            pairingAffinity: { berries: 90, dark_choc: 90, cheese: 85, dried_fruit: 80, walnuts: 70 },
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
            flavourProfile: { spice: 85, sweet: 55, smoky: 50, herbal: 35, coffee: 20, citrus: 15, fruity: 15, floral: 10, clean: 10 },
            pairingAffinity: { pistachios: 90, cashews: 85, walnuts: 80, dried_fruit: 75, dark_choc: 70 },
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
            flavourProfile: { sweet: 80, fruity: 65, spice: 50, smoky: 30, herbal: 20, citrus: 25, coffee: 15, floral: 10, clean: 10 },
            pairingAffinity: { tropical: 95, citrus_fruit: 80, dark_choc: 75, cashews: 65, honey: 70 },
            moods: ['celebratory', 'adventurous', 'relaxed'], styles: ['cocktail', 'mixed', 'neat', 'surprise'],
            occasions: ['friends', 'celebration', 'explore', 'date'], intensityRange: [35, 80],
            image: 'https://nbdistillers.com/wp-content/uploads/2022/11/Chak_De_Edit_Nov.png',
            cocktail: { name: 'Chak De Daiquiri', emoji: '\u{1F334}', recipe: 'Chak De Rum, fresh lime, simple syrup, tropical bitters' },
            matchReasons: { sweet: 'Rich, tropical sweetness \u2014 a rum lover\'s dream', fruity: 'Beautiful fruit character with Caribbean warmth', spice: 'Spiced warmth with a smooth, spirited finish', default: 'Tropical warmth crafted in the heart of Ontario' }
        }
    ];

    // ==================== ARCHETYPES ====================
    const archetypes = {
        'The Alchemist':  { desc: 'An experimental soul drawn to complexity, bold flavours, and the unexpected. Every sip is a discovery.', traits: ['adventurous', 'spice', 'smoky', 'coffee'], color: '#E8924C', emoji: '\u{2697}' },
        'The Botanist':   { desc: 'Your palate is a garden \u2014 drawn to floral elegance, herbal depth, and nature\'s aromatics.', traits: ['curious', 'floral', 'herbal', 'citrus'], color: '#5DC88E', emoji: '\u{1F33F}' },
        'The Connoisseur': { desc: 'You appreciate the finer things. Rich, warming, nuanced \u2014 savour every moment with refined taste.', traits: ['relaxed', 'sweet', 'smoky', 'neat'], color: '#D4A84C', emoji: '\u{1F3A9}' },
        'The Socialite':  { desc: 'Life is a celebration and you\'re at the centre. Spirits that match your vibrant, joyful personality.', traits: ['celebratory', 'fruity', 'sweet', 'cocktail'], color: '#E890C0', emoji: '\u{1F389}' },
        'The Pioneer':    { desc: 'You blaze your own trail. Bold, unconventional, fearless \u2014 drawn to spirits with stories worth telling.', traits: ['adventurous', 'smoky', 'spice', 'neat'], color: '#A884E8', emoji: '\u{1F3AF}' },
        'The Purist':     { desc: 'Clean, crisp, honest. The best spirits need nothing added. You value craftsmanship and simplicity.', traits: ['relaxed', 'clean', 'citrus', 'neat'], color: '#4FC1B5', emoji: '\u{1F52E}' }
    };

    // ==================== INIT ====================
    function init() {
        initParticles();
        initSlider();
        initNameInput();
    }

    // ==================== SCREEN NAVIGATION ====================
    function goToScreen(targetId) {
        if (isTransitioning || targetId === currentScreenId) return;

        const currentEl = document.getElementById(currentScreenId);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        isTransitioning = true;

        if (currentEl) {
            currentEl.style.opacity = '0';
            currentEl.style.pointerEvents = 'none';
        }

        setTimeout(() => {
            if (currentEl) {
                currentEl.classList.remove('active');
                currentEl.style.opacity = '';
                currentEl.style.pointerEvents = '';
            }
            targetEl.classList.add('active');
            currentScreenId = targetId;

            if (targetId === 'screen-name') {
                setTimeout(() => {
                    const input = document.getElementById('userName');
                    if (input) input.focus();
                }, 400);
            }
            if (targetId === 'screen-camera') startCamera();
            if (targetId === 'screen-generating') runGeneratingAnimation();

            setTimeout(() => { isTransitioning = false; }, 400);
        }, 350);
    }

    // ==================== USER ACTIONS ====================
    function startJourney() { goToScreen('screen-name'); }

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

        const nextMap = {
            mood: 'screen-flavour',
            style: 'screen-base',
            occasion: 'screen-intensity'
        };
        if (nextMap[key]) setTimeout(() => goToScreen(nextMap[key]), 600);
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
        goToScreen('screen-pairing');
    }

    function togglePairing(el) {
        const maxSelections = 3;
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
            state.pairings = state.pairings.filter(p => p !== el.dataset.value);
        } else {
            if (state.pairings.length >= maxSelections) return;
            el.classList.add('selected');
            state.pairings.push(el.dataset.value);
        }
        document.getElementById('pairingBtn').disabled = state.pairings.length === 0;
    }

    function submitPairing() {
        if (state.pairings.length === 0) return;
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
                return;
            } else {
                if (state.bases.length >= 2) return;
                el.classList.add('selected');
                state.bases.push(value);
            }
        }

        if (state.bases.length > 0) setTimeout(() => goToScreen('screen-occasion'), 700);
    }

    function submitIntensity() { goToScreen('screen-camera'); }

    // ==================== CAMERA ====================
    async function startCamera() {
        const video = document.getElementById('cameraFeed');
        const preview = document.getElementById('photoPreview');
        const captureBtn = document.getElementById('captureBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const useBtn = document.getElementById('usePhotoBtn');

        video.style.display = 'block';
        preview.style.display = 'none';
        captureBtn.style.display = '';
        retakeBtn.style.display = 'none';
        useBtn.style.display = 'none';

        try {
            if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } }
            });
            video.srcObject = cameraStream;
        } catch (err) {
            console.log('Camera not available:', err);
            video.style.display = 'none';
        }
    }

    function stopCamera() {
        if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
    }

    function capturePhoto() {
        const video = document.getElementById('cameraFeed');
        const canvas = document.getElementById('photoCanvas');
        const preview = document.getElementById('photoPreview');

        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const cropSize = Math.min(vw, vh);
        const sx = (vw - cropSize) / 2;
        const sy = (vh - cropSize) / 2;

        ctx.save();
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, cropSize, cropSize, 0, 0, size, size);
        ctx.restore();

        state.photoData = canvas.toDataURL('image/jpeg', 0.88);
        state.hasPhoto = true;

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

    function usePhoto() { stopCamera(); goToScreen('screen-generating'); }
    function skipPhoto() { state.photoData = null; state.hasPhoto = false; stopCamera(); goToScreen('screen-generating'); }

    // ==================== GENERATING ANIMATION ====================
    function runGeneratingAnimation() {
        const steps = ['genStep1', 'genStep2', 'genStep3', 'genStep4'];
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

            // Pairing affinity bonus
            state.pairings.forEach(p => {
                score += (product.pairingAffinity[p] || 0) * 0.15;
            });

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
        const colors = { citrus: '#F0D04C', spice: '#E5724C', floral: '#E890C0', sweet: '#F0924C', herbal: '#5DC88E', smoky: '#8C7060', coffee: '#6C4830', fruity: '#E5647A', clean: '#88B8D0' };
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
        document.getElementById('profileArchetype').textContent = archetype.emoji + ' ' + archetype.name;
        document.getElementById('profileDesc').textContent = archetype.desc;

        drawAvatar(archetype);
        spawnAvatarParticles(archetype);

        const dnaContainer = document.getElementById('dnaBars');
        dnaContainer.innerHTML = '';
        const sortedDNA = Object.values(flavourDNA).sort((a, b) => b.value - a.value).slice(0, 6);
        sortedDNA.forEach(({ label, value, color }) => {
            const row = document.createElement('div');
            row.className = 'dna-row';
            row.innerHTML = `<div class="dna-label">${label}</div><div class="dna-track"><div class="dna-fill" style="background:${color};color:${color};" data-width="${value}%"></div></div><div class="dna-value">${value}%</div>`;
            dnaContainer.appendChild(row);
        });
        setTimeout(() => {
            dnaContainer.querySelectorAll('.dna-fill').forEach(fill => { fill.style.width = fill.dataset.width; });
        }, 600);

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
                            <span class="cocktail-label">Try it in</span>
                            <span class="cocktail-name">${rec.cocktail.name}</span>
                            <span class="cocktail-recipe">${rec.cocktail.recipe}</span>
                        </div>
                    </div>
                </div>`;
            recoContainer.appendChild(card);
        });

        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) profileContainer.scrollTop = 0;
    }

    // ==================== AVATAR PARTICLE FIELD ====================
    function spawnAvatarParticles(archetype) {
        const field = document.getElementById('avatarParticles');
        if (!field) return;
        field.innerHTML = '';
        const count = 14;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'ap';
            p.style.top = '50%';
            p.style.left = '50%';
            p.style.background = archetype.color;
            p.style.boxShadow = `0 0 8px ${archetype.color}80`;
            p.style.animationDelay = (i * (8 / count)) + 's';
            p.style.animationDuration = (7 + Math.random() * 4) + 's';
            field.appendChild(p);
        }
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
            const img = new Image();
            img.onload = () => drawPhotoAvatar(ctx, img, archetype, cx, cy, size);
            img.src = state.photoData;
        } else {
            drawGeometricAvatar(ctx, archetype, cx, cy);
        }
    }

    // ---------- AI-Style Photo Transformation ----------
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }

    function paletteForArchetype(archetype) {
        // Tritone palette: shadow, midtone, highlight (mapped from luminance)
        const base = hexToRgb(archetype.color);
        return [
            [Math.round(base[0] * 0.18), Math.round(base[1] * 0.18), Math.round(base[2] * 0.22)], // deep shadow
            [Math.round(base[0] * 0.45), Math.round(base[1] * 0.4), Math.round(base[2] * 0.5)],  // shadow
            base,                                                                                  // midtone
            [Math.min(255, base[0] + (255 - base[0]) * 0.5),
             Math.min(255, base[1] + (255 - base[1]) * 0.5),
             Math.min(255, base[2] + (255 - base[2]) * 0.5)],                                    // highlight
            [Math.min(255, base[0] + (255 - base[0]) * 0.85),
             Math.min(255, base[1] + (255 - base[1]) * 0.85),
             Math.min(255, base[2] + (255 - base[2]) * 0.85)]                                    // glow
        ];
    }

    function applyAIStyle(ctx, size, archetype) {
        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;
        const palette = paletteForArchetype(archetype);
        const N = palette.length;

        // Posterize + palette-map by luminance
        for (let i = 0; i < data.length; i += 4) {
            const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
            const idx = Math.min(N - 1, Math.floor(lum * N));
            const c = palette[idx];
            // 70% palette mapping, 30% original luminance preserved for detail
            data[i]     = Math.round(c[0] * 0.78 + data[i]     * 0.22);
            data[i + 1] = Math.round(c[1] * 0.78 + data[i + 1] * 0.22);
            data[i + 2] = Math.round(c[2] * 0.78 + data[i + 2] * 0.22);
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function drawPhotoAvatar(ctx, img, archetype, cx, cy, size) {
        // Use a hidden working canvas for AI processing
        const work = document.createElement('canvas');
        work.width = size;
        work.height = size;
        const wctx = work.getContext('2d');

        // Slightly increase contrast/saturation via filter before drawing
        wctx.filter = 'contrast(1.15) saturate(1.3) brightness(1.05)';
        wctx.drawImage(img, 0, 0, size, size);
        wctx.filter = 'none';

        // Apply AI palette transformation
        applyAIStyle(wctx, size, archetype);

        // Now compose onto main canvas
        ctx.clearRect(0, 0, size, size);

        // Background halo
        const bg = ctx.createRadialGradient(cx, cy, 40, cx, cy, 140);
        bg.addColorStop(0, archetype.color + '30');
        bg.addColorStop(1, 'transparent');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);

        // Circular clip and draw transformed photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 116, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(work, 0, 0);

        // Glamour vignette
        ctx.globalCompositeOperation = 'multiply';
        const vignette = ctx.createRadialGradient(cx, cy - 8, 40, cx, cy, 130);
        vignette.addColorStop(0, 'rgba(255,255,255,1)');
        vignette.addColorStop(0.7, 'rgba(220,210,200,1)');
        vignette.addColorStop(1, 'rgba(20,15,10,1)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();

        // Connoisseur accessories overlaid on the photo
        drawConnoisseurAccessories(ctx, archetype, cx, cy);

        // Gilded outer frame
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 118, 0, Math.PI * 2);
        ctx.stroke();

        // Outer accent ring
        ctx.strokeStyle = archetype.color + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 128, 0, Math.PI * 2);
        ctx.stroke();

        drawFlavourPetals(ctx, archetype, cx, cy, 119, 137);

        // Intensity arc (gold leaf style)
        const intensityAngle = (state.intensity / 100) * Math.PI * 2;
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, 124, -Math.PI / 2, -Math.PI / 2 + intensityAngle);
        ctx.stroke();

        drawDecoDots(ctx, archetype, cx, cy, 132);
    }

    // ---------- Connoisseur Accessories: Top Hat, Monocle, Mustache ----------
    function drawConnoisseurAccessories(ctx, archetype, cx, cy) {
        const gold = archetype.color;
        const goldDark = '#1a1410';

        // ----- TOP HAT (above the head) -----
        ctx.save();
        // Hat brim
        ctx.fillStyle = goldDark;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 70, 56, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Hat body
        const hatGrad = ctx.createLinearGradient(cx - 30, cy - 110, cx + 30, cy - 70);
        hatGrad.addColorStop(0, '#0a0806');
        hatGrad.addColorStop(0.5, '#1f1812');
        hatGrad.addColorStop(1, '#0a0806');
        ctx.fillStyle = hatGrad;
        ctx.beginPath();
        ctx.moveTo(cx - 32, cy - 70);
        ctx.lineTo(cx - 30, cy - 112);
        ctx.lineTo(cx + 30, cy - 112);
        ctx.lineTo(cx + 32, cy - 70);
        ctx.closePath();
        ctx.fill();
        // Top of hat (ellipse cap)
        ctx.fillStyle = '#15100c';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 112, 30, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Gold band on hat
        ctx.fillStyle = gold;
        ctx.fillRect(cx - 31, cy - 80, 62, 6);
        // Band shine
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(cx - 31, cy - 79, 62, 1.5);
        ctx.restore();

        // ----- MONOCLE (right eye area) -----
        ctx.save();
        // Monocle glass (subtle frosted)
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.arc(cx + 24, cy - 12, 18, 0, Math.PI * 2);
        ctx.fill();
        // Gold rim
        ctx.strokeStyle = gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx + 24, cy - 12, 18, 0, Math.PI * 2);
        ctx.stroke();
        // Inner highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx + 22, cy - 14, 16, Math.PI * 1.1, Math.PI * 1.6);
        ctx.stroke();
        // Chain (curls down to coat)
        ctx.strokeStyle = gold;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + 42, cy - 10);
        ctx.bezierCurveTo(cx + 60, cy + 5, cx + 50, cy + 30, cx + 30, cy + 50);
        ctx.stroke();
        ctx.restore();

        // ----- CURLED MUSTACHE -----
        ctx.save();
        ctx.strokeStyle = '#1a1208';
        ctx.fillStyle = '#1a1208';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        // Left side
        ctx.beginPath();
        ctx.moveTo(cx, cy + 22);
        ctx.bezierCurveTo(cx - 12, cy + 24, cx - 22, cy + 18, cx - 28, cy + 14);
        ctx.bezierCurveTo(cx - 32, cy + 10, cx - 30, cy + 6, cx - 26, cy + 8);
        ctx.stroke();
        // Right side
        ctx.beginPath();
        ctx.moveTo(cx, cy + 22);
        ctx.bezierCurveTo(cx + 12, cy + 24, cx + 22, cy + 18, cx + 28, cy + 14);
        ctx.bezierCurveTo(cx + 32, cy + 10, cx + 30, cy + 6, cx + 26, cy + 8);
        ctx.stroke();
        // Center bump
        ctx.beginPath();
        ctx.arc(cx, cy + 22, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // ----- BOW TIE (below chin) -----
        ctx.save();
        ctx.fillStyle = gold;
        // Left wing
        ctx.beginPath();
        ctx.moveTo(cx, cy + 65);
        ctx.lineTo(cx - 22, cy + 56);
        ctx.lineTo(cx - 22, cy + 76);
        ctx.closePath();
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.moveTo(cx, cy + 65);
        ctx.lineTo(cx + 22, cy + 56);
        ctx.lineTo(cx + 22, cy + 76);
        ctx.closePath();
        ctx.fill();
        // Center knot
        ctx.fillStyle = goldDark;
        ctx.fillRect(cx - 4, cy + 60, 8, 12);
        // Subtle shine on bow tie
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy + 60);
        ctx.lineTo(cx - 6, cy + 64);
        ctx.lineTo(cx - 18, cy + 68);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ----- SPARKLES around the head -----
        ctx.save();
        ctx.fillStyle = gold;
        const sparkles = [
            [cx - 80, cy - 60], [cx + 80, cy - 50], [cx - 90, cy + 30],
            [cx + 92, cy + 20], [cx - 70, cy - 100], [cx + 70, cy - 100]
        ];
        sparkles.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            // Cross sparkle
            ctx.fillRect(x - 0.5, y - 5, 1, 10);
            ctx.fillRect(x - 5, y - 0.5, 10, 1);
        });
        ctx.restore();
    }

    function drawGeometricAvatar(ctx, archetype, cx, cy) {
        const size = 280;
        ctx.clearRect(0, 0, size, size);

        // Soft circular gradient backdrop
        const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 130);
        bgGrad.addColorStop(0, archetype.color + '60');
        bgGrad.addColorStop(0.6, archetype.color + '20');
        bgGrad.addColorStop(1, 'rgba(13,13,13,0.95)');
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 116, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Stylized connoisseur silhouette (face shape)
        const skinTone = 'rgba(245, 215, 175, 0.85)';
        // Neck
        ctx.fillStyle = 'rgba(40, 30, 22, 0.7)';
        ctx.fillRect(cx - 14, cy + 30, 28, 40);
        // Shoulders/coat
        ctx.fillStyle = '#1a1410';
        ctx.beginPath();
        ctx.moveTo(cx - 60, cy + 130);
        ctx.bezierCurveTo(cx - 60, cy + 70, cx - 30, cy + 60, cx, cy + 65);
        ctx.bezierCurveTo(cx + 30, cy + 60, cx + 60, cy + 70, cx + 60, cy + 130);
        ctx.lineTo(cx - 60, cy + 130);
        ctx.closePath();
        ctx.fill();
        // Lapels
        ctx.fillStyle = '#0a0806';
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 70);
        ctx.lineTo(cx - 30, cy + 130);
        ctx.lineTo(cx - 14, cy + 130);
        ctx.lineTo(cx, cy + 90);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy + 70);
        ctx.lineTo(cx + 30, cy + 130);
        ctx.lineTo(cx + 14, cy + 130);
        ctx.lineTo(cx, cy + 90);
        ctx.closePath();
        ctx.fill();
        // Pocket square
        ctx.fillStyle = archetype.color;
        ctx.beginPath();
        ctx.moveTo(cx + 32, cy + 95);
        ctx.lineTo(cx + 44, cy + 95);
        ctx.lineTo(cx + 38, cy + 88);
        ctx.closePath();
        ctx.fill();
        // Face (oval)
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 5, 38, 48, 0, 0, Math.PI * 2);
        ctx.fill();
        // Subtle face shading
        ctx.fillStyle = 'rgba(180, 130, 90, 0.25)';
        ctx.beginPath();
        ctx.ellipse(cx + 8, cy + 12, 32, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyebrows
        ctx.strokeStyle = '#1a1208';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 8);
        ctx.lineTo(cx - 6, cy - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 6, cy - 10);
        ctx.lineTo(cx + 18, cy - 8);
        ctx.stroke();
        // Eyes
        ctx.fillStyle = '#0a0806';
        ctx.beginPath();
        ctx.arc(cx - 12, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 12, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        ctx.strokeStyle = 'rgba(150, 100, 70, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 2, cy + 4);
        ctx.quadraticCurveTo(cx - 4, cy + 14, cx, cy + 16);
        ctx.stroke();

        ctx.restore();

        // Connoisseur accessories on top
        drawConnoisseurAccessories(ctx, archetype, cx, cy);

        // Outer frame
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 118, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = archetype.color + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 128, 0, Math.PI * 2);
        ctx.stroke();

        drawFlavourPetals(ctx, archetype, cx, cy, 119, 137);

        // Intensity ring
        const intensityAngle = (state.intensity / 100) * Math.PI * 2;
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, 124, -Math.PI / 2, -Math.PI / 2 + intensityAngle);
        ctx.stroke();

        drawDecoDots(ctx, archetype, cx, cy, 132);
    }

    function drawFlavourPetals(ctx, archetype, cx, cy, innerR, outerR) {
        const flavourColors = {
            citrus: '#F0D04C', spice: '#E5724C', floral: '#E890C0', sweet: '#F0924C',
            herbal: '#5DC88E', smoky: '#8C7060', coffee: '#6C4830', fruity: '#E5647A', clean: '#88B8D0'
        };
        state.flavours.forEach((flavour, i) => {
            const angle = i * (Math.PI * 2 / state.flavours.length) - Math.PI / 2;
            const color = flavourColors[flavour] || archetype.color;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            const petalGrad = ctx.createLinearGradient(0, -innerR, 0, -outerR);
            petalGrad.addColorStop(0, color + '80');
            petalGrad.addColorStop(1, color + '15');
            ctx.fillStyle = petalGrad;
            ctx.beginPath();
            ctx.moveTo(0, -innerR);
            ctx.bezierCurveTo(22, -innerR - 10, 18, -outerR + 6, 0, -outerR);
            ctx.bezierCurveTo(-18, -outerR + 6, -22, -innerR - 10, 0, -innerR);
            ctx.fill();
            ctx.strokeStyle = color + '90';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -innerR);
            ctx.lineTo(0, -outerR + 4);
            ctx.stroke();
            ctx.restore();
        });
    }

    function drawDecoDots(ctx, archetype, cx, cy, radius) {
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            ctx.fillStyle = archetype.color + (i % 2 === 0 ? '60' : '25');
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 1.8, 0, Math.PI * 2);
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

        track.addEventListener('touchstart', (e) => { dragging = true; updateSlider(e.touches[0].clientX); e.preventDefault(); }, { passive: false });
        thumb.addEventListener('touchstart', (e) => { dragging = true; e.preventDefault(); }, { passive: false });
        document.addEventListener('touchmove', (e) => { if (dragging) { updateSlider(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
        document.addEventListener('touchend', () => { dragging = false; });

        track.addEventListener('mousedown', (e) => { dragging = true; updateSlider(e.clientX); });
        thumb.addEventListener('mousedown', () => { dragging = true; });
        document.addEventListener('mousemove', (e) => { if (dragging) updateSlider(e.clientX); });
        document.addEventListener('mouseup', () => { dragging = false; });
    }

    function initNameInput() {
        const input = document.getElementById('userName');
        const btn = document.getElementById('nameBtn');
        if (!input) return;
        input.addEventListener('input', () => { btn.disabled = input.value.trim().length < 1; });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim().length >= 1) submitName();
        });
    }

    function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (6 + Math.random() * 8) + 's';
            const sz = 2 + Math.random() * 3;
            p.style.width = p.style.height = sz + 'px';
            container.appendChild(p);
        }
    }

    // ==================== MODAL ====================
    function requestTasting() { document.getElementById('tastingModal').classList.add('active'); }
    function closeModal() { document.getElementById('tastingModal').classList.remove('active'); }

    // ==================== RESTART ====================
    function restart() {
        state.name = ''; state.mood = ''; state.flavours = []; state.pairings = [];
        state.style = ''; state.bases = []; state.occasion = ''; state.intensity = 50;
        state.photoData = null; state.hasPhoto = false;
        stopCamera();

        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.gen-step').forEach(el => el.classList.remove('active', 'done'));

        const nameInput = document.getElementById('userName');
        if (nameInput) nameInput.value = '';
        ['nameBtn', 'flavourBtn', 'pairingBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = true;
        });

        const thumb = document.getElementById('sliderThumb');
        const fill = document.getElementById('sliderFill');
        const label = document.getElementById('intensityValue');
        if (thumb) thumb.style.left = '50%';
        if (fill) fill.style.width = '50%';
        if (label) label.textContent = 'Balanced & Smooth';

        document.querySelectorAll('.dna-fill').forEach(f => f.style.width = '0');
        goToScreen('screen-welcome');
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        startJourney, submitName, selectOption, togglePill, togglePairing,
        submitFlavour, submitPairing, toggleBase, submitIntensity,
        capturePhoto, retakePhoto, usePhoto, skipPhoto,
        requestTasting, closeModal, restart
    };
})();
