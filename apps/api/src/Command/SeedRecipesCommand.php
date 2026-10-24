<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Recipe;
use App\Seed\SeedTranslator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed:recipes',
    description: 'Seeds authentic pizza cookbook recipes into the database'
)]
final class SeedRecipesCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly SeedTranslator $translator
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $repo = $this->entityManager->getRepository(Recipe::class);

        $presets = [
            [
                'name' => 'Pizza Margherita Verace D.O.P.',
                'pizzaStyle' => 'neapolitan',
                'description' => 'Tradiční neapolská královna. Loupaná rajčata San Marzano D.O.P., čerstvá mozzarella Fior di Latte, lístky bazalky a extra panenský olivový olej.',
                'doughName' => 'Klasická Neapolská Pizza (AVPN)',
                'prepTimeMinutes' => 10,
                'bakeTemperature' => 450,
                'bakeTimeSeconds' => 75,
                'ingredients' => [
                    ['name' => 'Drcená rajčata San Marzano D.O.P. se špetkou mořské soli', 'amount' => '80 g', 'stage' => 'základ'],
                    ['name' => 'Mozzarella Fior di Latte (nakrájená na proužky)', 'amount' => '90 g', 'stage' => 'před pečením'],
                    ['name' => 'Čerstvá bazalka', 'amount' => '5 lístků', 'stage' => 'po upečení'],
                    ['name' => 'Extra panenský olivový olej (EVOO)', 'amount' => '1 lžíce', 'stage' => 'po upečení'],
                    ['name' => 'Parmezán / Pecorino Romano jemně strouhaný', 'amount' => '10 g', 'stage' => 'před pečením'],
                ],
                'instructions' => [
                    'Roztáhněte těsto od středu ke krajům a vytvořte pravidelný 1–2 cm okraj.',
                    'Kruhovým pohybem naneste rajčatový základ na střed těsta.',
                    'Posypte strouhaným parmezánem a rozprostřete okapanou mozzarellu.',
                    'Zastříkněte pár kapkami olivového oleje a zasaďte do rozpálené pece (450 °C).',
                    'Pečte 60–80 sekund s jedním až dvěma pootočeními pro rovnoměrné opékání.',
                    'Ihned po vytažení přidejte lístky čerstvé bazalky a zakápněte čerstvým EVOO.',
                ],
            ],
            [
                'name' => 'Pizza Marinara Tradizionale',
                'pizzaStyle' => 'neapolitan',
                'description' => 'Nejstarší neapolská pizza námořníků. Bez sýra, s explozí chuti rajčat, plátků česneku a sušeného oregana.',
                'doughName' => 'Klasická Neapolská Pizza (AVPN)',
                'prepTimeMinutes' => 8,
                'bakeTemperature' => 450,
                'bakeTimeSeconds' => 65,
                'ingredients' => [
                    ['name' => 'Rajčata San Marzano D.O.P.', 'amount' => '90 g', 'stage' => 'základ'],
                    ['name' => 'Čerstvý česnek na velmi tenké plátky', 'amount' => '1–2 stroužky', 'stage' => 'před pečením'],
                    ['name' => 'Sušené divoké oregano (nejlépe z Kalábrie či Sicílie)', 'amount' => '1 lžička', 'stage' => 'před pečením'],
                    ['name' => 'Extra panenský olivový olej', 'amount' => '15 ml', 'stage' => 'před i po pečení'],
                ],
                'instructions' => [
                    'Roztáhněte těsto do tenkého středu.',
                    'Naneste rovnoměrně rajčatový základ.',
                    'Rozmístěte tenké plátky česneku a posypte oreganem promnutým v dlaních.',
                    'Bohatě zakápněte olivovým olejem.',
                    'Pečte v peci 60–75 sekund.',
                ],
            ],
            [
                'name' => 'Pizza Diavola con \'Nduja di Spilinga',
                'pizzaStyle' => 'canotto',
                'description' => 'Pikantní moderní pizza s nadýchaným rantlem. Salame Napoli Piccante, kalábrijská \'Nduja a kapky medu s chilli.',
                'doughName' => 'Moderní Pizza Canotto (Vzdušné okraje)',
                'prepTimeMinutes' => 12,
                'bakeTemperature' => 440,
                'bakeTimeSeconds' => 80,
                'ingredients' => [
                    ['name' => 'Rajčatové sugo San Marzano', 'amount' => '80 g', 'stage' => 'základ'],
                    ['name' => 'Mozzarella di Bufala nebo Fior di Latte', 'amount' => '85 g', 'stage' => 'před pečením'],
                    ['name' => 'Salame Piccante / Ventricina', 'amount' => '40 g', 'stage' => 'před pečením'],
                    ['name' => '\'Nduja di Spilinga', 'amount' => '25 g', 'stage' => 'před pečením'],
                    ['name' => 'Chilli med (Hot Honey)', 'amount' => '1 lžička', 'stage' => 'po upečení'],
                ],
                'instructions' => [
                    'Roztáhněte těsto šetrně, abyste zachovali vzduch v okraji pro efekt Canotto.',
                    'Naneste sugo a mozzarellu.',
                    'Rozložte plátky pikantního salámu a kousky \'nduji.',
                    'Pečte 75–85 sekund při 440 °C.',
                    'Při podávání zakápněte pikantním medem pro dokonalý sweet & spicy kontrast.',
                ],
            ],
            [
                'name' => 'Mortadella, Pistacchio & Burrata Pugliese',
                'pizzaStyle' => 'canotto',
                'description' => 'Moderní italská senzace (Pizza Bianca). Krémová burrata, plátky jemné mortadelly Bologna I.G.P. a křupavé pistácie.',
                'doughName' => '100% Biga Neapolské těsto',
                'prepTimeMinutes' => 15,
                'bakeTemperature' => 430,
                'bakeTimeSeconds' => 80,
                'ingredients' => [
                    ['name' => 'Fior di latte (podklad pro upečení)', 'amount' => '60 g', 'stage' => 'před pečením'],
                    ['name' => 'Mortadella Bologna I.G.P. na tenoučké plátky', 'amount' => '70 g', 'stage' => 'po upečení'],
                    ['name' => 'Čerstvá Burrata di Puglia', 'amount' => '1 ks (125 g)', 'stage' => 'po upečení'],
                    ['name' => 'Pistáciové pesto nebo drcené pražené pistácie', 'amount' => '25 g', 'stage' => 'po upečení'],
                    ['name' => 'Lístky čerstvé bazalky a kapka citrónové kůry', 'amount' => 'dle chuti', 'stage' => 'po upečení'],
                ],
                'instructions' => [
                    'Roztáhněte těsto a poklaďte pouze malou vrstvou fior di latte na bílý základ.',
                    'Upečte korpus do zlatova a nafouknutí okrajů (cca 70–85 s).',
                    'Ihned po vytažení na horkou pizzu navrstvěte nadýchanou mortadellu.',
                    'Doprostřed umístěte natrženou burratu s krémovým vnitřkem.',
                    'Zasypte pistáciemi, zakápněte pistáciovým pestem a ozdobte bazalkou.',
                ],
            ],
            [
                'name' => 'Quattro Formaggi Cremosa',
                'pizzaStyle' => 'canotto',
                'description' => 'Bohatá sýrová kompozice se sladkokyselým nádechem gorgonzoly a parmazánu.',
                'doughName' => 'Klasická Neapolská Pizza (AVPN)',
                'prepTimeMinutes' => 10,
                'bakeTemperature' => 430,
                'bakeTimeSeconds' => 80,
                'ingredients' => [
                    ['name' => 'Fior di Latte', 'amount' => '70 g', 'stage' => 'před pečením'],
                    ['name' => 'Gorgonzola D.O.P. Dolce', 'amount' => '40 g', 'stage' => 'před pečením'],
                    ['name' => 'Fontina nebo Provolone Valpadana', 'amount' => '30 g', 'stage' => 'před pečením'],
                    ['name' => 'Parmigiano Reggiano 24 měsíců', 'amount' => '20 g', 'stage' => 'po upečení'],
                ],
                'instructions' => [
                    'Rozprostřete sýry rovnoměrně na roztažené těsto.',
                    'Upečte do roztečení a jemného zhnědnutí sýrů.',
                    'Ihned posypte jemně nastrouhaným parmazánem a zakápněte olivovým olejem.',
                ],
            ],
            [
                'name' => 'Bezlepková Pizza Margherita (Caputo Fioreglut)',
                'pizzaStyle' => 'glutenfree',
                'description' => '100% bezlepková neapolská pizza s nepřekonatelnou chutí a křupavým spodkem.',
                'doughName' => 'Bezlepkové těsto (Gluten-Free)',
                'prepTimeMinutes' => 10,
                'bakeTemperature' => 400,
                'bakeTimeSeconds' => 120,
                'ingredients' => [
                    ['name' => 'Sugo San Marzano D.O.P.', 'amount' => '80 g', 'stage' => 'základ'],
                    ['name' => 'Mozzarella bez laktózy nebo klasické Fior di Latte', 'amount' => '85 g', 'stage' => 'před pečením'],
                    ['name' => 'Čerstvá bazalka', 'amount' => '4 lístky', 'stage' => 'po upečení'],
                    ['name' => 'Extra panenský olivový olej', 'amount' => '1 lžíce', 'stage' => 'po upečení'],
                ],
                'instructions' => [
                    'Bezlepkový bochánek roztahujte na papíře na pečení nebo podsypané bezlepkovou moukou.',
                    'Naneste sugo a mozzarellu.',
                    'Pečte v peci při 380–420 °C po dobu cca 90–120 s (bezlepkové těsto potřebuje mírně delší propečení).',
                    'Dozdobte bazalkou a olejem.',
                ],
            ],
        ];

        $count = 0;
        foreach ($presets as $item) {
            $existing = $repo->findOneBy(['name' => $item['name']]);
            if ($existing instanceof Recipe) {
                $existing->setPizzaStyle($item['pizzaStyle']);
                $existing->setDescription($item['description']);
                $existing->setDoughName($item['doughName']);
                $existing->setPrepTimeMinutes($item['prepTimeMinutes']);
                $existing->setBakeTemperature($item['bakeTemperature']);
                $existing->setBakeTimeSeconds($item['bakeTimeSeconds']);
                $existing->setIngredients($item['ingredients']);
                $existing->setInstructions($item['instructions']);
                $existing->setIsPreset(true);
                $existing->setTranslations(['en' => $this->translator->translateItem($item, Recipe::translatableFields())]);
            } else {
                $recipe = new Recipe(
                    name: $item['name'],
                    pizzaStyle: $item['pizzaStyle'],
                    description: $item['description'],
                    doughName: $item['doughName'],
                    prepTimeMinutes: $item['prepTimeMinutes'],
                    bakeTemperature: $item['bakeTemperature'],
                    bakeTimeSeconds: $item['bakeTimeSeconds'],
                    ingredients: $item['ingredients'],
                    instructions: $item['instructions'],
                    isPreset: true
                );
                $recipe->setTranslations(['en' => $this->translator->translateItem($item, Recipe::translatableFields())]);
                $this->entityManager->persist($recipe);
            }
            $count++;
        }

        $this->entityManager->flush();

        $io->success(sprintf('Seeded/Updated %d pizza cookbook recipes successfully.', $count));
        return Command::SUCCESS;
    }
}
