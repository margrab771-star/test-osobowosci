/**
 * PSYCHE.OS STANDALONE - KOMPLEKSOWA BAZA WIEDZY PSYCHOMETRYCZNEJ
 * 
 * Moduł zawiera przystępne, pogłębione opisy:
 * 1. Enneagramu (9 typów rdzennych, wszystkie 18 kombinacji skrzydeł, triady motywacyjne, integracja i dezintegracja).
 * 2. 12 Archetypów Osobowości Carol Pearson (dary, cienie, strategie życiowe i role relacyjne).
 * 3. Słownik pojęć psychologicznych (Tooltips): Anima/Animus, Senex, Triady, Wymiary 5 i 6, Indywiduacja.
 */

window.PSYCHE_KNOWLEDGE = (function() {

  // Słownik 9 typów Enneagramu (jednozdaniowe charakterystyki dla wykresu)
  const ENNEAGRAM_CORE_TYPES = {
    1: {
      name: 'Reformator / Perfekcjonista',
      triad: 'Ciało / Gniew (Gut Triad)',
      shortDesc: 'Dąży do doskonałości, etycznej spójności i naprawiania niedoskonałości świata.',
      passion: 'Gniew (Resentyment)',
      virtue: 'Spokój i Czystość Intencji'
    },
    2: {
      name: 'Pomocnik / Dawca',
      triad: 'Serce / Wstyd (Heart Triad)',
      shortDesc: 'Skupiony na empatii, altruizmie i budowaniu bliskości poprzez zaspokajanie potrzeb innych.',
      passion: 'Duma (Potrzeba Bycia Niezbędnym)',
      virtue: 'Pokora i Bezwarunkowa Miłość'
    },
    3: {
      name: 'Zdobywca / Osiągający',
      triad: 'Serce / Wstyd (Heart Triad)',
      shortDesc: 'Nastawiony na mierzalny sukces, optymalną efektywność, rozwój i prestiż społeczny.',
      passion: 'Próżność (Auto-kreacja)',
      virtue: 'Autentyczność i Prawda'
    },
    4: {
      name: 'Indywidualista / Romantyk',
      triad: 'Serce / Wstyd (Heart Triad)',
      shortDesc: 'Poszukuje głębi, unikalnej tożsamości, estetyki i autentycznego rezonansu emocjonalnego.',
      passion: 'Zawiść (Poczucie Braku)',
      virtue: 'Równowaga Emocjonalna (Ekwanimizm)'
    },
    5: {
      name: 'Obserwator / Badacz',
      triad: 'Głowa / Lęk (Head Triad)',
      shortDesc: 'Dąży do obiektywnej wiedzy, autonomii umysłu i ochrony własnych zasobów psychicznych.',
      passion: 'Skąpstwo (Zatracenie w Zasobach)',
      virtue: 'Szczodrość Poznawcza i Zaangażowanie'
    },
    6: {
      name: 'Lojalista / Strażnik',
      triad: 'Głowa / Lęk (Head Triad)',
      shortDesc: 'Poszukuje bezpieczeństwa, przewidywalności i lojalności, czujnie antycypując zagrożenia.',
      passion: 'Lęk (Chroniczny Niepokój)',
      virtue: 'Odwaga i Ufność'
    },
    7: {
      name: 'Entuzjasta / Epikurejczyk',
      triad: 'Głowa / Lęk (Head Triad)',
      shortDesc: 'Pragnie wolności, wielości doświadczeń i radosnej eksploracji, unikając ograniczeń i bólu.',
      passion: 'Łakomstwo (Nienasycenie Wrażeniami)',
      virtue: 'Umiar i Trzeźwość Umysłu'
    },
    8: {
      name: 'Wyzywający / Przywódca',
      triad: 'Ciało / Gniew (Gut Triad)',
      shortDesc: 'Kieruje się siłą, kontrolą nad własnym losem, sprawczością i bezkompromisową obroną słabszych.',
      passion: 'Żądza (Intensywność i Dominacja)',
      virtue: 'Niewinność i Wielkoduszność'
    },
    9: {
      name: 'Rozjemca / Mediator',
      triad: 'Ciało / Gniew (Gut Triad)',
      shortDesc: 'Dąży do wewnętrznego spokoju, zgody i harmonii, unikając polaryzacji i konfliktów.',
      passion: 'Gnuśność (Zapominanie o Sobie)',
      virtue: 'Obecność i Sprawczość'
    }
  };

  // Pogłębione charakterystyki podtypów ze skrzydłami (Wings)
  const ENNEAGRAM_WINGS_DETAILS = {
    '1w9': {
      title: 'Idealista / Stoik (1w9)',
      subtitle: '„Spokojny Reformator”',
      motivation: 'Dążenie do etycznego ładu i doskonałości, złagodzone pragnieniem wewnętrznego pokoju, harmonii z naturą i unikania otwartych awantur.',
      fear: 'Lęk przed byciem niesprawiedliwym, skażonym moralnie lub uwikłanym w destrukcyjny chaos.',
      stress: 'W stresie (dezintegracja do 4): zamyka się w sobie, staje się melancholijny, chłodny i przekonany o samotnym dźwiganiu ciężaru świata.',
      growth: 'W rozwoju (integracja do 7): staje się pogodny, spontaniczny, uczy się wybaczać niedoskonałości sobie oraz innym.',
      strengths: 'Stoicka bezstronność, opanowanie, dalekowzroczność, wysoka kultura osobista i nieskazitelna uczciwość.',
      traps: 'Pasywna agresja, poczucie wyższości moralnej, odkładanie trudnych konfrontacji w obawie przed naruszeniem spokoju.'
    },
    '1w2': {
      title: 'Obrońca / Nauczyciel (1w2)',
      subtitle: '„Oddany Społecznik”',
      motivation: 'Chęć naprawiania świata połączona z serdeczną troską o konkretnych ludzi i potrzebą aktywnego pomagania słabszym.',
      fear: 'Lęk przed byciem bezużytecznym, odrzuconym lub uznanym za osobę samolubną i złą.',
      stress: 'W stresie (dezintegracja do 4): popada w poczucie niedocenienia, użalanie się nad sobą i zgorzknienie.',
      growth: 'W rozwoju (integracja do 7): odzyskuje radość życia, zdejmuje z siebie ciężar ratowania wszystkich wokół i bawi się chwilą.',
      strengths: 'Ogromna empatia połączona z żelazną dyscypliną, gotowość do poświęceń, wspaniały talent pedagogiczny.',
      traps: 'Naruszanie cudzych granic w imię „ich własnego dobra”, moralizatorstwo i wypalenie spowodowane nadmierną pracą na rzecz innych.'
    },
    '2w1': {
      title: 'Sługa / Altruista (2w1)',
      subtitle: '„Cichy Dobroczyńca”',
      motivation: 'Głębokie pragnienie kochania i bycia kochanym poprzez moralną, bezinteresowną służbę i przestrzeganie najwyższych standardów etycznych.',
      fear: 'Lęk przed byciem niegodnym miłości, egoistycznym lub niechcianym.',
      stress: 'W stresie (dezintegracja do 8): staje się roszczeniowy, wybuchowy, oskarżający innych o brak wdzięczności.',
      growth: 'W rozwoju (integracja do 4): zaczyna słuchać własnych potrzeb emocjonalnych, rozwija autentyczność i szanuje swoją intymność.',
      strengths: 'Niezwykłe wyczucie potrzeb innych, sumienność, dyskretna pomoc bez poszukiwania poklasku.',
      traps: 'Tłumienie własnych pragnień, syndrom męczennika i wewnętrzne poczucie winy, gdy odpoczywa.'
    },
    '2w3': {
      title: 'Gospodarz / Promotor (2w3)',
      subtitle: '„Czarujący Lider Relacji”',
      motivation: 'Bycie lubianym, docenianym i podziwianym; łączy ciepło interpersonalne z ambicją społeczną i dynamizmem.',
      fear: 'Lęk przed samotnością, odrzuceniem społecznym i byciem postrzeganym jako osoba bezwartościowa.',
      stress: 'W stresie (dezintegracja do 8): staje się manipulacyjny, agresywny w obronie swojej pozycji i kontrolujący.',
      growth: 'W rozwoju (integracja do 4): uczy się akceptować swoje słabości i smutek bez konieczności noszenia maski sukcesu.',
      strengths: 'Charyzma, talent perswazyjny, łatwość w nawiązywaniu kontaktów, naturalne budowanie wspólnoty.',
      traps: 'Uzależnienie samooceny od opinii otoczenia, powierzchowność emocjonalna i rozdawnictwo energii.'
    },
    '3w2': {
      title: 'Czarodziej / Uwodziciel Sukcesu (3w2)',
      subtitle: '„Charyzmatyczny Zdobywca”',
      motivation: 'Osiąganie wybitnych rezultatów przy jednoczesnym zdobywaniu sympatii i autentycznego uwielbienia otoczenia.',
      fear: 'Lęk przed porażką, byciem niewidzialnym lub zdemaskowanym jako osoba przeciętna.',
      stress: 'W stresie (dezintegracja do 9): ucieka w apatię, marnowanie czasu i zaprzeczanie problemom zawodowym.',
      growth: 'W rozwoju (integracja do 6): staje się lojalnym członkiem zespołu, dba o wspólne bezpieczeństwo i zdejmuje maskę.',
      strengths: 'Porywające wystąpienia publiczne, wysoka kultura pracy, motywowanie innych do przekraczania granic.',
      traps: 'Manipulowanie wizerunkiem, tłumienie autentycznych uczuć i traktowanie ludzi instrumentalnie.'
    },
    '3w4': {
      title: 'Ekspert / Profesjonalista (3w4)',
      subtitle: '„Arystokrata Mistrzostwa”',
      motivation: 'Połączenie ambicji rynkowej z głęboką potrzebą autorskiej unikalności, profesjonalizmu i elegancji intelektualnej.',
      fear: 'Lęk przed pospolitością, fuszerką i brakiem uznania dla własnej niepowtarzalnej wiedzy.',
      stress: 'W stresie (dezintegracja do 9): popada w bezsilność, prokrastynację i auto-destrukcyjne znieczulenie.',
      growth: 'W rozwoju (integracja do 6): angażuje się w sprawy wspólnotowe, ufa procedurom i wspiera innych bez rywalizacji.',
      strengths: 'Wybitna ekspertyza w wybranej niszy, dbałość o najwyższą jakość, strategiczny autorytet.',
      traps: 'Wyniosłość, pracoholizm, poczucie wyobcowania i wewnętrzna pustka pod płaszczem osiągnięć.'
    },
    '4w3': {
      title: 'Arystokrata / Artysta Sukcesu (4w3)',
      subtitle: '„Ekspresyjny Twórca”',
      motivation: 'Pragnienie wyrażenia unikalnej tożsamości w sposób widoczny, spektakularny i doceniony przez świat.',
      fear: 'Lęk przed byciem nijakim, niezauważonym i wtórnym.',
      stress: 'W stresie (dezintegracja do 2): staje się natarczywy w poszukiwaniu uwagi, zazdrosny i uzależniający.',
      growth: 'W rozwoju (integracja do 1): zyskuje dyscyplinę, przekształca emocjonalny chaos w regularną, mistrzowską pracę twórczą.',
      strengths: 'Oryginalność, niezwykły zmysł estetyczny, dramatyzm, odwaga w wyrażaniu niepopularnych emocji.',
      traps: 'Huśtawki nastrojów, kompulsywne porównywanie się z innymi i zazdrość o cudzy sukces.'
    },
    '4w5': {
      title: 'Włóczęga / Filozof (4w5)',
      subtitle: '„Mistyczny Samotnik”',
      motivation: 'Głęboka introspekcja, poszukiwanie prawdy o ludzkiej kondycji, autentyczności i ochrona własnej suwerenności emocjonalnej.',
      fear: 'Lęk przed powierzchownością, wtargnięciem otoczenia w intymny świat i byciem zmuszonym do konformizmu.',
      stress: 'W stresie (dezintegracja do 2): projektuje swoje cierpienie na zewnątrz, żądając ratunku i zrozumienia.',
      growth: 'W rozwoju (integracja do 1): zakorzenia się w rzeczywistości, działa systematycznie i wprowadza porządek w życie.',
      strengths: 'Głęboki wgląd psychologiczny, bezkompromisowa oryginalność, niezależność od mód i trendów.',
      traps: 'Nihilizm, alienacja społeczna, pielęgnowanie melancholii jako znaku wyższości duchowej.'
    },
    '5w4': {
      title: 'Obserwator / Obrazoburca (5w4)',
      subtitle: '„Filozoficzny Badacz”',
      motivation: 'Zrozumienie fundamentalnych mechanizmów rzeczywistości połączone z potrzebą unikalnej, autorskiej syntezy wiedzy.',
      fear: 'Lęk przed bezradnością, intelektualną niekompetencją, inwazją intruzów i wyczerpaniem baterii życiowych.',
      stress: 'W stresie (dezintegracja do 7): ucieka w powierzchowne rozrywki, kompulsywne surfowanie po sieci i chaotyczne teorie.',
      growth: 'W rozwoju (integracja do 8): wychodzi z głowy do ciała, podejmuje odważne decyzje operacyjne i staje się charyzmatycznym liderem.',
      strengths: 'Genialna synteza pojęciowa, nieszablonowe myślenie, głęboka niezależność i precyzja analityczna.',
      traps: 'Emocjonalny chłód, skąpstwo energetyczne, zamykanie się w mentalnej fortecy i ignorowanie relacji.'
    },
    '5w6': {
      title: 'Naukowiec / Analityk Systemów (5w6)',
      subtitle: '„Metodologiczny Badacz”',
      motivation: 'Oparcie wiedzy na twardych danych, sprawdzonych teoriach i budowanie systemów odpornych na błędy logiczne.',
      fear: 'Lęk przed chaosem, dezinformacją, uzależnieniem od innych i brakiem logicznego oparcia.',
      stress: 'W stresie (dezintegracja do 7): wpada w paranoiczne roztrząsanie czarnych scenariuszy i kompulsywną ucieczkę.',
      growth: 'W rozwoju (integracja do 8): przekształca wiedzę w realną władzę sprawczą i bierze odpowiedzialność za wdrożenie.',
      strengths: 'Rygor naukowy, bezstronność, logiczne myślenie procesowe, niezawodność w diagnozowaniu awarii.',
      traps: 'Sceptycyzm graniczący z cynizmem, paraliż analityczny i trudność w okazywaniu ciepła.'
    },
    '6w5': {
      title: 'Obrońca / Tradycjonalista (6w5)',
      subtitle: '„Czujny Analityk Ryzyka”',
      motivation: 'Zapewnienie trwałego bezpieczeństwa, oparcie się na sprawdzonych procedurach, wiedzy eksperckiej i lojalności.',
      fear: 'Lęk przed byciem zdanym na siebie w obliczu zagrożenia, zdradą i nagłą utratą stabilności.',
      stress: 'W stresie (dezintegracja do 3): staje się zimnym karierowiczem, maskującym strach arogancją i pośpiechem.',
      growth: 'W rozwoju (integracja do 9): odnajduje spokój wewnętrzny, wycisza gonitwę myśli i ufa naturalnemu biegowi zdarzeń.',
      strengths: 'Wybitna antycypacja kryzysów, wierność zasadom, dogłębna analiza techniczna i lojalność.',
      traps: 'Obsesyjne doszukiwanie się ukrytych intencji, paranoiczny lęk przed ryzykiem i sztywność myślenia.'
    },
    '6w7': {
      title: 'Kumpel / Towarzysz (6w7)',
      subtitle: '„Ciepły Realista”',
      motivation: 'Budowanie sieci zaufanych sojuszników poprzez życzliwość, humor, wzajemne wsparcie i ucieczkę od samotności.',
      fear: 'Lęk przed odrzuceniem przez grupę, samotnością w niebezpiecznym świecie i brakiem pomocy.',
      stress: 'W stresie (dezintegracja do 3): popada w nerwowe udowadnianie swojej wartości i konformizm.',
      growth: 'W rozwoju (integracja do 9): zyskuje zaufanie do życia, relaksuje się i emanuje kojącą pewnością siebie.',
      strengths: 'Rozbrajający humor, empatia, umiejętność łączenia ludzi w trudnych chwilach, solidarność.',
      traps: 'Wahania nastrojów, zamęczanie bliskich swoimi wątpliwościami i unikanie podejmowania trudnych decyzji.'
    },
    '7w6': {
      title: 'Zabawiacz / Animator (7w6)',
      subtitle: '„Radosny Optymista”',
      motivation: 'Doświadczanie pełni życia, odkrywanie fascynujących możliwości w towarzystwie serdecznych, bezpiecznych przyjaciół.',
      fear: 'Lęk przed nudą, cierpieniem, uwięzieniem w monotonnej rutynie i pozbawieniem opcji wyboru.',
      stress: 'W stresie (dezintegracja do 1): staje się zrzędliwy, krytyczny, dogmatyczny i agresywnie pouczający innych.',
      growth: 'W rozwoju (integracja do 5): uczy się skupienia na jednym celu, zgłębia wiedzę do dna i odkrywa wartość ciszy.',
      strengths: 'Zaraźliwy entuzjazm, wszechstronność umysłowa, błyskotliwa kreatywność, budowanie radosnej atmosfery.',
      traps: 'Słomiany zapał, lęk przed trudnymi emocjami i ucieczka od odpowiedzialności za długofalowe zobowiązania.'
    },
    '7w8': {
      title: 'Przedsiębiorca / Zdobywca (7w8)',
      subtitle: '„Kinetyczny Realizator”',
      motivation: 'Czerpanie z życia garściami, realizacja wielkich projektów, wolność osobista i przełamywanie wszelkich barier.',
      fear: 'Lęk przed bezsilnością, ograniczeniem przestrzeni życiowej i byciem kontrolowanym przez innych.',
      stress: 'W stresie (dezintegracja do 1): staje się bezwzględny, autorytarny i surowo osądzający.',
      growth: 'W rozwoju (integracja do 5): znajduje czas na strategiczną refleksję, bada szczegóły i unika pochopnego ryzyka.',
      strengths: 'Potężna energia życiowa, odwaga biznesowa, odporność na porażki, magnetyczne przywództwo.',
      traps: 'Skłonność do nadmiaru i uzależnień, brak cierpliwości dla cudzych słabości i taranowanie oporu.'
    },
    '8w7': {
      title: 'Nonkonformista / Dowódca (8w7)',
      subtitle: '„Nieugięty Przywódca”',
      motivation: 'Maksymalna sprawczość, dominacja nad własnym terytorium, wolność działania i porywanie ludzi ku wielkim celom.',
      fear: 'Lęk przed podporządkowaniem, zdradą, słabością i byciem zmanipulowanym.',
      stress: 'W stresie (dezintegracja do 5): izoluje się, staje się podejrzliwy, obsesyjnie zbiera informacje i planuje odwet.',
      growth: 'W rozwoju (integracja do 2): otwiera serce, staje się wspaniałomyślnym, czułym obrońcą słabszych i mentorem.',
      strengths: 'Charyzma, bezkompromisowa odwaga, naturalna umiejętność przewodzenia w kryzysie, protekcja bliskich.',
      traps: 'Tyrania, brak empatii dla ludzkiej wrażliwości, eskalowanie konfliktów i syndrom oblężonej twierdzy.'
    },
    '8w9': {
      title: 'Niedźwiedź / Lider Ochronny (8w9)',
      subtitle: '„Spokojna Siła”',
      motivation: 'Ochrona własnego miru domowego, spokoju i granic bliskich; łączy potężną siłę z powściągliwością i cierpliwością.',
      fear: 'Lęk przed utratą kontroli, wtargnięciem wrogich sił i bezsilnością.',
      stress: 'W stresie (dezintegracja do 5): zamyka się w milczeniu, staje się chłodny, wycofany i nieprzystępny.',
      growth: 'W rozwoju (integracja do 2): używa swojej siły do bezinteresownej opieki, łagodności i budowania zaufania.',
      strengths: 'Niewzruszona stabilność, odporność psychiczna, sprawiedliwość, obrona słabszych bez niepotrzebnego hałasu.',
      traps: 'Tłumiony gniew wybuchający po długim czasie, upór nie do przełamania i lekceważenie subtelnych emocji.'
    },
    '9w8': {
      title: 'Pocieszyciel / Negocjator (9w8)',
      subtitle: '„Spokojny Wojownik”',
      motivation: 'Utrzymanie wewnętrznego spokoju i harmonii w relacjach, wsparte determinacją i gotowością do twardej obrony granic.',
      fear: 'Lęk przed rozpadem więzi, chaosem emocjonalnym i koniecznością wyboru jednej ze skłóconych stron.',
      stress: 'W stresie (dezintegracja do 6): staje się niespokojny, podejrzliwy, defensywny i widzi zagrożenia na każdym kroku.',
      growth: 'W rozwoju (integracja do 3): odkrywa własne ambicje, stawia sobie śmiałe cele i działa z determinacją.',
      strengths: 'Genialny mediator, niewzruszony spokój w kryzysie, naturalny urok i wybitna odporność na manipulacje.',
      traps: 'Pasywny upór, znieczulanie się na własne potrzeby, ignorowanie problemów aż do ich eskalacji.'
    },
    '9w1': {
      title: 'Marzyciel / Etyk (9w1)',
      subtitle: '„Utopijny Idealista”',
      motivation: 'Życie w harmonii z uniwersalnymi prawami moralnymi, wewnętrznym spokojem, pięknem i dobrocią.',
      fear: 'Lęk przed konfliktem, poczuciem winy, byciem skażonym przez złość lub egoizm.',
      stress: 'W stresie (dezintegracja do 6): staje się lękliwy, zamartwiający się i szukający oparcia w autorytetach.',
      growth: 'W rozwoju (integracja do 3): zaczyna wierzyć w swoją wartość, realizuje marzenia i staje się widoczny w świecie.',
      strengths: 'Łagodność, wysoka kultura duchowa, bezstronność, tworzenie oazy spokoju dla każdego, kto jest blisko.',
      traps: 'Ucieczka od realnego świata w marzenia, tłumienie własnej złości i lęk przed otwartą konfrontacją.'
    }
  };

  // Słownik 12 Archetypów Carol Pearson (dary, cienie, strategie życiowe i role)
  const ARCHETYPES_DETAILS = {
    'Mędrzec': {
      name: 'Mędrzec (The Sage)',
      short: 'Poszukiwacz obiektywnej prawdy, mądrości i fundamentalnych zasad rządzących rzeczywistością.',
      gift: 'Głęboka wnikliwość epistemologiczna, bezstronność, dekonstrukcja iluzji, precyzja pojęciowa i zdolność do syntezy wielkich zbiorów wiedzy.',
      shadow: 'Paraliż analityczny, cyniczne oderwanie od życia emocjonalnego, dogmatyzm, poczucie wyższości i unikanie działania.',
      strategy: 'W zespole pełni rolę stratega, weryfikatora założeń i niezależnego doradcy. W relacjach wnosi spokój, refleksję i szacunek dla prawdy.'
    },
    'Twórca': {
      name: 'Twórca (The Creator)',
      short: 'Innowator urzeczywistniający nowe idee, formy artystyczne i oryginalne wizje.',
      gift: 'Niewyczerpana wyobraźnia, dar powoływania nowych struktur z nicości, autentyczność, innowacyjność i wybitny zmysł estetyczny.',
      shadow: 'Destrukcyjny perfekcjonizm, lęk przed byciem przeciętnym, niezdolność do domykania projektów przez nieustanne poprawianie.',
      strategy: 'W zespole jest generatorem przełomowych idei i architektem unikalnych rozwiązań. Ceni wolność twórczą i partnerów wspierających wdrożenie.'
    },
    'Władca': {
      name: 'Władca (The Ruler)',
      short: 'Architekt ładu, przejmujący odpowiedzialność za zarządzanie, strukturę i stabilność wspólnoty.',
      gift: 'Naturalne przywództwo, umiejętność koordynowania złożonych systemów, odpowiedzialność za dobrostan grupy i budowanie trwałych struktur.',
      shadow: 'Autorytaryzm, lęk przed chaosem i utratą kontroli, mikrozarządzanie, nieufność i tłumienie autonomii innych.',
      strategy: 'W organizacji porządkuje procesy, wyznacza czytelne reguły gry i egzekwuje standardy. W relacjach dba o bezpieczeństwo i oparcie.'
    },
    'Wojownik': {
      name: 'Wojownik / Bohater (The Hero)',
      short: 'Zdobywca pokonujący przeszkody siłą woli, odwagą, determinacją i dyscypliną.',
      gift: 'Niezłomna determinacja, odwaga w obliczu kryzysu, dyscyplina, zdolność do poświęceń i bezkompromisowa koncentracja na zwycięstwie.',
      shadow: 'Bezwzględność, arogancja, postrzeganie świata wyłącznie w kategoriach wygrany/przegrany oraz syndrom wypalenia przez nieustanną walkę.',
      strategy: 'W zespole jest taranem przełamującym bariery i realizującym najtrudniejsze wyzwania. W relacjach ceni lojalność, szacunek i honor.'
    },
    'Magik': {
      name: 'Magik / Czarodziej (The Magician)',
      short: 'Katalizator głębokich transformacji, łączący intuicję z manifestacją przełomowych zmian.',
      gift: 'Zdolność widzenia ukrytych synergii, holistyczne myślenie, katalizowanie procesów transformacyjnych i przełamywanie paradygmatów.',
      shadow: 'Skłonność do manipulacji, uleganie myśleniu życzeniowemu, megalomania i tworzenie iluzji bez pokrycia w faktach.',
      strategy: 'W zespole pełni rolę wizjonera zmian, który potrafi zamienić kryzys w szansę rozwojową. W relacjach wnosi fascynację, inspirację i rozwój.'
    },
    'Buntownik': {
      name: 'Buntownik / Outsider (The Rebel)',
      short: 'Rewolucjonista niszczący skostniałe struktury i fałszywe tabu w imię wolności.',
      gift: 'Odwaga do kwestionowania status quo, bezkompromisowa szczerość, wyzwalanie otoczenia z toksycznych schematów i obrona wolności.',
      shadow: 'Destrukcja dla samej destrukcji, nihilizm, alienacja społeczna i auto-sabotaż w obliczu jakichkolwiek narzuconych reguł.',
      strategy: 'W zespole jest demaskatorem hipokryzji i motorem odważnych reform. W relacjach wymaga absolutnej autentyczności i szacunku dla suwerenności.'
    },
    'Kochanek': {
      name: 'Kochanek (The Lover)',
      short: 'Poszukiwacz namiętności, intymności, piękna, pasji i głębokich relacji serca.',
      gift: 'Wybitna inteligencja emocjonalna, dar budowania głębokiej bliskości, zmysłowość, empatia i celebracja piękna życia.',
      shadow: 'Lęk przed odrzuceniem i samotnością, utrata własnej tożsamości w relacji, zazdrość i nadmierna zależność od akceptacji.',
      strategy: 'W zespole spaja relacje, dba o rezonans i przyjazną atmosferę. W życiu prywatnym stawia miłość i bliskość na pierwszym miejscu.'
    },
    'Odkrywca': {
      name: 'Odkrywca (The Explorer)',
      short: 'Wędrowiec przekraczający granice, poszukujący autentyczności i niezależności.',
      gift: 'Samodzielność, otwartość na nieznane, elastyczność, nieustanne poszukiwanie sensu i odporność na monotonię rutyny.',
      shadow: 'Chroniczny niepokój, niemożność zapuszczenia korzeni, unikanie zobowiązań i ucieczka przed codzienną odpowiedzialnością.',
      strategy: 'W zespole przeciera nowe szlaki i bada niezagospodarowane rynki. W relacjach potrzebuje przestrzeni, wolności i partnera do przygody.'
    },
    'Opiekun': {
      name: 'Opiekun (The Caregiver)',
      short: 'Altruista chroniący słabszych, niosący bezinteresowną troskę, pomoc i wsparcie.',
      gift: 'Niewyczerpana empatia, bezinteresowność, hojność, dar tworzenia atmosfery bezpieczeństwa i troski o innych.',
      shadow: 'Syndrom męczennika, manipulacja poczuciem winy, zaniedbywanie własnych potrzeb zdrowotnych i emocjonalnych.',
      strategy: 'W zespole stanowi opokę wsparcia emocjonalnego, dba o work-life balance i integrację. W relacjach daje bezgraniczne oddanie.'
    },
    'Błazen': {
      name: 'Błazen (The Jester)',
      short: 'Mistrz humoru i dystansu, celebrujący chwilę obecną i obnażający absurdy powagi.',
      gift: 'Rozbrajanie napięcia humorem, umiejętność życia tu i teraz, demaskowanie fałszu poprzez satyrę, zaraźliwy optymizm.',
      shadow: 'Nieodpowiedzialność, ucieczka w żart przed bolesnymi problemami, cynizm i powierzchowność relacyjna.',
      strategy: 'W zespole rozładowuje stres kryzysowy i buduje morale. W relacjach wnosi lekkość, śmiech i brak zadęcia.'
    },
    'Sierota / Realista': {
      name: 'Towarzysz / Realista (The Everyman / Orphan)',
      short: 'Rzecznik pragmatyzmu, solidarności, równości i szacunku dla zwykłego człowieka.',
      gift: 'Zdroworozsądkowy realizm, autentyczność, brak wywyższania się, solidarność i niezawodność w trudnych chwilach.',
      shadow: 'Mentalność ofiary, cynizm, uleganie przeciętności i lęk przed wyróżnieniem się z tłumu.',
      strategy: 'W zespole jest niezastąpionym filarem codziennej pracy zespołowej. W relacjach stawia na wierność, prostotę i lojalność.'
    },
    'Niewinny': {
      name: 'Niewinny (The Innocent)',
      short: 'Optymista wierzący w czystość intencji, nadzieję, dobroć i harmonijną prostotę życia.',
      gift: 'Niezachwiana wiara w dobro, optymizm, prostota, wierność czystym zasadom moralnym i umiejętność czerpania radości z małych rzeczy.',
      shadow: 'Naiwność, wyparcie trudnych faktów, zależność od innych i bezradność w zderzeniu z cynizmem świata.',
      strategy: 'W zespole jest strażnikiem czystości intencji i etyki. W relacjach wnosi bezpretensjonalne ciepło, zaufanie i szczerość.'
    }
  };

  // Baza interaktywnych podpowiedzi (Tooltips)
  const PSYCHOLOGICAL_TOOLTIPS = {
    'anima': 'W psychologii analitycznej Carla G. Junga to archetyp kobiecej części psychiki u mężczyzny (oraz Animus – męskiej u kobiety). Stanowi bramę do nieświadomości, źródło głębokiej intuicji, wrażliwości i aspiracji duchowych.',
    'senex': 'Archetyp Krytycznego Rodzica lub Surowego Starca w modelu Johna Beebe\'a. Gdy Ego czuje się zagrożone, Senex włącza się jako wewnętrzny sędzia, który wytyka błędy innym lub paraliżuje naszą pewność siebie.',
    'triada-serca': 'W Enneagramie typy 2, 3 i 4. Ich aparat psychiczny ogniskuje się wokół tożsamości, wizerunku, relacji i potrzeby bycia kochanym; podświadomie mierzą się z problemem wstydu.',
    'triada-glowy': 'W Enneagramie typy 5, 6 i 7. Ich aparat psychiczny przetwarza rzeczywistość przez analizę, strategie i poszukiwanie bezpieczeństwa; podświadomie radzą sobie z lękiem przed światem.',
    'triada-ciala': 'W Enneagramie typy 8, 9 i 1. Reagują instynktownie z poziomu trzewi; ogniskiem ich dynamiki jest autonomia, obrona granic i podświadomie tłumiony gniew.',
    'turbulentnosc': 'Wymiar 5 (T vs A). Osobowość turbulentna wykazuje wyższą czujność emocjonalną, silny perfekcjonizm i nieustanny imperatyw do samodoskonalenia i naprawiania braków.',
    'asertywnosc': 'Wymiar 5 (A vs T). Osobowość asertywna charakteryzuje się wysoką odpornością na stres, wiarą we własne siły i spokojem emocjonalnym w kryzysie.',
    'kooperatywnosc': 'Wymiar 6 (C vs S). Orientacja na synergię zespołową, zaufanie, współdzielenie wiedzy i kolektywne osiąganie rezultatów.',
    'autonomia': 'Wymiar 6 (S vs C). Niezależność decyzyjna, suwerenność operacyjna i poleganie przede wszystkim na własnych kompetencjach.',
    'hero': 'Funkcja Dominująca (Bohater) – najważniejszy aparat poznawczy Ego, którym operujemy z największą precyzją, lekkością i pewnością siebie.',
    'cien': 'Kompleks Cienia w modelu Beebe\'a (funkcje 5-8) – nieświadome mechanizmy obronne aktywowane w skrajnym stresie lub zmęczeniu.',
    'indywiduacja': 'Centralny proces rozwoju psychologicznego w ujęciu Junga – świadoma integracja wszystkich aspektów psychiki (Ego, Cienia, Animy) w pełną, zrównoważoną Jaźń.'
  };

  return {
    ENNEAGRAM_CORE_TYPES,
    ENNEAGRAM_WINGS_DETAILS,
    ARCHETYPES_DETAILS,
    PSYCHOLOGICAL_TOOLTIPS
  };
})();
