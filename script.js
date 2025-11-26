// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Plastic Bag Impact Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Input elements
    const bagsInput = document.getElementById('bags-per-week');
    const bagsSlider = document.getElementById('bags-slider');
    const costInput = document.getElementById('bag-cost');
    const costSlider = document.getElementById('cost-slider');
    const yearsInput = document.getElementById('usage-years');
    const yearsSlider = document.getElementById('years-slider');
    
    // Check if calculator elements exist
    if (!bagsInput || !bagsSlider) return;
    
    // Output elements
    const totalBagsEl = document.getElementById('total-bags');
    const weeklyUsageEl = document.getElementById('weekly-usage');
    const annualUsageEl = document.getElementById('annual-usage');
    const totalCostEl = document.getElementById('total-cost');
    const decomposeTimeEl = document.getElementById('decompose-time');
    
    // Constants
    const D = 1000; // Decomposition time per bag in years (assumed average)
    
    // Sync input and slider with validation
    function syncInputAndSlider(input, slider, min, max) {
        input.addEventListener('input', function() {
            let value = parseFloat(this.value);
            // Validate range
            if (value < min) value = min;
            if (value > max) value = max;
            slider.value = value;
            calculateImpact();
        });
        
        input.addEventListener('blur', function() {
            let value = parseFloat(this.value);
            if (isNaN(value) || value < min) {
                this.value = min;
                slider.value = min;
            } else if (value > max) {
                this.value = max;
                slider.value = max;
            }
            calculateImpact();
        });
        
        slider.addEventListener('input', function() {
            input.value = this.value;
            calculateImpact();
        });
    }
    
    // Set up sync with validation ranges
    syncInputAndSlider(bagsInput, bagsSlider, 0, 100);
    syncInputAndSlider(costInput, costSlider, 0, 1);
    syncInputAndSlider(yearsInput, yearsSlider, 1, 50);
    
    // Calculate and display impact using formulas
    function calculateImpact() {
        // Get input values
        const B = parseFloat(bagsInput.value) || 0;  // Bags per week
        const C = parseFloat(costInput.value) || 0;   // Cost per bag (SGD)
        const Y = parseFloat(yearsInput.value) || 1;  // Years of usage
        
        // Validate inputs - show friendly message if invalid
        if (B < 0 || C < 0 || Y <= 0) {
            showError();
            return;
        }
        
        // Core Formulas
        // Weekly usage = B (bags/week)
        const weeklyUsage = Math.round(B);
        
        // Annual usage = A = B × 52 (bags/year)
        const A = B * 52;
        const annualUsage = Math.round(A);
        
        // Total usage over lifetime = T = A × Y = B × 52 × Y (bags)
        const T = A * Y;
        const totalUsage = Math.round(T);
        
        // Total cost = Cost = T × C (SGD)
        const totalCost = T * C;
        
        // Total decomposition time (cumulative) = DecTotal = T × D (years)
        const DecTotal = T * D;
        
        // Display values with proper formatting
        weeklyUsageEl.textContent = formatInteger(weeklyUsage) + ' bags';
        annualUsageEl.textContent = formatInteger(annualUsage) + ' bags';
        totalBagsEl.textContent = formatInteger(totalUsage);
        totalCostEl.textContent = 'SGD ' + formatCurrency(totalCost);
        decomposeTimeEl.textContent = formatLargeYears(DecTotal);
    }
    
    // Format integer with commas (no decimals for bag counts)
    function formatInteger(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Format currency with 2 decimal places
    function formatCurrency(num) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Format large year numbers with suffixes (k, M)
    function formatLargeYears(years) {
        if (years >= 1000000000) {
            // Billions
            return (years / 1000000000).toFixed(1) + 'B years';
        } else if (years >= 1000000) {
            // Millions
            return (years / 1000000).toFixed(1) + 'M years';
        } else if (years >= 1000) {
            // Thousands
            return (years / 1000).toFixed(1) + 'k years';
        } else {
            return formatInteger(years) + ' years';
        }
    }
    
    // Show error message for invalid inputs
    function showError() {
        weeklyUsageEl.textContent = '—';
        annualUsageEl.textContent = '—';
        totalBagsEl.textContent = '—';
        totalCostEl.textContent = '—';
        decomposeTimeEl.textContent = '—';
    }
    
    // Initial calculation on page load
    calculateImpact();
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.stat-card, .cause-item, .action-item').forEach(el => {
    observer.observe(el);
});

// Animated counter for statistics
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target % 1 === 0 ? Math.floor(target) : target.toFixed(2);
            clearInterval(timer);
        } else {
            element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(2);
        }
    }, 16);
}

// Observe stat numbers
const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            if (entry.target.hasAttribute('data-target')) {
                animateCounter(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    statObserver.observe(el);
});

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Audio function for soft bell sound
function playCheckSound() {
    // Create audio context for web audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a soft bell sound using multiple harmonics
        const fundamental = audioContext.createOscillator();
        const harmonic2 = audioContext.createOscillator();
        const harmonic3 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const gain2 = audioContext.createGain();
        const gain3 = audioContext.createGain();
        
        // Connect nodes
        fundamental.connect(gainNode);
        harmonic2.connect(gain2);
        harmonic3.connect(gain3);
        gainNode.connect(audioContext.destination);
        gain2.connect(audioContext.destination);
        gain3.connect(audioContext.destination);
        
        // Bell-like frequencies (fundamental + harmonics)
        const baseFreq = 523.25; // C5 note
        fundamental.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        harmonic2.frequency.setValueAtTime(baseFreq * 2.76, audioContext.currentTime); // Minor third harmonic
        harmonic3.frequency.setValueAtTime(baseFreq * 5.04, audioContext.currentTime); // Fifth harmonic
        
        // Use sine waves for soft, pure tones
        fundamental.type = 'sine';
        harmonic2.type = 'sine';
        harmonic3.type = 'sine';
        
        // Configure volume envelopes for bell-like decay
        // Fundamental (loudest)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
        
        // Second harmonic (medium volume)
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
        
        // Third harmonic (quietest, shortest)
        gain3.gain.setValueAtTime(0, audioContext.currentTime);
        gain3.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.01);
        gain3.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        // Start and stop oscillators
        const startTime = audioContext.currentTime;
        fundamental.start(startTime);
        harmonic2.start(startTime);
        harmonic3.start(startTime);
        
        fundamental.stop(startTime + 1.2);
        harmonic2.stop(startTime + 0.8);
        harmonic3.stop(startTime + 0.5);
        
    } catch (error) {
        // Fallback: use a simple beep if Web Audio API fails
        console.log('Audio context not available, using fallback');
    }
}

// CTA Button functions
function takePledge() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfciBkfSP4fRUVURv80zTUKPXbbHg5AO-qxpYMEy0YB3B3GVQ/viewform?pli=1', '_blank', 'noopener,noreferrer');
}

function downloadInfo() {
    window.open('singapore_plastic_waste_infographic_v2.pdf', '_blank', 'noopener,noreferrer');
}

function startCampaign() {
    alert('Start Your School Campaign! 🎓\n\nGreat initiative! Contact your school administration to get started with your plastic bag reduction campaign.');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Expandable card functionality
document.addEventListener('DOMContentLoaded', function() {
    const expandableCards = document.querySelectorAll('.expandable-card');

    expandableCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Subtle UI click sound for interactive cards
            playClickSound();

            // Don't trigger if clicking inside a link or button
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            const isExpanded = this.classList.contains('expanded');
            const section = this.closest('.stats-grid') || this.closest('.causes-grid');
            
            // For stats-grid, allow independent expansion (no accordion behavior)
            if (section && section.classList.contains('stats-grid')) {
                // Simply toggle the current card's expanded state
                if (isExpanded) {
                    this.classList.remove('expanded');
                } else {
                    this.classList.add('expanded');
                }
                return;
            }

            // For causes-grid, maintain accordion behavior (only one open at a time)
            if (section && section.classList.contains('causes-grid')) {
                // If this card is already expanded, collapse it
                if (isExpanded) {
                    this.classList.remove('expanded');
                    return;
                }

                // Collapse all other cards in the causes section
                const allCardsInSection = section.querySelectorAll('.expandable-card');
                allCardsInSection.forEach(otherCard => {
                    if (otherCard !== this && otherCard.classList.contains('expanded')) {
                        otherCard.classList.remove('expanded');
                    }
                });

                // Expand the clicked card
                this.classList.add('expanded');
                return;
            }

            // Default behavior for other sections (toggle individual cards)
            if (isExpanded) {
                this.classList.remove('expanded');
            } else {
                this.classList.add('expanded');
            }
        });
    });

    // Initialize: ensure no cards are expanded on load
    expandableCards.forEach(card => {
        card.classList.remove('expanded');
    });

    // Policy items accordion functionality
    const policyItems = document.querySelectorAll('.expandable-policy');
    let currentlyExpandedPolicy = null;

    policyItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on the link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            const isExpanded = this.classList.contains('expanded');
            
            // If this item is already expanded, collapse it
            if (isExpanded) {
                this.classList.remove('expanded');
                currentlyExpandedPolicy = null;
                return;
            }

            // Collapse all other policy items first (accordion behavior)
            policyItems.forEach(otherItem => {
                if (otherItem !== this && otherItem.classList.contains('expanded')) {
                    otherItem.classList.remove('expanded');
                }
            });

            // Expand the clicked item
            this.classList.add('expanded');
            currentlyExpandedPolicy = this;
            // Play check sound when expanding
            playCheckSound();
        });
    });

    // Close expanded policy item when clicking outside
    document.addEventListener('click', function(e) {
        if (currentlyExpandedPolicy && !currentlyExpandedPolicy.contains(e.target)) {
            // Check if click is outside any policy item
            const clickedPolicy = e.target.closest('.expandable-policy');
            if (!clickedPolicy || clickedPolicy !== currentlyExpandedPolicy) {
                currentlyExpandedPolicy.classList.remove('expanded');
                currentlyExpandedPolicy = null;
            }
        }
    });

    // Initialize: ensure no policy items are expanded on load
    policyItems.forEach(item => {
        item.classList.remove('expanded');
    });
});

// Button Click Sound Effect
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        // Short, soft "mechanical" click using filtered noise
        const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.03, audioContext.sampleRate); // 30ms
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const noise = audioContext.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.Q.setValueAtTime(0.7, now);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.0, now);
        gainNode.gain.linearRampToValueAtTime(0.05, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        noise.start(now);
        noise.stop(now + 0.06);

        // Subtle haptic feedback on supported mobile devices
        if (navigator && typeof navigator.vibrate === 'function') {
            navigator.vibrate(15);
        }
        
    } catch (error) {
        // Fallback: silent if audio not available
        console.log('Click sound not available');
    }
}

// Ambient YouTube background audio toggle
document.addEventListener('DOMContentLoaded', function() {
    const ambientToggle = document.getElementById('ambient-audio-toggle');
    const ambientContainer = document.getElementById('ambient-audio-container');
    if (!ambientToggle || !ambientContainer) return;

    let ambientOn = false;
    let ambientIframe = null;
    let ambientDesired = true; // we want ambience by default, but need user interaction

    function createAmbientIframe() {
        const iframe = document.createElement('iframe');
        iframe.width = '0';
        iframe.height = '0';
        iframe.setAttribute('allow', 'autoplay');
        iframe.setAttribute('title', 'Ambient background sound');
        // YouTube embed with loop; autoplay starts only after user click
        iframe.src = 'https://www.youtube.com/embed/t8JVK1jSSGw?autoplay=1&loop=1&playlist=t8JVK1jSSGw&controls=0&modestbranding=1&rel=0';
        ambientContainer.innerHTML = '';
        ambientContainer.appendChild(iframe);
        ambientIframe = iframe;
    }

    function startAmbientIfNeeded() {
        if (!ambientOn) {
            createAmbientIframe();
            ambientOn = true;
            ambientToggle.classList.add('active');
            ambientToggle.querySelector('.ambient-audio-icon').textContent = '🔊';
        }
    }

    ambientToggle.addEventListener('click', function() {
        if (!ambientOn) {
            startAmbientIfNeeded();
        } else {
            // Stop audio by removing iframe
            ambientContainer.innerHTML = '';
            ambientIframe = null;
            ambientOn = false;
            ambientToggle.classList.remove('active');
            ambientToggle.querySelector('.ambient-audio-icon').textContent = '🔈';
        }
    });

    // Start Experience overlay hook
    const experienceOverlay = document.getElementById('experience-overlay');
    const experienceStartBtn = document.getElementById('experience-start-btn');
    if (experienceOverlay && experienceStartBtn) {
        experienceStartBtn.addEventListener('click', function() {
            playClickSound();
            startAmbientIfNeeded();  // First interaction explicitly starts ambience
            experienceOverlay.classList.add('hidden');
        });
    }
});

// Add click sound to all buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click sound to all buttons and clickable elements
    const clickableElements = document.querySelectorAll('button, .btn, .btn-primary, .btn-secondary, .btn-cta, .social-btn, .feedback-button, .join-us-button');
    
    clickableElements.forEach(element => {
        // Skip sound for the ambient volume controller button
        if (element.id === 'ambient-audio-toggle') return;
        element.addEventListener('click', playClickSound);
    });
});

// Narrator (text-to-speech for the page)
document.addEventListener('DOMContentLoaded', function() {
    const narratorToggle = document.getElementById('narrator-toggle');
    const narratorPanel = document.getElementById('narrator-panel');
    const readPageBtn = document.getElementById('narrator-read-page');
    const stopBtn = document.getElementById('narrator-stop');

    if (!narratorToggle || !narratorPanel || !readPageBtn || !stopBtn) return;

    let isNarratorOpen = false;
    let isReading = false;

    function getNarrationText() {
        const parts = [];

        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroTitle) parts.push(heroTitle.textContent.trim());
        if (heroSubtitle) parts.push(heroSubtitle.textContent.trim());

        document.querySelectorAll('.section').forEach(section => {
            const title = section.querySelector('.section-title');
            if (title) parts.push(title.textContent.trim());

            section.querySelectorAll('p, li').forEach(node => {
                const text = node.textContent.replace(/\s+/g, ' ').trim();
                if (text.length > 0) parts.push(text);
            });
        });

        return parts.join('. ');
    }

    function speakText(text) {
        if (!('speechSynthesis' in window)) {
            alert('Narrator is not supported in this browser.');
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-SG';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => {
            isReading = false;
        };

        window.speechSynthesis.speak(utterance);
        isReading = true;
    }

    narratorToggle.addEventListener('click', () => {
        playClickSound();
        isNarratorOpen = !isNarratorOpen;
        narratorToggle.classList.toggle('active', isNarratorOpen);
        narratorPanel.classList.toggle('hidden', !isNarratorOpen);
    });

    readPageBtn.addEventListener('click', () => {
        playClickSound();
        const text = getNarrationText();
        if (text && text.length > 0) {
            speakText(text);
        }
    });

    stopBtn.addEventListener('click', () => {
        playClickSound();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        isReading = false;
    });
});

// Chatbot Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    let isOpen = false;
    
    // Chatbot responses database
    const responses = {
        greetings: [
            "Hello! 🌱 I'm here to help you learn about reducing plastic waste in Singapore!",
            "Hi there! 🌿 Ready to make Singapore greener? Ask me anything!",
            "Welcome! 🌊 Let's work together to reduce plastic pollution!"
        ],
        
        statistics: [
            "📊 Here are key facts: Singapore generates 957,000 tonnes of plastic waste yearly, but only 5% gets recycled! The 5-cent bag charge reduced usage by 80%.",
            "🔢 Singapore produces 6.86 million tonnes of waste annually, with plastic being a major component. Our recycling rate is only 11%!",
            "📈 Since July 2023, the plastic bag charge has dramatically reduced usage by 80% - showing small changes make big impacts!"
        ],
        
        reduce: [
            "💡 Great ways to reduce: Use reusable bags, say no to unnecessary packaging, bring your own containers for takeaway, and choose products with less plastic!",
            "🛍️ Top tips: Always carry a reusable bag, buy in bulk to reduce packaging, choose glass/metal containers, and support businesses with eco-friendly practices!",
            "🌱 Simple steps: Bring reusable bags everywhere, refuse single-use items, choose package-free products, and inspire friends to do the same!"
        ],
        
        recycling: [
            "♻️ Recycling tips: Clean containers before recycling, separate materials properly, check recycling symbols, and remember - thin plastic bags often can't be recycled!",
            "🗂️ Proper recycling: Remove food residue, sort by material type, check with your local recycling center for guidelines, and focus on reducing first!",
            "📋 Recycling guide: Clean items, separate plastics by number, avoid contamination, and remember the 3 R's: Reduce, Reuse, then Recycle!"
        ],
        
        singapore: [
            "🇸🇬 Singapore facts: We're working toward zero waste by 2030! The Green Plan includes reducing daily waste and increasing recycling rates significantly.",
            "🏝️ In Singapore: Semakau Landfill is filling up fast, so waste reduction is critical. The government is implementing Extended Producer Responsibility policies!",
            "🌆 Singapore's efforts: The Resource Sustainability Act, carrier bag charges, and upcoming deposit-return schemes are helping reduce waste!"
        ],
        
        default: [
            "🤔 I'm still learning! Could you provide your feedback on what you'd like to know? This helps me improve my responses about plastic waste reduction.",
            "💭 I want to help better! Please provide your feedback - what specific information about plastic waste or recycling would be most useful?",
            "🌟 I'm learning from every conversation! Could you provide your feedback on how I can better assist with plastic waste topics?"
        ],
        
        feedback: [
            "📝 Thank you for your feedback! I'm learning from our conversation to better help with plastic waste questions. Is there anything specific about Singapore's plastic policies you'd like to know?",
            "🙏 I appreciate your feedback! This helps me improve. Let me try to help with plastic bag reduction, recycling tips, or Singapore's green initiatives.",
            "💚 Your feedback is valuable! I'm getting better at helping with environmental topics. What would you like to learn about plastic waste reduction?"
        ],
        
        error: [
            "😅 Oops! I encountered an issue. Please provide your feedback on what went wrong so I can learn and improve!",
            "🔧 Something didn't work as expected. Could you provide your feedback? This helps me learn to serve you better!",
            "⚠️ I'm having trouble with that request. Please provide your feedback so I can learn and give you better information about plastic waste!"
        ]
    };
    
    // Toggle chatbot
    chatbotToggle.addEventListener('click', function() {
        playClickSound();
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });
    
    chatbotClose.addEventListener('click', function() {
        playClickSound();
        closeChatbot();
    });
    
    function openChatbot() {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.classList.add('active');
        isOpen = true;
        chatbotInput.focus();
    }
    
    function closeChatbot() {
        chatbotWindow.classList.add('hidden');
        chatbotToggle.classList.remove('active');
        isOpen = false;
    }
    
    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            playClickSound();
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                const response = generateResponse(message);
                addMessage(response, 'bot');
            }, 1000);
        }
    }
    
    chatbotSend.addEventListener('click', sendMessage);
    
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick questions
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            playClickSound();
            const question = this.getAttribute('data-question');
            addMessage(question, 'user');
            
            setTimeout(() => {
                const response = generateResponse(question);
                addMessage(response, 'bot');
            }, 800);
        });
    });
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🌱</div>
                <div class="message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
                <div class="message-avatar">👤</div>
            `;
        }
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Learning storage for chatbot improvement
    let userInteractions = [];
    let feedbackCount = 0;
    
    // Generate response based on keywords with learning capability
    function generateResponse(message) {
        const msg = message.toLowerCase();
        
        // Store user interaction for learning
        userInteractions.push({
            message: message,
            timestamp: new Date().toISOString(),
            understood: false
        });
        
        try {
            // Check for feedback-related keywords
            if (msg.includes('feedback') || msg.includes('improve') || msg.includes('better') || msg.includes('learn')) {
                feedbackCount++;
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('feedback') + (feedbackCount > 2 ? " I'm getting smarter with each conversation! 🧠" : "");
            }
            // Greetings
            else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good afternoon')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('greetings');
            }
            // Statistics and data
            else if (msg.includes('statistic') || msg.includes('data') || msg.includes('number') || msg.includes('fact') || msg.includes('percent') || msg.includes('%')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('statistics');
            }
            // Reduction tips
            else if (msg.includes('reduce') || msg.includes('less') || msg.includes('tip') || msg.includes('how') || msg.includes('ways') || msg.includes('help')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('reduce');
            }
            // Recycling
            else if (msg.includes('recycle') || msg.includes('recycling') || msg.includes('bin') || msg.includes('waste') || msg.includes('disposal')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('recycling');
            }
            // Singapore specific
            else if (msg.includes('singapore') || msg.includes('policy') || msg.includes('government') || msg.includes('semakau') || msg.includes('nea')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return getRandomResponse('singapore');
            }
            // Thank you responses
            else if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
                userInteractions[userInteractions.length - 1].understood = true;
                return "🌟 You're welcome! I'm here to help make Singapore greener. Feel free to ask more questions or provide feedback!";
            }
            // Default with learning request
            else {
                // Mark as not understood for learning
                userInteractions[userInteractions.length - 1].understood = false;
                return getRandomResponse('default');
            }
            
        } catch (error) {
            // Error handling with feedback request
            console.log('Chatbot error:', error);
            return getRandomResponse('error');
        }
    }
    
    // Enhanced function to get responses with learning context
    function getRandomResponse(category) {
        const responseArray = responses[category];
        const baseResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
        
        // Add learning context for ununderstood messages
        if (category === 'default') {
            const ununderstoodCount = userInteractions.filter(i => !i.understood).length;
            if (ununderstoodCount > 3) {
                return baseResponse + " I notice I'm having trouble understanding some questions - your feedback helps me learn! 🤖📚";
            }
        }
        
        return baseResponse;
    }
    
    // Add feedback collection feature
    function collectFeedback() {
        setTimeout(() => {
            if (userInteractions.length > 5) {
                const ununderstoodRatio = userInteractions.filter(i => !i.understood).length / userInteractions.length;
                if (ununderstoodRatio > 0.4) {
                    addMessage("🤖 I notice I might not be understanding all your questions perfectly. Could you provide feedback on how I can improve? Your input helps me learn!", 'bot');
                }
            }
        }, 30000); // Check after 30 seconds of conversation
    }
    
    // Start feedback collection monitoring
    setTimeout(collectFeedback, 10000);
    
    function getRandomResponse(category) {
        const responseArray = responses[category];
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
});

