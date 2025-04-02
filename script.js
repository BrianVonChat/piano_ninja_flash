// --- Data Definitions --- (Remain mostly the same)

// Update notes array to include both representations
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Mobile responsive detection
const isSmallScreen = () => window.matchMedia("(max-width: 812px) and (max-height: 450px)").matches;
const isVerySmallScreen = () => window.matchMedia("(max-width: 667px) and (max-height: 375px)").matches;

// Get appropriate scale for current screen size
function getResponsiveScale() {
    if (isVerySmallScreen()) {
        return 0.7; // Very small screens (iPhone SE landscape)
    } else if (isSmallScreen()) {
        return 0.85; // Medium small screens (iPhone landscape)
    }
    return 1.0; // Default scale for larger screens
}

// Map for enharmonic equivalents (for display purposes)
const enharmonicMap = {
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb"
};
// Reverse map for flat to sharp conversion
const reverseEnharmonicMap = {
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#"
};
// Function to get a random note with balanced representation
function getRandomBalancedNote() {
    // 60% chance of natural note, 40% chance of accidental
    const useNatural = Math.random() < 0.6;
    
    if (useNatural) {
        // Get a natural note (indices 0, 2, 4, 5, 7, 9, 11)
        const naturalIndices = [0, 2, 4, 5, 7, 9, 11];
        const randomIndex = Math.floor(Math.random() * naturalIndices.length);
        return notes[naturalIndices[randomIndex]];
    } else {
        // Get a black key note
        const blackKeyIndices = [1, 3, 6, 8, 10];
        const randomIndex = Math.floor(Math.random() * blackKeyIndices.length);
        const note = notes[blackKeyIndices[randomIndex]];
        
        // 50% chance to display as flat instead of sharp
        if (Math.random() < 0.5) {
            return enharmonicMap[note];
        } else {
            return note;
        }
    }
}

// Chord definitions: using standard spellings where common (like Eb, Ab, Bb)
// We'll need to map these to abc notation correctly.
const chords = [
    // Major Triads
    { tones: ["C", "E", "G"], root: "C", quality: "major" },
    { tones: ["C#", "E#", "G#"], root: "C#", quality: "major" }, // E# is F natural
    { tones: ["D", "F#", "A"], root: "D", quality: "major" },
    { tones: ["Eb", "G", "Bb"], root: "Eb", quality: "major" },
    { tones: ["E", "G#", "B"], root: "E", quality: "major" },
    { tones: ["F", "A", "C"], root: "F", quality: "major" },
    { tones: ["F#", "A#", "C#"], root: "F#", quality: "major" },
    { tones: ["G", "B", "D"], root: "G", quality: "major" },
    { tones: ["Ab", "C", "Eb"], root: "Ab", quality: "major" },
    { tones: ["A", "C#", "E"], root: "A", quality: "major" },
    { tones: ["Bb", "D", "F"], root: "Bb", quality: "major" },
    { tones: ["B", "D#", "F#"], root: "B", quality: "major" },

    // Minor Triads
    { tones: ["C", "Eb", "G"], root: "C", quality: "minor" },
    { tones: ["C#", "E", "G#"], root: "C#", quality: "minor" },
    { tones: ["D", "F", "A"], root: "D", quality: "minor" },
    { tones: ["Eb", "Gb", "Bb"], root: "Eb", quality: "minor" }, // Gb is F#
    { tones: ["E", "G", "B"], root: "E", quality: "minor" },
    { tones: ["F", "Ab", "C"], root: "F", quality: "minor" },
    { tones: ["F#", "A", "C#"], root: "F#", quality: "minor" },
    { tones: ["G", "Bb", "D"], root: "G", quality: "minor" },
    { tones: ["Ab", "Cb", "Eb"], root: "Ab", quality: "minor" }, // Cb is B natural
    { tones: ["A", "C", "E"], root: "A", quality: "minor" },
    { tones: ["Bb", "Db", "F"], root: "Bb", quality: "minor" }, // Db is C#
    { tones: ["B", "D", "F#"], root: "B", quality: "minor" },
];

// Add interval definitions
const intervals = [
    { name: "Perfect Unison", semitones: 0, quality: "P", degree: "1" },
    { name: "Minor 2nd", semitones: 1, quality: "m", degree: "2" },
    { name: "Major 2nd", semitones: 2, quality: "M", degree: "2" },
    { name: "Minor 3rd", semitones: 3, quality: "m", degree: "3" },
    { name: "Major 3rd", semitones: 4, quality: "M", degree: "3" },
    { name: "Perfect 4th", semitones: 5, quality: "P", degree: "4" },
    { name: "Tritone", semitones: 6, quality: "A", degree: "4" },
    { name: "Tritone", semitones: 6, quality: "d", degree: "5" },
    { name: "Perfect 5th", semitones: 7, quality: "P", degree: "5" },
    { name: "Minor 6th", semitones: 8, quality: "m", degree: "6" },
    { name: "Major 6th", semitones: 9, quality: "M", degree: "6" },
    { name: "Minor 7th", semitones: 10, quality: "m", degree: "7" },
    { name: "Major 7th", semitones: 11, quality: "M", degree: "7" },
    { name: "Perfect 8th", semitones: 12, quality: "P", degree: "8" }
];
// Helper function to convert note to abc notation for specific clef
function noteToAbcForClef(noteName, clef) {
    let abcNote = noteName.charAt(0); // Base note letter (C, D, E...)
    let accidental = "";

    // Handle accidentals
    if (noteName.includes('#')) {
        accidental = "^"; // Sharp
    } else if (noteName.includes('b')) {
        accidental = "_"; // Flat
    } else if (noteName.includes('##')) {
        accidental = "^^"; // Double Sharp
    } else if (noteName.includes('bb')) {
        accidental = "__"; // Double Flat
    }

    // Handle specific enharmonic cases
    if (noteName === "E#") return clef === 'treble' ? "f" : "F,";
    if (noteName === "B#") return clef === 'treble' ? "^c" : "^C,";
    if (noteName === "Fb") return clef === 'treble' ? "e" : "E,";
    if (noteName === "Cb") return clef === 'treble' ? "b" : "B,";

    // Set correct octave based on clef
    if (clef === 'treble') {
        abcNote = abcNote.toLowerCase(); // Middle C octave for treble
    } else {
        abcNote = abcNote.toUpperCase() + ','; // Middle C octave for bass
    }

    return accidental + abcNote;
}
// Function to get a random index within an array
function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}
// Function to get a note from index, taking into account enharmonics
function getNoteFromIndex(index) {
    // Ensure index is within 0-11 range
    index = ((index % 12) + 12) % 12;
    return notes[index];
}

// Function to create a grand staff object with blank rests
function createEmptyGrandStaff() {
    return {
        treble: "z z z z z",
        bass: "z z z z z"
    };
}

// --- DOM Elements ---
const setupGameBtn = document.getElementById('setup-game-btn');
const setupModal = document.getElementById('setup-modal');
const beginGameBtn = document.getElementById('begin-game-btn');
const teacherNameInput = document.getElementById('teacher-name-input');
const studentNameInput = document.getElementById('student-name-input');
const staffArea = document.getElementById('staff-area');
const staffPlaceholder = document.getElementById('staff-placeholder');
const feedbackArea = document.getElementById('feedback-area');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const pauseOverlay = document.getElementById('pause-overlay');
const resumeButton = document.getElementById('resume-button');
const timerBar = document.getElementById('timer-bar');
const pointsIndicator = document.getElementById('points-indicator');
const notesBtn = document.getElementById('notes-btn');
const intervalsBtn = document.getElementById('intervals-btn');
const chordsBtn = document.getElementById('chords-btn');
const noteGuideBtn = document.getElementById('note-guide-btn');
const noteGuideOverlay = document.getElementById('note-guide-overlay');
const closeGuideBtn = document.getElementById('close-guide-btn');
const intervalButtons = document.getElementById('interval-buttons');
const qualityButtons = document.querySelectorAll('.interval-quality-btn');
const degreeButtons = document.querySelectorAll('.interval-degree-btn');
const elapsedTimeDisplay = document.getElementById('elapsed-time');
const teacherNameDisplay = document.getElementById('teacher-name');
const studentNameDisplay = document.getElementById('student-name');
const endGameBtn = document.getElementById('end-game-btn');
const scorecardOverlay = document.getElementById('scorecard-overlay');
const playAgainBtn = document.getElementById('play-again-btn');
const gameContainer = document.getElementById('game-container');
const welcomeContainer = document.querySelector('.welcome-container');
// Scorecard display elements
const scorecardTeacher = document.getElementById('scorecard-teacher');
const scorecardStudent = document.getElementById('scorecard-student');
const scorecardScore = document.getElementById('scorecard-score');
const scorecardTime = document.getElementById('scorecard-time');
const scorecardAccuracy = document.getElementById('scorecard-accuracy');

// --- Game State Variables ---
let score = 0;
let currentItem = null;
let expectedRootKey = null;
let isMinorChord = false;
let gameActive = false;
let gamePaused = false;
let gameMode = 'notes';
let noteStartTime = 0;
let maxPointsPerQuestion = 1000;
let timeForMinPoints = 5000;
let minPointsPerQuestion = 100;
let timerAnimationId = null;
const timers = {
    notes: 5000,
    intervals: 12000,
    chords: 7000
};
let gameStartTime = 0;
let elapsedTimeIntervalId = null;
let teacherName = "Teacher"; // Default, will be set by modal
let studentName = "Student"; // Default, will be set by modal
let totalQuestions = 0;
let correctAnswers = 0;
// NEW variables for timed modes
let gameDurationMode = 'practice'; // 'practice', '5min', '10min'
let gameDurationSeconds = 0; // Total seconds for timed modes
let challengeTimerId = null; // Interval ID for countdown timer

// --- Event Listeners ---
setupGameBtn.addEventListener('click', showSetupModal);
beginGameBtn.addEventListener('click', processSetupAndStartGame);
pauseButton.addEventListener('click', togglePause);
resumeButton.addEventListener('click', togglePause);
endGameBtn.addEventListener('click', () => endGame(false));
playAgainBtn.addEventListener('click', () => {
    scorecardOverlay.style.display = 'none';
    showSetupModal();
});
noteGuideBtn.addEventListener('click', toggleNoteGuide);
closeGuideBtn.addEventListener('click', toggleNoteGuide);
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && gameActive) {
        if (noteGuideOverlay.style.display === 'flex') {
            toggleNoteGuide();
        } else if (setupModal.style.display === 'flex') {
            // Optional: Close setup modal on Escape? Or just rely on button?
            // setupModal.style.display = 'none';
            // setupGameBtn.style.display = 'inline-block'; 
            // noteGuideBtn.style.display = 'inline-block';
        } else {
            togglePause();
        }
    }
});
window.addEventListener('beforeunload', () => {
    if (gameActive || challengeTimerId) {
        stopElapsedTimeTimer(); 
    }
});

// --- Setup Modal Functions (NEW) ---
function showSetupModal() {
    // Reset modal fields to defaults
    teacherNameInput.value = "Teacher"; 
    studentNameInput.value = "Student";
    document.getElementById('duration-practice').checked = true;
    
    // Hide welcome screen
    welcomeContainer.style.display = 'none';
    
    // Hide game elements, show modal
    setupModal.style.display = 'flex';
    pauseButton.style.display = 'none';
    endGameBtn.style.display = 'none';
    if (document.getElementById('timer-container')) {
        document.getElementById('timer-container').style.display = 'none'; // Hide per-question timer
    }
    staffArea.innerHTML = '<div id="staff-placeholder">Setup Game</div>'; // Show placeholder
    if (staffPlaceholder) staffPlaceholder.style.display = 'block';
    feedbackArea.textContent = '\u00A0'; // Clear feedback
    
    // Ensure setup modal is visible and scrollable on touch devices
    setupModal.querySelector('.setup-modal-content').scrollTop = 0;
}

// Enable scrolling in modals for touch devices (iOS fix)
document.addEventListener('DOMContentLoaded', function() {
    // Get all modal content elements that need scrolling support
    const scrollableElements = [
        document.querySelector('.setup-modal-content'),
        document.querySelector('.note-guide-content'),
        document.querySelector('.scorecard-content')
    ];
    
    // Enable scrolling on touch devices
    scrollableElements.forEach(element => {
        if (!element) return;
        
        // Prevent touchmove from being blocked
        element.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        // For iOS compatibility
        element.style.webkitOverflowScrolling = 'touch';
    });
});

function processSetupAndStartGame() {
    // Get values from modal
    teacherName = teacherNameInput.value.trim() || "Teacher";
    studentName = studentNameInput.value.trim() || "Student";
    gameDurationMode = document.querySelector('input[name="gameDuration"]:checked').value;
    gameMode = document.querySelector('input[name="gameModeSelect"]:checked').value; // Get game mode

    // Set timer duration if applicable
    gameDurationSeconds = 0; // Default to 0 (practice)
    if (gameDurationMode === '5min') {
        gameDurationSeconds = 5 * 60;
    } else if (gameDurationMode === '10min') {
        gameDurationSeconds = 10 * 60;
    }

    // Update displays
    teacherNameDisplay.textContent = teacherName;
    studentNameDisplay.textContent = studentName;
    elapsedTimeDisplay.textContent = '0:00'; // Reset display
    
    // Hide modal
    setupModal.style.display = 'none';
    
    // Show game container
    gameContainer.style.display = 'block';
    
    // Add active game class to body and game container
    document.body.classList.add('game-active');
    gameContainer.classList.add('game-active');
    
    // Check orientation after game setup is complete
    // If we're in portrait mode on mobile, show the rotation message
    handleOrientationChange();
    
    // Start the actual game logic
    startGame();
}

// --- Core Game Functions ---
function startGame() {
    // Apply mode-specific styles/layouts FIRST
    setGameMode(gameMode); // Call setGameMode with the selected mode

    // --- Start Timers based on mode --- 
    gameStartTime = Date.now();
    stopElapsedTimeTimer(); 
    if (gameDurationSeconds > 0) {
        startChallengeTimer(gameDurationSeconds);
    } else {
        elapsedTimeDisplay.textContent = '0:00';
        startElapsedTimeTimer();
    }

    // --- Reset Score, Stats, etc. --- 
    totalQuestions = 0;
    correctAnswers = 0;
    score = 0;
    updateScoreDisplay();
    feedbackArea.textContent = '';
    feedbackArea.className = '';
    gameActive = true;
    gamePaused = false;
    
    // Update button states
    gameContainer.style.display = 'flex'; // Use flex for mobile layout
    gameContainer.style.flexDirection = 'column';
    gameContainer.classList.add('game-active');
    document.body.classList.add('game-active');
    
    setupGameBtn.textContent = 'Restart';
    setupGameBtn.style.display = 'inline-block';
    pauseButton.style.display = 'inline-block';
    endGameBtn.style.display = 'inline-block';
    noteGuideBtn.style.display = 'inline-block';
    scorecardOverlay.style.display = 'none';
    pauseOverlay.style.display = 'none';
    
    if (staffPlaceholder) staffPlaceholder.style.display = 'none';
    
    // Reset and show per-question timer elements
    const timerContainer = document.getElementById('timer-container');
    if(timerContainer) {
        // Make it visible
        timerContainer.style.display = 'block';
        
        // Make sure the timer bar is reset to full width
        if(timerBar) {
            timerBar.style.transform = 'scaleX(1)';
            timerBar.style.display = 'block';
        }
        
        // Reset the points indicator
        if(pointsIndicator) {
            pointsIndicator.textContent = `+${maxPointsPerQuestion}`;
        }
    }
    
    // Check orientation again after game starts
    // This will show the rotation message if needed
    handleOrientationChange();
    
    // Apply proper ordering for mobile flexbox layout
    if (window.matchMedia("(max-width: 812px) and (orientation: landscape)").matches) {
        // Staff is already first by default
        const staffArea = document.getElementById('staff-area');
        if (staffArea) {
            staffArea.style.order = '0';
        }
        
        // Order 1: Timer container (right after staff)
        const timerContainer = document.getElementById('timer-container');
        if (timerContainer) {
            timerContainer.style.display = 'block';
            timerContainer.style.order = '1';
            // Ensure timer is more visible on mobile
            timerContainer.style.width = '98%';
            timerContainer.style.margin = '0 auto 5px';
            timerContainer.style.height = '8px';
            
            // Make sure the timer bar is properly styled
            if (timerBar) {
                timerBar.style.transform = 'scaleX(1)';
                timerBar.style.display = 'block';
            }
        }
        
        // Order 2: Mobile keyboard (after timer)
        const mobileKeyboard = document.getElementById('mobile-keyboard-container');
        if (mobileKeyboard) {
            mobileKeyboard.style.display = 'block';
            mobileKeyboard.style.order = '2';
        }
        
        // Order 3: Controls
        const mainControls = document.getElementById('main-controls');
        if (mainControls) {
            mainControls.style.order = '3';
        }
        
        // Order 4: Feedback
        if (feedbackArea) {
            feedbackArea.style.order = '4';
        }
        
        // Order 5: Interval buttons
        const intervalButtons = document.getElementById('interval-buttons');
        if (intervalButtons) {
            intervalButtons.style.order = '5';
        }
        
        // Hide instructions on mobile to save space
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
    }
    
    nextItem(); // Start the first question

    // --- Scroll down automatically in Interval mode after starting --- 
    if (gameMode === 'intervals') {
        // Use setTimeout to allow the DOM to update before scrolling
        setTimeout(() => {
            intervalButtons.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150); // Slightly longer delay after start
    }
    // --- End Scroll Adjustment ---
}

// --- Timer Functions --- 
function startElapsedTimeTimer() {
    // Clear any existing timer
    if (elapsedTimeIntervalId) {
        clearInterval(elapsedTimeIntervalId);
    }
    
    // Force the timer display to show the initial value
    const elapsedTimeDisplay = document.getElementById('elapsed-time');
    if (elapsedTimeDisplay) {
        elapsedTimeDisplay.textContent = '0:00';
    }
    
    function updateDisplay() {
        if (gamePaused || !gameActive) return; // Don't update if paused or game over
        
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - gameStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        
        // Make sure the element exists before updating
        const elapsedTimeDisplay = document.getElementById('elapsed-time');
        if (elapsedTimeDisplay) {
            elapsedTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Initial update
    updateDisplay();
    
    // Start the interval
    elapsedTimeIntervalId = setInterval(updateDisplay, 1000);
}

// Stop both elapsed time and challenge timers
function stopElapsedTimeTimer() {
    if (elapsedTimeIntervalId) {
        clearInterval(elapsedTimeIntervalId);
        elapsedTimeIntervalId = null;
    }
    if (challengeTimerId) {
        clearInterval(challengeTimerId);
        challengeTimerId = null;
    }
}

// Challenge Countdown Timer
function startChallengeTimer(durationInSeconds) {
    let remainingTime = durationInSeconds;
    
    // Get the elapsed time display element
    const elapsedTimeDisplay = document.getElementById('elapsed-time');
    if (!elapsedTimeDisplay) return; // Safety check
    
    // Add class for potential styling
    elapsedTimeDisplay.classList.add('challenge-timer');
    
    function updateChallengeDisplay() {
        if (gamePaused || !gameActive) return; 
        
        remainingTime--;
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        // Make sure the element exists before updating
        const elapsedTimeDisplay = document.getElementById('elapsed-time');
        if (elapsedTimeDisplay) {
            elapsedTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} ⏳`; // Countdown icon
        }

        if (remainingTime <= 0) {
            clearInterval(challengeTimerId);
            challengeTimerId = null;
            
            if (elapsedTimeDisplay) {
                elapsedTimeDisplay.textContent = "Time's Up!";
                elapsedTimeDisplay.classList.remove('challenge-timer');
            }
            
            endGame(true); // Automatically end the game when time is up (pass true)
        }
    }
    
    // Clear previous timer if any
    if (challengeTimerId) {
        clearInterval(challengeTimerId);
    }
    
    // Initial display
    updateChallengeDisplay(); 
    
    // Start the interval
    challengeTimerId = setInterval(updateChallengeDisplay, 1000);
}

// --- Game Over Function (Modified) ---
function endGame(timeExpired = false) { // Accept optional parameter
    // Prevent multiple calls if game already ended
    if (!gameActive && !timeExpired) { // Allow call if timeExpired even if gameActive false
        // If manually ended and already inactive, do nothing
        return; 
    } 
    // If time expired, ensure gameActive is false
    if (timeExpired) gameActive = false; 
    
    gameActive = false; // Set explicitly
    gamePaused = true; // Effectively pause things
    
    stopElapsedTimeTimer(); // Stops both timers now
    
    // Stop per-question timer animation if running
    if (timerAnimationId) {
        cancelAnimationFrame(timerAnimationId);
        timerAnimationId = null;
    }
    
    // Hide game controls
    pauseButton.style.display = 'none';
    endGameBtn.style.display = 'none';
    noteGuideBtn.style.display = 'none'; 
    if(document.getElementById('timer-container')) {
        document.getElementById('timer-container').style.display = 'none';
    }

    // Calculate stats
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Determine final time display based on mode
    let finalTime = "N/A";
    if (gameDurationSeconds > 0) {
        // Timed mode: Show the duration limit
        const minutes = Math.floor(gameDurationSeconds / 60);
        finalTime = `${minutes}:00 Challenge`;
        if (timeExpired) finalTime += " (Time's Up!)";
    } else {
        // Practice mode: Show final elapsed time
        const finalElapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(finalElapsedSeconds / 60);
        const seconds = finalElapsedSeconds % 60;
        finalTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    const finalScore = scoreDisplay.textContent; // Get score from display
    
    // Populate scorecard
    document.getElementById('scorecard-title').textContent = `Congratulations ${studentName}!`; // Update title
    scorecardTeacher.textContent = teacherName;
    scorecardStudent.textContent = studentName;
    scorecardScore.textContent = finalScore;
    scorecardTime.textContent = finalTime; 
    scorecardAccuracy.textContent = `${accuracy}% (${correctAnswers}/${totalQuestions})`;
    
    // Display scorecard & reset setup button
    scorecardOverlay.style.display = 'flex';
    setupGameBtn.textContent = 'Launch New Game'; // Reset button text
    setupGameBtn.style.display = 'inline-block'; // Show setup button again
    
    // Remove active game classes
    document.body.classList.remove('game-active');
    gameContainer.classList.remove('game-active');
    
    // Remove portrait mode message since the game is no longer active
    document.body.classList.remove('portrait-mode');
    
    // Call orientation change handler to update display
    handleOrientationChange();
    
    // Show welcome screen again after scorecard is closed
    playAgainBtn.addEventListener('click', function() {
        scorecardOverlay.style.display = 'none';
        welcomeContainer.style.display = 'flex';
        gameContainer.style.display = 'none';
    }, { once: true });
}

// --- Other Functions ---

// Modified togglePause to ensure buttons are handled correctly
function togglePause() {
    // Allow pause only if game is active OR challenge timer is running (even if game ended)
    if (!gameActive && !challengeTimerId) return; 
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        pauseButton.style.display = 'none';
        endGameBtn.style.display = 'none'; // Hide End Game btn while paused
        pauseOverlay.style.display = 'flex';
        // Timers pause via their internal checks
    } else { // Resuming
        pauseButton.style.display = 'inline-block';
        endGameBtn.style.display = 'inline-block';
        pauseOverlay.style.display = 'none';
        // Resume per-question timer animation if needed
        if (currentItem) {
            updateTimingIndicator(Date.now() - noteStartTime);
        }
        // Other timers resume via their internal checks
    }
}

// ... (rest of functions like nextItem, correctAnswer, incorrectAnswer, setGameMode, etc. should be mostly unchanged unless they interact with timers/game state in a way not covered)

// --- abcjs Notation Helper ---

/**
 * Converts a note name (e.g., "C#", "Eb", "G") into abc notation format.
 * Handles accidentals and basic octave placement (relative to middle C).
 * @param {string} noteName - The name of the note.
 * @returns {string} The note in abc notation (e.g., "^C", "_E", "G").
 */
function noteToAbc(noteName) {
    let abcNote = noteName.charAt(0); // Base note letter (C, D, E...)
    let accidental = "";

    // Handle accidentals
    if (noteName.includes('#')) {
        accidental = "^"; // Sharp
    } else if (noteName.includes('b')) {
        accidental = "_"; // Flat
    } else if (noteName.includes('##')) {
        accidental = "^^"; // Double Sharp - abcjs might need specific handling or fonts
    } else if (noteName.includes('bb')) {
        accidental = "__"; // Double Flat - abcjs might need specific handling or fonts
    }

    // Handle specific enharmonic cases if needed (e.g., E# -> F, Cb -> B)
    // These need to be handled before lowercase conversion
    if (noteName === "E#") return currentClef === 'treble' ? "f" : "F,";  // E# is the same as F
    if (noteName === "B#") return currentClef === 'treble' ? "^c" : "^C,"; // B# is the same as C#
    if (noteName === "Fb") return currentClef === 'treble' ? "e" : "E,";  // Fb is the same as E
    if (noteName === "Cb") return currentClef === 'treble' ? "b" : "B,";  // Cb is the same as B

    // In ABC notation: 
    // - Treble clef: lowercase letters (c,d,e,f,g,a,b) = middle C octave
    // - Bass clef: uppercase letters with comma (C,D,E,F,G,A,B,) = middle C octave
    if (currentClef === 'treble') {
        // For treble clef, use lowercase for middle C octave
        abcNote = abcNote.toLowerCase();
     } else {
        // For bass clef, use uppercase with comma for middle C octave
        abcNote = abcNote.toUpperCase() + ',';
     }

    // Construct the abc note string
    return accidental + abcNote;
}

// Function to render the notation on the staff
function renderStaff(abcString) {
    // Basic abc header with a grand staff (both treble and bass clefs)
    const header = "X:1\nM:4/4\nL:1/4\nK:clef=treble\nV:1 clef=treble\nV:2 clef=bass\n";
    
    // Format to show both treble and bass clefs in grand staff
    // The [V:1] and [V:2] markers indicate which voice/staff is being used
    let fullAbc = header + "[V:1] " + abcString.treble + " |]\n";
    fullAbc += "[V:2] " + abcString.bass + " |]";
    
    // Debug: Log the ABC notation
    console.log("Full ABC notation (Grand Staff):", fullAbc);

    // Use abcjs to render
    // Ensure the target div is empty before rendering
    staffArea.innerHTML = '';
    
    // Get scale based on screen size
    const scale = isVerySmallScreen() ? 1.2 : (isSmallScreen() ? 1.4 : 1.6);
    
    // Set staff width based on screen size
    const staffWidth = isSmallScreen() ? Math.min(window.innerWidth * 0.85, 380) : 400;
    
    try {
        ABCJS.renderAbc(staffArea, fullAbc, {
            scale: scale,
            staffwidth: staffWidth,
            responsive: "resize",
            add_classes: true,
            paddingtop: 0,
            paddingbottom: 0,
            paddingleft: 0,
            paddingright: 0,
            // Hide elements we don't need for flashcards
            hideFingerlings: true,
            hideStemDetails: false,
            hideTimeSignature: true
        });
        
        // Apply Piano Ninja styling to the SVG elements after rendering
        const svgElements = staffArea.querySelectorAll('svg');
        svgElements.forEach(svg => {
            // Set SVG to fill its container properly
            svg.style.display = 'block';
            svg.style.margin = '0 auto';
            
            // Add subtle glow effect to the SVG
            svg.style.filter = 'drop-shadow(0 0 1px rgba(0, 255, 0, 0.3))';
            
            // Make staff lines green but more visible
            const staffLines = svg.querySelectorAll('path.abcjs-staff');
            staffLines.forEach(line => {
                line.setAttribute('stroke', '#3dff3d');
                line.setAttribute('stroke-opacity', '1.0');
                line.setAttribute('stroke-width', isSmallScreen() ? '1.3' : '1.5'); // Thinner lines on mobile
            });
            
            // Make notes green with subtle glow
            const noteHeads = svg.querySelectorAll('g.abcjs-note path, path.abcjs-stem');
            noteHeads.forEach(note => {
                note.setAttribute('fill', '#3dff3d');
                note.setAttribute('stroke', '#3dff3d');
                note.setAttribute('stroke-width', isSmallScreen() ? '1.2' : '1.1');
            });
            
            // Make note circles glow subtly
            const noteCircles = svg.querySelectorAll('ellipse');
            noteCircles.forEach(circle => {
                circle.setAttribute('fill', '#3dff3d');
                circle.setAttribute('stroke', '#3dff3d');
                circle.style.filter = 'drop-shadow(0 0 1px rgba(0, 255, 0, 0.5))';
            });
            
            // Add very subtle glow to other musical elements
            const musicElements = svg.querySelectorAll('.abcjs-clef, .abcjs-note, .abcjs-rest');
            musicElements.forEach(el => {
                el.style.filter = 'drop-shadow(0 0 1px rgba(0, 255, 0, 0.4))';
            });
            
            // Ensure clefs are clearly visible
            const clefs = svg.querySelectorAll('.abcjs-clef');
            clefs.forEach(clef => {
                clef.setAttribute('stroke-width', isSmallScreen() ? '1.3' : '1.2');
            });
        });
        
        // REMOVED: The middle-c-indicator code has been removed
    } catch (error) {
        console.error("Error rendering ABC notation:", error);
        staffArea.innerHTML = '<div style="color:#0f0; text-shadow: 0 0 5px #0f0;">Error rendering staff</div>';
    }
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Only re-render if we have a current note and the game is active
    if (currentItem && gameActive && !gamePaused) {
        // Re-render current note with new responsive settings
        renderStaff(currentItem.abcString);
    }
});

// Helper function to determine number of interval options based on score
function getIntervalOptionsCount(score) {
    // Progressive difficulty based on score
    if (score < 2000) {
        return 2; // Start with 2 options (1 correct, 1 incorrect)
    } else if (score < 4000) {
        return 3; // 3 options when score is 2000-3999
    } else if (score < 6000) {
        return 4; // 4 options when score is 4000-5999
    } else {
        return 5; // Max of 5 options when score is 6000+
    }
}

function nextItem() {
    if (!gameActive) return;
    
    totalQuestions++; // Increment total questions when a new item is presented

    listeningForMinorKey = false;
    feedbackArea.textContent = '\u00A0';
    feedbackArea.className = '';

    // Reset interval button selections if in interval mode
    if (gameMode === 'intervals') {
        resetIntervalButtonSelections();
    }

    // Create object to hold grand staff notation
    let abcToRender = createEmptyGrandStaff();
    
    // Generate content based on game mode
    if (gameMode === 'notes') {
        // Randomly decide if the note goes on treble or bass clef
        const useTreebleClef = Math.random() > 0.5;
        
        // Get a random note with balanced distribution
        const randomNote = getRandomBalancedNote();
        
        // Create note representation for the selected clef
        if (useTreebleClef) {
            abcToRender.treble = "z z " + noteToAbcForClef(randomNote, 'treble') + " z z";
            abcToRender.bass = "z z z z z";
        expectedRootKey = randomNote.charAt(0).toLowerCase();
        } else {
            abcToRender.treble = "z z z z z";
            abcToRender.bass = "z z " + noteToAbcForClef(randomNote, 'bass') + " z z";
            expectedRootKey = randomNote.charAt(0).toLowerCase();
        }
        
        // Update current item
        currentItem = { 
            type: 'note', 
            value: randomNote,
            clef: useTreebleClef ? 'treble' : 'bass',
            abcString: abcToRender
        };
        
        isMinorChord = false;
        console.log(`Next: Note ${randomNote} on ${currentItem.clef} clef, Expect: ${expectedRootKey}`);
        
    } else if (gameMode === 'intervals') {
        // COMPLETELY SIMPLIFIED APPROACH FOR RELIABLE INTERVAL IDENTIFICATION
        
        // 1. Define the possible intervals we want to show
        const simpleIntervals = [
            { name: "Perfect Unison", semitones: 0, positions: 0 },
            { name: "Minor 2nd", semitones: 1, positions: 1 },
            { name: "Major 2nd", semitones: 2, positions: 1 },
            { name: "Minor 3rd", semitones: 3, positions: 2 },
            { name: "Major 3rd", semitones: 4, positions: 2 },
            { name: "Perfect 4th", semitones: 5, positions: 3 },
            { name: "Tritone", semitones: 6, positions: 3 },  // As augmented 4th
            { name: "Tritone", semitones: 6, positions: 4 },  // As diminished 5th
            { name: "Perfect 5th", semitones: 7, positions: 4 },
            { name: "Minor 6th", semitones: 8, positions: 5 },
            { name: "Major 6th", semitones: 9, positions: 5 },
            { name: "Minor 7th", semitones: 10, positions: 6 },
            { name: "Major 7th", semitones: 11, positions: 6 },
            { name: "Perfect 8th", semitones: 12, positions: 7 }
        ];

        // 2. Pick a random interval from our list
        const selectedInterval = simpleIntervals[Math.floor(Math.random() * simpleIntervals.length)];
        console.log("Selected interval:", selectedInterval.name);
        
        // 3. Use fixed notes for consistency based on position count
        // This defines exactly what should be displayed on the staff
        // The position count in the interval definition corresponds to these patterns
        const intervalPatterns = [
            // positions: 0 (unison)
            { lower: "C4", upper: "C4", lowerAbc: "c", upperAbc: "c" },
            // positions: 1 (2nds) 
            { lower: "C4", upper: "D4", lowerAbc: "c", upperAbc: "d" },
            // positions: 2 (3rds)
            { lower: "C4", upper: "E4", lowerAbc: "c", upperAbc: "e" },
            // positions: 3 (4ths)
            { lower: "C4", upper: "F4", lowerAbc: "c", upperAbc: "f" },
            // positions: 4 (5ths)
            { lower: "C4", upper: "G4", lowerAbc: "c", upperAbc: "g" },
            // positions: 5 (6ths)
            { lower: "C4", upper: "A4", lowerAbc: "c", upperAbc: "a" },
            // positions: 6 (7ths)
            { lower: "C4", upper: "B4", lowerAbc: "c", upperAbc: "b" },
            // positions: 7 (octave)
            { lower: "C4", upper: "C5", lowerAbc: "c", upperAbc: "c'" }
        ];
        
        // 4. Get the base pattern for our selected interval
        const pattern = intervalPatterns[selectedInterval.positions];
        
        // 5. Apply any needed accidental to the upper note based on semitones
        // Default pattern is based on C major scale, so we need to adjust
        const naturalSemitones = [0, 2, 4, 5, 7, 9, 11, 12]; // C major scale semitones
        const targetSemitones = selectedInterval.semitones;
        const adjustmentNeeded = targetSemitones - naturalSemitones[selectedInterval.positions];
        
        let upperAccidental = "";
        let abcAccidental = "";
        
        if (adjustmentNeeded === 1) {
            upperAccidental = "#";
            abcAccidental = "^";
        } else if (adjustmentNeeded === -1) {
            upperAccidental = "b";
            abcAccidental = "_";
        } else if (adjustmentNeeded === 2) {
            upperAccidental = "##";
            abcAccidental = "^^";
        } else if (adjustmentNeeded === -2) {
            upperAccidental = "bb";
            abcAccidental = "__";
        }
        
        // 6. Create our actual displayed notes
        const lowerNote = pattern.lower;
        const upperNote = pattern.upper.replace(/[A-G]/, "$&" + upperAccidental);
        
        // 7. Create ABC notation
        const lowerAbc = pattern.lowerAbc;
        const upperAbc = abcAccidental + pattern.upperAbc;
        
        // Random pick if we'll show on treble or bass clef
        const useTreebleClef = Math.random() > 0.5;
        
        // 8. Build the staff notation
        if (useTreebleClef) {
            abcToRender.treble = `z ${lowerAbc} ${upperAbc} z`;
            abcToRender.bass = "z z z z";
        } else {
            // For bass clef, we need to use uppercase and add commas for register
            const bassLowerAbc = lowerAbc.toUpperCase() + ",";
            const bassUpperAbc = abcAccidental + pattern.upperAbc.toUpperCase() + 
                                (pattern.upperAbc === "c'" ? "" : ",");
            
            abcToRender.treble = "z z z z";
            abcToRender.bass = `z ${bassLowerAbc} ${bassUpperAbc} z`;
        }
        
        // 9. Create our current interval object
        const intervalObj = {
            name: selectedInterval.name,
            semitones: selectedInterval.semitones,
            positions: selectedInterval.positions,
            lowerNote: lowerNote,
            upperNote: upperNote
        };
        
        // 10. Determine the number of options based on player's score - UPDATED
        const numberOfOptions = getIntervalOptionsCount(score);
        
        // 11. Generate answer options (1 correct + variable number of incorrect)
        const intervalOptions = generateIntervalOptions(intervalObj, numberOfOptions);
        
        // 12. Store everything in the current item
        currentItem = {
            type: 'interval',
            value: intervalObj,
            abcString: abcToRender,
            options: intervalOptions,
            selectedAnswer: null,
            displayMode: useTreebleClef ? 'treble' : 'bass',
            difficulty: numberOfOptions // Track the difficulty level
        };
        
        // 13. Generate the choice buttons
        generateIntervalChoiceButtons(intervalOptions, selectedInterval.name);

        // 14. Set feedback prompt for interval mode - without difficulty announcement
        showFeedback("Select the interval", "intermediate"); 
        
        // 15. Debug output - keep for debugging but not visible to user
        console.log(`Interval: ${selectedInterval.name}, From ${lowerNote} to ${upperNote}, ` +
                   `Semitones: ${selectedInterval.semitones}, Positions: ${selectedInterval.positions}, ` +
                   `Difficulty: ${numberOfOptions} options`);
    } else { // chords or notes mode
        // Get a random chord
        let randomChord = { ...chords[getRandomIndex(chords)] };
        
        // Balance major/minor triads with flats and sharps by randomly converting some chords
        // to their enharmonic equivalents
        if (randomChord.quality === 'major' && enharmonicMap[randomChord.root] && Math.random() < 0.5) {
            // Convert to flat version
            const flatRoot = enharmonicMap[randomChord.root];
            randomChord = chords.find(chord => chord.root === flatRoot && chord.quality === 'major') || randomChord;
        } else if (randomChord.quality === 'minor' && enharmonicMap[randomChord.root] && Math.random() < 0.5) {
            // Convert to flat version
            const flatRoot = enharmonicMap[randomChord.root];
            randomChord = chords.find(chord => chord.root === flatRoot && chord.quality === 'minor') || randomChord;
        }
        
        // Decide where to place the chord (treble, bass, or across both)
        const chordPlacement = Math.random() < 0.6 ? 'treble' : 
                            Math.random() < 0.8 ? 'bass' : 'across';
        
        // Convert chord tones to abc notation for the respective clefs
        if (chordPlacement === 'treble') {
            // All notes on treble clef
            const trebleChordTones = randomChord.tones.map(note => noteToAbcForClef(note, 'treble'));
            abcToRender.treble = "z z [" + trebleChordTones.join("") + "] z z";
            abcToRender.bass = "z z z z z";
        } else if (chordPlacement === 'bass') {
            // All notes on bass clef
            const bassChordTones = randomChord.tones.map(note => noteToAbcForClef(note, 'bass'));
            abcToRender.treble = "z z z z z";
            abcToRender.bass = "z z [" + bassChordTones.join("") + "] z z";
        } else {
            // Split chord across both clefs (e.g., root in bass, 3rd and 5th in treble)
            const bassNote = noteToAbcForClef(randomChord.tones[0], 'bass');
            const trebleNotes = [
                noteToAbcForClef(randomChord.tones[1], 'treble'),
                noteToAbcForClef(randomChord.tones[2], 'treble')
            ];
            
            abcToRender.treble = "z z [" + trebleNotes.join("") + "] z z";
            abcToRender.bass = "z z " + bassNote + " z z";
        }
        
        // Update current item
        currentItem = {
            type: 'chord',
            value: randomChord,
            placement: chordPlacement,
            abcString: abcToRender
        };
        
        expectedRootKey = randomChord.root.charAt(0).toLowerCase();
        isMinorChord = randomChord.quality === 'minor';

        console.log(`Next: Chord ${randomChord.root} ${randomChord.quality} on ${chordPlacement}, ` +
                  `Expect: ${expectedRootKey}${isMinorChord ? ' then m' : ''}`);
    }

     // Render the generated abc notation to the staff
     renderStaff(abcToRender);
    
    // Start the timer for this question
    noteStartTime = Date.now();
    
    // Show timing indicator
    updateTimingIndicator();
}

// Calculate points based on elapsed time
function calculatePoints(elapsedTime) {
    if (elapsedTime >= timeForMinPoints) {
        return minPointsPerQuestion;
    }
    
    // Linear scale from max points to min points
    const pointsLost = (maxPointsPerQuestion - minPointsPerQuestion) * (elapsedTime / timeForMinPoints);
    const points = Math.floor(maxPointsPerQuestion - pointsLost);
    return Math.max(points, minPointsPerQuestion);
}
// Update the timer bar and points indicator
function updateTimingIndicator(elapsedMsOverride = 0) {
    // Clear any existing timer
    if (timerAnimationId) {
        cancelAnimationFrame(timerAnimationId);
        timerAnimationId = null;
    }
    
    // Make sure timer container is visible
    if (document.getElementById('timer-container')) {
        document.getElementById('timer-container').style.display = 'block';
    }
    
    // Reset timer bar
    timerBar.style.transform = 'scaleX(1)';
    pointsIndicator.textContent = `+${maxPointsPerQuestion}`;
    pointsIndicator.style.opacity = '0.7'; // Make it slightly less prominent
    
    // If game is paused, don't start a new timer
    if (gamePaused) return;
    
    // Start the animation
    const startTime = Date.now() - elapsedMsOverride;
    
    function animate() {
        if (!gameActive || gamePaused) {
            if (timerAnimationId) {
                cancelAnimationFrame(timerAnimationId);
                timerAnimationId = null;
            }
            return;
        }
        
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= timeForMinPoints) {
            // Timer completed
            timerBar.style.transform = 'scaleX(0)';
            pointsIndicator.textContent = `+${minPointsPerQuestion}`;
            
            if (timerAnimationId) {
                cancelAnimationFrame(timerAnimationId);
                timerAnimationId = null;
            }
            return;
        }
        
        // Calculate scale based on elapsed time (0 to 1)
        const scale = Math.max(0, 1 - (elapsed / timeForMinPoints));
        timerBar.style.transform = `scaleX(${scale})`;
        
        // Update points indicator
        const currentPoints = calculatePoints(elapsed);
        pointsIndicator.textContent = `+${currentPoints}`;
        
        // Continue animation
        timerAnimationId = requestAnimationFrame(animate);
    }
    
    // Start animation loop
    timerAnimationId = requestAnimationFrame(animate);
}
// Show the points earned animation
function showPointsEarned(points, x, y) {
    // Create the points popup element
    const pointsPopup = document.createElement('div');
    pointsPopup.className = 'points-popup';
    pointsPopup.textContent = `+${points}`;
    
    // Get better positioning based on the staff area
    const staffRect = staffArea.getBoundingClientRect();
    
    // Default to center of staff area if no specific coordinates provided
    const centerX = staffRect.left + (staffRect.width / 2);
    const centerY = staffRect.top + (staffRect.height / 2);
    
    // Use provided coordinates or default to staff center
    pointsPopup.style.left = `${x || centerX}px`;
    pointsPopup.style.top = `${y || centerY}px`;
    
    // Center the popup on the point (adjust for its width/height)
    pointsPopup.style.transform = 'translate(-50%, -50%)';
    
    // Add it to the document
    document.body.appendChild(pointsPopup);
    
    // Create ripple effect
    createPointsRipple(x || centerX, y || centerY);
    
    // Add ping animation using CSS animation
    pointsPopup.style.animation = 'points-float 1.4s ease-out forwards, points-ping 0.3s ease-in-out 2';
    
    // Add an extra glow effect to draw attention
    setTimeout(() => {
        pointsPopup.style.boxShadow = "0 0 25px rgba(0, 255, 0, 0.8), inset 0 0 15px rgba(0, 255, 0, 0.5)";
        pointsPopup.style.textShadow = "0 0 15px #0f0, 0 0 20px #0f0";
    }, 100);
    
    // Remove after animation completes
    setTimeout(() => {
        if (pointsPopup.parentNode) {
            document.body.removeChild(pointsPopup);
        }
    }, 1400);
}

// Create a ripple effect around the point
function createPointsRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'transparent';
    ripple.style.border = '2px solid #0f0';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.zIndex = '9998';
    ripple.style.pointerEvents = 'none';
    
    // Add animation
    ripple.style.animation = 'ripple 0.8s ease-out forwards';
    
    // Add animation keyframes dynamically if not already added
    if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                0% { width: 10px; height: 10px; opacity: 1; }
                100% { width: 100px; height: 100px; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(ripple);
    
    // Remove after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            document.body.removeChild(ripple);
        }
    }, 800);
}

// handleKeyPress, correctAnswer, incorrectAnswer, showFeedback, updateScoreDisplay
// functions remain exactly the same as the previous text-based version.
// They handle the logic of checking key presses against expectedRootKey and isMinorChord.

function handleKeyPress(event) {
    if (!gameActive || gamePaused) return;

    const key = event.key;
    
    // Handle ESC key for pause functionality
    if (key === 'Escape') {
        togglePause();
        return;
    }
    
    // Only process if we're in a relevant game mode
    if (gameMode === 'notes' || gameMode === 'chords') {
        // Check for note input (A-G)
        if (/^[a-gA-G]$/.test(key)) {
            const hasAccidental = event.shiftKey || event.altKey;
            handleNoteInput(key, hasAccidental);
        }
        // Special case for minor chord input
        else if (gameMode === 'chords' && key.toLowerCase() === 'm') {
            if (lastInput && /^[A-G]$/.test(lastInput.toUpperCase())) {
                checkChordAnswer(lastInput, true); // true means minor
            }
        }
    }
}

function correctAnswer(event) {
    correctAnswers++; // Increment correct answers
    
    // Stop the timer animation
    if (timerAnimationId) {
        cancelAnimationFrame(timerAnimationId);
        timerAnimationId = null;
    }
    
    // Calculate elapsed time and points
    const elapsedTime = Date.now() - noteStartTime;
    const pointsEarned = calculatePoints(elapsedTime);
    
    // Keep track of difficulty before scoring (silently)
    let prevDifficulty = 0;
    if (gameMode === 'intervals') {
        prevDifficulty = getIntervalOptionsCount(score);
    }
    
    // Add to score
    score += pointsEarned;
    updateScoreDisplay();
    
    // Check if difficulty changed (silently)
    let difficultyChanged = false;
    if (gameMode === 'intervals') {
        const newDifficulty = getIntervalOptionsCount(score);
        difficultyChanged = (newDifficulty > prevDifficulty);
    }
    
    // Simple feedback without difficulty announcement
    showFeedback('Correct!', 'correct');
    
    // Determine the best position for the points animation
    let x, y;
    
    if (event && event.clientX && event.clientY) {
        // If we have mouse/touch event coordinates, use them
        x = event.clientX;
        y = event.clientY;
    } else if (currentItem && currentItem.type === 'note' || currentItem.type === 'chord') {
        // For notes/chords, try to position over the rendered note
        const staffRect = staffArea.getBoundingClientRect();
        x = staffRect.left + (staffRect.width * 0.5); // Center horizontally
        
        // If we know which clef, adjust vertical position
        if (currentItem.clef === 'treble') {
            y = staffRect.top + (staffRect.height * 0.3); // Upper half for treble
        } else if (currentItem.clef === 'bass') {
            y = staffRect.top + (staffRect.height * 0.7); // Lower half for bass
        } else {
            y = staffRect.top + (staffRect.height * 0.5); // Center if unknown
        }
    } else {
        // Default to center of viewport if all else fails
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
    }
    
    // Show points animation
    showPointsEarned(pointsEarned, x, y);
    
    // Move to next item after delay (slightly longer delay if difficulty changed)
    setTimeout(nextItem, difficultyChanged ? 1200 : 800);
}

function incorrectAnswer(message) {
    // Stop the timer animation
    if (timerAnimationId) {
        cancelAnimationFrame(timerAnimationId);
        timerAnimationId = null;
    }
    
    // Optional: Keep the current staff visible longer on incorrect answer
    showFeedback(message, 'incorrect');
    setTimeout(nextItem, 1500); // Slightly longer delay
}

function showFeedback(message, type = 'success') {
    feedbackArea.textContent = message;
    feedbackArea.className = type;
}

function updateScoreDisplay() {
    // Format the score with leading zeros
    const formattedScore = String(score).padStart(6, '0');
    scoreDisplay.textContent = formattedScore;
}

// Function to toggle pause state
function togglePause() {
    if (!gameActive) return;
    
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        // Pause the game
        pauseButton.style.display = 'none';
        endGameBtn.style.display = 'none'; // Hide End Game btn while paused
        pauseOverlay.style.display = 'flex';
    } else {
        // Resume the game
        pauseButton.style.display = 'inline-block';
        endGameBtn.style.display = 'inline-block'; // Show End Game btn again
        pauseOverlay.style.display = 'none';
        
        // If the timer was running, restart it from current position
        if (currentItem) {
            updateTimingIndicator(Date.now() - noteStartTime);
        }
    }
}

// Function to set the active game mode
function setGameMode(mode) {
    // If mode hasn't changed, do nothing (might be called by startGame)
    // Note: gameMode global variable is already set in processSetupAndStartGame
    // This function now primarily applies UI changes based on the mode.
    
    console.log(`Setting UI for game mode: ${mode}`);

    // --- Dynamic Staff Area Adjustment --- 
    if (mode === 'intervals') {
        intervalButtons.style.display = 'flex'; // Show interval buttons
        resetIntervalButtonSelections(); 
        // Apply compact styles for interval mode
        staffArea.style.minHeight = '120px'; 
        staffArea.style.padding = '10px 15px 20px 15px';
        
        // Hide minor chord button in intervals mode
        const minorChordBtn = document.getElementById('minor-chord-btn');
        if (minorChordBtn) {
            minorChordBtn.style.display = 'none';
            minorChordBtn.classList.remove('pulse-animation');
        }
    } else if (mode === 'chords') {
        // Hide interval buttons in chords mode
        intervalButtons.style.display = 'none';
        // Apply default/larger styles for chords mode
        staffArea.style.minHeight = '180px';
        staffArea.style.padding = '10px 15px 60px 15px';
        
        // Show minor chord button only in chords mode
        const minorChordBtn = document.getElementById('minor-chord-btn');
        if (minorChordBtn) {
            minorChordBtn.style.display = 'block';
            // Make minor button more prominent with animated pulse
            minorChordBtn.classList.add('pulse-animation');
            
            // Enhanced visibility with bold text
            minorChordBtn.innerHTML = '<span style="font-weight: bold; font-size: 1.2em;">MINOR</span>';
            
            // Ensure mobile keyboard is visible in chord mode on mobile
            if (window.matchMedia("(max-width: 812px) and (orientation: landscape)").matches) {
                const mobileKeyboard = document.getElementById('mobile-keyboard-container');
                if (mobileKeyboard) {
                    mobileKeyboard.style.display = 'block';
                }
            }
        }
    } else {
        // Apply default/larger styles for notes mode
        intervalButtons.style.display = 'none'; // Hide interval buttons
        staffArea.style.minHeight = '180px'; // Restore larger height
        staffArea.style.padding = '10px 15px 60px 15px'; // Restore larger padding
        
        // Hide minor chord button in notes mode
        const minorChordBtn = document.getElementById('minor-chord-btn');
        if (minorChordBtn) {
            minorChordBtn.style.display = 'none';
            minorChordBtn.classList.remove('pulse-animation');
        }
    }
    // --- End Dynamic Adjustment ---
    
    // Update the timer duration variable (used by per-question timer)
    timeForMinPoints = timers[mode];

    // NOTE: We don't call nextItem() here anymore because startGame does it
    // after calling this function.
}

// Function to toggle note guide
function toggleNoteGuide() {
    if (noteGuideOverlay.style.display === 'flex') {
        noteGuideOverlay.style.display = 'none';
        if (gameActive) {
            gameContainer.style.display = 'block';
        } else {
            welcomeContainer.style.display = 'flex';
        }
    } else {
        noteGuideOverlay.style.display = 'flex';
        welcomeContainer.style.display = 'none';
        gameContainer.style.display = 'none';
    }
}

// Add event listeners to the keys / buttons
document.addEventListener('keydown', handleKeyPress);
document.querySelectorAll('.keyboard-key').forEach(key => {
    key.addEventListener('click', handleKeyClick);
});

// Function to show a success message
function showSuccessMessage(message) {
    showFeedback(message, 'correct');
}

// Function to show a failure message
function showFailMessage(message) {
    showFeedback(message, 'incorrect');
}

// Function to clear any displayed messages
function clearMessage() {
    feedbackArea.textContent = '';
    feedbackArea.className = '';
}

// Function to generate a new note/interval/chord
function generateNewNote() {
    nextItem();
}

// Setup interval quality buttons
qualityButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (!gameActive || gamePaused || !currentItem || currentItem.type !== 'interval') return;
        
        // Reset all quality buttons
        qualityButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Select this button
        this.classList.add('selected');
        
        // Store the selected quality
        const quality = this.getAttribute('data-quality');
        currentItem.selectedQuality = quality;
        
        // Check if we have both parts selected
        checkIntervalSelection();
    });
});

// Setup interval degree buttons
degreeButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (!gameActive || gamePaused || !currentItem || currentItem.type !== 'interval') return;
        
        // Reset all degree buttons
        degreeButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Select this button
        this.classList.add('selected');
        
        // Store the selected degree
        const degree = this.getAttribute('data-degree');
        currentItem.selectedDegree = degree;
        
        // Check if we have both parts selected
        checkIntervalSelection();
    });
});

// Function to check if interval selection is complete
function checkIntervalSelection() {
    if (currentItem.selectedQuality && currentItem.selectedDegree) {
        // We have both quality and degree, check answer
        const userInterval = currentItem.selectedQuality + currentItem.selectedDegree;
        const correctInterval = currentItem.value.quality + currentItem.value.degree;
        
        // Clear feedback area immediately
        feedbackArea.textContent = '';
        
        // Case-insensitive comparison for interval quality
        if (userInterval.toLowerCase() === correctInterval.toLowerCase()) {
            correctAnswer(null); // No event since it's a button click
        } else {
            incorrectAnswer(`Incorrect. The interval was ${currentItem.value.name} (${correctInterval}).`);
        }
        
        // Reset selections for next interval
        resetIntervalButtonSelections();
    }
}

// Function to reset interval button selections
function resetIntervalButtonSelections() {
    qualityButtons.forEach(btn => btn.classList.remove('selected'));
    degreeButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Fix for tritone button
    const tritoneBtn = document.querySelector('.interval-special-btn[data-interval="tritone"]');
    if (tritoneBtn) tritoneBtn.classList.remove('selected');
    
    if (currentItem) {
        currentItem.selectedQuality = null;
        currentItem.selectedDegree = null;
    }
}

// Setup tritone special button
document.addEventListener('DOMContentLoaded', function() {
    const tritoneButton = document.querySelector('.interval-special-btn[data-interval="tritone"]');
    if (tritoneButton) {
        tritoneButton.addEventListener('click', function() {
            if (!gameActive || gamePaused || !currentItem || currentItem.type !== 'interval') return;
            
            // Reset all buttons
            qualityButtons.forEach(btn => btn.classList.remove('selected'));
            degreeButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Select this special button
            this.classList.add('selected');
            
            // For tritone, we'll randomly select either A4 or d5
            // This matches how the interval is generated in the nextItem function
            const isTritone = currentItem.value.semitones === 6;
            
            if (isTritone) {
                // Check if the actual interval is A4 or d5
                if (currentItem.value.quality === 'A' && currentItem.value.degree === '4') {
                    currentItem.selectedQuality = 'A';
                    currentItem.selectedDegree = '4';
                    correctAnswer(null);
                } else if (currentItem.value.quality === 'd' && currentItem.value.degree === '5') {
                    currentItem.selectedQuality = 'd';
                    currentItem.selectedDegree = '5';
                    correctAnswer(null);
                } else {
                    incorrectAnswer(`Incorrect. The interval was ${currentItem.value.name} (${currentItem.value.quality}${currentItem.value.degree}).`);
                }
            } else {
                incorrectAnswer(`Incorrect. The interval was ${currentItem.value.name} (${currentItem.value.quality}${currentItem.value.degree}).`);
            }
            
            // Reset selection after a short delay
            setTimeout(() => {
                this.classList.remove('selected');
            }, 800);
        });
    }
});

// Handle clicking on an interval button
function handleIntervalButton(event) {
    if (!currentItem || currentItem.type !== 'interval') return;
    
    let target = event.target;
    
    // If we clicked on the span inside the button, use the parent button
    if (target.tagName === 'SPAN') {
        target = target.parentElement;
    }
    
    // Get the data attributes from the button
    const quality = target.dataset.quality;
    const degree = target.dataset.degree;
    const isTritone = target.classList.contains('tritone');
    
    // Handle tritone button specially
    if (isTritone) {
        // A tritone can be recognized as either an augmented 4th or diminished 5th
        const isTritoneInterval = currentItem.value.semitones === 6;
        
        if (isTritoneInterval) {
            score++;
            document.getElementById('score').textContent = score;
            showSuccessMessage("Correct! That's a tritone.");
            setTimeout(function() {
                clearMessage();
                generateNewNote();
            }, 1000);
        } else {
            showFailMessage("That's not a tritone!");
            setTimeout(function() {
                clearMessage();
            }, 1000);
        }
        return;
    }
    
    // For non-tritone buttons, build the answer string
    if (quality) {
        currentItem.inputSoFar = quality;
    }
    
    if (degree) {
        currentItem.inputSoFar += degree;
    }
    
    // Check if we have a complete answer (both quality and degree)
    if (currentItem.inputSoFar.length >= 2) {
        if (currentItem.inputSoFar === expectedRootKey) {
            // Correct answer
            score++;
            document.getElementById('score').textContent = score;
            showSuccessMessage("Correct!");
            setTimeout(function() {
                clearMessage();
                generateNewNote();
            }, 1000);
        } else {
            // Wrong answer
            showFailMessage("Try again!");
            currentItem.inputSoFar = ""; // Reset input
            setTimeout(function() {
                clearMessage();
            }, 1000);
        }
    }
}

function checkInterval(answer) {
    console.log(`Checking interval: expected=${expectedRootKey}, got=${answer}`);
    
    const isCorrect = (answer === expectedRootKey) || 
                     (answer === 'tritone' && currentItem.value.isTritone);
    
    // Add visual feedback and update score
    if (isCorrect) {
        score++;
        document.getElementById('score').textContent = score;
        showSuccessMessage("Correct!");
        
        // Reset the buttons after a brief delay
        setTimeout(function() {
            document.querySelectorAll('.interval-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Clear the currently selected quality and degree
            if (currentItem) {
                currentItem.selectedQuality = null;
                currentItem.selectedDegree = null;
            }
            
            // Clear the message and generate a new question
            clearMessage();
            generateNewNote();
        }, 1000);
    } else {
        // For incorrect answers, just show a message but don't move to the next question
        showFailMessage("Try again!");
        setTimeout(function() {
            clearMessage();
        }, 1000);
    }
}

// Function to generate interval choice buttons
function generateIntervalChoiceButtons(options, correctAnswer) {
    const choiceContainer = document.querySelector('.interval-choice-buttons');
    choiceContainer.innerHTML = ''; // Clear previous buttons
    
    // Apply CSS class based on number of options
    const numOptions = options.length;
    choiceContainer.className = 'interval-choice-buttons options-' + numOptions;
    
    // Shuffle the options array to randomize button order
    const shuffledOptions = shuffleArray([...options]);
    
    // Create a button for each option
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'interval-choice-btn';
        button.textContent = option;
        button.dataset.interval = option;
        button.addEventListener('click', handleIntervalChoiceClick);
        choiceContainer.appendChild(button);
    });
    
    // Debug output
    console.log(`Generated ${numOptions} interval options. Difficulty level: ${numOptions}`);
}

// Function to handle interval choice button clicks
function handleIntervalChoiceClick(event) {
    if (!currentItem || currentItem.type !== 'interval' || !gameActive || gamePaused) return;
    
    // Get all choice buttons
    const allButtons = document.querySelectorAll('.interval-choice-btn');
    
    // Remove any previous selections or feedback
    allButtons.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Get the selected button and answer
    const selectedButton = event.target;
    const selectedAnswer = selectedButton.dataset.interval;
    
    // Highlight the selected button
    selectedButton.classList.add('selected');
    
    // Store the selected answer
    currentItem.selectedAnswer = selectedAnswer;
    
    // Check if the answer is correct
    const isCorrect = selectedAnswer === currentItem.value.name;
    
    if (isCorrect) {
        // Highlight the button as correct
        selectedButton.classList.add('correct');
        
        // --- Call the main correctAnswer function --- 
        // It handles score, stats, feedback, and moving to the next item.
        // Pass null for event as it wasn't a keyboard press.
        correctAnswer(null); 

        // Remove the old direct score/feedback logic:
        // score++;
        // document.getElementById('score').textContent = score;
        // showSuccessMessage("Correct!");
        // setTimeout(() => {
        //     clearMessage();
        //     generateNewNote();
        // }, 1200);

    } else {
        // Highlight the selected button as incorrect
        selectedButton.classList.add('incorrect');
        
        // Find and highlight the correct button
        allButtons.forEach(btn => {
            if (btn.dataset.interval === currentItem.value.name) {
                btn.classList.add('correct');
            }
        });
        
        // --- Call the main incorrectAnswer function --- 
        // It handles feedback and moving to the next item.
        incorrectAnswer(`Incorrect. The interval was ${currentItem.value.name}.`);
        
        // Remove the old direct feedback logic:
        // showFailMessage("Incorrect!");
        // setTimeout(() => {
        //     clearMessage();
        //     generateNewNote();
        // }, 2000);
    }
}

// Function to generate interval options (1 correct + variable number of incorrect)
function generateIntervalOptions(correctInterval, numberOfOptions = 5) {
    // Ensure numberOfOptions is at least 2 and at most 5
    numberOfOptions = Math.max(2, Math.min(5, numberOfOptions));
    
    // Define all possible interval names
    const allIntervals = [
        'Perfect Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd',
        'Perfect 4th', 'Tritone', 'Perfect 5th',
        'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Perfect 8th',
        'Augmented Unison', 'Diminished 2nd', 'Augmented 2nd', 'Diminished 3rd',
        'Augmented 3rd', 'Diminished 4th', 'Augmented 5th', 'Diminished 6th',
        'Augmented 6th', 'Diminished 7th', 'Augmented 7th', 'Diminished 8th'
    ];
    
    // Make sure our interval list includes ALL possible interval types
    // including augmented unison which is an important interval
    const completeIntervalList = [
        'Perfect Unison', 'Augmented Unison', 
        'Diminished 2nd', 'Minor 2nd', 'Major 2nd', 'Augmented 2nd',
        'Diminished 3rd', 'Minor 3rd', 'Major 3rd', 'Augmented 3rd',
        'Diminished 4th', 'Perfect 4th', 'Augmented 4th', 'Tritone',
        'Diminished 5th', 'Perfect 5th', 'Augmented 5th',
        'Diminished 6th', 'Minor 6th', 'Major 6th', 'Augmented 6th',
        'Diminished 7th', 'Minor 7th', 'Major 7th', 'Augmented 7th',
        'Diminished 8th', 'Perfect 8th', 'Augmented 8th'
    ];
    
    // Ensure the list has our correct interval
    if (!completeIntervalList.includes(correctInterval.name)) {
        completeIntervalList.push(correctInterval.name);
    }
    
    // Remove the correct answer from the possible options
    const availableOptions = completeIntervalList.filter(interval => interval !== correctInterval.name);
    
    // Shuffle the available options
    const shuffledOptions = shuffleArray(availableOptions);
    
    // Take the first (numberOfOptions-1) options
    const incorrectOptions = shuffledOptions.slice(0, numberOfOptions - 1);
    
    // Add the correct answer and return
    return [...incorrectOptions, correctInterval.name];
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to handle when user clicks a piano key
function handleKeyClick(event) {
    if (!gameActive || gamePaused) return;
    
    // Get the note associated with the clicked key
    const noteValue = event.currentTarget.dataset.note;
    
    if (noteValue) {
        // Simulate a key press with the note value
        const keyEvent = {
            key: noteValue.toLowerCase(),
            shiftKey: noteValue.includes('#') || noteValue.includes('b'),
            altKey: noteValue.includes('b')
        };
        
        handleKeyPress(keyEvent);
    }
}
// On page load, add a test for the abcjs library
window.addEventListener('load', function() {
    // Allow some time for the script to load
    setTimeout(checkAbcjsAndRender, 500);
    
    // Check and retry a few times if the library isn't loaded yet
    let retries = 0;
    const maxRetries = 5;
    
    // Clean up any middle C indicators that might be present
    document.querySelectorAll('.middle-c-indicator').forEach(indicator => {
        indicator.style.display = 'none';
        indicator.remove();
    });
    
    // Make sure timer container is properly setup
    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
        console.log("Timer container found, setting up...");
        // Ensure proper display and styling
        timerContainer.style.cssText = "display: block; height: 8px; width: 100%; background-color: rgba(0, 255, 0, 0.1); position: relative; overflow: hidden;";
        
        // Make sure timer bar is visible
        const timerBar = document.getElementById('timer-bar');
        if (timerBar) {
            timerBar.style.cssText = "height: 100%; width: 100%; background: linear-gradient(90deg, #0f0, #0ff); transform-origin: left; display: block;";
        } else {
            console.error("Timer bar element not found!");
        }
        
        // Check points indicator
        const pointsIndicator = document.getElementById('points-indicator');
        if (pointsIndicator) {
            pointsIndicator.style.cssText = "position: absolute; right: 0; top: -20px; font-size: 0.9em; color: #0f0; opacity: 0.7;";
        } else {
            console.error("Points indicator element not found!");
        }
    } else {
        console.error("Timer container element not found!");
    }
    
    function checkAbcjsAndRender() {
        // Check if the abcjs library loaded correctly
        if (typeof ABCJS !== 'undefined') {
            console.log("abcjs library loaded successfully!");
            
            // Try to render a test note when the page loads
            try {
                // Make sure the placeholder is hidden
                const placeholder = document.getElementById('staff-placeholder');
                if (placeholder) placeholder.style.display = 'none';
                
                // Render a test grand staff with middle C
                const testAbc = "X:1\nM:4/4\nL:1/4\nK:clef=treble\nV:1 clef=treble\nV:2 clef=bass\n" +
                               "[V:1] z z z z z |]\n" +
                               "[V:2] z z C, z z |]";
                
                ABCJS.renderAbc('staff-area', testAbc, {
                    scale: 1.6,
                    staffwidth: 400,
                    paddingtop: 10,
                    paddingbottom: 10,
                    paddingleft: 0,
                    paddingright: 0,
                    responsive: "resize",
                    add_classes: true
                });
                
                // Apply the same styling as in renderStaff
                const svg = document.querySelector('#staff-area svg');
                if (svg) {
                    svg.style.display = 'block';
                    svg.style.margin = '0 auto';
                    svg.style.filter = 'drop-shadow(0 0 1px rgba(0, 255, 0, 0.3))';
                    
                    // Style staff lines
                    const staffLines = svg.querySelectorAll('path');
                    staffLines.forEach(line => {
                        line.setAttribute('stroke', '#3dff3d');
                        line.setAttribute('stroke-opacity', '1.0');
                        line.setAttribute('stroke-width', '1.2');
                    });
                }
                console.log("Test note rendered successfully!");
            } catch (e) {
                console.error("Error rendering test note:", e);
                document.getElementById('staff-area').innerHTML = 
                    '<div style="color:red;">Error rendering staff: ' + e.message + '</div>';
            }
        } else {
            retries++;
            console.warn(`abcjs library not found yet! Retry ${retries}/${maxRetries}`);
            
            if (retries < maxRetries) {
                // Try again in 500ms
                setTimeout(checkAbcjsAndRender, 500);
            } else {
                console.error("abcjs library not loaded after multiple attempts");
                const downloadLink = 'https://github.com/paulrosen/abcjs/releases/download/v6.2.2/abcjs-basic-min.js';
                document.getElementById('staff-placeholder').innerHTML = 
                    `<div style="color:red;">
                        Error: abcjs library not loaded. 
                        <p>Options to fix:</p>
                        <ol>
                            <li><button onclick="window.location.reload()">Reload Page</button></li>
                            <li><a href="${downloadLink}" download>Download abcjs library</a> and add it to your project folder</li>
                        </ol>
                    </div>`;
            }
        }
    }
});
// Initialize MIDI as soon as the page loads
document.addEventListener('DOMContentLoaded', function() {
    initMIDI();
});

// Function to initialize MIDI access
async function initMIDI() {
    try {
        // Check if the Web MIDI API is supported
        if (!navigator.requestMIDIAccess) {
            console.warn("Web MIDI API is not supported in this browser");
            return;
        }

        // Request MIDI access
        const midiAccess = await navigator.requestMIDIAccess();
        
        // Add a MIDI connection status indicator to the game
        // Create a separate MIDI status container instead of adding to game-stats
        const gameContainer = document.getElementById('game-container');
        
        if (gameContainer) {
            // Check if MIDI status box already exists
            let midiStatusBox = document.getElementById('midi-status-box');
            
            if (!midiStatusBox) {
                // Create a new display area for MIDI status
                midiStatusBox = document.createElement('div');
                midiStatusBox.id = 'midi-status-box';
                midiStatusBox.className = 'midi-status-box';
                midiStatusBox.innerHTML = `
                    <div class="stat-icon">🎹</div>
                    <div class="stat-label">MIDI</div>
                    <div class="stat-value" id="midi-status">Connected</div>
                `;
                
                // Add the MIDI status below the game stats but above the staff area
                const staffArea = document.getElementById('staff-area');
                if (staffArea) {
                    gameContainer.insertBefore(midiStatusBox, staffArea);
                } else {
                    // Fallback - append to the end of game container
                    gameContainer.appendChild(midiStatusBox);
                }
            }
        }
        
        // Log MIDI access success
        console.log("MIDI Access granted!", midiAccess);
        
        // Set up event handlers for MIDI inputs
        const inputs = midiAccess.inputs.values();
        let inputCount = 0;
        
        // For each MIDI input, set up a message handler
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = handleMIDIMessage;
            inputCount++;
            console.log(`MIDI Input: ${input.value.name}`);
        }
        
        if (inputCount === 0) {
            console.log("No MIDI devices detected. Please connect a MIDI device and refresh the page.");
            if (document.getElementById('midi-status')) {
                document.getElementById('midi-status').textContent = "No Device";
                document.getElementById('midi-status').style.color = "#ff9";
            }
        }
        
        // Set up listeners for MIDI connection/disconnection events
        midiAccess.onstatechange = function(event) {
            const midiStatus = document.getElementById('midi-status');
            if (event.port.type === 'input') {
                if (event.port.state === 'connected') {
                    console.log(`MIDI device connected: ${event.port.name}`);
                    if (midiStatus) {
                        midiStatus.textContent = "Connected";
                        midiStatus.style.color = "#0f0";
                    }
                } else if (event.port.state === 'disconnected') {
                    console.log(`MIDI device disconnected: ${event.port.name}`);
                    if (midiStatus) {
                        midiStatus.textContent = "Disconnected";
                        midiStatus.style.color = "#f00";
                    }
                }
            }
        };
        
    } catch (error) {
        console.error("Error accessing MIDI devices:", error);
        const midiStatus = document.getElementById('midi-status');
        if (midiStatus) {
            midiStatus.textContent = "Error";
            midiStatus.style.color = "#f00";
        }
    }
}

// Handle incoming MIDI messages
function handleMIDIMessage(event) {
    // Extract MIDI message data
    const [status, note, velocity] = event.data;
    
    // Check if it's a Note On message (144-159) with velocity > 0
    if (status >= 144 && status <= 159 && velocity > 0) {
        // Convert MIDI note number to note name
        const noteName = midiNoteNumberToName(note);
        
        // Process the note through the existing game logic
        processMIDINote(noteName);
    }
    // Note: We're ignoring Note Off messages and other MIDI message types
}

// Convert MIDI note number to note name
function midiNoteNumberToName(midiNote) {
    // Calculate the base note (0-11 for C through B)
    const baseNoteIndex = midiNote % 12;
    
    // Get the note name from the existing notes array
    let noteName = notes[baseNoteIndex];
    
    // Special case for A# (MIDI index 10) - use Bb form more consistently
    // This helps with the Bb4 in bass clef display issue
    if (baseNoteIndex === 10 && noteName === "A#" && enharmonicMap["A#"]) {
        noteName = enharmonicMap["A#"]; // Use "Bb" instead of "A#"
    }
    
    // Calculate octave (C4/Middle C is MIDI note 60)
    const octave = Math.floor(midiNote / 12) - 1;
    
    // Return the note name with octave (e.g., "C4", "Bb4")
    return noteName + octave;
}

// Process a MIDI note through the game's existing logic
function processMIDINote(noteWithOctave) {
    // Extract just the note name without the octave
    const noteName = noteWithOctave.replace(/\d+$/, '');
    
    // Determine if we need to use shiftKey (for accidentals)
    const hasAccidental = noteName.includes('#') || noteName.includes('b');
    
    // Get the base note letter (C, D, E, etc.)
    const noteLetter = noteName.charAt(0).toLowerCase();
    
    // Debug logging specifically for Bb notes to help diagnose the issue
    if (noteName.includes("Bb") || noteName.includes("A#")) {
        console.log(`Special case - processing ${noteName} in ${currentItem?.clef || 'unknown'} clef`);
        console.log(`Using letter ${noteLetter} with accidental: ${hasAccidental}`);
        if (currentItem && currentItem.value) {
            console.log(`Expected value: ${currentItem.value}`);
        }
    }
    
    // Create a synthetic keyboard event that matches what handleKeyPress expects
    const syntheticEvent = {
        key: noteLetter,
        shiftKey: hasAccidental,
        // Include altKey for flat notes (alternative method used in the game)
        // This helps with the A#/Bb decision - use altKey for Bb specifically
        altKey: noteName.includes('b'),
        // Add a flag to identify this as a MIDI-generated event
        isMIDIEvent: true,
        // Add client coordinates for points animation (center of the staff area)
        clientX: staffArea.offsetLeft + (staffArea.offsetWidth / 2),
        clientY: staffArea.offsetTop + (staffArea.offsetHeight / 2),
        // Prevent default to avoid conflicts
        preventDefault: function() {}
    };
    
    // Log the MIDI note being processed (for debugging)
    console.log(`MIDI Note: ${noteWithOctave} → Key: ${noteLetter}, Shift: ${hasAccidental}, Alt: ${syntheticEvent.altKey}`);
    
    // Send the synthetic event to the existing handleKeyPress function
    if (gameActive && !gamePaused) {
        // Display the MIDI note visually in the feedback area for a moment
        const originalFeedback = feedbackArea.textContent;
        const originalClass = feedbackArea.className;
        
        // Show a visual indicator that a MIDI key was pressed
        feedbackArea.textContent = `MIDI: ${noteName}`;
        feedbackArea.className = 'intermediate';
        
        // Process the note through the existing game logic
        setTimeout(() => {
            // Only reset the feedback if it hasn't been changed by the game logic
            if (feedbackArea.textContent === `MIDI: ${noteName}`) {
                feedbackArea.textContent = originalFeedback;
                feedbackArea.className = originalClass;
            }
            
            // Call the existing handler
            handleKeyPress(syntheticEvent);
        }, 200);
    }
}

// Function to handle mobile orientation changes
function handleOrientationChange() {
    const isMobile = window.matchMedia("(max-width: 812px)").matches;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const mobileKeyboard = document.getElementById('mobile-keyboard-container');
    
    if (isMobile) {
        if (isLandscape) {
            // Landscape mode on mobile - proper game layout
            document.body.classList.remove('portrait-mode');
            
            // Make sure game container is using flexbox for ordering
            if (gameContainer) {
                gameContainer.style.display = 'flex';
                gameContainer.style.flexDirection = 'column';
            }
            
            // Set staff order
            const staffArea = document.getElementById('staff-area');
            if (staffArea) {
                staffArea.style.order = '0';
            }
            
            // Position timer above keyboard
            const timerContainer = document.getElementById('timer-container');
            if (timerContainer) {
                timerContainer.style.display = 'block';
                timerContainer.style.order = '1';
                timerContainer.style.width = '98%';
                timerContainer.style.margin = '0 auto 5px';
            }
            
            // Show keyboard if game is active
            if (mobileKeyboard && gameActive) {
                mobileKeyboard.style.display = 'block';
                mobileKeyboard.style.order = '2';
            }
            
            // Ensure controls are visible and properly placed
            const mainControls = document.getElementById('main-controls');
            if (mainControls) {
                mainControls.style.order = '3';
            }
            
            // Make sure the feedback area is properly positioned
            const feedbackArea = document.getElementById('feedback-area');
            if (feedbackArea) {
                feedbackArea.style.order = '4';
            }
            
            // Position interval buttons at the bottom
            const intervalButtons = document.getElementById('interval-buttons');
            if (intervalButtons) {
                intervalButtons.style.order = '5';
            }
            
            // Hide instructions to save space
            const instructions = document.querySelector('.instructions');
            if (instructions) {
                instructions.style.display = 'none';
            }
            
        } else {
            // Only show portrait mode message if game is active
            // This way setup can be done in portrait mode
            if (gameActive) {
                document.body.classList.add('portrait-mode');
            } else {
                document.body.classList.remove('portrait-mode');
            }
            
            // Hide keyboard in portrait
            if (mobileKeyboard) {
                mobileKeyboard.style.display = 'none';
            }
        }
    } else {
        // Desktop layout - reset flex ordering
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
        
        // Hide mobile keyboard on desktop
        if (mobileKeyboard) {
            mobileKeyboard.style.display = 'none';
        }
        
        // Show instructions on desktop
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.style.display = 'block';
        }
    }
}

// Call on page load and orientation change
window.addEventListener('load', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);
window.addEventListener('orientationchange', handleOrientationChange);

// --- Mobile Piano Keyboard Functionality ---
function initMobilePianoKeyboard() {
    const pianoKeys = document.querySelectorAll('.piano-key');
    
    // Handle touch events for mobile piano keys
    pianoKeys.forEach(key => {
        // Add touch start event
        key.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default touch behavior
            
            // Add visual feedback
            this.classList.add('active');
            
            // Get the note from data attribute
            const note = this.getAttribute('data-note');
            const enharmonic = this.getAttribute('data-enharmonic');
            
            if (note) {
                // Process the note input - handle the same way as keyboard input
                const noteName = note.charAt(0); // Get base note (C, D, E, etc.)
                const hasAccidental = note.includes('#') || note.includes('b');
                
                // Log for debugging
                console.log(`Mobile key pressed: ${note} (enharmonic: ${enharmonic})`);
                
                // Simulate keyboard input using the same logic
                handleNoteInput(noteName, hasAccidental, note, enharmonic);
            }
        });
        
        // Add touch end event to remove active state
        key.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.classList.remove('active');
        });
        
        // Also handle mouse events for testing on desktop
        key.addEventListener('mousedown', function(e) {
            // Add visual feedback
            this.classList.add('active');
            
            // Get the note from data attribute
            const note = this.getAttribute('data-note');
            const enharmonic = this.getAttribute('data-enharmonic');
            
            if (note) {
                const noteName = note.charAt(0); // Get base note (C, D, E, etc.)
                const hasAccidental = note.includes('#') || note.includes('b');
                
                // Log for debugging
                console.log(`Mobile key clicked: ${note} (enharmonic: ${enharmonic})`);
                
                // Simulate keyboard input
                handleNoteInput(noteName, hasAccidental, note, enharmonic);
            }
        });
        
        key.addEventListener('mouseup', function(e) {
            this.classList.remove('active');
        });
        
        // Handle mouse leave to prevent stuck keys
        key.addEventListener('mouseleave', function(e) {
            this.classList.remove('active');
        });
    });
    
    // Add event listener for the minor chord button
    const minorChordBtn = document.getElementById('minor-chord-btn');
    if (minorChordBtn) {
        // Add touch event for minor chord button
        minorChordBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('active');
            
            // Only process if we have a last input and we're in chords mode
            if (lastInput && gameMode === 'chords') {
                console.log(`Minor button pressed for last input: ${lastInput}`);
                checkChordAnswer(lastInput, true); // true means minor chord
            }
        });
        
        minorChordBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.classList.remove('active');
        });
        
        // Also handle mouse events for testing
        minorChordBtn.addEventListener('mousedown', function(e) {
            this.classList.add('active');
            
            // Only process if we have a last input and we're in chords mode
            if (lastInput && gameMode === 'chords') {
                console.log(`Minor button clicked for last input: ${lastInput}`);
                checkChordAnswer(lastInput, true); // true means minor chord
            }
        });
        
        minorChordBtn.addEventListener('mouseup', function(e) {
            this.classList.remove('active');
        });
        
        minorChordBtn.addEventListener('mouseleave', function(e) {
            this.classList.remove('active');
        });
    }
}

// Extract the note input logic to a separate function for reuse
function handleNoteInput(noteName, hasAccidental, fullNote = null, enharmonic = null) {
    if (!gameActive || gamePaused) return;
    
    // Only process in notes mode or chords mode
    if (gameMode === 'notes' || gameMode === 'chords') {
        // Convert to uppercase for consistency
        noteName = noteName.toUpperCase();
        
        // Check if this is a valid note input (A through G)
        if (/^[A-G]$/.test(noteName)) {
            if (gameMode === 'notes') {
                // For notes mode, check if the input matches the current note
                checkNoteAnswer(noteName, hasAccidental, fullNote, enharmonic);
            } else if (gameMode === 'chords') {
                // For chords mode, check if the input matches the chord root
                checkChordAnswer(noteName, false, fullNote, enharmonic); // false means not minor
            }
        }
    }
}

// Refactor the keyboard event handler to use the common handleNoteInput function
function handleKeyboardInput(event) {
    if (!gameActive || gamePaused) return;
    
    const key = event.key;
    
    // Handle ESC key for pause functionality
    if (key === 'Escape') {
        togglePause();
        return;
    }
    
    // Only process if we're in a relevant game mode
    if (gameMode === 'notes' || gameMode === 'chords') {
        // Check for note input (A-G)
        if (/^[a-gA-G]$/.test(key)) {
            const hasAccidental = event.shiftKey || event.altKey;
            // For keyboard, we don't have full note/enharmonic info
            handleNoteInput(key, hasAccidental, null, null);
        }
        // Special case for minor chord input
        else if (gameMode === 'chords' && key.toLowerCase() === 'm') {
            if (lastInput && /^[A-G]$/.test(lastInput.toUpperCase())) {
                checkChordAnswer(lastInput, true, null, null); // true means minor
            }
        }
    }
}

// Initialize the mobile keyboard when the page loads
window.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    
    // Initialize the mobile piano keyboard
    initMobilePianoKeyboard();
});

// Handle keyboard input for notes and chords
function checkNoteAnswer(noteName, hasAccidental, fullNote = null, enharmonic = null) {
    if (!currentItem || currentItem.type !== 'note') return;

    // Store the last input for potential chord quality input
    lastInput = noteName;
    
    // Get expected note information
    const expectedValueString = currentItem.value;
    const expectedNoteLetter = expectedValueString.charAt(0).toLowerCase();
    const requiresAccidental = expectedValueString.includes('#') || expectedValueString.includes('b');
    
    // Normalize the user input
    noteName = noteName.toLowerCase();
    
    // First, check if the full note and enharmonic matched directly
    if (fullNote) {
        // Remove octave suffix for comparison
        const inputWithoutOctave = fullNote.replace(/\d+$/, '');
        const enharmonicWithoutOctave = enharmonic ? enharmonic.replace(/\d+$/, '') : '';
        
        console.log(`Checking note: ${inputWithoutOctave} (or ${enharmonicWithoutOctave}) against expected: ${expectedValueString}`);
        console.log(`Enharmonic map: ${JSON.stringify(enharmonicMap)}`);
        console.log(`Reverse enharmonic map: ${JSON.stringify(reverseEnharmonicMap)}`);
        
        // Check for direct match with full note (including enharmonic)
        if (inputWithoutOctave === expectedValueString || 
            (enharmonicWithoutOctave && enharmonicWithoutOctave === expectedValueString)) {
            console.log("Direct match found!");
            correctAnswer({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
            return;
        }
        
        // Check for enharmonic equivalence map matches
        const matchesAsEnharmonic = enharmonicMap[inputWithoutOctave] === expectedValueString;
        const matchesAsReverse = reverseEnharmonicMap[inputWithoutOctave] === expectedValueString;
        const enharmonicMatchesAsEnharmonic = enharmonicWithoutOctave && enharmonicMap[enharmonicWithoutOctave] === expectedValueString;
        const enharmonicMatchesAsReverse = enharmonicWithoutOctave && reverseEnharmonicMap[enharmonicWithoutOctave] === expectedValueString;
        
        console.log(`Checking enharmonic equivalents: 
            - Input as enharmonic: ${matchesAsEnharmonic}
            - Input as reverse: ${matchesAsReverse}
            - Enharmonic as enharmonic: ${enharmonicMatchesAsEnharmonic}
            - Enharmonic as reverse: ${enharmonicMatchesAsReverse}`);
        
        if (matchesAsEnharmonic || matchesAsReverse || enharmonicMatchesAsEnharmonic || enharmonicMatchesAsReverse) {
            console.log("Enharmonic match found!");
            correctAnswer({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
            return;
        }
    }
    
    // Standard note checking logic for keyboard input
    // Compare the input with expected value
    const letterMatch = (noteName === expectedNoteLetter);
    const accidentalMatch = (hasAccidental === requiresAccidental);
    const userInputCorrect = letterMatch && accidentalMatch;
    
    // Get coordinates from the staff for the animation
    const staffRect = staffArea.getBoundingClientRect();
    const centerX = staffRect.left + (staffRect.width / 2);
    let centerY;
    
    // Adjust Y based on clef
    if (currentItem.clef === 'treble') {
        centerY = staffRect.top + (staffRect.height * 0.3); 
    } else if (currentItem.clef === 'bass') {
        centerY = staffRect.top + (staffRect.height * 0.7);
    } else {
        centerY = staffRect.top + (staffRect.height / 2);
    }
    
    // Provide feedback based on the result
    if (userInputCorrect) {
        correctAnswer({ clientX: centerX, clientY: centerY });
    } else if (letterMatch) {
        // Letter was right, but accidental was wrong
        incorrectAnswer(`Incorrect. Use ${requiresAccidental ? 'accidental' : 'natural'} on note '${expectedValueString}'.`);
    } else {
        // Letter was wrong
        incorrectAnswer(`Incorrect. Expected note '${expectedValueString}'.`);
    }
}

// Handle chord answers
function checkChordAnswer(rootNote, isMinor, fullNote = null, enharmonic = null) {
    if (!currentItem || currentItem.type !== 'chord') return;
    
    // Store the last input for potential chord quality input
    lastInput = rootNote;
    
    // Get expected chord information
    const expectedRoot = currentItem.value.root;
    const expectedIsMinor = currentItem.value.quality === 'minor';
    const expectedRootLetter = expectedRoot.charAt(0).toLowerCase();
    const requiresAccidental = expectedRoot.includes('#') || expectedRoot.includes('b');
    
    // Normalize the user input
    rootNote = rootNote.toLowerCase();
    
    // Simplified hasAccidental check for mobile and keyboard input
    const hasAccidental = fullNote ? 
                          fullNote.includes('#') || fullNote.includes('b') : 
                          false;
    
    // Log for debugging
    console.log(`Checking chord root: ${rootNote}/${fullNote} against expected: ${expectedRoot}`);
    console.log(`Is minor chord: ${expectedIsMinor}, User indicated minor: ${isMinor}`);
    
    // Special handling for mobile keyboard with full note info
    if (fullNote) {
        // Remove octave suffix for comparison
        const inputWithoutOctave = fullNote.replace(/\d+$/, '');
        const enharmonicWithoutOctave = enharmonic ? enharmonic.replace(/\d+$/, '') : '';
        
        // Direct match checks (case insensitive for root letter)
        const rootMatches = 
            // Direct match
            inputWithoutOctave.toLowerCase() === expectedRoot.toLowerCase() ||
            // Enharmonic match
            (enharmonicWithoutOctave && enharmonicWithoutOctave.toLowerCase() === expectedRoot.toLowerCase()) ||
            // Match through enharmonic maps
            (enharmonicMap[inputWithoutOctave] === expectedRoot) ||
            (reverseEnharmonicMap[inputWithoutOctave] === expectedRoot) ||
            (enharmonicWithoutOctave && enharmonicMap[enharmonicWithoutOctave] === expectedRoot) ||
            (enharmonicWithoutOctave && reverseEnharmonicMap[enharmonicWithoutOctave] === expectedRoot) ||
            // Match just the root letter (for cases where the user is only required to identify the root)
            (inputWithoutOctave.charAt(0).toLowerCase() === expectedRoot.charAt(0).toLowerCase() && 
             (requiresAccidental === hasAccidental || !requiresAccidental));
        
        console.log(`Root matches: ${rootMatches}`);
        
        // If just checking the root (not the minor/major quality)
        if (rootMatches) {
            if (!expectedIsMinor && !isMinor) {
                // Major chord - correct
                correctAnswer({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                return;
            } else if (expectedIsMinor && isMinor) {
                // Minor chord with minor button pressed - correct
                correctAnswer({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                return;
            } else if (expectedIsMinor && !isMinor) {
                // Minor chord needs the 'm' key press
                feedbackArea.textContent = "Press 'm' key or 'minor' button for minor chord";
                feedbackArea.className = 'intermediate';
                return;
            } else {
                // They pressed 'm' but it's a major chord
                incorrectAnswer(`Incorrect. ${expectedRoot} is a major chord.`);
                return;
            }
        }
    }
    
    // Get coordinates from the staff for the animation
    const staffRect = staffArea.getBoundingClientRect();
    const centerX = staffRect.left + (staffRect.width / 2);
    
    // Adjust Y based on chord placement
    let centerY;
    if (currentItem.placement === 'treble') {
        centerY = staffRect.top + (staffRect.height * 0.3);
    } else if (currentItem.placement === 'bass') {
        centerY = staffRect.top + (staffRect.height * 0.7);
    } else {
        centerY = staffRect.top + (staffRect.height / 2);
    }
    
    // Standard keyboard input handling logic
    // Compare the input letter with expected root letter
    const letterMatch = (rootNote === expectedRootLetter);
    
    // If the root letter matches and we're not checking minor quality
    if (letterMatch && !isMinor && !expectedIsMinor) {
        // For major chords with matching root letter, we're correct
        correctAnswer({ clientX: centerX, clientY: centerY });
    } 
    // If the root letter matches, and both are minor
    else if (letterMatch && isMinor && expectedIsMinor) {
        // For minor chords with matching root letter, we're correct
        correctAnswer({ clientX: centerX, clientY: centerY });
    }
    // If letter matches but we need to press minor
    else if (letterMatch && !isMinor && expectedIsMinor) {
        feedbackArea.textContent = `Press 'm' key or 'minor' button for minor chord`;
        feedbackArea.className = 'intermediate';
    }
    // If letter matches but it's major and they pressed minor
    else if (letterMatch && isMinor && !expectedIsMinor) {
        incorrectAnswer(`Incorrect. ${expectedRoot} is a major chord.`);
    }
    // If letter doesn't match at all
    else {
        incorrectAnswer(`Incorrect. Expected root note '${expectedRoot}'.`);
    }
}

// Variable to store the last note input (used for chord quality input)
let lastInput = null;
