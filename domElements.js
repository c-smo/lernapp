const DOM = {
    mainMenuSection: document.getElementById('main-menu-section'),
    bereichSelect: document.getElementById('bereich-select'),
    startLearningBtn: document.getElementById('start-learning-btn'),
    resetProgressBtn: document.getElementById('reset-progress-btn'),
    
    flashcardSection: document.getElementById('flashcard-section'),
    flashcardElement: document.getElementById('flashcard'),
    questionTextElem: document.getElementById('question-text'),
    answerTextElem: document.getElementById('answer-text'),
    showAnswerBtn: document.getElementById('show-answer-btn'),
    markControlsElem: document.getElementById('mark-controls'),
    markCorrectBtn: document.getElementById('mark-correct-btn'),
    markRepeatBtn: document.getElementById('mark-repeat-btn'),
    backToMenuBtn: document.querySelector('#flashcard-section .back-to-menu-btn'),
    currentQNumberElem: document.getElementById('current-q-number'),
    totalQNumberElem: document.getElementById('total-q-number'),
    qIdDisplayElem: document.getElementById('q-id-display'),
    questionBereichTitleElem: document.getElementById('question-bereich-title'),

    progressInfoElem: document.getElementById('progress-info'),
    currentBereichNameElem: document.getElementById('current-bereich-name'),
    segmentedProgressBar: document.getElementById('segmented-progress-bar'),
    learnedCountElem: document.getElementById('learned-count'),
    gemeistertCountElem: document.getElementById('gemeistert-count'),
    bereichTotalCountElem: document.getElementById('bereich-total-count'),

    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    iconSun: document.querySelector('#theme-toggle-btn .icon-sun'),
    iconMoon: document.querySelector('#theme-toggle-btn .icon-moon')
};