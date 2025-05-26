
// Animated counter for stats
function animateCounter(elementId, target, duration = 2000) {
    const element = document.getElementById(elementId);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'project-count') {
                animateCounter('project-count', 40);
                animateCounter('client-count', 21);
                animateCounter('code-count', 35000);
                animateCounter('coffee-count', 147);
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
document.querySelectorAll('#project-count, #client-count, #code-count, #coffee-count').forEach(el => {
    observer.observe(el);
});

// Particle animation enhancement
document.querySelectorAll('.particle').forEach(particle => {
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
});

// Rap functionality
let audioContext;
let beatInterval;
let currentStep = 0;
const beatPattern = [1, 0, 1, 0, 1, 0, 1, 1]; // 1=kick, 0=snare

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeat() {
    initAudio();
    
    const kickFreq = 150;
    const snareFreq = 200;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (beatPattern[currentStep % beatPattern.length]) {
        // Kick drum
        oscillator.frequency.setValueAtTime(kickFreq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    } else {
        // Snare drum
        oscillator.frequency.setValueAtTime(snareFreq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(snareFreq * 0.8, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
    
    currentStep++;
}

function performRap() {
    const button = document.getElementById('rap-button');
    const stopButton = document.getElementById('stop-button');
    const status = document.getElementById('rap-status');
    const lyrics = document.getElementById('rap-lyrics');
    
    lyrics.classList.remove('hidden');
    status.classList.remove('hidden');
    button.disabled = true;
    stopButton.disabled = false;
    button.innerHTML = '<i class="fas fa-volume-up mr-2"></i> Rapping...';
    
    const rapLines = Array.from(lyrics.querySelectorAll('p'))
        .filter(p => !p.innerHTML.includes('<strong>'))
        .map(p => p.textContent.trim());
    
    initAudio();
    const bpm = 85;
    const beatDuration = 60 / bpm;
    beatInterval = setInterval(playBeat, beatDuration * 1000 / 2);
    
    const speech = window.speechSynthesis;
    speech.cancel();
    
    let rapVoice = speech.getVoices().find(voice => 
        voice.name.includes('Google UK English Male') || 
        voice.name.includes('Daniel') ||
        voice.name.includes('Microsoft David')
    ) || speech.getVoices()[0];
    
    if (!rapVoice) {
        status.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> No rap voice found - try Chrome';
        return;
    }
    
    let currentLine = 0;
    const lineElements = lyrics.querySelectorAll('p:not(:has(strong))');
    
    function rapLine(index) {
        if (index >= rapLines.length || !beatInterval) {
            finishRap();
            return;
        }
        
        lineElements.forEach(el => el.classList.remove('rap-line-highlight'));
        lineElements[index].classList.add('rap-line-highlight');
        
        const utterance = new SpeechSynthesisUtterance(rapLines[index]);
        utterance.voice = rapVoice;
        utterance.rate = 1.15;
        utterance.pitch = 0.85;
        
        const lineDuration = Math.max(rapLines[index].length * 0.06, 1.5);
        
        utterance.onend = function() {
            currentLine++;
            setTimeout(() => rapLine(currentLine), lineDuration * 300);
        };
        
        speech.speak(utterance);
    }
    
    function finishRap() {
        clearInterval(beatInterval);
        beatInterval = null;
        button.innerHTML = '<i class="fas fa-redo mr-2"></i> Play Again';
        button.disabled = false;
        stopButton.disabled = true;
        status.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Rap complete! Mic drop 🎤';
        lineElements.forEach(el => el.classList.remove('rap-line-highlight'));
    }
    
    setTimeout(() => rapLine(0), beatDuration * 1000 * 2);
    
    stopButton.onclick = function() {
        speech.cancel();
        clearInterval(beatInterval);
        beatInterval = null;
        button.innerHTML = '<i class="fas fa-play mr-2"></i> Play Rap';
        button.disabled = false;
        stopButton.disabled = true;
        status.classList.add('hidden');
        lineElements.forEach(el => el.classList.remove('rap-line-highlight'));
    };
}

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function() {
        document.getElementById('rap-button').disabled = false;
    };
}

document.getElementById('rap-button').addEventListener('click', performRap);

// Beat pulse animation
const beatPulseElements = document.querySelectorAll('.beat-pulse');
beatPulseElements.forEach(el => {
    el.style.animation = 'beatPulse 0.5s infinite alternate';
});