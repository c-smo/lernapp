// state.js
const MAX_CORRECT_STREAK = 3;
const LS_PREFIX = 'fachpruefung_app_v4_'; // Prefix für localStorage, ggf. Version erhöhen bei Strukturänderungen
const STATUS_KEY = 'lernStatus';
const STREAK_KEY = 'correctStreak';

let allQuestionsData = [];
let currentLernSessionQs = [];
let currentCardIdx = 0;

function initState(questions) {
    if (!questions || questions.length === 0) {
        console.error("Keine Fragen zum Initialisieren des Zustands vorhanden.");
        return false;
    }
    allQuestionsData = questions.map(q => {
        const savedProgress = loadQuestionProgressFromLS(q.id);
        return { 
            ...q, 
            [STATUS_KEY]: savedProgress[STATUS_KEY] || 'neutral',
            [STREAK_KEY]: savedProgress[STREAK_KEY] || 0
        };
    });
    return true;
}

function getBereiche() {
    return [...new Set(allQuestionsData.map(q => q.bereich))].sort();
}

function getQuestionsInScope(bereichValue) {
    if (bereichValue === 'alle') {
        return [...allQuestionsData];
    }
    return allQuestionsData.filter(q => q.bereich === bereichValue);
}

function saveQuestionProgressToLS(questionId, status, streak) {
    try {
        localStorage.setItem(LS_PREFIX + questionId, JSON.stringify({ [STATUS_KEY]: status, [STREAK_KEY]: streak }));
    } catch (e) {
        console.warn("localStorage nicht verfügbar oder voll.", e);
    }
}

function loadQuestionProgressFromLS(questionId) {
    try {
        const savedData = localStorage.getItem(LS_PREFIX + questionId);
        return savedData ? JSON.parse(savedData) : { [STATUS_KEY]: 'neutral', [STREAK_KEY]: 0 };
    } catch (e) {
        console.warn("Fehler beim Laden des Fortschritts für Frage " + questionId, e);
        return { [STATUS_KEY]: 'neutral', [STREAK_KEY]: 0 };
    }
}

function resetProgressInScope(bereichValue) {
    const questionsToReset = getQuestionsInScope(bereichValue);
    questionsToReset.forEach(qInScope => {
        const originalQuestion = allQuestionsData.find(origQ => origQ.id === qInScope.id);
        if (originalQuestion) {
            originalQuestion[STATUS_KEY] = 'neutral';
            originalQuestion[STREAK_KEY] = 0;
            saveQuestionProgressToLS(originalQuestion.id, 'neutral', 0);
        }
    });
}

function calculateProgressStats(bereichValue) {
    const questionsInScope = getQuestionsInScope(bereichValue);
    const total = questionsInScope.length;
    let gemeistert = 0;
    let gelernt = 0; // Inkludiert gemeistert und 1-2x richtig

    questionsInScope.forEach(q => {
        if (q[STREAK_KEY] >= MAX_CORRECT_STREAK) {
            gemeistert++;
            gelernt++; 
        } else if (q[STATUS_KEY] === 'richtig') {
            gelernt++;
        }
    });
    return { total, gemeistert, gelernt };
}

function prepareLernSession(bereichValue) {
    let questionsForSession = getQuestionsInScope(bereichValue)
                              .filter(q => q[STREAK_KEY] < MAX_CORRECT_STREAK);

    if (questionsForSession.length === 0) {
        currentLernSessionQs = [];
        currentCardIdx = 0;
        return false; // Keine Fragen zum Lernen
    }
    
    questionsForSession.sort((a, b) => {
        const statusOrder = { 'wiederholen': 0, 'neutral': 1, 'richtig': 2 };
        const statusA = statusOrder[a[STATUS_KEY]] || 1;
        const statusB = statusOrder[b[STATUS_KEY]] || 1;
        if (statusA !== statusB) return statusA - statusB;
        if (a[STATUS_KEY] === 'richtig' && b[STATUS_KEY] === 'richtig') {
            return (a[STREAK_KEY] || 0) - (b[STREAK_KEY] || 0);
        }
        return a.id - b.id;
    });
    
    currentLernSessionQs = questionsForSession;
    currentCardIdx = 0;
    return true; // Session vorbereitet
}

function getCurrentCard() {
    if (currentLernSessionQs.length === 0 || currentCardIdx >= currentLernSessionQs.length) {
        return null;
    }
    return currentLernSessionQs[currentCardIdx];
}

function processAnswerAndUpdateState(userMarking) {
    const currentQuestion = getCurrentCard();
    if (!currentQuestion) return false;

    const originalQuestion = allQuestionsData.find(q => q.id === currentQuestion.id);
    if (!originalQuestion) return false;

    let feedbackType = '';
    if (userMarking === 'richtig') {
        originalQuestion[STREAK_KEY] = (originalQuestion[STREAK_KEY] || 0) + 1;
        originalQuestion[STATUS_KEY] = 'richtig'; 
        feedbackType = 'correct';
    } else if (userMarking === 'wiederholen') {
        originalQuestion[STREAK_KEY] = 0;
        originalQuestion[STATUS_KEY] = 'wiederholen';
        feedbackType = 'repeat';
    }
    
    saveQuestionProgressToLS(originalQuestion.id, originalQuestion[STATUS_KEY], originalQuestion[STREAK_KEY]);
    return feedbackType;
}

function moveToNextCard() {
    currentCardIdx++;
    return getCurrentCard() !== null; // True, wenn es eine nächste Karte gibt
}

function getCurrentSessionLength() {
    return currentLernSessionQs.length;
}

function getCurrentCardIndex() {
    return currentCardIdx;
}