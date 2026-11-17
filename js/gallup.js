/**
 * PSYCHE.OS STANDALONE - MATRYCA 34 TALENTÓW I PREDYSPOZYCJI ZAWODOWYCH
 * Taksonomia 4 domen operacyjnych oraz 34 talentów predyspozycji zawodowych.
 */

window.GALLUP_DOMAINS = {
  EXECUTING: {
    id: 'EXECUTING',
    name: 'Wykonywanie (Executing)',
    desc: 'Talenty pozwalające przekształcać idee w konkretną, uporządkowaną i dokończoną rzeczywistość.',
    color: '#8B5CF6',
    border: 'rgba(139, 92, 246, 0.35)',
    bg: 'rgba(139, 92, 246, 0.08)'
  },
  INFLUENCING: {
    id: 'INFLUENCING',
    name: 'Wpływanie (Influencing)',
    desc: 'Talenty pomagające przejąć inicjatywę, wyrażać poglądy, inspirować i przekonywać innych do działania.',
    color: '#F59E0B',
    border: 'rgba(245, 158, 11, 0.35)',
    bg: 'rgba(245, 158, 11, 0.08)'
  },
  RELATIONSHIP_BUILDING: {
    id: 'RELATIONSHIP_BUILDING',
    name: 'Budowanie Relacji (Relationship Building)',
    desc: 'Talenty spajające grupy, tworzące głębokie zaufanie, empatię i autentyczne więzi międzyludzkie.',
    color: '#10B981',
    border: 'rgba(16, 185, 129, 0.35)',
    bg: 'rgba(16, 185, 129, 0.08)'
  },
  STRATEGIC_THINKING: {
    id: 'STRATEGIC_THINKING',
    name: 'Myślenie Strategiczne (Strategic Thinking)',
    desc: 'Talenty absorbujące i analizujące dane, projektujące wizje przyszłości i dostrzegające ukryte wzorce.',
    color: '#06B6D4',
    border: 'rgba(6, 182, 212, 0.35)',
    bg: 'rgba(6, 182, 212, 0.08)'
  }
};

window.GALLUP_TALENTS = [
  // --- DOMENA 1: WYKONYWANIE (EXECUTING) - 9 TALENTÓW ---
  {
    id: 'achiever',
    namePl: 'Osiąganie (Achiever)',
    nameEn: 'Achiever',
    domain: 'EXECUTING',
    mbtiCorrelation: { J: 2.0, T: 1.0 },
    cogCorrelation: { Te: 2.5, Si: 1.5 },
    oceanCorrelation: { C: 3.0, N: -1.0 },
    summary: 'Nieustanna wewnętrzna potrzeba namacalnego postępu, twardej produktywności i realizacji codziennych celów.'
  },
  {
    id: 'arranger',
    namePl: 'Organizator (Arranger)',
    nameEn: 'Arranger',
    domain: 'EXECUTING',
    mbtiCorrelation: { J: 1.5, T: 1.0 },
    cogCorrelation: { Te: 2.5, Ne: 1.5, Se: 1.0 },
    oceanCorrelation: { C: 2.5, O: 1.5 },
    summary: 'Elastyczność w koordynowaniu dynamicznych zasobów, ludzi i procedur w celu osiągnięcia maksymalnej wydajności.'
  },
  {
    id: 'belief',
    namePl: 'Pryncypialność (Belief)',
    nameEn: 'Belief',
    domain: 'EXECUTING',
    mbtiCorrelation: { F: 2.0, J: 1.5 },
    cogCorrelation: { Fi: 3.0, Si: 1.5 },
    oceanCorrelation: { C: 2.0, A: 1.5 },
    summary: 'Głęboko zakorzeniony, nienaruszalny kodeks wartości nadający cel i sens wszelkim podejmowanym działaniom.'
  },
  {
    id: 'consistency',
    namePl: 'Bezstronność (Consistency)',
    nameEn: 'Consistency',
    domain: 'EXECUTING',
    mbtiCorrelation: { J: 2.0, T: 1.5 },
    cogCorrelation: { Ti: 2.0, Si: 2.5, Fe: 1.0 },
    oceanCorrelation: { C: 2.5, A: 1.5 },
    summary: 'Niezachwiana wiara w sprawiedliwe, równe zasady dla każdego i eliminację arbitralnych przywilejów.'
  },
  {
    id: 'deliberative',
    namePl: 'Rozwaga (Deliberative)',
    nameEn: 'Deliberative',
    domain: 'EXECUTING',
    mbtiCorrelation: { I: 2.0, J: 2.0, T: 1.0 },
    cogCorrelation: { Ni: 2.0, Si: 2.5, Ti: 1.5 },
    oceanCorrelation: { C: 2.5, N: 0.5, E: -1.5 },
    summary: 'Poważne i czujne podejście do decyzji; naturalna zdolność przewidywania ryzyka i prewencji błędów.'
  },
  {
    id: 'discipline',
    namePl: 'Dyscyplina (Discipline)',
    nameEn: 'Discipline',
    domain: 'EXECUTING',
    mbtiCorrelation: { J: 3.0, S: 1.5 },
    cogCorrelation: { Si: 3.0, Te: 2.0 },
    oceanCorrelation: { C: 3.5, O: -1.0 },
    summary: 'Zamiłowanie do struktury, rutyny, harmonogramów i precyzyjnego porządkowania środowiska operacyjnego.'
  },
  {
    id: 'focus',
    namePl: 'Ukierunkowanie (Focus)',
    nameEn: 'Focus',
    domain: 'EXECUTING',
    mbtiCorrelation: { J: 2.5, I: 1.0 },
    cogCorrelation: { Ni: 2.5, Te: 2.5 },
    oceanCorrelation: { C: 3.0, O: -0.5 },
    summary: 'Zdolność do wyznaczenia priorytetu, odcięcia wszelkich rozproszeń i bezwzględnego zmierzania do celu.'
  },
  {
    id: 'responsibility',
    namePl: 'Odpowiedzialność (Responsibility)',
    nameEn: 'Responsibility',
    domain: 'EXECUTING',
    mbtiCorrelation: { J: 2.5, F: 1.0 },
    cogCorrelation: { Si: 2.5, Fi: 2.0, Te: 1.5 },
    oceanCorrelation: { C: 3.0, A: 1.5 },
    summary: 'Wewnętrzny imperatyw moralny dotrzymywania obietnic i pełna własność psychologiczna za podjęte zobowiązania.'
  },
  {
    id: 'restorative',
    namePl: 'Naprawianie (Restorative)',
    nameEn: 'Restorative',
    domain: 'EXECUTING',
    mbtiCorrelation: { T: 2.0, S: 1.0 },
    cogCorrelation: { Ti: 2.5, Se: 1.5, Te: 1.5 },
    oceanCorrelation: { C: 2.0, O: 1.0 },
    summary: 'Pasja do diagnozowania dysfunkcji, rozwiązywania awarii i przywracania zepsutych systemów do sprawności.'
  },

  // --- DOMENA 2: WPŁYWANIE (INFLUENCING) - 8 TALENTÓW ---
  {
    id: 'activator',
    namePl: 'Aktywator (Activator)',
    nameEn: 'Activator',
    domain: 'INFLUENCING',
    mbtiCorrelation: { E: 2.5, P: 1.5 },
    cogCorrelation: { Se: 3.0, Te: 2.0 },
    oceanCorrelation: { E: 2.5, C: -0.5, O: 1.0 },
    summary: 'Niecierpliwa potrzeba natychmiastowego przejścia od słów do czynów; wiara, że tylko działanie weryfikuje idee.'
  },
  {
    id: 'command',
    namePl: 'Dowodzenie (Command)',
    nameEn: 'Command',
    domain: 'INFLUENCING',
    mbtiCorrelation: { E: 2.0, T: 2.5, J: 2.0 },
    cogCorrelation: { Te: 3.5, Se: 2.0 },
    oceanCorrelation: { E: 2.5, A: -2.0, N: -1.5 },
    summary: 'Naturalna obecność lidera, odwaga w konfrontacji, przejmowanie kontroli w kryzysie i jasne dyktowanie kierunku.'
  },
  {
    id: 'communication',
    namePl: 'Komunikatywność (Communication)',
    nameEn: 'Communication',
    domain: 'INFLUENCING',
    mbtiCorrelation: { E: 2.5, F: 1.0 },
    cogCorrelation: { Fe: 2.5, Ne: 2.0, Te: 1.0 },
    oceanCorrelation: { E: 3.0, O: 1.5 },
    summary: 'Łatwość ubierania myśli w barwne opowieści, przykuwania uwagi audytorium i ożywiania suchych faktów.'
  },
  {
    id: 'competition',
    namePl: 'Rywalizacja (Competition)',
    nameEn: 'Competition',
    domain: 'INFLUENCING',
    mbtiCorrelation: { E: 1.5, T: 2.0 },
    cogCorrelation: { Te: 2.5, Se: 2.0 },
    oceanCorrelation: { E: 1.5, A: -2.0, C: 1.5 },
    summary: 'Mierzenie własnej wartości poprzez porównanie z innymi; paląca potrzeba bycia numerem jeden i wygrywania.'
  },
  {
    id: 'maximizer',
    namePl: 'Maksymalista (Maximizer)',
    nameEn: 'Maximizer',
    domain: 'INFLUENCING',
    mbtiCorrelation: { J: 1.5, T: 1.0 },
    cogCorrelation: { Te: 2.5, Ni: 2.0 },
    oceanCorrelation: { C: 2.0, O: 1.5 },
    summary: 'Fascynacja doskonałością; przekształcanie czegoś mocnego w wybitne zamiast marnowania energii na łatanie braków.'
  },
  {
    id: 'self-assurance',
    namePl: 'Pewność siebie (Self-Assurance)',
    nameEn: 'Self-Assurance',
    domain: 'INFLUENCING',
    mbtiCorrelation: { I: 1.0, T: 1.5, J: 1.5 },
    cogCorrelation: { Ni: 2.5, Ti: 2.0, Te: 1.5 },
    oceanCorrelation: { N: -2.5, E: 1.5 },
    summary: 'Niezachwiana wiara we własne możliwości decyzyjne, wewnętrzny kompas odporny na presję społeczną.'
  },
  {
    id: 'significance',
    namePl: 'Poważanie (Significance)',
    nameEn: 'Significance',
    domain: 'INFLUENCING',
    mbtiCorrelation: { E: 2.0, T: 1.0 },
    cogCorrelation: { Te: 2.0, Fe: 1.5, Se: 1.5 },
    oceanCorrelation: { E: 2.0, C: 1.5 },
    summary: 'Pragnienie wywarcia wielkiego, widocznego wpływu na świat oraz bycia docenionym jako osoba wyjątkowa.'
  },
  {
    id: 'woo',
    namePl: 'Czar (Woo)',
    nameEn: 'Woo',
    domain: 'INFLUENCING',
    mbtiCorrelation: { E: 3.5, F: 1.5 },
    cogCorrelation: { Fe: 3.0, Ne: 2.0, Se: 1.5 },
    oceanCorrelation: { E: 3.5, A: 2.0 },
    summary: 'Czerpanie energii ze zdobywania sympatii nieznajomych, błyskawiczne przełamywanie lodów i czarowanie otoczenia.'
  },

  // --- DOMENA 3: BUDOWANIE RELACJI (RELATIONSHIP BUILDING) - 9 TALENTÓW ---
  {
    id: 'adaptability',
    namePl: 'Elastyczność (Adaptability)',
    nameEn: 'Adaptability',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { P: 3.0, S: 1.0 },
    cogCorrelation: { Se: 3.0, Ne: 1.5 },
    oceanCorrelation: { C: -2.0, O: 1.5, N: -1.0 },
    summary: 'Życie tu i teraz, naturalny spokój w obliczu nagłych zmian planów i znakomita adaptacja do zmiennych okoliczności.'
  },
  {
    id: 'connectedness',
    namePl: 'Współzależność (Connectedness)',
    nameEn: 'Connectedness',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { N: 2.5, F: 2.0 },
    cogCorrelation: { Ni: 2.5, Fe: 2.0, Fi: 1.5 },
    oceanCorrelation: { O: 2.5, A: 2.0 },
    summary: 'Głęboka świadomość, że wszystko i wszyscy są ze sobą połączeni, a w świecie nie ma przypadkowych zdarzeń.'
  },
  {
    id: 'developer',
    namePl: 'Rozwijanie innych (Developer)',
    nameEn: 'Developer',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { F: 2.5, E: 1.0 },
    cogCorrelation: { Fe: 3.0, Fi: 2.0 },
    oceanCorrelation: { A: 3.0, E: 1.5 },
    summary: 'Dostrzeganie ukrytego potencjału w każdym człowieku i czerpanie radości z towarzyszenia mu w sukcesach.'
  },
  {
    id: 'empathy',
    namePl: 'Empatia (Empathy)',
    nameEn: 'Empathy',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { F: 3.5, I: 0.5 },
    cogCorrelation: { Fe: 3.5, Fi: 2.5 },
    oceanCorrelation: { A: 3.5, N: 0.5 },
    summary: 'Intuicyjne, bezsłowne wyczuwanie emocji, stanów psychicznych i niewypowiedzianych potrzeb drugiego człowieka.'
  },
  {
    id: 'harmony',
    namePl: 'Zgoda (Harmony)',
    nameEn: 'Harmony',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { F: 2.5, J: 1.0 },
    cogCorrelation: { Fe: 3.0, Si: 1.5 },
    oceanCorrelation: { A: 3.5, N: -1.0 },
    summary: 'Poszukiwanie płaszczyzn porozumienia, minimalizowanie konfliktów i budowanie atmosfery wzajemnego szacunku.'
  },
  {
    id: 'includer',
    namePl: 'Integrator (Includer)',
    nameEn: 'Includer',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { E: 1.5, F: 2.5 },
    cogCorrelation: { Fe: 3.0, Ne: 1.5 },
    oceanCorrelation: { A: 3.0, E: 1.5 },
    summary: 'Instynktowne zauważanie osób zepchniętych na margines i poszerzanie kręgu grupy, by nikt nie czuł się wykluczony.'
  },
  {
    id: 'individualization',
    namePl: 'Indywidualizacja (Individualization)',
    nameEn: 'Individualization',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { I: 1.0, F: 2.0, N: 1.0 },
    cogCorrelation: { Fi: 3.0, Ni: 1.5, Fe: 1.5 },
    oceanCorrelation: { O: 2.0, A: 2.0 },
    summary: 'Fascynacja unikalną specyfiką każdej jednostki; awersja do traktowania ludzi według jednego szablonu.'
  },
  {
    id: 'positivity',
    namePl: 'Pozytywność (Positivity)',
    nameEn: 'Positivity',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { E: 3.0, F: 2.0 },
    cogCorrelation: { Fe: 2.5, Ne: 2.0, Se: 1.5 },
    oceanCorrelation: { E: 3.5, N: -2.5, A: 2.0 },
    summary: 'Zaraźliwy optymizm, lekkość bycia, celebracja życia i zdolność rozjaśniania najtrudniejszych sytuacji.'
  },
  {
    id: 'relator',
    namePl: 'Bliskość (Relator)',
    nameEn: 'Relator',
    domain: 'RELATIONSHIP_BUILDING',
    mbtiCorrelation: { I: 2.0, F: 2.0 },
    cogCorrelation: { Fi: 3.0, Si: 1.5 },
    oceanCorrelation: { A: 2.5, E: -1.0 },
    summary: 'Preferencja dla głębokich, intymnych i autentycznych relacji z zaufanym gronem ponad powierzchowne znajomości.'
  },

  // --- DOMENA 4: MYŚLENIE STRATEGICZNE (STRATEGIC THINKING) - 8 TALENTÓW ---
  {
    id: 'analytical',
    namePl: 'Analityk (Analytical)',
    nameEn: 'Analytical',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { T: 3.5, I: 1.5 },
    cogCorrelation: { Ti: 3.5, Te: 2.5 },
    oceanCorrelation: { C: 2.0, O: 1.5, A: -1.5 },
    summary: 'Bezwzględne dążenie do prawdy opartej na dowodach, danych i bezstronnej weryfikacji przyczynowo-skutkowej.'
  },
  {
    id: 'context',
    namePl: 'Kontekst (Context)',
    nameEn: 'Context',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { I: 1.5, S: 2.0 },
    cogCorrelation: { Si: 3.5, Ti: 1.5 },
    oceanCorrelation: { O: 1.0, C: 1.5 },
    summary: 'Zrozumienie teraźniejszości poprzez badanie jej genezy, historii, precedensów i korzeni minionych wydarzeń.'
  },
  {
    id: 'futuristic',
    namePl: 'Wizjoner (Futuristic)',
    nameEn: 'Futuristic',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { N: 3.5, I: 1.0 },
    cogCorrelation: { Ni: 3.5, Ne: 2.0 },
    oceanCorrelation: { O: 3.5, C: 1.0 },
    summary: 'Krystaliczna wizja tego, co nadejdzie; zdolność inspirowania innych dalekowzrocznym obrazem przyszłości.'
  },
  {
    id: 'ideation',
    namePl: 'Odkrywczość (Ideation)',
    nameEn: 'Ideation',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { N: 3.5, P: 2.0 },
    cogCorrelation: { Ne: 3.5, Ti: 1.5 },
    oceanCorrelation: { O: 3.5, C: -1.0 },
    summary: 'Fascynacja nowatorskimi ideami, nieoczekiwanymi metaforami i łączeniem pozornie odległych zjawisk.'
  },
  {
    id: 'input',
    namePl: 'Zbieranie (Input)',
    nameEn: 'Input',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { I: 1.5, N: 1.5, P: 1.0 },
    cogCorrelation: { Ti: 2.0, Ne: 2.0, Si: 2.0 },
    oceanCorrelation: { O: 3.0, C: 1.0 },
    summary: 'Nienasycona ciekawość świata, archiwizowanie wiedzy, książek, cytatów, faktów i narzędzi na przyszłość.'
  },
  {
    id: 'intellection',
    namePl: 'Intelekt (Intellection)',
    nameEn: 'Intellection',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { I: 3.5, T: 1.5, N: 1.5 },
    cogCorrelation: { Ti: 3.5, Ni: 3.0 },
    oceanCorrelation: { O: 3.5, E: -2.0 },
    summary: 'Umiłowanie samotnej aktywności umysłowej, głębokich rozważań filozoficznych i nieustannej introspekcji.'
  },
  {
    id: 'learner',
    namePl: 'Uczenie się (Learner)',
    nameEn: 'Learner',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { N: 2.0, I: 1.0 },
    cogCorrelation: { Ne: 2.5, Ti: 2.5, Ni: 2.0 },
    oceanCorrelation: { O: 3.5, C: 1.5 },
    summary: 'Pasja do samego procesu zdobywania wiedzy, przekraczania niewiedzy i wchodzenia w stan nowicjusza.'
  },
  {
    id: 'strategic',
    namePl: 'Strateg (Strategic)',
    nameEn: 'Strategic',
    domain: 'STRATEGIC_THINKING',
    mbtiCorrelation: { N: 3.0, T: 2.0, J: 2.0 },
    cogCorrelation: { Ni: 3.5, Te: 2.5 },
    oceanCorrelation: { O: 3.0, C: 2.0 },
    summary: 'Błyskawiczne sortowanie chaosu, odrzucanie ślepych uliczek i wytyczanie optymalnej ścieżki do celu.'
  }
];
