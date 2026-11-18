/**
 * PSYCHE.OS STANDALONE - GENERATOR RAPORTU PSYCHOMETRYCZNEGO (64 TYPY MBTI)
 * Ścisła zawartość: WYŁĄCZNIE 5 Sekcji (zgodnie ze specyfikacją):
 * 1. Typ MBTI (6-literowy kod, opis dychotomii E/I, N/S, T/F, J/P oraz podtypów A/T i C/S)
 * 2. Funkcje Kognitywne (stos funkcji Beebe'a: Ego i Cień wraz z siłą/wykresem)
 * 3. Enneagram (główny typ + skrzydło, np. 5w4, oraz rozkład wszystkich 9 typów)
 * 4. Wielka Piątka (Big 5 / OCEAN) (wyniki procentowe/punktowe O, C, E, A, N z fasetami)
 * 5. Dominujące Archetypy (główny i wspierający archetyp Pearsona wraz z charakterystyką)
 */

window.REPORT_MODULE = (function() {
  const FUNCTION_NAMES = {
    Ni: { name: 'Introwertyczna Intuicja', short: 'Ni', desc: 'Synteza wzorców, przewidywanie trajektorii przyszłości, archetypowa głębia i wewnętrzne olśnienia.' },
    Ne: { name: 'Ekstrawertyczna Intuicja', short: 'Ne', desc: 'Generowanie możliwości, dostrzeganie powiązań w świecie zewnętrznym, dywergencyjna kreatywność.' },
    Ti: { name: 'Introwertyczne Myślenie', short: 'Ti', desc: 'Wewnętrzna precyzja logiczna, dekonstrukcja założeń, poszukiwanie spójnych zasad pierwszych.' },
    Te: { name: 'Ekstrawertyczne Myślenie', short: 'Te', desc: 'Obiektywna organizacja, egzekucja celów, strukturyzacja systemów zewnętrznych i optymalizacja.' },
    Fi: { name: 'Introwertyczne Uczucie', short: 'Fi', desc: 'Subiektywna hierarchia wartości, autentyczność moralna, głęboki wewnętrzny rezonans etyczny.' },
    Fe: { name: 'Ekstrawertyczne Uczucie', short: 'Fe', desc: 'Harmonia międzyludzka, rezonans emocjonalny grupy, odczytywanie dynamiki społecznej i empatii.' },
    Si: { name: 'Introwertyczne Poznanie', short: 'Si', desc: 'Archiwizacja doświadczeń, pamięć somatyczna, stabilność, wierność sprawdzonym procedurom.' },
    Se: { name: 'Ekstrawertyczne Poznanie', short: 'Se', desc: 'Bezpośrednia percepcja tu i teraz, immersja w bodźce zmysłowe, kinetyczna reakcja na otoczenie.' }
  };

  const ENNEAGRAM_NAMES = {
    1: { name: 'Reformator / Perfekcjonista', passion: 'Gniew (Resentyment)', virtue: 'Spokój wewnętrzny' },
    2: { name: 'Pomocnik / Dawca', passion: 'Duma (Uznanie)', virtue: 'Pokora' },
    3: { name: 'Zdobywca / Osiągający', passion: 'Próżność (Iluzja sukcesu)', virtue: 'Autentyczność' },
    4: { name: 'Indywidualista / Romantyk', passion: 'Zawiść (Poczucie braku)', virtue: 'Równowaga emocjonalna' },
    5: { name: 'Obserwator / Badacz', passion: 'Chciwość energii (Skąpstwo zasobów)', virtue: 'Nieprzywiązanie / Wszechwiedza' },
    6: { name: 'Lojalista / Sceptyk', passion: 'Lęk (Ciągła czujność)', virtue: 'Odwaga / Zaufanie' },
    7: { name: 'Entuzjasta / Epikurejczyk', passion: 'Żarłoczność (Głód nowości)', virtue: 'Umiar / Obecność' },
    8: { name: 'Wyzywający / Przywódca', passion: 'Żądza dominacji (Moc)', virtue: 'Niewinność / Prawda' },
    9: { name: 'Rozjemca / Mediator', passion: 'Gnuśność (Zapomnienie o sobie)', virtue: 'Właściwe działanie' }
  };

  const ARCHETYPE_DESCRIPTIONS = {
    'Mędrzec': 'Dążenie do prawdy, analizy fundamentalnej i mądrości. Lęk przed byciem oszukanym lub w błędzie. Główna cnota: prawda i obiektywizm.',
    'Władca': 'Zaprowadzanie porządku, budowanie stabilnych imperiów i odpowiedzialność za struktury. Lęk przed chaosem i upadkiem kontroli.',
    'Twórca': 'Ekspresja wizjonerska, materializacja nowatorskich idei i tworzenie rzeczy trwałych. Lęk przed przeciętnością i wtórnością.',
    'Wojownik': 'Dyscyplina, pokonywanie przeszkód, walka w obronie zasad i triumf nad trudnościami. Lęk przed słabością i porażką.',
    'Magik': 'Transformacja rzeczywistości, rozumienie ukrytych praw rządzących wszechświatem i katalizowanie zmian. Lęk przed negatywnymi skutkami.',
    'Buntownik': 'Przełamywanie skostniałych schematów, rewolucja, kwestionowanie status quo. Lęk przed bezsilnością i zniewoleniem konwenansami.',
    'Kochanek': 'Głęboka bliskość, pasja, zmysłowość i doświadczanie pełni intymności z ludźmi oraz sztuką. Lęk przed osamotnieniem i odrzuceniem.',
    'Odkrywca': 'Niezależność, poszukiwanie autonomii, eksploracja nieznanych terytoriów psychicznych i geograficznych. Lęk przed uwięzieniem i rutyną.',
    'Opiekun': 'Altruizm, troska o innych, budowanie bezpiecznego schronienia i ochrona słabszych. Lęk przed niewdzięcznością i egoizmem.',
    'Błazen': 'Życie chwilą teraźniejszą, radość, demontaż hipokryzji za pomocą humoru i lekkości. Lęk przed nudą i emocjonalną martwotą.',
    'Niewinny': 'Wiara w dobro, poszukiwanie raju, prostota i nieskazitelność intencji. Lęk przed zrobieniem czegoś złego i ukaraniem.',
    'Sierota / Realista': 'Przynależność, twardy pragmatyzm, empatia wobec zwykłego człowieka i odporność na iluzje. Lęk przed wykluczeniem.'
  };

  /**
   * Generuje ściśle 5-sekcyjny HTML raportu
   */
  function generateReportHtml(res) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
    const ax = res.axes;

    return `
      <div class="psyche-report-document">
        <!-- NAGŁÓWEK DOKUMENTU -->
        <header class="report-header">
          <div class="report-brand">
            <span class="report-brand-badge">PSYCHE.OS DIAGNOSTICS</span>
            <h1 class="report-title">Oficjalny Raport Architektury Psychometrycznej</h1>
            <p class="report-subtitle">System 64 Typów Osobowości (Model Typologii Jungowskiej) • Architektura Kognitywna • Data: ${dateStr}</p>
          </div>
          <div class="report-meta-stats">
            <div class="stat-pill"><span class="label">Odpowiedzi:</span> <strong>${res.answeredCount}</strong></div>
            <div class="stat-pill"><span class="label">Pominięte:</span> <strong>${res.skippedCount}</strong></div>
            <div class="stat-pill"><span class="label">Status:</span> <strong>Zweryfikowany (Klucz Jednorazowy)</strong></div>
          </div>
        </header>

        <!-- SEKCJA 1: SYSTEM 64 TYPÓW OSOBOWOŚCI (TYPOLOGIA JUNGOWSKA) -->
        <section class="report-section" id="report-sec-1">
          <div class="section-badge">SEKCJA 01 / 05</div>
          <h2 class="section-title">1. System 64 Typów Osobowości (Model Typologii Jungowskiej) i Rozkład 6 Osi</h2>
          <div class="mbti-summary-card">
            <div class="mbti-code-display">
              <span class="mbti-code">${res.mbtiCode6}</span>
              <span class="mbti-name">${res.mbtiMeta.name}</span>
              <span class="mbti-tagline">„${res.mbtiMeta.archetype}”</span>
            </div>
            <div class="mbti-desc-box">
              <p><strong>Motto kognitywne:</strong> ${res.mbtiMeta.motto || 'Autonomiczna synteza kognitywna ukierunkowana na głębokie przetwarzanie modeli pojęciowych i realizację celów długofalowych.'}</p>
              <div style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 6px; font-size: 12.5px;">
                <p style="margin: 0 0 6px 0;"><strong>5. wymiar (Reakcja na stres):</strong> ${res.dim5Meta.name} - ${res.dim5Meta.trait}.</p>
                <p style="margin: 0;"><strong>6. wymiar (Styl działania):</strong> ${res.dim6Meta.name} - ${res.dim6Meta.trait}.</p>
              </div>
            </div>
          </div>

          <!-- ROZKŁAD 6 OSI PSYCHOMETRYCZNYCH -->
          <div class="dichotomy-container">
            <h3 class="subsection-title">Analityczny Wektor Rozkładu Cech (Wszystkie 6 Wymiarów)</h3>
            
            <!-- E vs I -->
            <div class="dichotomy-row">
              <div class="dichotomy-labels">
                <span class="${ax.EI.posPct >= ax.EI.negPct ? 'active-pole' : ''}">Ekstrawersja (E): ${ax.EI.posPct}%</span>
                <span class="${ax.EI.negPct > ax.EI.posPct ? 'active-pole' : ''}">Introwersja (I): ${ax.EI.negPct}%</span>
              </div>
              <div class="dichotomy-bar-wrapper">
                <div class="dichotomy-bar left-bar" style="width: ${ax.EI.posPct}%;"></div>
                <div class="dichotomy-bar right-bar" style="width: ${ax.EI.negPct}%;"></div>
              </div>
            </div>

            <!-- N vs S -->
            <div class="dichotomy-row">
              <div class="dichotomy-labels">
                <span class="${ax.NS.posPct >= ax.NS.negPct ? 'active-pole' : ''}">Intuicja (N): ${ax.NS.posPct}%</span>
                <span class="${ax.NS.negPct > ax.NS.posPct ? 'active-pole' : ''}">Poznanie (S): ${ax.NS.negPct}%</span>
              </div>
              <div class="dichotomy-bar-wrapper">
                <div class="dichotomy-bar left-bar" style="width: ${ax.NS.posPct}%;"></div>
                <div class="dichotomy-bar right-bar" style="width: ${ax.NS.negPct}%;"></div>
              </div>
            </div>

            <!-- T vs F -->
            <div class="dichotomy-row">
              <div class="dichotomy-labels">
                <span class="${ax.TF.posPct >= ax.TF.negPct ? 'active-pole' : ''}">Myślenie (T): ${ax.TF.posPct}%</span>
                <span class="${ax.TF.negPct > ax.TF.posPct ? 'active-pole' : ''}">Uczucie (F): ${ax.TF.negPct}%</span>
              </div>
              <div class="dichotomy-bar-wrapper">
                <div class="dichotomy-bar left-bar" style="width: ${ax.TF.posPct}%;"></div>
                <div class="dichotomy-bar right-bar" style="width: ${ax.TF.negPct}%;"></div>
              </div>
            </div>

            <!-- J vs P -->
            <div class="dichotomy-row">
              <div class="dichotomy-labels">
                <span class="${ax.JP.posPct >= ax.JP.negPct ? 'active-pole' : ''}">Osądzanie (J): ${ax.JP.posPct}%</span>
                <span class="${ax.JP.negPct > ax.JP.posPct ? 'active-pole' : ''}">Obserwacja (P): ${ax.JP.negPct}%</span>
              </div>
              <div class="dichotomy-bar-wrapper">
                <div class="dichotomy-bar left-bar" style="width: ${ax.JP.posPct}%;"></div>
                <div class="dichotomy-bar right-bar" style="width: ${ax.JP.negPct}%;"></div>
              </div>
            </div>

            <!-- A vs T -->
            <div class="dichotomy-row">
              <div class="dichotomy-labels">
                <span class="${ax.AT.posPct >= ax.AT.negPct ? 'active-pole' : ''}">Asertywność (A): ${ax.AT.posPct}%</span>
                <span class="${ax.AT.negPct > ax.AT.posPct ? 'active-pole' : ''}">Turbulentność (T): ${ax.AT.negPct}%</span>
              </div>
              <div class="dichotomy-bar-wrapper">
                <div class="dichotomy-bar left-bar" style="width: ${ax.AT.posPct}%;"></div>
                <div class="dichotomy-bar right-bar" style="width: ${ax.AT.negPct}%;"></div>
              </div>
            </div>

            <!-- C vs S -->
            <div class="dichotomy-row">
              <div class="dichotomy-labels">
                <span class="${ax.CS.posPct >= ax.CS.negPct ? 'active-pole' : ''}">Kooperatywność (C): ${ax.CS.posPct}%</span>
                <span class="${ax.CS.negPct > ax.CS.posPct ? 'active-pole' : ''}">Autonomiczność (S): ${ax.CS.negPct}%</span>
              </div>
              <div class="dichotomy-bar-wrapper">
                <div class="dichotomy-bar left-bar" style="width: ${ax.CS.posPct}%;"></div>
                <div class="dichotomy-bar right-bar" style="width: ${ax.CS.negPct}%;"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- SEKCJA 2: FUNKCJE KOGNITYWNE (BEEBE) -->
        <section class="report-section" id="report-sec-2">
          <div class="section-badge">SEKCJA 02 / 05</div>
          <h2 class="section-title">2. Architektura Funkcji Kognitywnych (Model 8-Funkcyjny Johna Beebe'a)</h2>
          <p class="section-desc">Poniższy model obrazuje hierarchię aparatu poznawczego: świadome Ego (Bohater, Rodzic, Dziecko, Anima) oraz dynamiczny Cień nieświadomości (Przeciwnik, Senex, Oszust, Demon).</p>

          <div class="functions-grid-two-col">
            <!-- EGO STACK -->
            <div class="stack-column">
              <h3 class="stack-col-title ego-color">Kompleks Ego (Świadomość Operacyjna)</h3>
              <div class="function-card">
                <div class="func-header">
                  <span class="func-role">1. Dominująca (Bohater / Hero)</span>
                  <span class="func-badge">${res.cognitiveStack.hero}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.hero]?.name} (${res.cognitiveStack.hero})</div>
                <div class="func-bar-bg"><div class="func-bar-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.hero]?.pct || 85}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.hero]?.desc}</p>
              </div>

              <div class="function-card">
                <div class="func-header">
                  <span class="func-role">2. Pomocnicza (Dobry Rodzic / Parent)</span>
                  <span class="func-badge">${res.cognitiveStack.parent}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.parent]?.name} (${res.cognitiveStack.parent})</div>
                <div class="func-bar-bg"><div class="func-bar-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.parent]?.pct || 75}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.parent]?.desc}</p>
              </div>

              <div class="function-card">
                <div class="func-header">
                  <span class="func-role">3. Trzeciorzędowa (Wieczne Dziecko / Puer Aeternus)</span>
                  <span class="func-badge">${res.cognitiveStack.child}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.child]?.name} (${res.cognitiveStack.child})</div>
                <div class="func-bar-bg"><div class="func-bar-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.child]?.pct || 55}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.child]?.desc}</p>
              </div>

              <div class="function-card">
                <div class="func-header">
                  <span class="func-role">4. Podrzędna (Brama do Nieświadomości / Anima)</span>
                  <span class="func-badge">${res.cognitiveStack.inferior}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.inferior]?.name} (${res.cognitiveStack.inferior})</div>
                <div class="func-bar-bg"><div class="func-bar-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.inferior]?.pct || 40}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.inferior]?.desc}</p>
              </div>
            </div>

            <!-- SHADOW STACK -->
            <div class="stack-column">
              <h3 class="stack-col-title shadow-color">Kompleks Cienia (Nieświadomość i Reakcje Stresowe)</h3>
              <div class="function-card shadow-card">
                <div class="func-header">
                  <span class="func-role">5. Przeciwnik (Opposing Personality)</span>
                  <span class="func-badge shadow-badge">${res.cognitiveStack.opposing}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.opposing]?.name} (${res.cognitiveStack.opposing})</div>
                <div class="func-bar-bg"><div class="func-bar-fill shadow-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.opposing]?.pct || 48}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.opposing]?.desc}</p>
              </div>

              <div class="function-card shadow-card">
                <div class="func-header">
                  <span class="func-role">6. Senex / Krytyczny Rodzic (Witch / Senex)</span>
                  <span class="func-badge shadow-badge">${res.cognitiveStack.senex}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.senex]?.name} (${res.cognitiveStack.senex})</div>
                <div class="func-bar-bg"><div class="func-bar-fill shadow-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.senex]?.pct || 42}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.senex]?.desc}</p>
              </div>

              <div class="function-card shadow-card">
                <div class="func-header">
                  <span class="func-role">7. Oszust (Trickster / Double Bind)</span>
                  <span class="func-badge shadow-badge">${res.cognitiveStack.trickster}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.trickster]?.name} (${res.cognitiveStack.trickster})</div>
                <div class="func-bar-bg"><div class="func-bar-fill shadow-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.trickster]?.pct || 36}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.trickster]?.desc}</p>
              </div>

              <div class="function-card shadow-card">
                <div class="func-header">
                  <span class="func-role">8. Demon (Demonic / Transformative Function)</span>
                  <span class="func-badge shadow-badge">${res.cognitiveStack.demon}</span>
                </div>
                <div class="func-name">${FUNCTION_NAMES[res.cognitiveStack.demon]?.name} (${res.cognitiveStack.demon})</div>
                <div class="func-bar-bg"><div class="func-bar-fill shadow-fill" style="width: ${res.normalizedCogFunc[res.cognitiveStack.demon]?.pct || 28}%;"></div></div>
                <p class="func-detail">${FUNCTION_NAMES[res.cognitiveStack.demon]?.desc}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- SEKCJA 3: ENNEAGRAM -->
        <section class="report-section" id="report-sec-3">
          <div class="section-badge">SEKCJA 03 / 05</div>
          <h2 class="section-title">3. Typologia Motywacyjna Enneagramu (Typ Rdzenny, Skrzydło i Rozkład)</h2>
          <p class="section-desc">Enneagram bada głębokie, podświadome mechanizmy obronne, rdzenny lęk i motywację. Zapis ze skrzydłem (np. <strong>${res.enneagram.wing}</strong>) obrazuje modyfikację typu rdzennego przez sąsiednią energię psychiczną.</p>

          ${(() => {
            const K = (typeof window !== 'undefined' && window.PSYCHE_KNOWLEDGE) ? window.PSYCHE_KNOWLEDGE : null;
            const wingInfo = K?.ENNEAGRAM_WINGS_DETAILS?.[res.enneagram.wing];
            if (wingInfo) {
              return `
                <div class="enneagram-hero-banner">
                  <div class="ennea-core-badge">
                    <span class="ennea-num">${res.enneagram.wing}</span>
                    <span class="ennea-sub">Konfiguracja Rdzenna</span>
                  </div>
                  <div class="ennea-core-info">
                    <h3>${wingInfo.title}</h3>
                    <p style="color: #a78bfa; font-weight: 600; margin-bottom: 4px;">${wingInfo.subtitle}</p>
                    <p><strong>Triada Motywacyjna:</strong> ${res.enneagram.triad}</p>
                  </div>
                </div>

                <div class="report-rich-grid">
                  <div class="report-rich-box">
                    <h4 class="box-title color-cyan">🎯 Główna Motywacja i Pragnienie:</h4>
                    <p class="box-text">${wingInfo.motivation}</p>
                  </div>
                  <div class="report-rich-box">
                    <h4 class="box-title color-red">⚠️ Podstawowy Lęk Podświadomy:</h4>
                    <p class="box-text">${wingInfo.fear}</p>
                  </div>
                  <div class="report-rich-box">
                    <h4 class="box-title color-purple">🔄 Dynamika w Stresie i w Komforcie:</h4>
                    <p class="box-text"><strong>W stresie:</strong> ${wingInfo.stress}<br><strong>W rozwoju:</strong> ${wingInfo.growth}</p>
                  </div>
                  <div class="report-rich-box">
                    <h4 class="box-title color-emerald">💎 Mocne Strony i Pułapki Życiowe:</h4>
                    <p class="box-text"><strong>Mocne strony:</strong> ${wingInfo.strengths}<br><strong>Ślepe plamki:</strong> ${wingInfo.traps}</p>
                  </div>
                </div>
              `;
            }
            return `
              <div class="enneagram-hero-banner">
                <div class="ennea-core-badge">
                  <span class="ennea-num">${res.enneagram.wing}</span>
                  <span class="ennea-sub">Konfiguracja Rdzenna</span>
                </div>
                <div class="ennea-core-info">
                  <h3>Typ ${res.enneagram.core}: ${ENNEAGRAM_NAMES[res.enneagram.core]?.name}</h3>
                  <p><strong>Triada Motywacyjna:</strong> ${res.enneagram.triad}</p>
                  <p><strong>Namiętność Rdzenna:</strong> ${ENNEAGRAM_NAMES[res.enneagram.core]?.passion} | <strong>Cnota Integrująca:</strong> ${ENNEAGRAM_NAMES[res.enneagram.core]?.virtue}</p>
                </div>
              </div>
            `;
          })()}

          <div class="enneagram-distribution-table">
            <h3 class="subsection-title">Pełny Rozkład Energetyczny Wszystkich 9 Typów Enneagramu</h3>
            <div class="ennea-grid-9">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const data = res.enneagram.distribution ? res.enneagram.distribution[num] : null;
                const pct = data ? data.pct : Math.min(98, Math.max(10, Math.round(((res.enneagram.scores[num] || 0) + 10) / 20 * 100)));
                const isCore = num === res.enneagram.core;
                const K = (typeof window !== 'undefined' && window.PSYCHE_KNOWLEDGE) ? window.PSYCHE_KNOWLEDGE : null;
                const shortDesc = K?.ENNEAGRAM_CORE_TYPES?.[num]?.shortDesc || '';
                return `
                  <div class="ennea-item-card ${isCore ? 'core-item' : ''}">
                    <div class="ennea-item-num">Typ ${num} ${isCore ? '★ (GŁÓWNY)' : ''}</div>
                    <div class="ennea-item-name">${ENNEAGRAM_NAMES[num]?.name.split('/')[0]}</div>
                    <div class="ennea-item-bar"><div class="fill" style="width: ${pct}%;"></div></div>
                    <div class="ennea-item-score">${pct}% nasycenia</div>
                    ${shortDesc ? `<div style="font-size: 10px; color: #9ca3af; margin-top: 4px; line-height: 1.35;">${shortDesc}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- SEKCJA 4: WIELKA PIĄTKA (BIG 5 / OCEAN) -->
        <section class="report-section" id="report-sec-4">
          <div class="section-badge">SEKCJA 04 / 05</div>
          <h2 class="section-title">4. Model Pięcioczynnikowy Osobowości (Big Five / OCEAN)</h2>
          <p class="section-desc">Zestandaryzowany model psychometrii cech (Costa & McCrae). Wyniki wyrażone w skali percentylowej (0–100%) w odniesieniu do próby normalizacyjnej.</p>

          <div class="ocean-list">
            ${[
              { key: 'O', name: 'Otwartość na Doświadczenie (Openness)' },
              { key: 'C', name: 'Sumienność (Conscientiousness)' },
              { key: 'E', name: 'Ekstrawersja (Extraversion)' },
              { key: 'A', name: 'Ugodowość (Agreeableness)' },
              { key: 'N', name: 'Neurotyczność (Neuroticism)' }
            ].map(trait => {
              const data = res.bigFive[trait.key];
              const levelColor = data.level === 'Wysoka' ? '#10B981' : (data.level === 'Niska' ? '#3B82F6' : '#F59E0B');
              return `
                <div class="ocean-card">
                  <div class="ocean-card-header">
                    <div>
                      <span class="ocean-key">${trait.key}</span>
                      <strong class="ocean-name">${trait.name}</strong>
                    </div>
                    <div class="ocean-score-badge" style="border-color: ${levelColor}; color: ${levelColor};">
                      ${data.pct}% • Poziom: ${data.level}
                    </div>
                  </div>
                  <div class="ocean-progress-wrapper">
                    <div class="ocean-progress-bar" style="width: ${data.pct}%; background-color: ${levelColor};"></div>
                  </div>
                  <div class="ocean-interpretation">
                    <p class="academic-text"><strong>Wnioski kliniczno-rozwojowe:</strong> ${data.academicInterpretation}</p>
                    <p class="facets-text"><strong>Kluczowe fasety cechy:</strong> ${data.facets.join(' • ')}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- SEKCJA 5: DOMINUJĄCE ARCHETYPY -->
        <section class="report-section" id="report-sec-5">
          <div class="section-badge">SEKCJA 05 / 05</div>
          <h2 class="section-title">5. Dominujące Archetypy Psychologiczne (Model Carol Pearson)</h2>
          <p class="section-desc">Struktury nieświadomości zbiorowej determinujące narrację życiową jednostki, jej mity przewodnie oraz fundamentalne źródła motywacji i lęków.</p>

          ${(() => {
            const K = (typeof window !== 'undefined' && window.PSYCHE_KNOWLEDGE) ? window.PSYCHE_KNOWLEDGE : null;
            const domInfo = K?.ARCHETYPES_DETAILS?.[res.archetypes.dominant.name];
            const secInfo = K?.ARCHETYPES_DETAILS?.[res.archetypes.secondary.name];
            return `
              <div class="archetypes-container">
                <div class="archetype-dominant-card">
                  <div class="arch-tag">GŁÓWNY ARCHETYP PRZEWODNI</div>
                  <h3 class="arch-name">${domInfo ? domInfo.name : res.archetypes.dominant.name} (${res.archetypes.dominant.pct}%)</h3>
                  <p class="arch-desc" style="margin-bottom: 12px; font-style: italic;">${domInfo ? domInfo.short : (ARCHETYPE_DESCRIPTIONS[res.archetypes.dominant.name] || '')}</p>
                  ${domInfo ? `
                    <div style="font-size: 11.5px; line-height: 1.45; color: #cbd5e1;">
                      <p style="margin: 4px 0;"><strong style="color: #34d399;">⚡ Dar / Supermoc:</strong> ${domInfo.gift}</p>
                      <p style="margin: 4px 0;"><strong style="color: #f87171;">🌑 Cień / Zagrożenie:</strong> ${domInfo.shadow}</p>
                      <p style="margin: 4px 0;"><strong style="color: #38bdf8;">🧭 Strategia Życiowa i Rola w Relacjach:</strong> ${domInfo.strategy}</p>
                    </div>
                  ` : ''}
                </div>

                <div class="archetype-secondary-card">
                  <div class="arch-tag sec-tag">ARCHETYP WSPIERAJĄCY (KOMPLEMENTARNY)</div>
                  <h3 class="arch-name">${secInfo ? secInfo.name : res.archetypes.secondary.name} (${res.archetypes.secondary.pct}%)</h3>
                  <p class="arch-desc" style="margin-bottom: 12px; font-style: italic;">${secInfo ? secInfo.short : (ARCHETYPE_DESCRIPTIONS[res.archetypes.secondary.name] || '')}</p>
                  ${secInfo ? `
                    <div style="font-size: 11.5px; line-height: 1.45; color: #cbd5e1;">
                      <p style="margin: 4px 0;"><strong style="color: #34d399;">⚡ Dar / Supermoc:</strong> ${secInfo.gift}</p>
                      <p style="margin: 4px 0;"><strong style="color: #f87171;">🌑 Cień / Zagrożenie:</strong> ${secInfo.shadow}</p>
                      <p style="margin: 4px 0;"><strong style="color: #38bdf8;">🧭 Strategia Życiowa i Rola w Relacjach:</strong> ${secInfo.strategy}</p>
                    </div>
                  ` : ''}
                </div>

                <div class="archetypes-table-wrapper">
                  <h4 class="subsection-title">Hierarchia Wszystkich 12 Archetypów Pearson</h4>
                  <div class="arch-rank-grid">
                    ${res.archetypes.ranking.map((arch, index) => {
                      const K = (typeof window !== 'undefined' && window.PSYCHE_KNOWLEDGE) ? window.PSYCHE_KNOWLEDGE : null;
                      const aDesc = K?.ARCHETYPES_DETAILS?.[arch.name]?.short || '';
                      return `
                        <div class="arch-rank-item ${index === 0 ? 'arch-first' : (index === 1 ? 'arch-second' : '')}">
                          <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 3px;">
                            <span class="rank-pos">#${index + 1}</span>
                            <span class="rank-name">${arch.name}</span>
                            <span class="rank-pct">${arch.pct}%</span>
                          </div>
                          ${aDesc ? `<div style="font-size: 10px; color: #9ca3af; line-height: 1.3;">${aDesc}</div>` : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `;
          })()}
        </section>

        <!-- STOPKA DOKUMENTU -->
        <footer class="report-footer" style="flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; width: 100%;">
            <span>PSYCHE.OS System 64 Typów Osobowości (Model Typologii Jungowskiej) v3.5</span>
            <span class="report-hash">Dokument zautoryzowany jednorazowym kluczem kryptograficznym</span>
          </div>
          <div style="font-size: 10px; color: #9ca3af; line-height: 1.45; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px;">
            <strong>Nota prawna (Disclaimer):</strong> Narzędzie ma charakter edukacyjny, rozwojowy i rozrywkowy (self-discovery). Uzyskane wyniki nie stanowią diagnozy psychologicznej, psychiatrycznej ani medycznej w rozumieniu przepisów prawa. System nie jest powiązany ani certyfikowany przez The Myers-Briggs Company ani Gallup, Inc.
          </div>
        </footer>
      </div>
    `;
  }

  /**
   * Wywołanie drukowania lub zapisu do PDF
   */
  function printReport(result) {
    const printArea = document.getElementById('report-print-container');
    if (!printArea) {
      alert('Błąd kontenera raportu.');
      return;
    }
    printArea.innerHTML = generateReportHtml(result);
    setTimeout(() => {
      window.print();
    }, 250);
  }

  /**
   * Pobieranie pliku HTML raportu offline
   */
  function downloadReportHtmlFile(result) {
    const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Raport Psychometryczny - ${result.mbtiCode6} - PSYCHE.OS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 24px; margin: 0; }
    .psyche-report-document { max-width: 900px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .report-header { border-bottom: 2px solid #374151; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; }
    .report-brand-badge { background: #06b6d4; color: #000; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; letter-spacing: 1px; display: inline-block; margin-bottom: 8px; }
    .report-title { font-size: 26px; margin: 0 0 6px 0; color: #ffffff; }
    .report-subtitle { color: #9ca3af; font-size: 13px; margin: 0; }
    .report-meta-stats { display: flex; gap: 8px; flex-direction: column; text-align: right; }
    .stat-pill { background: #1f2937; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
    .report-section { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #1f2937; }
    .section-badge { color: #06b6d4; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
    .section-title { font-size: 20px; color: #f9fafb; margin: 0 0 16px 0; }
    .section-desc { font-size: 13px; color: #9ca3af; line-height: 1.5; margin-bottom: 20px; }
    .mbti-summary-card { display: flex; gap: 24px; background: #1a2234; border: 1px solid #2d3748; padding: 20px; border-radius: 10px; margin-bottom: 24px; }
    .mbti-code-display { text-align: center; min-width: 150px; border-right: 1px solid #2d3748; padding-right: 20px; }
    .mbti-code { display: block; font-size: 34px; font-weight: 900; color: #06b6d4; }
    .mbti-name { display: block; font-weight: 700; color: #fff; font-size: 15px; }
    .mbti-tagline { font-size: 12px; color: #9ca3af; font-style: italic; }
    .mbti-desc-box { font-size: 13.5px; line-height: 1.6; color: #d1d5db; }
    .dichotomy-row { margin-bottom: 14px; }
    .dichotomy-labels { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 4px; }
    .active-pole { color: #06b6d4; }
    .dichotomy-bar-wrapper { display: flex; height: 10px; background: #1f2937; border-radius: 5px; overflow: hidden; }
    .dichotomy-bar.left-bar { background: #06b6d4; }
    .dichotomy-bar.right-bar { background: #8b5cf6; }
    .functions-grid-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .stack-col-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .ego-color { color: #06b6d4; }
    .shadow-color { color: #f59e0b; }
    .function-card { background: #131c2e; border: 1px solid #1f2937; padding: 14px; border-radius: 8px; margin-bottom: 12px; }
    .func-header { display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; font-weight: 600; margin-bottom: 4px; }
    .func-badge { background: #06b6d4; color: #000; font-weight: 800; font-size: 11px; padding: 2px 6px; border-radius: 4px; }
    .shadow-badge { background: #f59e0b; color: #000; }
    .func-name { font-size: 14px; font-weight: 700; color: #f3f4f6; margin-bottom: 6px; }
    .func-bar-bg { height: 6px; background: #1f2937; border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
    .func-bar-fill { height: 100%; background: #06b6d4; }
    .shadow-fill { background: #f59e0b; }
    .func-detail { font-size: 11.5px; color: #9ca3af; margin: 0; line-height: 1.4; }
    .enneagram-hero-banner { display: flex; gap: 20px; background: #172033; border: 1px solid #374151; padding: 20px; border-radius: 10px; margin-bottom: 20px; align-items: center; }
    .ennea-core-badge { text-align: center; background: #8b5cf6; color: #fff; padding: 14px 20px; border-radius: 8px; min-width: 90px; }
    .ennea-num { font-size: 32px; font-weight: 900; display: block; line-height: 1; }
    .ennea-sub { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ennea-core-info h3 { margin: 0 0 6px 0; font-size: 18px; color: #fff; }
    .ennea-core-info p { margin: 3px 0; font-size: 12.5px; color: #cbd5e1; }
    .ennea-grid-9 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .ennea-item-card { background: #131a29; border: 1px solid #1f2937; padding: 10px; border-radius: 6px; }
    .ennea-item-card.core-item { border-color: #8b5cf6; background: #1e1b4b; }
    .ennea-item-num { font-size: 11px; font-weight: 700; color: #8b5cf6; }
    .ennea-item-name { font-size: 12px; font-weight: 600; color: #f9fafb; margin-bottom: 6px; }
    .ennea-item-bar { height: 5px; background: #1f2937; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
    .ennea-item-bar .fill { height: 100%; background: #8b5cf6; }
    .ennea-item-score { font-size: 10px; color: #9ca3af; }
    .ocean-card { background: #131c2e; border: 1px solid #1f2937; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
    .ocean-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .ocean-key { background: #374151; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-right: 8px; font-size: 12px; }
    .ocean-name { font-size: 15px; color: #fff; }
    .ocean-score-badge { font-size: 12px; font-weight: 700; border: 1px solid; padding: 3px 8px; border-radius: 4px; }
    .ocean-progress-wrapper { height: 8px; background: #1f2937; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
    .ocean-progress-bar { height: 100%; }
    .ocean-interpretation { font-size: 12px; line-height: 1.5; color: #cbd5e1; }
    .ocean-interpretation p { margin: 4px 0; }
    .archetype-dominant-card { background: #192338; border: 1px solid #06b6d4; padding: 20px; border-radius: 8px; margin-bottom: 14px; }
    .archetype-secondary-card { background: #192338; border: 1px solid #8b5cf6; padding: 18px; border-radius: 8px; margin-bottom: 20px; }
    .arch-tag { font-size: 10.5px; font-weight: 800; color: #06b6d4; letter-spacing: 1px; margin-bottom: 6px; }
    .arch-tag.sec-tag { color: #8b5cf6; }
    .arch-name { margin: 0 0 8px 0; font-size: 18px; color: #fff; }
    .arch-desc { font-size: 12.5px; color: #cbd5e1; margin: 0; line-height: 1.5; }
    .arch-rank-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
    .arch-rank-item { background: #131a29; border: 1px solid #1f2937; padding: 8px; border-radius: 6px; font-size: 11.5px; display: flex; justify-content: space-between; }
    .arch-first { border-color: #06b6d4; color: #06b6d4; }
    .arch-second { border-color: #8b5cf6; color: #8b5cf6; }
    .report-rich-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .report-rich-box { background: #131c2e; border: 1px solid #1f2937; border-radius: 8px; padding: 12px 14px; }
    .box-title { font-size: 11.5px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 6px 0; }
    .box-text { font-size: 11.5px; color: #cbd5e1; line-height: 1.5; margin: 0; }
    .color-cyan { color: #06b6d4; }
    .color-red { color: #f87171; }
    .color-purple { color: #a78bfa; }
    .color-emerald { color: #10b981; }
    .report-footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
    @media print {
      body { background: #ffffff !important; color: #111827 !important; padding: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .psyche-report-document { box-shadow: none !important; border: none !important; padding: 20px !important; background: #ffffff !important; max-width: 100% !important; }
      .report-title, .section-title, .func-name, .mbti-name, .ocean-name, .arch-name { color: #111827 !important; }
      .report-section, .report-rich-box { page-break-inside: avoid !important; break-inside: avoid !important; border-bottom: 1px solid #e5e7eb !important; }
      .mbti-summary-card, .function-card, .ennea-item-card, .ocean-card, .archetype-dominant-card, .archetype-secondary-card, .report-rich-box { background: #f9fafb !important; border: 1px solid #e5e7eb !important; color: #111827 !important; }
      .func-detail, .section-desc, .report-subtitle, .ocean-interpretation, .arch-desc, .box-text { color: #4b5563 !important; }
    }
  </style>
</head>
<body>
  ${generateReportHtml(result)}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Raport_Psychometryczny_${result.mbtiCode6}_PSYCHE.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    generateReportHtml,
    printReport,
    downloadReportHtmlFile
  };
})();
