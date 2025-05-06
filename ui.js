function updateThemeIconUI(theme) {
    if (theme === 'dark') {
        DOM.iconSun.classList.remove('hidden');
        DOM.iconMoon.classList.add('hidden');
    } else {
        DOM.iconSun.classList.add('hidden');
        DOM.iconMoon.classList.remove('hidden');
    }
}

function populateBereicheUI(bereiche) {
    DOM.bereichSelect.innerHTML = '<option value="alle">Alle Bereiche</option>'; 
    bereiche.forEach(bereich => {
        const option = document.createElement('option');
        option.value = bereich;
        option.textContent = bereich;
        DOM.bereichSelect.appendChild(option);
    });
}

function updateSegmentedProgressBarUI(questionsInScope) {
    DOM.segmentedProgressBar.innerHTML = ''; 
    if (!questionsInScope || questionsInScope.length === 0) {
        DOM.segmentedProgressBar.style.display = 'none'; // Balken verstecken, wenn keine Fragen
        return;
    }
    DOM.segmentedProgressBar.style.display = 'flex'; // Sicherstellen, dass Balken sichtbar ist

    questionsInScope.forEach(q => {
        const segment = document.createElement('div');
        segment.classList.add('progress-segment');
        
        if (q[STREAK_KEY] >= MAX_CORRECT_STREAK) {
            segment.classList.add('status-mastered');
        } else if (q[STATUS_KEY] === 'richtig') {
            segment.classList.add('status-correct');
        } else if (q[STATUS_KEY] === 'wiederholen') {
            segment.classList.add('status-repeat');
        } 
        
        segment.title = `ID: ${q.id} - Status: ${q[STATUS_KEY]}, Streak: ${q[STREAK_KEY]}`; 
        DOM.segmentedProgressBar.appendChild(segment);
    });
}


function updateProgressDisplayUI(stats, bereichNameText, questionsInScope) {
    DOM.currentBereichNameElem.textContent = bereichNameText;
    DOM.learnedCountElem.textContent = stats.gelernt;
    DOM.gemeistertCountElem.textContent = stats.gemeistert;
    DOM.bereichTotalCountElem.textContent = stats.total;

    updateSegmentedProgressBarUI(questionsInScope);
    
    if (stats.total > 0 && stats.gemeistert === stats.total) {
        DOM.startLearningBtn.textContent = "Alle gemeistert! 🎉";
        DOM.startLearningBtn.disabled = true;
    } else if (stats.total === 0 && DOM.bereichSelect.value !== 'alle') {
        DOM.startLearningBtn.textContent = "Keine Fragen";
        DOM.startLearningBtn.disabled = true;
        DOM.progressInfoElem.classList.add('hidden');
        DOM.segmentedProgressBar.style.display = 'none';
    } else {
        DOM.startLearningBtn.textContent = "Lernen starten";
        DOM.startLearningBtn.disabled = false;
        DOM.progressInfoElem.classList.remove('hidden');
        DOM.segmentedProgressBar.style.display = 'flex';
    }
}


function showLernsessionUI() {
    DOM.mainMenuSection.classList.add('hidden');
    DOM.flashcardSection.classList.remove('hidden');
}

function showMainMenuUI() {
    DOM.mainMenuSection.classList.remove('hidden');
    DOM.flashcardSection.classList.add('hidden');
}

function displayCardUI(cardData, currentIndex, sessionLength) {
    if (!cardData) return;

    DOM.questionBereichTitleElem.textContent = `Bereich: ${cardData.bereich}`;
    DOM.questionTextElem.innerHTML = cardData.frage;
    DOM.answerTextElem.innerHTML = cardData.antwort;
    DOM.qIdDisplayElem.textContent = `ID: ${cardData.id}`;
    
    DOM.flashcardElement.classList.remove('answer-visible'); 
    DOM.flashcardElement.classList.remove('feedback-correct', 'feedback-repeat');

    DOM.markControlsElem.classList.add('hidden');
    DOM.showAnswerBtn.classList.remove('hidden');
    DOM.showAnswerBtn.textContent = 'Antwort zeigen';

    DOM.currentQNumberElem.textContent = currentIndex + 1;
    DOM.totalQNumberElem.textContent = sessionLength;
}

function toggleAnswerVisibilityUI() {
    DOM.flashcardElement.classList.toggle('answer-visible');
    
    if (DOM.flashcardElement.classList.contains('answer-visible')) {
        DOM.showAnswerBtn.classList.add('hidden');
        DOM.markControlsElem.classList.remove('hidden');
    } else {
        DOM.showAnswerBtn.classList.remove('hidden');
        DOM.markControlsElem.classList.add('hidden');
    }
}

function showFeedbackOnCardUI(feedbackType) {
    if (feedbackType === 'correct') {
        DOM.flashcardElement.classList.add('feedback-correct');
    } else if (feedbackType === 'repeat') {
        DOM.flashcardElement.classList.add('feedback-repeat');
    }
}

function removeFeedbackFromCardUI() {
    DOM.flashcardElement.classList.remove('feedback-correct', 'feedback-repeat');
}

function showAlertUI(message) {
    alert(message);
}

function confirmActionUI(message) {
    return confirm(message);
}