export interface RecipeIngredient {
  name: string;
  amount: string;
  stage: string; // 'základ' | 'před pečením' | 'po upečení'
}

export interface RecipeItem {
  id: number;
  name: string;
  description?: string | null;
  pizzaStyle: string;
  doughId?: number | null;
  doughName?: string | null;
  prepTimeMinutes: number;
  bakeTemperature: number;
  bakeTimeSeconds: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  isPreset: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const PRESET_RECIPES: RecipeItem[] = [
  {
    id: 1,
    name: 'Pizza Margherita Verace D.O.P.',
    pizzaStyle: 'neapolitan',
    description: 'Tradiční neapolská královna. Loupaná rajčata San Marzano D.O.P., čerstvá mozzarella Fior di Latte, lístky bazalky a extra panenský olivový olej.',
    doughName: 'Klasická Neapolská Pizza (AVPN)',
    prepTimeMinutes: 10,
    bakeTemperature: 450,
    bakeTimeSeconds: 75,
    ingredients: [
      { name: 'Drcená rajčata San Marzano D.O.P. se špetkou soli', amount: '80 g', stage: 'základ' },
      { name: 'Mozzarella Fior di Latte (okapaná)', amount: '90 g', stage: 'před pečením' },
      { name: 'Parmezán / Pecorino Romano jemně strouhaný', amount: '10 g', stage: 'před pečením' },
      { name: 'Čerstvá bazalka', amount: '5 lístků', stage: 'po upečení' },
      { name: 'Extra panenský olivový olej (EVOO)', amount: '1 lžíce', stage: 'po upečení' },
    ],
    instructions: [
      'Roztáhněte těsto od středu ke krajům a vytvořte pravidelný 1–2 cm rantl.',
      'Kruhovým pohybem naneste rajčatový základ na střed těsta.',
      'Posypte strouhaným parmezánem a rozprostřete proužky mozzarelly.',
      'Sazejte do rozpálené pece na 450 °C a pečte 60–80 sekund.',
      'Ihned po vytažení dozdobte čerstvou bazalkou a zastříkněte olivovým olejem.',
    ],
    isPreset: true,
  },
  {
    id: 2,
    name: 'Pizza Marinara Tradizionale',
    pizzaStyle: 'neapolitan',
    description: 'Nejstarší neapolská pizza bez sýra s explozí chuti rajčat, tenkých plátků česneku a divokého oregana.',
    doughName: 'Klasická Neapolská Pizza (AVPN)',
    prepTimeMinutes: 8,
    bakeTemperature: 450,
    bakeTimeSeconds: 65,
    ingredients: [
      { name: 'Rajčata San Marzano D.O.P.', amount: '90 g', stage: 'základ' },
      { name: 'Čerstvý česnek na velmi tenké plátky', amount: '2 stroužky', stage: 'před pečením' },
      { name: 'Divoké oregano (promnuté v dlaních)', amount: '1 lžička', stage: 'před pečením' },
      { name: 'Extra panenský olivový olej', amount: '15 ml', stage: 'před i po pečení' },
    ],
    instructions: [
      'Roztáhněte těsto do tenkého středu.',
      'Naneste rovnoměrně rajčatový základ.',
      'Rozmístěte tenké plátky česneku, posypte oreganem a zakápněte olejem.',
      'Pečte v peci 60–75 sekund.',
    ],
    isPreset: true,
  },
  {
    id: 3,
    name: "Pizza Diavola con 'Nduja di Spilinga",
    pizzaStyle: 'canotto',
    description: "Pikantní moderní pizza s nadýchaným okrajem Canotto, kalábrijskou 'Ndujou a kapkami chilli medu.",
    doughName: 'Moderní Pizza Canotto (Vzdušné okraje)',
    prepTimeMinutes: 12,
    bakeTemperature: 440,
    bakeTimeSeconds: 80,
    ingredients: [
      { name: 'Rajčatové sugo San Marzano', amount: '80 g', stage: 'základ' },
      { name: 'Mozzarella Fior di Latte', amount: '85 g', stage: 'před pečením' },
      { name: 'Salame Piccante / Ventricina', amount: '40 g', stage: 'před pečením' },
      { name: "'Nduja di Spilinga", amount: '25 g', stage: 'před pečením' },
      { name: 'Pikantní chilli med (Hot Honey)', amount: '1 lžička', stage: 'po upečení' },
    ],
    instructions: [
      'Roztáhněte těsto šetrně, aby okraje zůstaly plné vzduchových bublin.',
      'Naneste sugo, mozzarellu, plátky salámu a kousky pikantní nduji.',
      'Pečte v peci na 440 °C cca 75–85 sekund.',
      'Po upečení pokapejte chilli medem.',
    ],
    isPreset: true,
  },
  {
    id: 4,
    name: 'Mortadella, Pistacchio & Burrata Pugliese',
    pizzaStyle: 'canotto',
    description: 'Moderní italská bílá pizza (Pizza Bianca). Krémová burrata, plátky jemné mortadelly Bologna a křupavé pistácie.',
    doughName: '100% Biga Neapolské těsto',
    prepTimeMinutes: 15,
    bakeTemperature: 430,
    bakeTimeSeconds: 80,
    ingredients: [
      { name: 'Fior di latte (podklad pro upečení)', amount: '60 g', stage: 'před pečením' },
      { name: 'Mortadella Bologna I.G.P. na tenoučké plátky', amount: '70 g', stage: 'po upečení' },
      { name: 'Čerstvá Burrata di Puglia', amount: '1 ks (125 g)', stage: 'po upečení' },
      { name: 'Drcené pražené pistácie nebo pistáciové pesto', amount: '25 g', stage: 'po upečení' },
      { name: 'Čerstvá bazalka', amount: '4 lístky', stage: 'po upečení' },
    ],
    instructions: [
      'Na těsto dejte pouze malé množství fior di latte pro bílý základ a upečte korpus.',
      'Ihned po vytažení na horkou pizzu položte tenké plátky mortadelly.',
      'Doprostřed usaďte natrženou krémovou burratu a zasypte pistáciemi s kapkou pesta.',
    ],
    isPreset: true,
  },
  {
    id: 5,
    name: 'Quattro Formaggi Cremosa',
    pizzaStyle: 'canotto',
    description: 'Bohatá sýrová harmonie se sladkokyselým tónem gorgonzoly a 24měsíčního parmezánu.',
    doughName: 'Klasická Neapolská Pizza (AVPN)',
    prepTimeMinutes: 10,
    bakeTemperature: 430,
    bakeTimeSeconds: 80,
    ingredients: [
      { name: 'Fior di Latte', amount: '70 g', stage: 'před pečením' },
      { name: 'Gorgonzola D.O.P. Dolce', amount: '40 g', stage: 'před pečením' },
      { name: 'Fontina nebo Provolone', amount: '30 g', stage: 'před pečením' },
      { name: 'Parmigiano Reggiano 24 měsíců', amount: '20 g', stage: 'po upečení' },
    ],
    instructions: [
      'Rozprostřete sýry na roztažené těsto.',
      'Pečte do roztavení a mírného zhnědnutí.',
      'Ihned posypte jemně nastrouhaným parmezánem a zakápněte olivovým olejem.',
    ],
    isPreset: true,
  },
  {
    id: 6,
    name: 'Bezlepková Pizza Margherita (Caputo Fioreglut)',
    pizzaStyle: 'glutenfree',
    description: '100% bezlepková neapolská pizza s křupavou kůrkou a lahodným sýrem.',
    doughName: 'Bezlepkové těsto (Gluten-Free)',
    prepTimeMinutes: 10,
    bakeTemperature: 400,
    bakeTimeSeconds: 110,
    ingredients: [
      { name: 'Sugo San Marzano D.O.P.', amount: '80 g', stage: 'základ' },
      { name: 'Mozzarella bez laktózy nebo Fior di Latte', amount: '85 g', stage: 'před pečením' },
      { name: 'Čerstvá bazalka', amount: '4 lístky', stage: 'po upečení' },
      { name: 'Extra panenský olivový olej', amount: '1 lžíce', stage: 'po upečení' },
    ],
    instructions: [
      'Bezlepkový bochánek roztahujte na papíře na pečení s podsypáním.',
      'Naneste sugo a mozzarellu.',
      'Pečte při 380–420 °C cca 90–120 sekund do křupava.',
      'Dozdobte bazalkou a čerstvým olejem.',
    ],
    isPreset: true,
  },
];
