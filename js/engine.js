/**
 * PSYCHE.OS STANDALONE - ZAAWANSOWANY SILNIK OBLICZENIOWY (64 TYPY MBTI)
 * 
 * Cechy kluczowe:
 * 1. Zrównoważona polaryzacja pytań (E/I, N/S, T/F, J/P, A/T, C/S).
 * 2. Symetryczna skala Likerta (-2 do +2): odpowiedź neutralna = 0 punktów (brak sztucznego biasu).
 * 3. Proporcjonalna normalizacja przy pomijaniu pytań (wyłącza pytania z mianownika).
 * 4. Pełny system 64 typów MBTI (6 liter: np. INTJ-AS, ENFP-TC).
 * 5. Wektorowe dopasowanie 1 postaci męskiej i 1 żeńskiej (zbalansowane, realistyczne -%).
 * 6. Ukryta funkcja diagnostyczna `window.runDiagnostics()` potwierdzająca generowanie każdego z 64 typów.
 */

window.PSYCHE_ENGINE = (function() {

  // Słownik 16 typów bazowych (4 litery) wraz z pogłębionym wprowadzeniem psychodynamicznym
  const MBTI_BASE_META = {
    'INTJ': {
      name: 'Architekt',
      archetype: 'Strategiczny Wizjoner',
      motto: 'Wszystko podlega dekonstrukcji, optymalizacji i strategicznemu ulepszeniu.',
      desc: 'Osobowość typu INTJ opiera się na głębokiej syntezie pojęciowej, dalekowzrocznej wizji oraz bezkompromisowej optymalizacji systemów. Twój aparat kognitywny instynktownie dekonstruuje rzeczywistość na czynniki pierwsze, by odkrywać ukryte prawa i wzorce rządzące przyszłością. Jako niezależny strateg łączysz chłodny, obiektywny osąd z pasją do tworzenia trwałych, całościowych rozwiązań.'
    },
    'INTP': {
      name: 'Logik',
      archetype: 'Innowacyjny Teoretyk',
      motto: 'Prawda jest bezwzględnym modelem spójności pojęciowej i definicyjnej precyzji.',
      desc: 'Osobowość typu INTP charakteryzuje się niestrudzoną dociekliwością intelektualną oraz dążeniem do absolutnej spójności definicyjnej i teoretycznej. Twój umysł funkcjonuje jak precyzyjne laboratorium epistemologiczne, nieustannie testujące założenia i eliminujące logiczne błędy myślowe. Wnosisz unikalną zdolność dostrzegania elegancji w skomplikowanych strukturach abstrakcyjnych.'
    },
    'ENTJ': {
      name: 'Dowódca',
      archetype: 'Bezwzględny Realizator',
      motto: 'Nie ma przeszkód, są tylko źle zorganizowane zasoby i nieefektywne strategie.',
      desc: 'Osobowość typu ENTJ to uosobienie strategicznego przywództwa, zdecydowania operacyjnego i bezkompromisowej efektywności. Twój aparat kognitywny natychmiast identyfikuje nieefektywności w strukturach i przekształca długoterminowe cele w precyzyjnie skoordynowane plany działania. Jako racjonalny lider inspirujesz otoczenie wysokimi standardami, dyscypliną logiczną i nieustannym dążeniem do mierzalnych rezultatów.'
    },
    'ENTP': {
      name: 'Wizjoner',
      archetype: 'Adwokat Diabła',
      motto: 'Granice istnieją tylko po to, by je dialektycznie zakwestionować i zburzyć.',
      desc: 'Osobowość typu ENTP napędzana jest niespożytą ciekawością poznawczą, dialektycznym sprytem i zamiłowaniem do innowacji. Z łatwością kwestionujesz zastane schematy, łącząc odległe punkty widzenia w zupełnie nowe, przełomowe idee i scenariusze. Twój umysł rozwija się najpełniej w dynamicznym dialogu, intelektualnych wyzwaniach i eksploracji niezbadanych możliwości.'
    },
    'INFJ': {
      name: 'Rzecznik',
      archetype: 'Mistyczny Przewodnik',
      motto: 'Służyć ewolucji ludzkiej świadomości ku prawdzie, głębi i moralnemu wglądowi.',
      desc: 'Osobowość typu INFJ łączy przenikliwą intuicję dotyczącą ludzkiej psychiki z głębokim, nienaruszalnym kompasem moralnym. Postrzegasz świat przez pryzmat ukrytych znaczeń, symboli i długofalowych konsekwencji dla rozwoju człowieka. Twoją misją jest cicha, lecz transformująca praca nad urzeczywistnianiem ideałów sprawiedliwości, empatii i duchowej prawdy.'
    },
    'INFP': {
      name: 'Pośrednik',
      archetype: 'Idealistyczny Twórca',
      motto: 'Wierność własnemu sumieniu i autentyczności jest jedyną miarą godnego życia.',
      desc: 'Osobowość typu INFP kieruje się niezłomną wiernością własnemu sumieniu, autentycznością i głęboką wrażliwością etyczną. Posiadasz bogaty wewnętrzny świat wartości, który pozwala Ci dostrzegać piękno, potencjał i unikalność w każdej istocie ludzkiej. Jako idealistyczny twórca dążysz do harmonii pomiędzy zewnętrznym działaniem a wewnętrzną prawdą serca.'
    },
    'ENFJ': {
      name: 'Protagonista',
      archetype: 'Charyzmatyczny Mentor',
      motto: 'Wydobywać z innych ich najwyższy, ukryty potencjał i prowadzić ich ku jedności.',
      desc: 'Osobowość typu ENFJ to naturalny przewodnik ludzkich serc, łączący charyzmatyczną ekspresję z intuicyjnym wyczuciem potrzeb innych. Posiadasz rzadki dar inspirowania jednostek i całych grup do przekraczania własnych ograniczeń w imię wyższego dobra. Twoja energia spaja społeczności wokół wspólnej wizji, empatii i konstruktywnego rozwoju.'
    },
    'ENFP': {
      name: 'Działacz',
      archetype: 'Entuzjastyczny Reformator',
      motto: 'Świat jest nieskończonym oceanem fascynujących możliwości i głębokich spotkań.',
      desc: 'Osobowość typu ENFP to wulkan twórczego entuzjazmu, otwartości na świat i autentycznego rezonansu międzyludzkiego. W każdym człowieku i sytuacji dostrzegasz iskry niewykorzystanego potencjału oraz fascynujące sploty możliwości. Twój entuzjazm i elastyczność przełamują sztywne bariery, wnosząc świeżość i inspirację tam, gdzie panowała stagnacja.'
    },
    'ISTJ': {
      name: 'Logistyk',
      archetype: 'Niezłomny Inspektor',
      motto: 'Fakty, procedury i lojalność wobec zobowiązań są fundamentem porządku.',
      desc: 'Osobowość typu ISTJ stanowi filar stabilności, rzetelności i odpowiedzialności w każdej strukturze społecznej. Twój aparat poznawczy opiera się na skrupulatnej weryfikacji faktów, szacunku dla sprawdzonych procedur i bezwzględnej lojalności wobec danego słowa. Zapewniasz bezpieczeństwo i ład, budując trwałe fundamenty, na których inni mogą bez wahania polegać.'
    },
    'ISFJ': {
      name: 'Obrońca',
      archetype: 'Troskliwy Strażnik',
      motto: 'Cicha, codzienna służba i ochrona bezpieczeństwa tych, których kocham.',
      desc: 'Osobowość typu ISFJ to uosobienie cichej troski, niezawodności i praktycznego humanizmu. Posiadasz nadzwyczajną pamięć do detali dotyczących potrzeb bliskich oraz głębokie poczucie obowiązku ochrony tradycji i harmonii. Twoja codzienna, oddana praca tworzy bezpieczną przestrzeń, w której każdy czuje się zauważony, zaopiekowany i doceniony.'
    },
    'ESTJ': {
      name: 'Wykonawca',
      archetype: 'Twardy Administrator',
      motto: 'Porządek społeczny, rzetelne reguły gry i dowożenie mierzalnych rezultatów.',
      desc: 'Osobowość typu ESTJ to mistrz organizacji, sprawnego zarządzania i dbałości o standardy doskonałości. Z natury przejmujesz inicjatywę w porządkowaniu chaosu, wdrażaniu jasnych reguł oraz egzekwowaniu zobowiązań. Twoja bezpośredniość, determinacja i szacunek dla uczciwej pracy czynią z Ciebie niezłomnego lidera operacyjnego.'
    },
    'ESFJ': {
      name: 'Doradca',
      archetype: 'Społeczny Integrator',
      motto: 'Wzajemna życzliwość, tradycja i troska o dobrostan całej wspólnoty.',
      desc: 'Osobowość typu ESFJ wyróżnia się niezwykłym ciepłem społecznym, wyczuciem dynamiki grupowej i troską o dobrostan otoczenia. Dbasz o relacje z wyjątkową pieczołowitością, pielęgnując poczucie przynależności, tradycję i współpracę. Twoja obecność łagodzi napięcia, integruje ludzi i wnosi serdeczność do każdej społeczności.'
    },
    'ISTP': {
      name: 'Wirtuoz',
      archetype: 'Pragmatyczny Mistrz',
      motto: 'Zrozumieć, jak rzeczy działają pod maską i opanować ich fizyczną mechanikę.',
      desc: 'Osobowość typu ISTP łączy chłodną, analityczną obserwację z pragmatycznym mistrzostwem w operowaniu narzędziami i mechanizmami. Reagujesz błyskawicznie na realne wyzwania fizycznego świata, zachowując stoicki spokój w sytuacjach awaryjnych. Cenisz suwerenność, logiczną oszczędność ruchów i natychmiastowe rozwiązywanie konkretnych problemów.'
    },
    'ISFP': {
      name: 'Poszukiwacz',
      archetype: 'Wrażliwy Esteta',
      motto: 'Żyć tu i teraz w harmonii z własnymi zmysłami, pięknem i wewnętrznym rezonansem.',
      desc: 'Osobowość typu ISFP żyje w głębokim zmysłowym i emocjonalnym rezonansie z otaczającym światem. Wyrażasz swoją unikalną tożsamość poprzez działanie, sztukę, styl bycia i autentyczne gesty, unikając narzucania się innym. Twoja wrażliwość na piękno, empatia i elastyczność sprawiają, że wnosisz dyskretną harmonię wszędzie, gdzie się pojawiasz.'
    },
    'ESTP': {
      name: 'Przedsiębiorca',
      archetype: 'Kinetyczny Ryzykant',
      motto: 'Życie jest grą wysokich stawek - liczy się natychmiastowa reakcja i odwaga.',
      desc: 'Osobowość typu ESTP to żywioł natychmiastowego działania, bystrej percepcji i odwagi w podejmowaniu skalkulowanego ryzyka. Czytasz otoczenie w ułamku sekundy, natychmiast chwytając nadarzające się okazje i adaptując się do zmiennych warunków gry. Twoja charyzma, energia i bezpretensjonalny pragmatyzm przyciągają ludzi i wprawiają sprawy w ruch.'
    },
    'ESFP': {
      name: 'Animator',
      archetype: 'Żywioł Estrady',
      motto: 'Świat jest sceną, na której należy świecić najjaśniejszym, autentycznym światłem.',
      desc: 'Osobowość typu ESFP czerpie radość z pełnego doświadczania chwili obecnej i dzielenia się swoją żywiołową energią z innymi. Posiadasz wrodzony dar rozładowywania napięcia, budowania entuzjazmu i tworzenia niezapomnianych wspomnień. Jako spontaniczny esteta celebrujesz życie, inspirując innych do autentyczności i radości.'
    }
  };

  // Metadane 5. wymiaru: A (Assertive / Asertywny) vs T (Turbulent / Turbulentny)
  const DIM_5_META = {
    'A': {
      code: 'A',
      name: 'Asertywny (Assertive)',
      trait: 'Odporność na stres, spokój emocjonalny i wysoka pewność siebie',
      desc: 'W sytuacjach kryzysowych zachowuje zimną krew. Nie rozpamiętuje błędów ani nie ulega syndromowi oszusta. Charakteryzuje się stabilnym poczuciem własnej wartości i odpornością na opinię innych.'
    },
    'T': {
      code: 'T',
      name: 'Turbulentny (Turbulent)',
      trait: 'Wysoka czujność, perfekcjonizm i dążenie do nieustannej poprawy',
      desc: 'Nieustannie analizuje swoje działania w poszukiwaniu luk i obszarów do ulepszenia. Wyższa wrażliwość na stres staje się dla niego potężnym motorem napędowym do rygorystycznego przygotowania i mistrzostwa.'
    }
  };

  // Metadane 6. wymiaru: C (Cooperative / Kooperatywny) vs S (Self-directed / Autonomiczny)
  const DIM_6_META = {
    'C': {
      code: 'C',
      name: 'Kooperatywny (Cooperative)',
      trait: 'Orientacja na synergię zespołową, otwartość i współdzielenie zasobów',
      desc: 'Preferuje kolektywny styl działania oparty na dialogu, wzajemnym wsparciu i kompromisie. Wierzy, że przełomowe rezultaty są owocem zgranej pracy wspólnotowej i zaufania.'
    },
    'S': {
      code: 'S',
      name: 'Autonomiczny (Self-directed)',
      trait: 'Niezależność decyzyjna, samowystarczalność i suwerenność operacyjna',
      desc: 'Działa najlepiej jako autonomiczna jednostka lub suwerenny lider. Ceni niezależność myślenia, unika biurokratycznych komitetów i polega przede wszystkim na własnych kompetencjach.'
    }
  };

  // Stosy funkcji Johna Beebe'a (Ego + Cień)
  const BEEBE_STACKS = {
    'INTJ': { ego: [{role:'Hero (Dominująca)', func:'Ni'}, {role:'Parent (Pomocnicza)', func:'Te'}, {role:'Child (Trzeciorzędowa)', func:'Fi'}, {role:'Inferior (Podrzędna)', func:'Se'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Ne'}, {role:'Senex (Krytyk)', func:'Ti'}, {role:'Trickster (Oszust)', func:'Fe'}, {role:'Demon (Demon)', func:'Si'}] },
    'INTP': { ego: [{role:'Hero (Dominująca)', func:'Ti'}, {role:'Parent (Pomocnicza)', func:'Ne'}, {role:'Child (Trzeciorzędowa)', func:'Si'}, {role:'Inferior (Podrzędna)', func:'Fe'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Te'}, {role:'Senex (Krytyk)', func:'Ni'}, {role:'Trickster (Oszust)', func:'Se'}, {role:'Demon (Demon)', func:'Fi'}] },
    'ENTJ': { ego: [{role:'Hero (Dominująca)', func:'Te'}, {role:'Parent (Pomocnicza)', func:'Ni'}, {role:'Child (Trzeciorzędowa)', func:'Se'}, {role:'Inferior (Podrzędna)', func:'Fi'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Ti'}, {role:'Senex (Krytyk)', func:'Ne'}, {role:'Trickster (Oszust)', func:'Si'}, {role:'Demon (Demon)', func:'Fe'}] },
    'ENTP': { ego: [{role:'Hero (Dominująca)', func:'Ne'}, {role:'Parent (Pomocnicza)', func:'Ti'}, {role:'Child (Trzeciorzędowa)', func:'Fe'}, {role:'Inferior (Podrzędna)', func:'Si'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Ni'}, {role:'Senex (Krytyk)', func:'Te'}, {role:'Trickster (Oszust)', func:'Fi'}, {role:'Demon (Demon)', func:'Se'}] },
    'INFJ': { ego: [{role:'Hero (Dominująca)', func:'Ni'}, {role:'Parent (Pomocnicza)', func:'Fe'}, {role:'Child (Trzeciorzędowa)', func:'Ti'}, {role:'Inferior (Podrzędna)', func:'Se'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Ne'}, {role:'Senex (Krytyk)', func:'Fi'}, {role:'Trickster (Oszust)', func:'Te'}, {role:'Demon (Demon)', func:'Si'}] },
    'INFP': { ego: [{role:'Hero (Dominująca)', func:'Fi'}, {role:'Parent (Pomocnicza)', func:'Ne'}, {role:'Child (Trzeciorzędowa)', func:'Si'}, {role:'Inferior (Podrzędna)', func:'Te'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Fe'}, {role:'Senex (Krytyk)', func:'Ni'}, {role:'Trickster (Oszust)', func:'Se'}, {role:'Demon (Demon)', func:'Ti'}] },
    'ENFJ': { ego: [{role:'Hero (Dominująca)', func:'Fe'}, {role:'Parent (Pomocnicza)', func:'Ni'}, {role:'Child (Trzeciorzędowa)', func:'Se'}, {role:'Inferior (Podrzędna)', func:'Ti'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Fi'}, {role:'Senex (Krytyk)', func:'Ne'}, {role:'Trickster (Oszust)', func:'Si'}, {role:'Demon (Demon)', func:'Te'}] },
    'ENFP': { ego: [{role:'Hero (Dominująca)', func:'Ne'}, {role:'Parent (Pomocnicza)', func:'Fi'}, {role:'Child (Trzeciorzędowa)', func:'Te'}, {role:'Inferior (Podrzędna)', func:'Si'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Ni'}, {role:'Senex (Krytyk)', func:'Fe'}, {role:'Trickster (Oszust)', func:'Ti'}, {role:'Demon (Demon)', func:'Se'}] },
    'ISTJ': { ego: [{role:'Hero (Dominująca)', func:'Si'}, {role:'Parent (Pomocnicza)', func:'Te'}, {role:'Child (Trzeciorzędowa)', func:'Fi'}, {role:'Inferior (Podrzędna)', func:'Ne'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Se'}, {role:'Senex (Krytyk)', func:'Ti'}, {role:'Trickster (Oszust)', func:'Fe'}, {role:'Demon (Demon)', func:'Ni'}] },
    'ISFJ': { ego: [{role:'Hero (Dominująca)', func:'Si'}, {role:'Parent (Pomocnicza)', func:'Fe'}, {role:'Child (Trzeciorzędowa)', func:'Ti'}, {role:'Inferior (Podrzędna)', func:'Ne'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Se'}, {role:'Senex (Krytyk)', func:'Fi'}, {role:'Trickster (Oszust)', func:'Te'}, {role:'Demon (Demon)', func:'Ni'}] },
    'ESTJ': { ego: [{role:'Hero (Dominująca)', func:'Te'}, {role:'Parent (Pomocnicza)', func:'Si'}, {role:'Child (Trzeciorzędowa)', func:'Ne'}, {role:'Inferior (Podrzędna)', func:'Fi'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Ti'}, {role:'Senex (Krytyk)', func:'Se'}, {role:'Trickster (Oszust)', func:'Ni'}, {role:'Demon (Demon)', func:'Fe'}] },
    'ESFJ': { ego: [{role:'Hero (Dominująca)', func:'Fe'}, {role:'Parent (Pomocnicza)', func:'Si'}, {role:'Child (Trzeciorzędowa)', func:'Ne'}, {role:'Inferior (Podrzędna)', func:'Ti'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Fi'}, {role:'Senex (Krytyk)', func:'Se'}, {role:'Trickster (Oszust)', func:'Ni'}, {role:'Demon (Demon)', func:'Te'}] },
    'ISTP': { ego: [{role:'Hero (Dominująca)', func:'Ti'}, {role:'Parent (Pomocnicza)', func:'Se'}, {role:'Child (Trzeciorzędowa)', func:'Ni'}, {role:'Inferior (Podrzędna)', func:'Fe'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Te'}, {role:'Senex (Krytyk)', func:'Si'}, {role:'Trickster (Oszust)', func:'Ne'}, {role:'Demon (Demon)', func:'Fi'}] },
    'ISFP': { ego: [{role:'Hero (Dominująca)', func:'Fi'}, {role:'Parent (Pomocnicza)', func:'Se'}, {role:'Child (Trzeciorzędowa)', func:'Ni'}, {role:'Inferior (Podrzędna)', func:'Te'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Fe'}, {role:'Senex (Krytyk)', func:'Si'}, {role:'Trickster (Oszust)', func:'Ne'}, {role:'Demon (Demon)', func:'Ti'}] },
    'ESTP': { ego: [{role:'Hero (Dominująca)', func:'Se'}, {role:'Parent (Pomocnicza)', func:'Ti'}, {role:'Child (Trzeciorzędowa)', func:'Fe'}, {role:'Inferior (Podrzędna)', func:'Ni'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Si'}, {role:'Senex (Krytyk)', func:'Te'}, {role:'Trickster (Oszust)', func:'Fi'}, {role:'Demon (Demon)', func:'Ne'}] },
    'ESFP': { ego: [{role:'Hero (Dominująca)', func:'Se'}, {role:'Parent (Pomocnicza)', func:'Fi'}, {role:'Child (Trzeciorzędowa)', func:'Te'}, {role:'Inferior (Podrzędna)', func:'Ni'}], shadow: [{role:'Opposing (Przeciwnik)', func:'Si'}, {role:'Senex (Krytyk)', func:'Fe'}, {role:'Trickster (Oszust)', func:'Ti'}, {role:'Demon (Demon)', func:'Ne'}] }
  };

  /**
   * Główna funkcja kalkulacji
   */
  function calculate(answers, questions) {
    const qList = questions || window.QUESTIONS_DETAILED_200;
    
    // Inicjalizacja akumulatorów 6 osi
    const axisRaw = { EI: 0, NS: 0, TF: 0, JP: 0, AT: 0, CS: 0 };
    const axisMax = { EI: 0, NS: 0, TF: 0, JP: 0, AT: 0, CS: 0 };

    // Inicjalizacja funkcji kognitywnych, Big 5, Enneagramu, Archetypów i Gallupa
    const cogRaw = { Ni: 0, Ne: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0, Si: 0, Se: 0 };
    const cogMax = { Ni: 0, Ne: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0, Si: 0, Se: 0 };

    const oceanRaw = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const oceanMax = { O: 0, C: 0, E: 0, A: 0, N: 0 };

    const enneaRaw = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    const enneaMax = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    const archRaw = {};
    const archMax = {};
    const gallupDirect = {};

    let answeredCount = 0;
    let skippedCount = 0;

    qList.forEach(q => {
      const rawAns = answers[q.id];
      if (rawAns === 'SKIP' || rawAns === null || rawAns === undefined) {
        skippedCount++;
        return; // Pominięte pytania są CAŁKOWICIE ignorowane (zero wpływu na wagi i mianownik)
      }

      answeredCount++;
      const val = parseInt(rawAns, 10);
      // Symetryczna skala Likerta: 1=-2, 2=-1, 3=0, 4=+1, 5=+2
      const likertPoint = val - 3; // 3 daje dokładnie 0.0!

      // 1. Akumulacja osi MBTI
      if (q.axis && axisRaw[q.axis] !== undefined) {
        axisRaw[q.axis] += likertPoint * (q.weight || 2.0);
        axisMax[q.axis] += 2 * Math.abs(q.weight || 2.0);
      }

      // 2. Akumulacja Funkcji Kognitywnych
      if (q.cogFunc) {
        for (let f in q.cogFunc) {
          const w = q.cogFunc[f];
          cogRaw[f] = (cogRaw[f] || 0) + likertPoint * w;
          cogMax[f] = (cogMax[f] || 0) + 2 * Math.abs(w);
        }
      }

      // 3. Akumulacja Big Five (OCEAN)
      if (q.ocean) {
        for (let trait in q.ocean) {
          const w = q.ocean[trait];
          oceanRaw[trait] = (oceanRaw[trait] || 0) + likertPoint * w;
          oceanMax[trait] = (oceanMax[trait] || 0) + 2 * Math.abs(w);
        }
      }

      // 4. Akumulacja Enneagramu (pełna symetryczna skala Likerta)
      if (q.ennea) {
        for (let e in q.ennea) {
          const w = q.ennea[e] || 1;
          enneaRaw[e] = (enneaRaw[e] || 0) + likertPoint * w;
          enneaMax[e] = (enneaMax[e] || 0) + 2 * Math.abs(w);
        }
      }

      // 5. Akumulacja Archetypów (pełna symetryczna skala Likerta)
      if (q.archetype) {
        const arch = q.archetype;
        archRaw[arch] = (archRaw[arch] || 0) + likertPoint;
        archMax[arch] = (archMax[arch] || 0) + 2;
      }

      // 6. Gallup bezpośredni
      if (q.gallupTalent && likertPoint > 0) {
        gallupDirect[q.gallupTalent] = (gallupDirect[q.gallupTalent] || 0) + likertPoint;
      }
    });

    // Funkcja normalizacji punktów do percentyla -%
    function calcAxisPercent(raw, max) {
      if (max === 0) return { posPct: 50, negPct: 50 };
      const ratio = (raw + max) / (2 * max);
      const posPct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
      return { posPct, negPct: 100 - posPct };
    }

    // Obliczenie percentyli dla wszystkich 6 osi
    const pEI = calcAxisPercent(axisRaw.EI, axisMax.EI);
    const pNS = calcAxisPercent(axisRaw.NS, axisMax.NS);
    const pTF = calcAxisPercent(axisRaw.TF, axisMax.TF);
    const pJP = calcAxisPercent(axisRaw.JP, axisMax.JP);
    const pAT = calcAxisPercent(axisRaw.AT, axisMax.AT);
    const pCS = calcAxisPercent(axisRaw.CS, axisMax.CS);

    // Wyznaczenie liter kodu
    const letter1 = pEI.posPct >= pEI.negPct ? 'E' : 'I';
    const letter2 = pNS.posPct >= pNS.negPct ? 'N' : 'S';
    const letter3 = pTF.posPct >= pTF.negPct ? 'T' : 'F';
    const letter4 = pJP.posPct >= pJP.negPct ? 'J' : 'P';
    const letter5 = pAT.posPct >= pAT.negPct ? 'A' : 'T';
    const letter6 = pCS.posPct >= pCS.negPct ? 'C' : 'S';

    const base4 = `${letter1}${letter2}${letter3}${letter4}`;
    const code6 = `${base4}-${letter5}${letter6}`;

    // Normalizacja Funkcji Kognitywnych (0–100%)
    const normalizedCogFunc = {};
    for (let f in cogRaw) {
      const max = cogMax[f] || 1;
      const pct = Math.min(100, Math.max(10, Math.round(((cogRaw[f] + max) / (2 * max)) * 100)));
      normalizedCogFunc[f] = { score: cogRaw[f], pct };
    }

    // Normalizacja Big Five (OCEAN)
    const oceanNormalized = {};
    const oceanFacetsMap = {
      O: ['Wyobraźnia i Kreatywność', 'Złożoność Intelektualna', 'Wrażliwość Estetyczna', 'Otwartość na Niekonwencjonalność'],
      C: ['Samodyscyplina i Determinacja', 'Skrupulatność Operacyjna', 'Poczucie Obowiązku', 'Dążenie do Osiągnięć'],
      E: ['Ekspresja Społeczna', 'Pewność w Relacjach', 'Poszukiwanie Stymulacji', 'Poziom Energii Życiowej'],
      A: ['Altruizm i Współczucie', 'Zaufanie do Ludzi', 'Koncyliacyjność', 'Skromność i Przejrzystość'],
      N: ['Reaktywność na Stres', 'Skłonność do Niepokoju', 'Samokrytycyzm', 'Stabilność Emocjonalna']
    };

    ['O', 'C', 'E', 'A', 'N'].forEach(k => {
      const max = oceanMax[k] || 1;
      const pct = Math.min(100, Math.max(0, Math.round(((oceanRaw[k] + max) / (2 * max)) * 100)));
      const level = pct >= 65 ? 'Wysoka' : (pct <= 35 ? 'Niska' : 'Umiarkowana');
      
      let interpretation = '';
      if (k === 'O') interpretation = pct >= 65 ? 'Wybitna gotowość do eksploracji abstrakcyjnych idei i innowacyjnych paradygmatów.' : (pct <= 35 ? 'Ugruntowany pragmatyzm, lojalność wobec sprawdzonych faktów i tradycji.' : 'Zrównoważona równowaga między innowacją a zdroworozsądkowym pragmatyzmem.');
      else if (k === 'C') interpretation = pct >= 65 ? 'Wzorowa samodyscyplina, wysoka sumienność i doskonała organizacja procesowa.' : (pct <= 35 ? 'Elastyczność, skłonność do improwizacji i niechęć do sztywnych ram.' : 'Zdrowy kompromis między planowaniem a gotowością do elastycznych zmian.');
      else if (k === 'E') interpretation = pct >= 65 ? 'Wysoka energia społeczna, naturalna łatwość w porywaniu innych i ekstrawersja.' : (pct <= 35 ? 'Głęboka introwertyczna praca umysłowa, selektywność relacji i spokój.' : 'Ambiwertyczna równowaga - swoboda zarówno w grupie, jak i w samotności.');
      else if (k === 'A') interpretation = pct >= 65 ? 'Wysoki poziom empatii, kooperatywność i dbałość o porozumienie międzyludzkie.' : (pct <= 35 ? 'Twarda asertywność, sceptycyzm i bezkompromisowa wierność logice.' : 'Zdolność do obrony własnych granic przy jednoczesnym poszanowaniu innych.');
      else if (k === 'N') interpretation = pct >= 65 ? 'Wysoka czujność emocjonalna, podatność na perfekcjonizm i dążenie do doskonałości.' : (pct <= 35 ? 'Nadzwyczajna odporność psychiczna, spokój w kryzysie i stabilność afektu.' : 'Typowa, adaptacyjna wrażliwość na wyzwania bez popadania w paraliż.');

      oceanNormalized[k] = { pct, level, academicInterpretation: interpretation, facets: oceanFacetsMap[k] };
    });

    // Enneagram (Typ rdzenny + skrzydła + pełna normalizacja percentylowa)
    const enneaDistribution = {};
    let bestEnnea = 1;
    let maxEnneaRatio = -Infinity;

    for (let i = 1; i <= 9; i++) {
      const maxVal = enneaMax[i] || 1;
      const raw = enneaRaw[i] || 0;
      // Normalizacja percentylowa na symetrycznej skali Likerta [-maxVal, +maxVal] do [10%, 98%]
      const ratio = (raw + maxVal) / (2 * maxVal);
      const pct = Math.min(98, Math.max(10, Math.round(ratio * 100)));
      enneaDistribution[i] = { score: raw, max: maxVal, pct };

      if (ratio > maxEnneaRatio) {
        maxEnneaRatio = ratio;
        bestEnnea = i;
      }
    }

    const leftWing = bestEnnea === 1 ? 9 : bestEnnea - 1;
    const rightWing = bestEnnea === 9 ? 1 : bestEnnea + 1;
    const wing = ((enneaDistribution[rightWing]?.pct || 0) >= (enneaDistribution[leftWing]?.pct || 0)) ? rightWing : leftWing;
    const enneaWingString = `${bestEnnea}w${wing}`;

    const enneaTriads = {
      1: 'Ciało / Gniew (Gut Triad)', 8: 'Ciało / Gniew (Gut Triad)', 9: 'Ciało / Gniew (Gut Triad)',
      2: 'Serce / Wstyd (Heart Triad)', 3: 'Serce / Wstyd (Heart Triad)', 4: 'Serce / Wstyd (Heart Triad)',
      5: 'Głowa / Lęk (Head Triad)', 6: 'Głowa / Lęk (Head Triad)', 7: 'Głowa / Lęk (Head Triad)'
    };

    // Archetypy Carol Pearson (Pełna normalizacja percentylowa 12-98%)
    const defaultArchetypes = ['Mędrzec', 'Twórca', 'Władca', 'Wojownik', 'Magik', 'Buntownik', 'Kochanek', 'Odkrywca', 'Opiekun', 'Błazen', 'Niewinny', 'Sierota / Realista'];
    defaultArchetypes.forEach(a => {
      if (archRaw[a] === undefined) archRaw[a] = 0;
      if (archMax[a] === undefined) archMax[a] = 1;
    });

    const sortedArch = defaultArchetypes.map(name => {
      const raw = archRaw[name] || 0;
      const maxVal = archMax[name] || 1;
      const ratio = (raw + maxVal) / (2 * maxVal);
      const pct = Math.min(98, Math.max(12, Math.round(ratio * 100)));
      return {
        name,
        score: raw,
        max: maxVal,
        pct
      };
    }).sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      return b.score - a.score;
    });

    // CliftonStrengths 34 Talents Matrix
    const gallupScored = (window.GALLUP_TALENTS || []).map(t => {
      let score = (gallupDirect[t.id] || 0) * 5.0;
      let maxPossible = 20.0;

      // Korelacja z 6 osiami
      if (t.mbtiCorrelation) {
        for (let dim in t.mbtiCorrelation) {
          const w = t.mbtiCorrelation[dim];
          let dimPct = 50;
          if (dim === 'E') dimPct = pEI.posPct;
          else if (dim === 'I') dimPct = pEI.negPct;
          else if (dim === 'N') dimPct = pNS.posPct;
          else if (dim === 'S') dimPct = pNS.negPct;
          else if (dim === 'T') dimPct = pTF.posPct;
          else if (dim === 'F') dimPct = pTF.negPct;
          else if (dim === 'J') dimPct = pJP.posPct;
          else if (dim === 'P') dimPct = pJP.negPct;
          score += (dimPct / 100) * w * 12;
          maxPossible += w * 12;
        }
      }

      // Korelacja Big 5
      if (t.oceanCorrelation) {
        for (let tr in t.oceanCorrelation) {
          const w = t.oceanCorrelation[tr];
          const trPct = oceanNormalized[tr]?.pct || 50;
          score += (trPct / 100) * Math.abs(w) * 10;
          maxPossible += Math.abs(w) * 10;
        }
      }

      const finalPct = Math.min(98, Math.max(18, Math.round((score / maxPossible) * 100)));
      return {
        id: t.id,
        namePl: t.namePl,
        nameEn: t.nameEn,
        domain: t.domain,
        summary: t.summary,
        pct: finalPct
      };
    });

    gallupScored.sort((a, b) => b.pct - a.pct);
    gallupScored.forEach((t, idx) => { t.rank = idx + 1; });

    // Dopasowanie 2 Postaci (1 Mężczyzna + 1 Kobieta)
    // Wektor użytkownika w skali -: [E, N, T, J, A, C, O, C_big, E_big, A_big, N_big]
    const uVec = [
      pEI.posPct / 100, pNS.posPct / 100, pTF.posPct / 100, pJP.posPct / 100,
      pAT.posPct / 100, pCS.posPct / 100,
      oceanNormalized.O.pct / 100, oceanNormalized.C.pct / 100,
      oceanNormalized.E.pct / 100, oceanNormalized.A.pct / 100,
      oceanNormalized.N.pct / 100
    ];

    function calcCelebSim(celeb) {
      const cCode = celeb.mbti; // np. 'INTJ-AS'
      const cBase = cCode.split('-')[0] || 'INTJ';
      const cSub = cCode.split('-')[1] || 'AS';

      const cVec = [
        cBase.includes('E') ? 0.85 : 0.15,
        cBase.includes('N') ? 0.85 : 0.15,
        cBase.includes('T') ? 0.85 : 0.15,
        cBase.includes('J') ? 0.85 : 0.15,
        cSub.includes('A') ? 0.85 : 0.15,
        cSub.includes('C') ? 0.85 : 0.15,
        (celeb.bigFive.O || 50) / 100,
        (celeb.bigFive.C || 50) / 100,
        (celeb.bigFive.E || 50) / 100,
        (celeb.bigFive.A || 50) / 100,
        (celeb.bigFive.N || 50) / 100
      ];

      // Podobieństwo cosinusowe
      let dot = 0, nU = 0, nC = 0;
      for (let i = 0; i < uVec.length; i++) {
        dot += uVec[i] * cVec[i];
        nU += uVec[i] * uVec[i];
        nC += cVec[i] * cVec[i];
      }
      let sim = dot / ((Math.sqrt(nU) * Math.sqrt(nC)) || 1);

      // Kategoryczne bonusy
      if (cBase === base4) sim += 0.05;
      if (cCode === code6) sim += 0.04;
      if (celeb.enneagram === enneaWingString) sim += 0.03;
      if (celeb.archetype === sortedArch[0]?.name) sim += 0.03;

      // Zrównoważony, realistyczny przedział 72% - 96%
      const matchPct = Math.min(96, Math.max(72, Math.round(sim * 100 * 0.94)));
      return { sim, matchPct };
    }

    const allCelebs = window.CELEBRITY_DATABASE || [];
    let bestMale = null;
    let bestMaleSim = -1;
    let bestFemale = null;
    let bestFemaleSim = -1;

    allCelebs.forEach(celeb => {
      const { sim, matchPct } = calcCelebSim(celeb);
      if (celeb.gender === 'M') {
        if (sim > bestMaleSim) {
          bestMaleSim = sim;
          bestMale = {
            ...celeb,
            matchPct,
            matchExplanation: `Wysoka zbieżność aparatu poznawczego (${celeb.mbti}): wspólna dominacja ${c_explainDominance(celeb, base4, letter5, letter6)} oraz tożsama orientacja archetypowa (${celeb.archetype}).`
          };
        }
      } else if (celeb.gender === 'F') {
        if (sim > bestFemaleSim) {
          bestFemaleSim = sim;
          bestFemale = {
            ...celeb,
            matchPct,
            matchExplanation: `Wysoka zbieżność aparatu poznawczego (${celeb.mbti}): wspólna dominacja ${c_explainDominance(celeb, base4, letter5, letter6)} oraz tożsama orientacja archetypowa (${celeb.archetype}).`
          };
        }
      }
    });

    function c_explainDominance(celeb, uBase, uA, uC) {
      const parts = [];
      if (celeb.mbti.startsWith(uBase)) parts.push(`rdzennego typu ${uBase}`);
      if (celeb.mbti.includes(uA)) parts.push(uA === 'A' ? 'asertywnej pewności' : 'analitycznej czujności');
      if (celeb.mbti.includes(uC)) parts.push(uC === 'C' ? 'ducha kooperacji' : 'suwerennej autonomii');
      return parts.length ? parts.join(', ') : 'wektora psychometrycznego';
    }

    const bStack = BEEBE_STACKS[base4] || BEEBE_STACKS['INTJ'];
    const cognitiveStack = {
      hero: bStack.ego[0]?.func || 'Ni',
      parent: bStack.ego[1]?.func || 'Te',
      child: bStack.ego[2]?.func || 'Fi',
      inferior: bStack.ego[3]?.func || 'Se',
      opposing: bStack.shadow[0]?.func || 'Ne',
      senex: bStack.shadow[1]?.func || 'Ti',
      trickster: bStack.shadow[2]?.func || 'Fe',
      demon: bStack.shadow[3]?.func || 'Si',
      ego: bStack.ego,
      shadow: bStack.shadow
    };

    return {
      answeredCount,
      skippedCount,
      mbtiCode4: base4,
      mbtiCode6: code6,
      mbtiMeta: MBTI_BASE_META[base4] || { name: base4, archetype: 'Typ Poznawczy', motto: '' },
      dim5Meta: DIM_5_META[letter5],
      dim6Meta: DIM_6_META[letter6],
      axes: {
        EI: { pole1: 'E', pole2: 'I', ...pEI },
        NS: { pole1: 'N', pole2: 'S', ...pNS },
        TF: { pole1: 'T', pole2: 'F', ...pTF },
        JP: { pole1: 'J', pole2: 'P', ...pJP },
        AT: { pole1: 'A', pole2: 'T', ...pAT },
        CS: { pole1: 'C', pole2: 'S', ...pCS }
      },
      cognitiveStack,
      normalizedCogFunc,
      bigFive: oceanNormalized,
      enneagram: {
        core: bestEnnea,
        wing: enneaWingString,
        triad: enneaTriads[bestEnnea] || 'Głowa / Lęk (Head Triad)',
        scores: enneaRaw,
        distribution: enneaDistribution
      },
      archetypes: {
        dominant: sortedArch[0] || { name: 'Mędrzec', pct: 85 },
        secondary: sortedArch[1] || { name: 'Twórca', pct: 72 },
        ranking: sortedArch
      },
      gallup: {
        all34: gallupScored,
        top5: gallupScored.slice(0, 5),
        supporting: gallupScored.slice(5, 10),
        remaining: gallupScored.slice(10, 34)
      },
      celebrityMatches: {
        male: bestMale,
        female: bestFemale
      }
    };
  }

  /**
   * UKRYTA FUNKCJA DIAGNOSTYCZNA W KONSOLI (Weryfikuje wszystkie 64 typy MBTI)
   */
  function runDiagnostics() {
    console.log('=== URUCHAMIANIE PEŁNEJ DIAGNOSTYKI 64 TYPÓW MBTI ===');
    const questions = window.QUESTIONS_DETAILED_200;
    const generatedTypes = new Set();
    const permutations = [];

    // Generowanie 64 wektorów skrajnych
    const signs = [1, -1];
    for (let ei of signs) {
      for (let ns of signs) {
        for (let tf of signs) {
          for (let jp of signs) {
            for (let at of signs) {
              for (let cs of signs) {
                permutations.push({ EI: ei, NS: ns, TF: tf, JP: jp, AT: at, CS: cs });
              }
            }
          }
        }
      }
    }

    permutations.forEach(perm => {
      const answers = {};
      questions.forEach(q => {
        const sign = perm[q.axis] || 1;
        // Odpowiedź skrajna zgodnie z zadaną permutacją
        answers[q.id] = (sign * q.weight > 0) ? 5 : 1;
      });

      const res = calculate(answers, questions);
      generatedTypes.add(res.mbtiCode6);
    });

    console.log(`Wygenerowano ${generatedTypes.size} unikalnych typów spośród 64 możliwych kombinacji.`);
    console.log('Czy pokryto wszystkie 64 typy?', generatedTypes.size === 64 ? 'TAK (100% SUKCES!)' : 'NIE');
    if (generatedTypes.size < 64) {
      console.warn('Brakujące typy:', 64 - generatedTypes.size);
    }
    return {
      success: generatedTypes.size === 64,
      totalGenerated: generatedTypes.size,
      types: Array.from(generatedTypes).sort()
    };
  }

  // Upublicznienie funkcji diagnostycznej w konsoli przeglądarki
  if (typeof window !== 'undefined') {
    window.runDiagnostics = runDiagnostics;
  }

  return {
    calculate,
    runDiagnostics
  };
})();
