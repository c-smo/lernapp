document.addEventListener('DOMContentLoaded', () => {
    
    function initializeApp() {
        const storedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeIconUI(storedTheme);

        if (!initState(questionsData)) {
            showAlertUI("Fehler: Lerndaten konnten nicht initialisiert werden.");
            DOM.startLearningBtn.disabled = true;
            DOM.resetProgressBtn.disabled = true;
            return;
        }
        
        populateBereicheUI(getBereiche());
        handleProgressDisplayUpdate(); 
        setupEventListeners();
    }

    function setupEventListeners() {
        DOM.themeToggleBtn.addEventListener('click', handleThemeToggle);
        DOM.bereichSelect.addEventListener('change', handleProgressDisplayUpdate);
        DOM.startLearningBtn.addEventListener('click', handleStartLearning);
        DOM.resetProgressBtn.addEventListener('click', handleResetProgress);
        DOM.showAnswerBtn.addEventListener('click', handleShowAnswer);
        DOM.markCorrectBtn.addEventListener('click', () => handleProcessAnswer('richtig'));
        DOM.markRepeatBtn.addEventListener('click', () => handleProcessAnswer('wiederholen'));
        DOM.backToMenuBtn.addEventListener('click', handleShowMainMenu);
    }

    function handleThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIconUI(newTheme);
    }

    function handleProgressDisplayUpdate() {
        const selectedBereich = DOM.bereichSelect.value;
        const questionsInScope = getQuestionsInScope(selectedBereich);
        const stats = calculateProgressStats(selectedBereich);
        const bereichNameText = selectedBereich === 'alle' ? "Alle Bereiche" : `"${DOM.bereichSelect.options[DOM.bereichSelect.selectedIndex].text}"`;
        updateProgressDisplayUI(stats, bereichNameText, questionsInScope); 
    }

    function handleStartLearning() {
        if (prepareLernSession(DOM.bereichSelect.value)) {
            showLernsessionUI();
            loadNextCardUI();
        } else {
            showAlertUI("Super! Alle Fragen in diesem Bereich sind bereits gemeistert oder es sind keine Fragen vorhanden.");
            handleProgressDisplayUpdate(); 
        }
    }

    function handleResetProgress() {
        const selectedBereich = DOM.bereichSelect.value;
        const bereichText = selectedBereich === 'alle' ? "allen Bereichen" : `dem Bereich "${DOM.bereichSelect.options[DOM.bereichSelect.selectedIndex].text}"`;
        if (confirmActionUI(`Möchtest du den Lernfortschritt für ${bereichText} wirklich zurücksetzen?`)) {
            resetProgressInScope(selectedBereich);
            handleProgressDisplayUpdate();
            showAlertUI("Lernfortschritt wurde zurückgesetzt.");
        }
    }

    function handleShowAnswer() {
        toggleAnswerVisibilityUI();
    }

    function handleProcessAnswer(marking) {
        const feedbackType = processAnswerAndUpdateState(marking);
        if (feedbackType) {
            showFeedbackOnCardUI(feedbackType);
        }

        setTimeout(() => {
            removeFeedbackFromCardUI();
            if (!moveToNextCard()) { 
                showAlertUI("Super! Alle Karten für diese Runde durchgearbeitet.");
                handleShowMainMenu();
            } else {
                loadNextCardUI();
            }
        }, 700);
    }
    
    function loadNextCardUI() {
        const card = getCurrentCard();
        if (card) {
            displayCardUI(card, getCurrentCardIndex(), getCurrentSessionLength());
        } else {
            showAlertUI("Keine weiteren Karten in dieser Session.");
            handleShowMainMenu();
        }
    }

    function handleShowMainMenu() {
        showMainMenuUI();
        handleProgressDisplayUpdate();
    }

    initializeApp();
});