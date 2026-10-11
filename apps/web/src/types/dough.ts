export interface DoughItem {
  id: number;
  name: string;
  description?: string | null;
  pizzaStyle: string;
  prefermentType: 'direct' | 'biga' | 'poolish';
  prefermentPercentage: number;
  doughBallsCount: number;
  ballWeightGrams: number;
  hydrationPercentage: number;
  saltPercentage: number;
  yeastPercentage: number;
  yeastType: string;
  oilPercentage: number;
  sugarPercentage: number;
  fermentationRtHours: number;
  fermentationCtHours: number;
  flourId?: number | null;
  flourName?: string | null;
  instructions: string[];
  isPreset: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const PRESET_DOUGHS: DoughItem[] = [
  {
    id: 1,
    name: 'Klasická Neapolská Pizza (AVPN)',
    pizzaStyle: 'neapolitan',
    prefermentType: 'direct',
    prefermentPercentage: 0,
    doughBallsCount: 4,
    ballWeightGrams: 260,
    hydrationPercentage: 65.0,
    saltPercentage: 2.8,
    yeastPercentage: 0.15,
    yeastType: 'fresh',
    oilPercentage: 0.0,
    sugarPercentage: 0.0,
    fermentationRtHours: 8.0,
    fermentationCtHours: 16.0,
    description: 'Oficiální neapolská receptura podle asociace AVPN. Vynikající pružnost, tenký střed a leopardí fleky.',
    flourName: 'Caputo Pizzeria Tipo 00 (W 260)',
    instructions: [
      'Rozpusťte sůl ve studené vodě (cca 18°C).',
      'Přidejte cca 10 % mouky a promíchejte.',
      'Rozdrobte čerstvé droždí a postupně přisypávejte zbylou mouku.',
      'Hněťte 15–20 minut, dokud není těsto sametově hladké a elastické.',
      'Nechte odpočívat 2 hodiny v bloku při pokojové teplotě.',
      'Vytvarujte bochánky po 260 g a uložte do boxu do chladu na 16 hodin.',
      'Vyjměte 4–6 hodin před pečením a pečte při 450°C po dobu 60–90 sekund.',
    ],
    isPreset: true,
  },
  {
    id: 2,
    name: 'Moderní Pizza Canotto (Vzdušné okraje)',
    pizzaStyle: 'canotto',
    prefermentType: 'direct',
    prefermentPercentage: 0,
    doughBallsCount: 4,
    ballWeightGrams: 280,
    hydrationPercentage: 72.0,
    saltPercentage: 2.6,
    yeastPercentage: 0.12,
    yeastType: 'fresh',
    oilPercentage: 1.5,
    sugarPercentage: 0.0,
    fermentationRtHours: 6.0,
    fermentationCtHours: 24.0,
    description: 'Moderní styl s velkými bublinami v okraji. Vyšší hydratace a dlouhé chladové zrání.',
    flourName: 'Caputo Nuvola Super (W 330)',
    instructions: [
      'Začněte autolýzou s 60 % vody na 30 minut.',
      'Přidejte droždí a zbývající ledovou vodu postupně během hnětení.',
      'Přidejte sůl a olivový olej, proveďte 3 série překladů (stretch & fold).',
      'Zrání v chladu 24 hodin, rozdělení na 280g bochánky a 5h kynutí při pokojové teplotě.',
    ],
    isPreset: true,
  },
  {
    id: 3,
    name: '100% Biga Neapolské těsto',
    pizzaStyle: 'canotto',
    prefermentType: 'biga',
    prefermentPercentage: 100,
    doughBallsCount: 4,
    ballWeightGrams: 275,
    hydrationPercentage: 70.0,
    saltPercentage: 2.7,
    yeastPercentage: 1.0,
    yeastType: 'fresh',
    oilPercentage: 0.0,
    sugarPercentage: 0.0,
    fermentationRtHours: 1.0,
    fermentationCtHours: 24.0,
    description: 'Tradiční italský předkvas pro neuvěřitelnou lehkost, voňavost a křupavé alveoly.',
    flourName: 'Caputo Nuvola Super (W 330)',
    instructions: [
      'Fáze 1 (Biga): Smíchejte 100 % mouky s 45 % vody a 1 % droždí jen hrubě, nerozvíjejte lepek.',
      'Zrání bigy: 1h RT + 16–24h v lednici.',
      'Fáze 2 (Osvěžení): Natrhejte bigu, přidejte zbylou ledovou vodu a sůl.',
      'Vyhněťte do hladka, odpočinek 30 min, tvorba bochánků a 3–4h kynutí před pečením.',
    ],
    isPreset: true,
  },
  {
    id: 4,
    name: 'Poolish Pizza Formula (30 % Poolish)',
    pizzaStyle: 'neapolitan',
    prefermentType: 'poolish',
    prefermentPercentage: 30,
    doughBallsCount: 4,
    ballWeightGrams: 260,
    hydrationPercentage: 68.0,
    saltPercentage: 2.8,
    yeastPercentage: 0.20,
    yeastType: 'fresh',
    oilPercentage: 1.0,
    sugarPercentage: 0.5,
    fermentationRtHours: 2.0,
    fermentationCtHours: 18.0,
    description: 'Tekutý preferment (1:1 mouka a voda) pro hedvábnou tažnost a zlatavou karamelizaci.',
    flourName: 'Caputo Pizzeria Tipo 00 (W 260)',
    instructions: [
      'Fáze 1: Smíchejte 30 % celkové mouky se stejným množstvím vody (1:1) a špetkou droždí.',
      'Zrání poolishe: 1h RT + 16–20h lednice.',
      'Fáze 2: Přidejte zbytek mouky, vody, sůl a olej. Hněťte 12 minut a nechte bochánky kynout 3 hodiny.',
    ],
    isPreset: true,
  },
  {
    id: 5,
    name: 'Římská pizza na plech (Pizza in Teglia)',
    pizzaStyle: 'roman_crispy',
    prefermentType: 'direct',
    prefermentPercentage: 0,
    doughBallsCount: 2,
    ballWeightGrams: 550,
    hydrationPercentage: 78.0,
    saltPercentage: 2.5,
    yeastPercentage: 0.20,
    yeastType: 'fresh',
    oilPercentage: 3.0,
    sugarPercentage: 1.0,
    fermentationRtHours: 4.0,
    fermentationCtHours: 48.0,
    description: 'Extrémně křupavá vysoká pizza pečená v plechu v domácí troubě (250–300°C).',
    flourName: 'Caputo Manitoba Oro (W 380)',
    instructions: [
      'Vysoká hydratace (78 %) s postupným přiléváním ledové vody.',
      'Aplikujte techniku coil folds 4× po 20 minutách.',
      'Zrání v chladu 48 hodin.',
      'Roztáhněte prsty do naolejovaného plechu a pečte do křupava.',
    ],
    isPreset: true,
  },
  {
    id: 6,
    name: 'Bezlepkové těsto (Gluten-Free)',
    pizzaStyle: 'glutenfree',
    prefermentType: 'direct',
    prefermentPercentage: 0,
    doughBallsCount: 4,
    ballWeightGrams: 270,
    hydrationPercentage: 82.0,
    saltPercentage: 2.5,
    yeastPercentage: 0.35,
    yeastType: 'instant_dry',
    oilPercentage: 3.0,
    sugarPercentage: 0.0,
    fermentationRtHours: 3.0,
    fermentationCtHours: 18.0,
    description: 'Speciální těsto pro bezlepkovou dietu s vysokou hydratací pro vláčnost a pružnost.',
    flourName: 'Caputo Fioreglut (Gluten-Free)',
    instructions: [
      'Smíchejte bezlepkovou směs s vlažnou vodou, droždím, solí a olejem.',
      'Nehněte na lepek, pouze důkladně spojte do homogenní hmoty.',
      'Rozdělte do misek s olejem na 270g bochánky, kynutí 3h RT nebo přes noc v lednici.',
    ],
    isPreset: true,
  },
];
