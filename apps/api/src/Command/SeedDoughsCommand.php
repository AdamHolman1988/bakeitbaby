<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Dough;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed:doughs',
    description: 'Seeds authentic benchmark dough formulations into the database'
)]
final class SeedDoughsCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $repo = $this->entityManager->getRepository(Dough::class);

        $presets = [
            [
                'name' => 'Klasická Neapolská Pizza (AVPN)',
                'pizzaStyle' => 'neapolitan',
                'prefermentType' => 'direct',
                'prefermentPercentage' => 0.0,
                'doughBallsCount' => 4,
                'ballWeightGrams' => 260,
                'hydrationPercentage' => 65.0,
                'saltPercentage' => 2.8,
                'yeastPercentage' => 0.15,
                'yeastType' => 'fresh',
                'oilPercentage' => 0.0,
                'sugarPercentage' => 0.0,
                'fermentationRtHours' => 8.0,
                'fermentationCtHours' => 16.0,
                'description' => 'Oficiální neapolská receptura podle asociace AVPN. Vynikající pružnost, tenký střed a charakteristické leopardí fleky.',
                'flourName' => 'Caputo Pizzeria Tipo 00 (W 260)',
                'instructions' => [
                    'Rozpusťte sůl ve studené vodě (cca 18°C).',
                    'Přidejte cca 10 % mouky a promíchejte.',
                    'Rozdrobte čerstvé droždí a postupně přisypávejte zbylou mouku.',
                    'Hněťte 15–20 minut, dokud není těsto sametově hladké a elastické.',
                    'Nechte odpočívat 2 hodiny v bloku při pokojové teplotě přikryté utěrkou.',
                    'Vytvarujte bochánky (panetti) po 260 g a uložte do kynoucího boxu do lednice na 16 hodin.',
                    'Vyjměte 4–6 hodin před pečením a nechte dokynout při pokojové teplotě.',
                    'Pečte v rozehřáté peci (430–480°C) po dobu 60–90 sekund.',
                ],
            ],
            [
                'name' => 'Moderní Pizza Canotto (Vzdušné okraje)',
                'pizzaStyle' => 'canotto',
                'prefermentType' => 'direct',
                'prefermentPercentage' => 0.0,
                'doughBallsCount' => 4,
                'ballWeightGrams' => 280,
                'hydrationPercentage' => 72.0,
                'saltPercentage' => 2.6,
                'yeastPercentage' => 0.12,
                'yeastType' => 'fresh',
                'oilPercentage' => 1.5,
                'sugarPercentage' => 0.0,
                'fermentationRtHours' => 6.0,
                'fermentationCtHours' => 24.0,
                'description' => 'Moderní styl s nafouknutými a křupavými bublinami v okraji (canotto = záchranný člun). Vyšší hydratace a delší chladové zrání.',
                'flourName' => 'Caputo Nuvola Super (W 330)',
                'instructions' => [
                    'Začněte autolýzou: smíchejte celou mouku s 60 % vody a nechte 30 minut stát.',
                    'Přidejte droždí a zbývající ledovou vodu postupně (bassinage) během hnětení.',
                    'Na závěr přidejte sůl a olivový olej pro lepší elasticitu.',
                    'Proveďte 3 série překladů (stretch & fold) po 20 minutách.',
                    'Uložte do chladu (4°C) na 24 hodin.',
                    'Navažte 280g bochánky a nechte 5 hodin v pokojové teplotě.',
                    'Při roztahování vytlačujte vzduch jemně ze středu do okrajů, nikdy nemačkejte rantl!',
                ],
            ],
            [
                'name' => '100% Biga Neapolské těsto',
                'pizzaStyle' => 'canotto',
                'prefermentType' => 'biga',
                'prefermentPercentage' => 100.0,
                'doughBallsCount' => 4,
                'ballWeightGrams' => 275,
                'hydrationPercentage' => 70.0,
                'saltPercentage' => 2.7,
                'yeastPercentage' => 1.0,
                'yeastType' => 'fresh',
                'oilPercentage' => 0.0,
                'sugarPercentage' => 0.0,
                'fermentationRtHours' => 1.0,
                'fermentationCtHours' => 24.0,
                'description' => 'Tradiční italský předkvas pro neuvěřitelnou lehkost, voňavost a křupavé alveoly.',
                'flourName' => 'Caputo Nuvola Super / Cuoco (W 320+)',
                'instructions' => [
                    'Fáze 1 (Biga): Smíchejte veškerou mouku s 45 % vody a 1 % čerstvého droždí. Těsto pouze hrubě spojte, nesmí vzniknout lepek!',
                    'Nechte bigu zrát 1 hodinu při pokojové teplotě, poté 16–24 hodin v chladu (4–18°C).',
                    'Fáze 2 (Osvěžení): Natrhejte bigu na kousky do mísy.',
                    'Přidávejte postupně zbývající ledovou vodu a sůl.',
                    'Hněťte do hladkého a sametového těsta s teplotou do 23°C.',
                    'Odpočinek 30 min, rozdělení na bochánky a kynutí 3–4 hodiny při pokojové teplotě před pečením.',
                ],
            ],
            [
                'name' => 'Poolish Pizza Formula',
                'pizzaStyle' => 'neapolitan',
                'prefermentType' => 'poolish',
                'prefermentPercentage' => 30.0,
                'doughBallsCount' => 4,
                'ballWeightGrams' => 260,
                'hydrationPercentage' => 68.0,
                'saltPercentage' => 2.8,
                'yeastPercentage' => 0.20,
                'yeastType' => 'fresh',
                'oilPercentage' => 1.0,
                'sugarPercentage' => 0.5,
                'fermentationRtHours' => 2.0,
                'fermentationCtHours' => 18.0,
                'description' => 'Tekutý preferment (1:1 mouka a voda) pro hedvábnou tažnost těsta a zlatavou karamelizaci.',
                'flourName' => 'Caputo Pizzeria Tipo 00 (W 260)',
                'instructions' => [
                    'Fáze 1 (Poolish): Smíchejte 30 % celkové mouky s odpovídajícím množstvím vody (1:1) a špetkou droždí a medu.',
                    'Nechte 1 hodinu v teple a poté 16–20 hodin v lednici, dokud na povrchu nevzniknou bubliny.',
                    'Fáze 2: Do mísy vlijte poolish, přisypte zbytek mouky a začněte hníst.',
                    'Přilijte zbytek vody, přidejte sůl a olivový olej.',
                    'Hněťte 12 minut, odpočinek 45 minut, vytvarujte bochánky a nechte 3 hodiny kynout.',
                ],
            ],
            [
                'name' => 'Římská pizza na plech (Pizza in Teglia)',
                'pizzaStyle' => 'roman_crispy',
                'prefermentType' => 'direct',
                'prefermentPercentage' => 0.0,
                'doughBallsCount' => 2,
                'ballWeightGrams' => 550,
                'hydrationPercentage' => 78.0,
                'saltPercentage' => 2.5,
                'yeastPercentage' => 0.20,
                'yeastType' => 'fresh',
                'oilPercentage' => 3.0,
                'sugarPercentage' => 1.0,
                'fermentationRtHours' => 4.0,
                'fermentationCtHours' => 48.0,
                'description' => 'Lehká, extrémně křupavá a vysoká pizza pečená v plechu v domácí troubě na maximum (250–300°C).',
                'flourName' => 'Caputo Manitoba Oro (W 380)',
                'instructions' => [
                    'Smíchejte mouku s 70 % ledové vody.',
                    'Po rozpuštění droždí pomalu přilévejte zbylou vodu se solí.',
                    'Přidejte kvalitní olivový olej a dobře zapracujte.',
                    'Aplikujte techniku coil folds 4× po 20 minutách.',
                    'Nechte fermentovat v chladu (4°C) 48 hodin.',
                    'Vykynuté těsto jemně prsty roztáhněte do naolejovaného plechu a pečte do křupava.',
                ],
            ],
            [
                'name' => 'Bezlepkové těsto (Gluten-Free)',
                'pizzaStyle' => 'glutenfree',
                'prefermentType' => 'direct',
                'prefermentPercentage' => 0.0,
                'doughBallsCount' => 4,
                'ballWeightGrams' => 270,
                'hydrationPercentage' => 82.0,
                'saltPercentage' => 2.5,
                'yeastPercentage' => 0.35,
                'yeastType' => 'instant_dry',
                'oilPercentage' => 3.0,
                'sugarPercentage' => 0.0,
                'fermentationRtHours' => 3.0,
                'fermentationCtHours' => 18.0,
                'description' => 'Speciální těsto pro celiaky a bezlepkovou dietu. Vysoká hydratace zajišťuje vláčnost a strukturu i bez pšeničného lepku.',
                'flourName' => 'Caputo Fioreglut (Gluten-Free)',
                'instructions' => [
                    'Vlažnou vodu smíchejte se sušeným droždím a nechte 5 minut aktivovat.',
                    'Do mísy prosejte bezlepkovou směs Caputo Fioreglut.',
                    'Míchejte vařečkou nebo hnětačem na nízkou rychlost, postupně přidejte sůl a olivový olej.',
                    'Bezlepkové těsto se nehněte pro vývoj lepku, ale důkladně se spojí do homogenní vláčné hmoty.',
                    'Nechte 30 minut odpočinout, poté rozdělte na bochánky po 270 g do naolejovaných misek.',
                    'Kynutí: 3 hodiny při pokojové teplotě nebo přes noc v lednici.',
                    'Při tvarování podsypávejte rýžovou moukou nebo bezlepkovou směsí.',
                ],
            ],
        ];

        $count = 0;
        foreach ($presets as $item) {
            $existing = $repo->findOneBy(['name' => $item['name']]);
            if ($existing instanceof Dough) {
                $existing->setPizzaStyle($item['pizzaStyle']);
                $existing->setPrefermentType($item['prefermentType']);
                $existing->setPrefermentPercentage((float) $item['prefermentPercentage']);
                $existing->setDoughBallsCount($item['doughBallsCount']);
                $existing->setBallWeightGrams($item['ballWeightGrams']);
                $existing->setHydrationPercentage((float) $item['hydrationPercentage']);
                $existing->setSaltPercentage((float) $item['saltPercentage']);
                $existing->setYeastPercentage((float) $item['yeastPercentage']);
                $existing->setYeastType($item['yeastType']);
                $existing->setOilPercentage((float) $item['oilPercentage']);
                $existing->setSugarPercentage((float) $item['sugarPercentage']);
                $existing->setFermentationRtHours((float) $item['fermentationRtHours']);
                $existing->setFermentationCtHours((float) $item['fermentationCtHours']);
                $existing->setDescription($item['description']);
                $existing->setFlourName($item['flourName']);
                $existing->setInstructions($item['instructions']);
                $existing->setIsPreset(true);
            } else {
                $dough = new Dough(
                    name: $item['name'],
                    pizzaStyle: $item['pizzaStyle'],
                    prefermentType: $item['prefermentType'],
                    doughBallsCount: $item['doughBallsCount'],
                    ballWeightGrams: $item['ballWeightGrams'],
                    hydrationPercentage: (float) $item['hydrationPercentage'],
                    saltPercentage: (float) $item['saltPercentage'],
                    yeastPercentage: (float) $item['yeastPercentage'],
                    yeastType: $item['yeastType'],
                    oilPercentage: (float) $item['oilPercentage'],
                    sugarPercentage: (float) $item['sugarPercentage'],
                    fermentationRtHours: (float) $item['fermentationRtHours'],
                    fermentationCtHours: (float) $item['fermentationCtHours'],
                    description: $item['description'],
                    flourName: $item['flourName'],
                    instructions: $item['instructions'],
                    prefermentPercentage: (float) $item['prefermentPercentage'],
                    isPreset: true
                );
                $this->entityManager->persist($dough);
            }
            $count++;
        }

        $this->entityManager->flush();

        $io->success(sprintf('Seeded/Updated %d dough formulations successfully.', $count));
        return Command::SUCCESS;
    }
}
