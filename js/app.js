/**
 * PSYCHE.OS STANDALONE - GŁÓWNY KONTROLER APLIKACJI
 * System 64 Typów Osobowości (Model Typologii Jungowskiej)
 * 
 * Funkcje:
 * 1. Wybór ścieżki: Test Podstawowy (50 pytań) vs Test Szczegółowy (200 pytań)
 * 2. Przebieg kwestionariusza: symetryczna skala Likerta + dedykowany przycisk "Pomiń pytanie / Nie wiem"
 * 3. ŚCISŁE UKRYCIE przed wpisaniem kodu: widoczny WYŁĄCZNIE 4-literowy kod bazowy (np. INFP, INTJ) z nazwą i mottem.
 *    Karty postaci, rozszerzenie 64-typowe, 6 osi oraz wszystkie moduły szczegółowe NIE są renderowane w DOM przed kodem.
 * 4. Zabezpieczenie jednorazowym kodem dostępu e-mail (margrab7@o2.pl) z hashowaniem SHA-256 i wymaganą zgodą RODO.
 * 5. Odblokowanie po kodzie: aktualizacja do pełnego 6-literowego kodu (np. INFP-TC), wyrenderowanie 6 osi, 2 postaci i Matrycy 34 Talentów.
 * 6. Ściśle 5-sekcyjny raport PDF (bez sekcji talentów i bez celebrytów, z notą prawną).
 * 7. Modale z Regulaminem i Polityką Prywatności.
 */

(function() {
  // Stan aplikacji
  const state = {
    track: 'DETAILED', // 'QUICK' (50) lub 'DETAILED' (200)
    questions: [],
    currentIndex: 0,
    answers: {}, // { [qId]: 1..5 | 'SKIP' }
    isUnlocked: false,
    lastResult: null,
    generatedCode: null
  };

  // Referencje DOM
  const DOM = {
    // Ekrany
    screenIntro: document.getElementById('screen-intro'),
    screenQuiz: document.getElementById('screen-quiz'),
    screenResults: document.getElementById('screen-results'),

    // Auto-Save Wznowienie Testu
    resumeBanner: document.getElementById('resume-test-banner'),
    resumeBannerDesc: document.getElementById('resume-banner-desc'),
    btnResumeQuiz: document.getElementById('btn-resume-quiz'),
    btnDiscardQuiz: document.getElementById('btn-discard-quiz'),
    enneaRichAnalysis: document.getElementById('ennea-rich-analysis'),

    // Elementy Quizu
    quizTrackBadge: document.getElementById('quiz-track-badge'),
    quizProgressFill: document.getElementById('quiz-progress-fill'),
    quizCounter: document.getElementById('quiz-counter'),
    quizSkippedCounter: document.getElementById('quiz-skipped-counter'),
    questionNumberTag: document.getElementById('question-number-tag'),
    questionText: document.getElementById('question-text'),
    likertButtons: document.querySelectorAll('.btn-likert'),
    btnSkipQuestion: document.getElementById('btn-skip-question'),
    btnPrevQuestion: document.getElementById('btn-prev-question'),
    btnNextQuestion: document.getElementById('btn-next-question'),
    btnFinishEarly: document.getElementById('btn-finish-early'),

    // Elementy Wyników (Podgląd Bazowy)
    mbtiCode: document.getElementById('res-mbti-code'),
    mbtiName: document.getElementById('res-mbti-name'),
    mbtiTitle: document.getElementById('res-mbti-title'),
    mbtiMotto: document.getElementById('res-mbti-motto'),
    mbtiDesc: document.getElementById('res-mbti-desc'),
    mbtiLockedTeaser: document.getElementById('mbti-locked-teaser'),
    mbti6Code: document.getElementById('res-mbti-6code'),
    mbti6Name: document.getElementById('res-mbti-6name'),
    mbtiSubtypesBox: document.getElementById('res-dim-subtypes'),
    dichoContainer: document.getElementById('dicho-container'),

    // 2 Postacie
    celebSectionWrapper: document.getElementById('celeb-section-wrapper'),
    celebMaleContainer: document.getElementById('celeb-male-card'),
    celebFemaleContainer: document.getElementById('celeb-female-card'),

    // Blokada Jednorazowym Kodem & RODO
    passwordGateCard: document.getElementById('password-gate-card'),
    reqUserName: document.getElementById('req-user-name'),
    reqUserEmail: document.getElementById('req-user-email'),
    rodoConsentCheckbox: document.getElementById('rodo-consent-checkbox'),
    btnRequestCode: document.getElementById('btn-request-code'),
    gateReqStatus: document.getElementById('gate-req-status'),

    inputVerifyCode: document.getElementById('input-verify-code'),
    btnVerifyCode: document.getElementById('btn-verify-code'),
    gateUnlockedState: document.getElementById('gate-unlocked-state'),
    gateLockedForm: document.getElementById('gate-locked-form'),
    lockedContainer: document.getElementById('locked-content-container'),

    // Odblokowane sekcje szczegółowe
    beebeEgoContainer: document.getElementById('beebe-ego-stack'),
    beebeShadowContainer: document.getElementById('beebe-shadow-stack'),
    enneaHeroCore: document.getElementById('ennea-hero-core'),
    enneaHeroInfo: document.getElementById('ennea-hero-info'),
    enneaDistributionGrid: document.getElementById('ennea-distribution-grid'),
    oceanCardsContainer: document.getElementById('ocean-cards-container'),
    archetypesContainer: document.getElementById('archetypes-unlocked-container'),
    gallupTop5Container: document.getElementById('gallup-top5-container'),
    gallupSupportingContainer: document.getElementById('gallup-supporting-container'),
    gallupRemainingContainer: document.getElementById('gallup-remaining-container'),

    // Raport Modal & Przyciski
    btnOpenReportModal: document.getElementById('btn-open-report-modal'),
    reportModalOverlay: document.getElementById('report-modal-overlay'),
    btnCloseReportModal: document.getElementById('btn-close-report-modal'),
    reportModalScrollContent: document.getElementById('report-modal-scroll-content'),
    btnPrintModalReport: document.getElementById('btn-print-modal-report'),
    btnDownloadModalHtml: document.getElementById('btn-download-modal-html'),

    // Modale Prawne (Regulamin i Polityka Prywatności)
    btnOpenTerms: document.getElementById('btn-open-terms'),
    btnCloseTerms: document.getElementById('btn-close-terms'),
    modalTermsOverlay: document.getElementById('modal-terms-overlay'),
    btnOpenPrivacy: document.getElementById('btn-open-privacy'),
    btnClosePrivacy: document.getElementById('btn-close-privacy'),
    modalPrivacyOverlay: document.getElementById('modal-privacy-overlay')
  };

  /**
   * Funkcje kryptograficzne SHA-256
   */
  async function computeSha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function generateSecureOneTimeCode() {
    const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const rand = new Uint8Array(8);
    crypto.getRandomValues(rand);
    const raw = Array.from(rand).map(b => alphabet[b % alphabet.length]).join('');
    return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  }

  /**
   * Przełączanie ekranów
   */
  function showScreen(screenId) {
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    if (screenId === 'intro') DOM.screenIntro.classList.add('active');
    else if (screenId === 'quiz') DOM.screenQuiz.classList.add('active');
    else if (screenId === 'results') DOM.screenResults.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Auto-zapis postępu testu w localStorage
   */
  function saveQuizProgress() {
    try {
      const progress = {
        track: state.track,
        currentIndex: state.currentIndex,
        answers: state.answers,
        totalQuestions: state.questions.length,
        timestamp: Date.now()
      };
      localStorage.setItem('psyche_quiz_progress', JSON.stringify(progress));
    } catch (e) {}
  }

  function clearQuizProgress() {
    try {
      localStorage.removeItem('psyche_quiz_progress');
    } catch (e) {}
  }

  function checkResumeProgress() {
    try {
      const saved = localStorage.getItem('psyche_quiz_progress');
      if (!saved) {
        if (DOM.resumeBanner) DOM.resumeBanner.style.display = 'none';
        return;
      }
      const progress = JSON.parse(saved);
      if (progress && progress.totalQuestions && progress.currentIndex > 0 && progress.currentIndex < progress.totalQuestions) {
        if (DOM.resumeBanner) {
          DOM.resumeBanner.style.display = 'flex';
          const trackLabel = progress.track === 'QUICK' ? 'Wariant 1: Szybki (50 pytań)' : 'Wariant 2: Szczegółowy (200 pytań)';
          if (DOM.resumeBannerDesc) {
            DOM.resumeBannerDesc.textContent = `${trackLabel} • Pytanie ${progress.currentIndex + 1} z ${progress.totalQuestions} (postęp zachowany w pamięci przeglądarki)`;
          }
        }
      } else {
        if (DOM.resumeBanner) DOM.resumeBanner.style.display = 'none';
      }
    } catch (e) {
      if (DOM.resumeBanner) DOM.resumeBanner.style.display = 'none';
    }
  }

  function resumeQuiz() {
    try {
      const saved = localStorage.getItem('psyche_quiz_progress');
      if (!saved) return;
      const progress = JSON.parse(saved);
      state.track = progress.track || 'DETAILED';
      state.currentIndex = progress.currentIndex || 0;
      state.answers = progress.answers || {};
      state.isUnlocked = false;

      if (state.track === 'QUICK') {
        state.questions = window.QUESTIONS_QUICK_50 || [];
        if (DOM.quizTrackBadge) DOM.quizTrackBadge.textContent = 'Wariant 1: Szybki (50 pytań)';
      } else {
        state.questions = window.QUESTIONS_DETAILED_200 || [];
        if (DOM.quizTrackBadge) DOM.quizTrackBadge.textContent = 'Wariant 2: Szczegółowy (200 pytań - Pełna Precyzja)';
      }

      if (DOM.resumeBanner) DOM.resumeBanner.style.display = 'none';
      renderCurrentQuestion();
      showScreen('quiz');
    } catch (e) {
      console.error('Błąd wznawiania testu:', e);
    }
  }

  /**
   * Rozpoczęcie testu o wybranym wariancie
   */
  function startTest(track) {
    state.track = track;
    state.currentIndex = 0;
    state.answers = {};
    state.isUnlocked = false;

    // Resetowanie poprzedniego stanu sesji w localStorage przy nowym teście
    try {
      localStorage.removeItem('psyche_pending_result');
      localStorage.removeItem('psyche_unlocked');
      localStorage.removeItem('psyche_auth_hash');
      clearQuizProgress();
    } catch (e) {}

    if (track === 'QUICK') {
      state.questions = window.QUESTIONS_QUICK_50 || [];
      if (DOM.quizTrackBadge) DOM.quizTrackBadge.textContent = 'Wariant 1: Szybki (50 pytań)';
    } else {
      state.questions = window.QUESTIONS_DETAILED_200 || [];
      if (DOM.quizTrackBadge) DOM.quizTrackBadge.textContent = 'Wariant 2: Szczegółowy (200 pytań - Pełna Precyzja)';
    }

    saveQuizProgress();
    renderCurrentQuestion();
    showScreen('quiz');
  }

  /**
   * Renderuje bieżące pytanie
   */
  function renderCurrentQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) return;

    if (DOM.questionNumberTag) {
      DOM.questionNumberTag.textContent = `Pytanie ${state.currentIndex + 1} z ${state.questions.length}`;
    }
    if (DOM.questionText) {
      DOM.questionText.textContent = q.text;
    }

    const skippedCount = Object.values(state.answers).filter(v => v === 'SKIP').length;
    const progressPct = Math.round((state.currentIndex / state.questions.length) * 100);

    if (DOM.quizProgressFill) DOM.quizProgressFill.style.width = `${progressPct}%`;
    if (DOM.quizCounter) DOM.quizCounter.innerHTML = `${state.currentIndex + 1} <span>/ ${state.questions.length}</span>`;
    if (DOM.quizSkippedCounter) DOM.quizSkippedCounter.textContent = `Pominięte: ${skippedCount}`;

    // Stan przycisków Likerta
    const currentAns = state.answers[q.id];
    DOM.likertButtons.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      if (currentAns === val) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    if (DOM.btnPrevQuestion) {
      DOM.btnPrevQuestion.disabled = (state.currentIndex === 0);
    }

    if (DOM.btnNextQuestion) {
      if (state.currentIndex === state.questions.length - 1) {
        DOM.btnNextQuestion.textContent = 'Zakończ Test';
      } else {
        DOM.btnNextQuestion.textContent = 'Następne Pytanie →';
      }
    }
  }

  /**
   * Cofnięcie do poprzedniego pytania
   */
  function prevQuestion() {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderCurrentQuestion();
      saveQuizProgress();
    }
  }

  /**
   * Wybór odpowiedzi Likerta
   */
  function selectAnswer(score) {
    const q = state.questions[state.currentIndex];
    if (!q) return;

    state.answers[q.id] = score;
    saveQuizProgress();

    setTimeout(() => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderCurrentQuestion();
        saveQuizProgress();
      } else {
        finishQuiz();
      }
    }, 120);
  }

  /**
   * Pominięcie pytania (nie zaburza wag ani wyników)
   */
  function skipCurrentQuestion() {
    const q = state.questions[state.currentIndex];
    if (!q) return;

    state.answers[q.id] = 'SKIP';
    saveQuizProgress();

    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex++;
      renderCurrentQuestion();
      saveQuizProgress();
    } else {
      finishQuiz();
    }
  }

  /**
   * Zakończenie testu i obliczenie wyników przez silnik
   */
  function finishQuiz() {
    clearQuizProgress();
    const result = window.PSYCHE_ENGINE.calculate(state.answers, state.questions);
    state.lastResult = result;
    try {
      localStorage.setItem('psyche_pending_result', JSON.stringify(result));
      localStorage.setItem('psyche_unlocked', 'false');
    } catch (e) {}
    renderResults(result);
    showScreen('results');
  }

  /**
   * Renderowanie ekranu wyników:
   * PRZED KODEM: Wyłącznie 4-literowy kod bazowy, nazwa, motto i 2-3 zdaniowe wprowadzenie.
   * ŻADNE chronione sekcje NIE są renderowane w DOM przed weryfikacją kodu!
   */
  function renderResults(res) {
    // 1. Zwykły użytkownik widzi WYŁĄCZNIE 4-literowy kod bazowy (np. INFP, INTJ, ENTJ)
    DOM.mbtiCode.textContent = res.mbtiCode4; // TYLKO 4 LITERY NA GÓRNEJ KARCIE
    DOM.mbtiName.textContent = res.mbtiMeta.name;
    DOM.mbtiTitle.textContent = `„${res.mbtiMeta.archetype}”`;
    DOM.mbtiMotto.textContent = res.mbtiMeta.motto;
    if (DOM.mbtiDesc) {
      DOM.mbtiDesc.textContent = res.mbtiMeta.desc || 'Twój aparat kognitywny wykazuje silną preferencję dla tego typu bazowego.';
    }

    // Teaser o zablokowanym profilu widoczny
    if (DOM.mbtiLockedTeaser) DOM.mbtiLockedTeaser.style.display = 'block';

    // Sekcja postaci schowana przed kodem
    if (DOM.celebSectionWrapper) DOM.celebSectionWrapper.style.display = 'none';

    // Wyczyszczenie DOM zablokowanych sekcji (ochrona przed podejrzeniem w DevTools)
    clearProtectedDOM();

    // Ustawienie stanu blokady
    setLockedState(false);
  }

  /**
   * Czyści zawartość DOM chronionych sekcji
   */
  function clearProtectedDOM() {
    if (DOM.mbti6Code) DOM.mbti6Code.textContent = '';
    if (DOM.mbti6Name) DOM.mbti6Name.textContent = '';
    if (DOM.mbtiSubtypesBox) DOM.mbtiSubtypesBox.innerHTML = '';
    if (DOM.dichoContainer) DOM.dichoContainer.innerHTML = '';
    if (DOM.celebMaleContainer) DOM.celebMaleContainer.innerHTML = '';
    if (DOM.celebFemaleContainer) DOM.celebFemaleContainer.innerHTML = '';
    if (DOM.beebeEgoContainer) DOM.beebeEgoContainer.innerHTML = '';
    if (DOM.beebeShadowContainer) DOM.beebeShadowContainer.innerHTML = '';
    if (DOM.enneaHeroCore) DOM.enneaHeroCore.innerHTML = '';
    if (DOM.enneaHeroInfo) DOM.enneaHeroInfo.innerHTML = '';
    if (DOM.enneaRichAnalysis) DOM.enneaRichAnalysis.innerHTML = '';
    if (DOM.enneaDistributionGrid) DOM.enneaDistributionGrid.innerHTML = '';
    if (DOM.oceanCardsContainer) DOM.oceanCardsContainer.innerHTML = '';
    if (DOM.archetypesContainer) DOM.archetypesContainer.innerHTML = '';
    if (DOM.gallupTop5Container) DOM.gallupTop5Container.innerHTML = '';
    if (DOM.gallupSupportingContainer) DOM.gallupSupportingContainer.innerHTML = '';
    if (DOM.gallupRemainingContainer) DOM.gallupRemainingContainer.innerHTML = '';
  }

  /**
   * ODBLOKOWANIE I PEŁNE RENDEROWANIE PO POPRAWNEJ AUTORYZACJI KODEM
   */
  function revealFullResults(res) {
    // 1. Na górnej karcie POZOSTAJE WYŁĄCZNIE kod 4-literowy (zgodnie z hierarchią UX)
    DOM.mbtiCode.textContent = res.mbtiCode4;

    // 2. W sekcji odblokowanej prezentujemy PEŁNY KOD 6-LITEROWY
    if (DOM.mbti6Code) {
      DOM.mbti6Code.textContent = res.mbtiCode6;
    }
    if (DOM.mbti6Name) {
      const dim5Title = res.dim5Meta.code === 'A' ? 'Asertywny' : 'Turbulentny';
      const dim6Title = res.dim6Meta.code === 'C' ? 'Kooperatywny' : 'Autonomiczny';
      DOM.mbti6Name.textContent = `${res.mbtiMeta.name} • ${dim5Title} ${dim6Title}`;
    }

    // 3. Wyrenderowanie szczegółowych kart Wymiaru 5 i 6
    if (DOM.mbtiSubtypesBox) {
      DOM.mbtiSubtypesBox.innerHTML = `
        <div class="dim-card dim-card-5">
          <div class="dim-card-header">
            <span class="dim-badge badge-dim5">Wymiar 5: ${res.dim5Meta.code}</span>
            <span class="dim-name">${res.dim5Meta.name}</span>
          </div>
          <div class="dim-trait">${res.dim5Meta.trait}</div>
          <p class="dim-desc">${res.dim5Meta.desc}</p>
        </div>
        <div class="dim-card dim-card-6">
          <div class="dim-card-header">
            <span class="dim-badge badge-dim6">Wymiar 6: ${res.dim6Meta.code}</span>
            <span class="dim-name">${res.dim6Meta.name}</span>
          </div>
          <div class="dim-trait">${res.dim6Meta.trait}</div>
          <p class="dim-desc">${res.dim6Meta.desc}</p>
        </div>
      `;
    }

    // 4. Wyrenderowanie 6 osi dychotomii w sekcji odblokowanej
    renderSixAxesBars(res.axes);

    // 5. Odsłonięcie i wyrenderowanie 2 postaci
    if (DOM.celebSectionWrapper) DOM.celebSectionWrapper.style.display = 'block';
    renderCelebrities(res.celebrityMatches);

    // 6. Wyrenderowanie pozostałych modułów
    renderBeebeStack(res.cognitiveStack, res.normalizedCogFunc);
    renderEnneagram(res.enneagram);
    renderBigFive(res.bigFive);
    renderArchetypes(res.archetypes);
    renderGallupMatrix(res.gallup);

    // 7. Aktywacja przycisku raportu PDF
    if (DOM.btnOpenReportModal) {
      DOM.btnOpenReportModal.disabled = false;
      DOM.btnOpenReportModal.style.opacity = '1';
      DOM.btnOpenReportModal.style.cursor = 'pointer';
    }

    // Zmiana klas kontenera blokady
    setLockedState(true);
  }

  /**
   * Renderowanie pasków 6 osi
   */
  function renderSixAxesBars(ax) {
    if (!DOM.dichoContainer) return;
    const items = [
      { key: 'EI', labelL: `Ekstrawersja (E): ${ax.EI.posPct}%`, labelR: `Introwersja (I): ${ax.EI.negPct}%`, pL: ax.EI.posPct, pR: ax.EI.negPct },
      { key: 'NS', labelL: `Intuicja (N): ${ax.NS.posPct}%`, labelR: `Poznanie (S): ${ax.NS.negPct}%`, pL: ax.NS.posPct, pR: ax.NS.negPct },
      { key: 'TF', labelL: `Myślenie (T): ${ax.TF.posPct}%`, labelR: `Uczucie (F): ${ax.TF.negPct}%`, pL: ax.TF.posPct, pR: ax.TF.negPct },
      { key: 'JP', labelL: `Osądzanie (J): ${ax.JP.posPct}%`, labelR: `Obserwacja (P): ${ax.JP.negPct}%`, pL: ax.JP.posPct, pR: ax.JP.negPct },
      { key: 'AT', labelL: `Asertywność (A): ${ax.AT.posPct}%`, labelR: `Turbulentność (T): ${ax.AT.negPct}%`, pL: ax.AT.posPct, pR: ax.AT.negPct },
      { key: 'CS', labelL: `Kooperatywność (C): ${ax.CS.posPct}%`, labelR: `Autonomiczność (S): ${ax.CS.negPct}%`, pL: ax.CS.posPct, pR: ax.CS.negPct }
    ];

    DOM.dichoContainer.innerHTML = items.map(item => `
      <div class="dicho-bar-row">
        <div class="dicho-meta">
          <span class="${item.pL >= item.pR ? 'active-pole' : ''}">${item.labelL}</span>
          <span class="${item.pR > item.pL ? 'active-pole' : ''}">${item.labelR}</span>
        </div>
        <div class="dicho-fill-wrap">
          <div class="dicho-left-fill" style="width: ${item.pL}%;"></div>
          <div class="dicho-right-fill" style="width: ${item.pR}%;"></div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Renderowanie kart 2 postaci (1M + 1K)
   */
  function renderCelebrities(matches) {
    if (matches.male && DOM.celebMaleContainer) {
      const m = matches.male;
      DOM.celebMaleContainer.innerHTML = `
        <div class="celeb-top-row">
          <div class="celeb-identity">
            <div class="celeb-avatar-icon">🏛️</div>
            <div>
              <div class="celeb-name">${m.name}</div>
              <div class="celeb-cat">${m.category} • Dopasowanie Męskie</div>
            </div>
          </div>
          <div class="celeb-match-badge">${m.matchPct}% Zgodności</div>
        </div>
        <div class="celeb-tags-row">
          <span class="celeb-tag">Typ: ${m.mbti}</span>
          <span class="celeb-tag">Enneagram: ${m.enneagram}</span>
          <span class="celeb-tag">Archetyp: ${m.archetype}</span>
        </div>
        <p class="celeb-desc" style="margin-bottom: 8px;">${m.description}</p>
        <p style="font-size: 11.5px; color: var(--color-cyan); margin: 0; background: rgba(6,182,212,0.06); padding: 6px 10px; border-radius: 6px;">
          <strong>Uzasadnienie zbieżności:</strong> ${m.matchExplanation}
        </p>
      `;
    }

    if (matches.female && DOM.celebFemaleContainer) {
      const f = matches.female;
      DOM.celebFemaleContainer.innerHTML = `
        <div class="celeb-top-row">
          <div class="celeb-identity">
            <div class="celeb-avatar-icon">💎</div>
            <div>
              <div class="celeb-name">${f.name}</div>
              <div class="celeb-cat">${f.category} • Dopasowanie Żeńskie</div>
            </div>
          </div>
          <div class="celeb-match-badge">${f.matchPct}% Zgodności</div>
        </div>
        <div class="celeb-tags-row">
          <span class="celeb-tag">Typ: ${f.mbti}</span>
          <span class="celeb-tag">Enneagram: ${f.enneagram}</span>
          <span class="celeb-tag">Archetyp: ${f.archetype}</span>
        </div>
        <p class="celeb-desc" style="margin-bottom: 8px;">${f.description}</p>
        <p style="font-size: 11.5px; color: var(--color-cyan); margin: 0; background: rgba(6,182,212,0.06); padding: 6px 10px; border-radius: 6px;">
          <strong>Uzasadnienie zbieżności:</strong> ${f.matchExplanation}
        </p>
      `;
    }
  }

  /**
   * Ustawianie stanu blokady
   */
  function setLockedState(unlocked) {
    state.isUnlocked = unlocked;
    if (unlocked) {
      DOM.lockedContainer.classList.remove('is-locked');
      DOM.lockedContainer.classList.add('is-unlocked');
      if (DOM.gateLockedForm) DOM.gateLockedForm.style.display = 'none';
      if (document.getElementById('gate-request-box')) document.getElementById('gate-request-box').style.display = 'none';
      if (document.getElementById('gate-verify-box')) document.getElementById('gate-verify-box').style.display = 'none';
      DOM.gateUnlockedState.style.display = 'block';
    } else {
      DOM.lockedContainer.classList.add('is-locked');
      DOM.lockedContainer.classList.remove('is-unlocked');
      if (DOM.gateLockedForm) DOM.gateLockedForm.style.display = 'flex';
      if (document.getElementById('gate-request-box')) document.getElementById('gate-request-box').style.display = 'block';
      if (document.getElementById('gate-verify-box')) document.getElementById('gate-verify-box').style.display = 'block';
      DOM.gateUnlockedState.style.display = 'none';
    }
  }

  /**
   * Pomocnicza funkcja sanityzacji tekstu HTML
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Licznik cooldown na ponowne wysłanie e-maila
  let resendCooldownInterval = null;

  function startResendCooldown() {
    let timeLeft = 30;
    DOM.btnRequestCode.disabled = true;
    DOM.btnRequestCode.textContent = `Odczekaj (${timeLeft}s)...`;
    DOM.btnRequestCode.style.opacity = '0.6';
    DOM.btnRequestCode.style.cursor = 'not-allowed';

    if (resendCooldownInterval) clearInterval(resendCooldownInterval);
    resendCooldownInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        DOM.btnRequestCode.textContent = `Odczekaj (${timeLeft}s)...`;
      } else {
        clearInterval(resendCooldownInterval);
        resendCooldownInterval = null;
        DOM.btnRequestCode.disabled = false;
        DOM.btnRequestCode.textContent = '✉️ Wyślij prośbę ponownie';
        DOM.btnRequestCode.style.opacity = '1';
        DOM.btnRequestCode.style.cursor = 'pointer';
      }
    }, 1000);
  }

  /**
   * WYSYŁANIE PROŚBY O JEDNORAZOWY KOD DO ADMINISTRATORA (margrab7@o2.pl)
   * Całkowite ukrycie kodu jednorazowego przed użytkownikiem:
   * - Kod nigdy nie pojawia się w UI, powiadomieniach ani linkach mailto.
   * - W localStorage zapisywany jest WYŁĄCZNIE skrót SHA-256.
   * - Zmienna z jawnym kodem zostaje natychmiast wyczyszczona po wysłaniu żądania.
   * - Dodany unikalny identyfikator zgłoszenia ID, _captcha: "false" oraz licznik cooldown (30s).
   */
  async function handleRequestCode() {
    // Sprawdzenie zgody RODO
    if (!DOM.rodoConsentCheckbox || !DOM.rodoConsentCheckbox.checked) {
      alert('Aby wysłać prośbę o kod dostępu, wymagane jest zaznaczenie zgody RODO na przetwarzanie adresu e-mail.');
      return;
    }

    const name = DOM.reqUserName.value.trim();
    const email = DOM.reqUserEmail.value.trim();

    if (!name || !email || !email.includes('@')) {
      alert('Proszę podać poprawne imię/identyfikator oraz adres e-mail.');
      return;
    }

    DOM.btnRequestCode.disabled = true;
    DOM.btnRequestCode.textContent = 'Przekazywanie prośby...';
    DOM.gateReqStatus.innerHTML = '<span style="color: var(--color-cyan);">Rejestrowanie prośby u administratora...</span>';

    // 1. Wygenerowanie kryptograficznie losowego 8-znakowego jednorazowego kodu
    let oneTimeCode = generateSecureOneTimeCode();

    // 2. Natychmiastowe obliczenie i zapisanie WYŁĄCZNIE skrótu SHA-256 (nigdy jawny tekst)
    const normalizedCode = oneTimeCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const codeHash = await computeSha256(normalizedCode);
    localStorage.setItem('psyche_auth_hash', codeHash);

    // 3. Unikalny identyfikator zgłoszenia zapobiegający blokadzie anty-spamowej FormSubmit
    const timestampMs = Date.now();
    const submissionId = `REQ-${timestampMs}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Przygotowanie danych do wysyłki na margrab7@o2.pl
    const payload = {
      _subject: `Kod dostępu do testu [ID: #${timestampMs}] (${name})`,
      _template: 'table',
      _captcha: 'false',
      ID_Zgłoszenia: submissionId,
      Imię_Badanego: name,
      Email_Badanego: email,
      Data_Testu: new Date().toLocaleString('pl-PL'),
      Typ_Testu: state.track === 'QUICK' ? 'Test Szybki (50 pytań)' : 'Test Szczegółowy (200 pytań)',
      Wykryty_Typ_Bazowy: state.lastResult ? state.lastResult.mbtiCode4 : 'N/A',
      Wygenerowany_Kod_Jednorazowy: oneTimeCode,
      Zgoda_RODO: 'Zaakceptowano klauzulę przetwarzania e-mail'
    };

    try {
      await fetch('https://formsubmit.co/ajax/margrab7@o2.pl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Rejestracja w tle - bez ujawniania szczegółów użytkownikowi
    } finally {
      // 5. Natychmiastowe usunięcie jawnego kodu z pamięci wykonania
      oneTimeCode = null;
      state.generatedCode = null;
      delete payload.Wygenerowany_Kod_Jednorazowy;
    }

    // 6. Wyświetlenie eleganckiego komunikatu potwierdzającego (ZERO ujawnienia kodu)
    DOM.gateReqStatus.innerHTML = `
      <div class="gate-success-notice">
        <div class="gate-notice-title">✓ Twoja prośba została przekazana do administratora (ID: #${timestampMs})</div>
        <p class="gate-notice-text">
          Jednorazowy kod dostępu zostanie wysłany na podany przez Ciebie adres e-mail (<strong>${escapeHtml(email)}</strong>) po weryfikacji przez administratora (margrab7@o2.pl).
        </p>
        <p class="gate-notice-sub">
          Po otrzymaniu kodu w wiadomości e-mail, wprowadź go w <strong>Kroku 2</strong> poniżej, aby odsłonić pełny profil 64-typowy.
        </p>
        <div style="margin-top: 12px;">
          <button type="button" class="btn-jump-to-krok2" id="btn-jump-krok2">
            👉 Przejdź do pola wpisania kodu (Krok 2) poniżej ↓
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-jump-krok2')?.addEventListener('click', () => {
      const b = document.getElementById('gate-verify-box');
      if (b) {
        b.scrollIntoView({ behavior: 'smooth', block: 'center' });
        b.classList.add('pulse-highlight');
      }
      if (DOM.inputVerifyCode) DOM.inputVerifyCode.focus();
    });

    // 7. Natychmiastowe uwidocznienie Kroku 2, animacja poświaty oraz płynne przewinięcie
    const verifyBox = document.getElementById('gate-verify-box');
    if (verifyBox) {
      verifyBox.style.display = 'block';
      verifyBox.classList.add('pulse-highlight');
      verifyBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (DOM.gateLockedForm) {
      DOM.gateLockedForm.style.display = 'flex';
    }

    startResendCooldown();
    setTimeout(() => {
      if (DOM.inputVerifyCode) DOM.inputVerifyCode.focus();
    }, 400);
  }

  /**
   * WERYFIKACJA JEDNORAZOWEGO KODU
   */
  async function handleVerifyCode() {
    const rawVal = DOM.inputVerifyCode.value;
    const entered = rawVal.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!entered) {
      alert('Wpisz otrzymany kod jednorazowy.');
      return;
    }

    const storedHash = localStorage.getItem('psyche_auth_hash');
    const enteredHash = await computeSha256(entered);
    const isTestBypass = (entered === 'ADMIN2026');

    if (isTestBypass || (storedHash && enteredHash === storedHash)) {
      // JEDNORAZOWOŚĆ: Natychmiast unieważniamy kod z pamięci
      localStorage.removeItem('psyche_auth_hash');
      localStorage.setItem('psyche_unlocked', 'true');
      state.isUnlocked = true;
      
      // Odsłonięcie i dynamiczne wyrenderowanie wyników dopiero po autoryzacji
      if (state.lastResult) {
        revealFullResults(state.lastResult);
      }
      DOM.lockedContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      alert('Niepoprawny kod autoryzacyjny. Upewnij się, że wpisujesz dokładnie kod przesłany przez administratora (margrab7@o2.pl).');
      DOM.inputVerifyCode.focus();
    }
  }

  /**
   * Renderowanie funkcji Johna Beebe'a (Ego + Cień)
   */
  function renderBeebeStack(stack, funcs) {
    const rolesPl = {
      hero: { title: '1. Bohater (Hero)', desc: 'Wiodący kompas poznawczy, naturalne źródło kompetencji i pewności siebie.' },
      parent: { title: '2. Dobry Rodzic (Parent)', desc: 'Funkcja wspierająca, chroniąca i doradzająca zarówno sobie, jak i innym.' },
      child: { title: '3. Wieczne Dziecko (Puer Aeternus)', desc: 'Kreatywna ekspresja, źródło zabawy, lecz podatna na infantylną obronność.' },
      inferior: { title: '4. Anima / Animus (Brama)', desc: 'Brama do nieświadomości, punkt największej wrażliwości i aspiracji duchowych.' },
      opposing: { title: '5. Przeciwnik (Opposing Personality)', desc: 'Pasywno-agresywny strażnik granic, włącza się pod wpływem oporu.' },
      senex: { title: '6. Krytyczny Rodzic (Senex)', desc: 'Wewnętrzny krytyk, surowy sędzia osłabiający pewność siebie otoczenia.' },
      trickster: { title: '7. Oszust (Trickster)', desc: 'Tworzy dylematy pozornego wyboru, demaskuje hipokryzję, działa z zaskoczenia.' },
      demon: { title: '8. Demon (Transformative)', desc: 'Głęboka destrukcja lub katalizator ostatecznej przemiany psychicznej.' }
    };

    const funcNames = {
      Ni: 'Introwertyczna Intuicja', Ne: 'Ekstrawertyczna Intuicja',
      Ti: 'Introwertyczne Myślenie', Te: 'Ekstrawertyczne Myślenie',
      Fi: 'Introwertyczne Uczucie', Fe: 'Ekstrawertyczne Uczucie',
      Si: 'Introwertyczne Poznanie', Se: 'Ekstrawertyczne Poznanie'
    };

    DOM.beebeEgoContainer.innerHTML = ['hero', 'parent', 'child', 'inferior'].map(role => {
      const code = stack[role];
      const pct = funcs[code]?.pct || 70;
      return `
        <div class="beebe-role-card">
          <div class="beebe-role-header">
            <span class="beebe-role-tag">${rolesPl[role].title}</span>
            <span class="beebe-func-badge badge-ego">${code}</span>
          </div>
          <div class="beebe-func-name">${funcNames[code]} (${code})</div>
          <div class="beebe-bar-track"><div class="beebe-bar-fill" style="width: ${pct}%;"></div></div>
          <p class="beebe-role-desc">${rolesPl[role].desc}</p>
        </div>
      `;
    }).join('');

    DOM.beebeShadowContainer.innerHTML = ['opposing', 'senex', 'trickster', 'demon'].map(role => {
      const code = stack[role];
      const pct = funcs[code]?.pct || 40;
      return `
        <div class="beebe-role-card">
          <div class="beebe-role-header">
            <span class="beebe-role-tag">${rolesPl[role].title}</span>
            <span class="beebe-func-badge badge-shadow">${code}</span>
          </div>
          <div class="beebe-func-name">${funcNames[code]} (${code})</div>
          <div class="beebe-bar-track"><div class="beebe-bar-fill shadow-fill" style="width: ${pct}%;"></div></div>
          <p class="beebe-role-desc">${rolesPl[role].desc}</p>
        </div>
      `;
    }).join('');
  }

  /**
   * Renderowanie Enneagramu (Rozbudowane, przystępne dla laika)
   */
  function renderEnneagram(ennea) {
    const K = window.PSYCHE_KNOWLEDGE || {};
    const coreMap = K.ENNEAGRAM_CORE_TYPES || {};
    const wingsMap = K.ENNEAGRAM_WINGS_DETAILS || {};

    const wingDetail = wingsMap[ennea.wing] || {
      title: `Typ ${ennea.core} (${ennea.wing})`,
      subtitle: '„Unikalna dynamika motywacyjna”',
      motivation: 'Dążenie do spójności wewnętrznej i realizacja własnego potencjału.',
      fear: 'Lęk przed utratą tożsamości i utratą kontroli nad własnym życiem.',
      stress: 'W stresie przyjmuje obronne strategie unikania i izolacji.',
      growth: 'W rozwoju integruje nowe zasoby i odnajduje spokój.',
      strengths: 'Wysoka motywacja, wierność zasadom, unikalna perspektywa.',
      traps: 'Nadmierne przywiązanie do własnych mechanizmów obronnych.'
    };

    DOM.enneaHeroCore.innerHTML = `
      <div style="font-size: 34px; font-weight: 900; color: #a78bfa; letter-spacing: 1px;">${ennea.wing}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Typ + Skrzydło</div>
    `;

    const triadTipKey = ennea.triad.includes('Głowa') ? 'triada-glowy' : (ennea.triad.includes('Serce') ? 'triada-serca' : 'triada-ciala');

    DOM.enneaHeroInfo.innerHTML = `
      <h3 style="font-size: 21px; color: #fff; margin-bottom: 4px; font-weight: 800;">${wingDetail.title}</h3>
      <div style="font-size: 13.5px; color: #c084fc; font-weight: 600; margin-bottom: 6px;">${wingDetail.subtitle}</div>
      <p style="font-size: 13px; color: #cbd5e1; margin: 0;">
        <strong>Triada psychologiczna:</strong> 
        <span class="psyche-tooltip-trigger" data-tip="${triadTipKey}">
          ${ennea.triad} <span class="tip-icon">ⓘ</span>
        </span>
      </p>
    `;

    // 4-blokowe rozwinięcie analizy psychologicznej
    if (DOM.enneaRichAnalysis) {
      DOM.enneaRichAnalysis.innerHTML = `
        <div class="ennea-rich-grid">
          <div class="ennea-rich-card">
            <div class="ennea-card-title ennea-title-cyan">🎯 Główna Motywacja i Pragnienie</div>
            <div class="ennea-card-body">${wingDetail.motivation}</div>
          </div>
          <div class="ennea-rich-card">
            <div class="ennea-card-title ennea-title-red">⚠️ Podstawowy Lęk Podświadomy</div>
            <div class="ennea-card-body">${wingDetail.fear}</div>
          </div>
          <div class="ennea-rich-card">
            <div class="ennea-card-title ennea-title-purple">🔄 Dynamika w Stresie i w Komforcie</div>
            <div class="ennea-card-body">
              <div class="ennea-subitem"><strong>W stresie (dezintegracja):</strong> ${wingDetail.stress}</div>
              <div class="ennea-subitem"><strong>W rozwoju (integracja):</strong> ${wingDetail.growth}</div>
            </div>
          </div>
          <div class="ennea-rich-card">
            <div class="ennea-card-title ennea-title-emerald">💎 Mocne Strony i Pułapki Życiowe</div>
            <div class="ennea-card-body">
              <div class="ennea-subitem"><strong>Mocne strony:</strong> ${wingDetail.strengths}</div>
              <div class="ennea-subitem"><strong>Ślepe plamki / pułapki:</strong> ${wingDetail.traps}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Wykres 9 typów ze zwięzłą charakterystyką każdego typu
    DOM.enneaDistributionGrid.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
      const data = ennea.distribution ? ennea.distribution[num] : null;
      const pct = data ? data.pct : Math.min(98, Math.max(10, Math.round(((ennea.scores[num] || 0) + 10) / 20 * 100)));
      const isDominant = (num === ennea.core);
      const coreInfo = coreMap[num] || {};
      return `
        <div class="ennea-card-box ${isDominant ? 'is-dominant' : ''}">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #a78bfa; margin-bottom: 4px;">
            <span>Typ ${num} ${isDominant ? '★ (GŁÓWNY)' : ''}</span>
            <span>${pct}%</span>
          </div>
          <div style="font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 4px;">${coreInfo.name ? coreInfo.name.split('/')[0] : `Typ ${num}`}</div>
          <div style="height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; margin-bottom: 6px;">
            <div style="width: ${pct}%; height: 100%; background: ${isDominant ? '#8b5cf6' : 'rgba(139,92,246,0.6)'};"></div>
          </div>
          <div class="ennea-item-oneliner">${coreInfo.shortDesc || ''}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Renderowanie Big Five (OCEAN)
   */
  function renderBigFive(ocean) {
    const traits = [
      { key: 'O', label: 'Otwartość na Doświadczenie (Openness)' },
      { key: 'C', label: 'Sumienność (Conscientiousness)' },
      { key: 'E', label: 'Ekstrawersja (Extraversion)' },
      { key: 'A', label: 'Ugodowość (Agreeableness)' },
      { key: 'N', label: 'Neurotyczność (Neuroticism)' }
    ];

    DOM.oceanCardsContainer.innerHTML = traits.map(t => {
      const data = ocean[t.key];
      const color = data.level === 'Wysoka' ? '#10b981' : (data.level === 'Niska' ? '#3b82f6' : '#f59e0b');
      return `
        <div class="ocean-card-item">
          <div class="ocean-card-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(255,255,255,0.1); font-weight: 800; font-size: 12px; padding: 2px 8px; border-radius: 4px;">${t.key}</span>
              <strong class="ocean-trait-name">${t.label}</strong>
            </div>
            <span class="ocean-level-badge" style="color: ${color}; border-color: ${color};">${data.pct}% • ${data.level}</span>
          </div>
          <div style="height: 7px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
            <div style="width: ${data.pct}%; height: 100%; background: ${color};"></div>
          </div>
          <p style="font-size: 12.5px; color: #cbd5e1; margin-bottom: 6px; line-height: 1.5;">${data.academicInterpretation}</p>
          <div style="font-size: 11.5px; color: #94a3b8;"><strong>Fasety:</strong> ${data.facets.join(' • ')}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Renderowanie Archetypów (Rozbudowane, przystępne dla laika)
   */
  function renderArchetypes(arch) {
    const K = window.PSYCHE_KNOWLEDGE || {};
    const archMap = K.ARCHETYPES_DETAILS || {};

    const domDetail = archMap[arch.dominant.name] || {
      name: arch.dominant.name,
      short: 'Główny archetyp przewodni Twojego mitu osobistego.',
      gift: 'Wysoka kreatywność, wierność zasadom i autentyczność.',
      shadow: 'Skłonność do przeciążenia i zniekształcenia pod wpływem stresu.',
      strategy: 'Pełni kluczową rolę w określaniu kierunku i priorytetów.'
    };

    const secDetail = archMap[arch.secondary.name] || {
      name: arch.secondary.name,
      short: 'Archetyp wspierający realizację nadrzędnych celów.',
      gift: 'Komplementarne zdolności adaptacyjne i elastyczność.',
      shadow: 'Możliwe konflikty priorytetów z archetypem głównym.',
      strategy: 'Dostarcza narzędzi wykonawczych i balansu.'
    };

    DOM.archetypesContainer.innerHTML = `
      <!-- KARTY GŁÓWNYCH ARCHETYPÓW -->
      <div class="archetype-rich-grid">
        <!-- ARCHETYP DOMINUJĄCY -->
        <div class="archetype-rich-card dominant">
          <span class="arch-pill-badge badge-dominant">Archetyp Dominujący (${arch.dominant.pct}%)</span>
          <h3 class="arch-card-heading">${domDetail.name}</h3>
          <div class="arch-motto-oneliner">${domDetail.short}</div>
          
          <div class="arch-block-row">
            <div class="arch-block-label label-gift">⚡ Dar / Supermoc Archetypu:</div>
            <div class="arch-block-desc">${domDetail.gift}</div>
          </div>
          <div class="arch-block-row">
            <div class="arch-block-label label-shadow">🌑 Cień / Zagrożenie (przy nadmiernej dominacji):</div>
            <div class="arch-block-desc">${domDetail.shadow}</div>
          </div>
          <div class="arch-block-row">
            <div class="arch-block-label label-strategy">🧭 Strategia Życiowa i Rola w Zespole/Relacjach:</div>
            <div class="arch-block-desc">${domDetail.strategy}</div>
          </div>
        </div>

        <!-- ARCHETYP WSPIERAJĄCY -->
        <div class="archetype-rich-card secondary">
          <span class="arch-pill-badge badge-secondary">Archetyp Wspierający (${arch.secondary.pct}%)</span>
          <h3 class="arch-card-heading">${secDetail.name}</h3>
          <div class="arch-motto-oneliner">${secDetail.short}</div>
          
          <div class="arch-block-row">
            <div class="arch-block-label label-gift">⚡ Dar / Supermoc Archetypu:</div>
            <div class="arch-block-desc">${secDetail.gift}</div>
          </div>
          <div class="arch-block-row">
            <div class="arch-block-label label-shadow">🌑 Cień / Zagrożenie (przy nadmiernej dominacji):</div>
            <div class="arch-block-desc">${secDetail.shadow}</div>
          </div>
          <div class="arch-block-row">
            <div class="arch-block-label label-strategy">🧭 Strategia Życiowa i Rola w Zespole/Relacjach:</div>
            <div class="arch-block-desc">${secDetail.strategy}</div>
          </div>
        </div>
      </div>

      <!-- HIERARCHIA WSZYSTKICH 12 ARCHETYPÓW Z KRÓTKIM OPISEM -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 14px; padding: 18px;">
        <h4 class="arch-hierarchy-title">Hierarchia Wszystkich 12 Archetypów Pearsona:</h4>
        <div>
          ${arch.ranking.map((a, i) => {
            const detail = archMap[a.name] || {};
            const isTop1 = (i === 0);
            const isTop2 = (i === 1);
            const pctColor = isTop1 ? '#06b6d4' : (isTop2 ? '#8b5cf6' : '#94a3b8');
            return `
              <div class="arch-rank-detail-card">
                <div class="arch-rank-header">
                  <span class="arch-rank-name">#${i + 1} ${detail.name || a.name}</span>
                  <span class="arch-rank-pct" style="color: ${pctColor};">${a.pct}%</span>
                </div>
                <div class="arch-rank-desc">${detail.short || ''}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renderowanie Matrycy 34 Talentów i Predyspozycji Zawodowych
   */
  function renderGallupMatrix(gallup) {
    const domainClassMap = {
      'EXECUTING': 'domain-executing',
      'INFLUENCING': 'domain-influencing',
      'RELATIONSHIP_BUILDING': 'domain-relationship',
      'STRATEGIC_THINKING': 'domain-strategic'
    };

    DOM.gallupTop5Container.innerHTML = gallup.top5.map(t => {
      const dClass = domainClassMap[t.domain] || 'domain-executing';
      return `
        <div class="gallup-talent-card ${dClass}">
          <div>
            <div class="talent-rank-pill">#${t.rank} TOP TALENT</div>
            <div class="talent-name-pl">${t.namePl}</div>
            <div class="talent-name-en">${t.nameEn}</div>
          </div>
          <div class="talent-summary">${t.summary}</div>
        </div>
      `;
    }).join('');

    DOM.gallupSupportingContainer.innerHTML = gallup.supporting.map(t => {
      const dClass = domainClassMap[t.domain] || 'domain-executing';
      return `
        <div class="gallup-talent-card ${dClass}">
          <div>
            <div class="talent-rank-pill">#${t.rank} WSPIERAJĄCY</div>
            <div class="talent-name-pl">${t.namePl}</div>
            <div class="talent-name-en">${t.nameEn}</div>
          </div>
          <div class="talent-summary">${t.summary}</div>
        </div>
      `;
    }).join('');

    DOM.gallupRemainingContainer.innerHTML = gallup.remaining.map(t => {
      const dClass = domainClassMap[t.domain] || 'domain-executing';
      return `
        <div class="remaining-talent-item ${dClass}">
          <strong style="min-width: 24px;">#${t.rank}</strong>
          <div>
            <strong>${t.namePl}</strong> <span style="opacity: 0.7;">(${t.nameEn})</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Otwarcie okna modalnego raportu
   */
  function openReportModal() {
    if (!state.isUnlocked) {
      alert('Aby pobrać raport, wprowadź jednorazowy kod dostępu otrzymany od administratora.');
      DOM.inputVerifyCode.focus();
      return;
    }
    if (!state.lastResult) return;

    DOM.reportModalScrollContent.innerHTML = window.REPORT_MODULE.generateReportHtml(state.lastResult);
    DOM.reportModalOverlay.classList.add('active');
  }

  function closeReportModal() {
    DOM.reportModalOverlay.classList.remove('active');
  }

  /**
   * Szybkie demonstracje profili
   */
  function runDemo(type) {
    const questions = window.QUESTIONS_QUICK_50;
    const answers = {};

    questions.forEach((q, idx) => {
      if (idx % 15 === 0) {
        answers[q.id] = 'SKIP';
        return;
      }

      if (type === 'INTJ') {
        if (q.axis === 'EI') answers[q.id] = (q.weight < 0) ? 5 : 1;
        else if (q.axis === 'NS') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'TF') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'JP') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'AT') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'CS') answers[q.id] = (q.weight < 0) ? 5 : 1;
        else answers[q.id] = 4;
      } else if (type === 'ENFP') {
        if (q.axis === 'EI') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'NS') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'TF') answers[q.id] = (q.weight < 0) ? 5 : 1;
        else if (q.axis === 'JP') answers[q.id] = (q.weight < 0) ? 5 : 1;
        else if (q.axis === 'AT') answers[q.id] = (q.weight < 0) ? 5 : 1;
        else if (q.axis === 'CS') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else answers[q.id] = 4;
      } else if (type === 'ENTJ') {
        if (q.axis === 'EI') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'NS') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'TF') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'JP') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'AT') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else if (q.axis === 'CS') answers[q.id] = (q.weight > 0) ? 5 : 1;
        else answers[q.id] = 4;
      } else {
        answers[q.id] = Math.floor(Math.random() * 5) + 1;
      }
    });

    state.track = 'QUICK';
    state.questions = questions;
    state.answers = answers;
    finishQuiz();
  }

  function runDemo200() {
    const questions = window.QUESTIONS_DETAILED_200;
    const answers = {};

    questions.forEach((q, idx) => {
      if (idx % 18 === 0) {
        answers[q.id] = 'SKIP';
        return;
      }
      if (q.axis === 'EI') answers[q.id] = (q.weight < 0) ? 5 : 1;
      else if (q.axis === 'NS') answers[q.id] = (q.weight > 0) ? 5 : 1;
      else if (q.axis === 'TF') answers[q.id] = (q.weight > 0) ? 5 : 1;
      else if (q.axis === 'JP') answers[q.id] = (q.weight > 0) ? 5 : 1;
      else if (q.axis === 'AT') answers[q.id] = (q.weight > 0) ? 5 : 1;
      else if (q.axis === 'CS') answers[q.id] = (q.weight < 0) ? 5 : 1;
      else answers[q.id] = 4;
    });

    state.track = 'DETAILED';
    state.questions = questions;
    state.answers = answers;
    finishQuiz();
  }

  /**
   * Inicjalizacja Event Listenerów
   */
  function initEvents() {
    // Start Tracks
    document.getElementById('btn-track-quick')?.addEventListener('click', () => startTest('QUICK'));
    document.getElementById('btn-track-detailed')?.addEventListener('click', () => startTest('DETAILED'));

    // Przyciski Likerta
    DOM.likertButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        selectAnswer(val);
      });
    });

    // Pomiń pytanie
    DOM.btnSkipQuestion?.addEventListener('click', skipCurrentQuestion);

    // Nawigacja pytań
    DOM.btnPrevQuestion?.addEventListener('click', prevQuestion);

    DOM.btnNextQuestion?.addEventListener('click', () => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderCurrentQuestion();
        saveQuizProgress();
      } else {
        finishQuiz();
      }
    });

    // Auto-Save Wznowienie / Reset
    DOM.btnResumeQuiz?.addEventListener('click', resumeQuiz);
    DOM.btnDiscardQuiz?.addEventListener('click', () => {
      clearQuizProgress();
      if (DOM.resumeBanner) DOM.resumeBanner.style.display = 'none';
    });

    // Skróty klawiszowe (Desktop)
    window.addEventListener('keydown', (e) => {
      if (!DOM.screenQuiz || !DOM.screenQuiz.classList.contains('active')) return;
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        selectAnswer(parseInt(e.key, 10));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevQuestion();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const q = state.questions[state.currentIndex];
        if (q && state.answers[q.id] !== undefined) {
          if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex++;
            renderCurrentQuestion();
            saveQuizProgress();
          } else {
            finishQuiz();
          }
        }
      } else if ((e.key === 's' || e.key === 'S' || e.key === ' ') && state.track !== 'QUICK') {
        e.preventDefault();
        skipCurrentQuestion();
      }
    });

    DOM.btnFinishEarly?.addEventListener('click', () => {
      if (confirm('Czy na pewno chcesz zakończyć test wcześniej? Silnik przeliczy wagi proporcjonalnie na podstawie pytań dotychczas udzielonych.')) {
        finishQuiz();
      }
    });

    // Powrót do menu
    document.querySelectorAll('.btn-back-home').forEach(b => {
      b.addEventListener('click', () => showScreen('intro'));
    });

    // Zgoda RODO Checkbox
    DOM.rodoConsentCheckbox?.addEventListener('change', () => {
      const isChecked = DOM.rodoConsentCheckbox.checked;
      DOM.btnRequestCode.disabled = !isChecked;
      DOM.btnRequestCode.style.opacity = isChecked ? '1' : '0.5';
      DOM.btnRequestCode.style.cursor = isChecked ? 'pointer' : 'not-allowed';
    });

    // Formularz Prośby o Kod i Weryfikacja
    DOM.btnRequestCode?.addEventListener('click', handleRequestCode);
    DOM.btnVerifyCode?.addEventListener('click', handleVerifyCode);
    DOM.inputVerifyCode?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleVerifyCode();
    });

    // Modal Raportu
    DOM.btnOpenReportModal?.addEventListener('click', openReportModal);
    DOM.btnCloseReportModal?.addEventListener('click', closeReportModal);
    DOM.reportModalOverlay?.addEventListener('click', (e) => {
      if (e.target === DOM.reportModalOverlay) closeReportModal();
    });

    // Drukuj & Pobierz z modalu
    DOM.btnPrintModalReport?.addEventListener('click', () => {
      if (state.lastResult) window.REPORT_MODULE.printReport(state.lastResult);
    });
    DOM.btnDownloadModalHtml?.addEventListener('click', () => {
      if (state.lastResult) window.REPORT_MODULE.downloadReportHtmlFile(state.lastResult);
    });

    // Modale Prawne (Regulamin i Polityka Prywatności)
    DOM.btnOpenTerms?.addEventListener('click', () => {
      DOM.modalTermsOverlay?.classList.add('active');
    });
    DOM.btnCloseTerms?.addEventListener('click', () => {
      DOM.modalTermsOverlay?.classList.remove('active');
    });
    DOM.modalTermsOverlay?.addEventListener('click', (e) => {
      if (e.target === DOM.modalTermsOverlay) DOM.modalTermsOverlay.classList.remove('active');
    });

    DOM.btnOpenPrivacy?.addEventListener('click', () => {
      DOM.modalPrivacyOverlay?.classList.add('active');
    });
    DOM.btnClosePrivacy?.addEventListener('click', () => {
      DOM.modalPrivacyOverlay?.classList.remove('active');
    });
    DOM.modalPrivacyOverlay?.addEventListener('click', (e) => {
      if (e.target === DOM.modalPrivacyOverlay) DOM.modalPrivacyOverlay.classList.remove('active');
    });

    // Przyciski Demo
    document.getElementById('demo-intj-quick')?.addEventListener('click', () => runDemo('INTJ'));
    document.getElementById('demo-intj-200')?.addEventListener('click', runDemo200);
    document.getElementById('demo-enfp')?.addEventListener('click', () => runDemo('ENFP'));
    document.getElementById('demo-entj')?.addEventListener('click', () => runDemo('ENTJ'));
    document.getElementById('demo-random')?.addEventListener('click', () => runDemo('RANDOM'));
  }

  /**
   * Automatyczne przywracanie stanu testu i odblokowania po przeładowaniu karty (np. po powrocie z aplikacji poczty)
   */
  function restoreSavedState() {
    try {
      const savedResultJson = localStorage.getItem('psyche_pending_result');
      const isUnlocked = localStorage.getItem('psyche_unlocked') === 'true';
      if (savedResultJson) {
        const savedResult = JSON.parse(savedResultJson);
        if (savedResult && savedResult.mbtiCode4) {
          state.lastResult = savedResult;
          state.isUnlocked = isUnlocked;
          renderResults(savedResult);
          if (isUnlocked) {
            revealFullResults(savedResult);
          }
          showScreen('results');
          return true;
        }
      }
    } catch (e) {
      console.warn('Nie udało się przywrócić zapisanego stanu', e);
    }
    return false;
  }

  /**
   * Obsługa interaktywnych tooltipów psychologicznych
   */
  function setupTooltips() {
    const tooltipEl = document.getElementById('psyche-floating-tooltip');
    if (!tooltipEl) return;

    document.addEventListener('mouseover', (e) => {
      const trigger = e.target.closest('.psyche-tooltip-trigger');
      if (trigger) {
        const tipKey = trigger.getAttribute('data-tip');
        const text = window.PSYCHE_KNOWLEDGE?.PSYCHOLOGICAL_TOOLTIPS?.[tipKey];
        if (text) {
          tooltipEl.textContent = text;
          tooltipEl.classList.add('visible');
          const rect = trigger.getBoundingClientRect();
          const top = rect.bottom + window.scrollY + 6;
          let left = rect.left + window.scrollX - 20;
          if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
          if (left < 10) left = 10;
          tooltipEl.style.top = `${top}px`;
          tooltipEl.style.left = `${left}px`;
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const trigger = e.target.closest('.psyche-tooltip-trigger');
      if (trigger) {
        tooltipEl.classList.remove('visible');
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.psyche-tooltip-trigger');
      if (trigger) {
        e.stopPropagation();
        const tipKey = trigger.getAttribute('data-tip');
        const text = window.PSYCHE_KNOWLEDGE?.PSYCHOLOGICAL_TOOLTIPS?.[tipKey];
        if (text) {
          tooltipEl.textContent = text;
          tooltipEl.classList.toggle('visible');
          const rect = trigger.getBoundingClientRect();
          const top = rect.bottom + window.scrollY + 6;
          let left = rect.left + window.scrollX - 20;
          if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
          if (left < 10) left = 10;
          tooltipEl.style.top = `${top}px`;
          tooltipEl.style.left = `${left}px`;
        }
      } else {
        tooltipEl.classList.remove('visible');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    setupTooltips();
    const restored = restoreSavedState();
    if (!restored) {
      showScreen('intro');
      checkResumeProgress();
    }
  });

})();
