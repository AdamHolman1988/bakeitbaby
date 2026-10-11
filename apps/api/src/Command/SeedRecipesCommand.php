<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Recipe;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed:recipes',
    description: 'Seeds authentic benchmark pizza recipes into the database'
)]
final class SeedRecipesCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $repo = $this->entityManager->getRepository(Recipe::class);

        $presets = [
            [
                'name' => 'Klasická Neapolská Pizza (AVPN)',
                'pizzaStyle' => 'neapolitan',
                'prefermentType' => 'direct',
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
                'flourName' => 'Caputo Nuvola Tipo 0 (W 270)',
                'instructions' => [
                    'Začněte autolýzou: smíchejte celou mouku s 60 % vody a nechte 30 minut stát.',
                    'Přidejte droždí a zbývající vodu postupně (bassinage) během hnětení.',
                    'Na závěr přidejte sůl a olivový olej pro lepší elasticitu.',
                    'Proveďte 3 série překladů (stretch & fold) po 20 minutách.',
                    'Uložte do chladu (4°C) na 24 hodin.',
                    'Navažte 280g bochánky a nechte 5 hodin v pokojové teplotě.',
                    'Při roztahování vytlačujte vzduch jemně ze středu do okrajů, nikdy nemačkejte rantl!',
                ],
            ],
            [
                'name' => 'Římská pizza na plech (Pizza in Teglia)',
                'pizzaStyle' => 'roman_crispy',
                'prefermentType' => 'direct',
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
                    'Použijte silnou mouku Manitoba schopnou absorbovat 78–80 % vody.',
                    'Hněťte pomalu, vodu přidávejte po částech.',
                    'Olej a sůl přidejte až po vyvinutí silné lepkové sítě.',
                    'Laminujte těsto na pomoučeném stole a uložte na 48 hodin do lednice.',
                    'V den pečení vyndejte, rozprostřete do naolejovaného plechu a nechte 3 hodiny kynout.',
                    'Pečte na spodním roštu trouby na 250°C cca 10 minut, poté dopečte na středu.',
                ],
            ],
            [
                'name' => '100% Biga Neapolská Pizza',
                'pizzaStyle' => 'biga',
                'prefermentType' => 'biga',
                'doughBallsCount' => 6,
                'ballWeightGrams' => 260,
                'hydrationPercentage' => 68.0,
                'saltPercentage' => 2.7,
                'yeastPercentage' => 0.10,
                'yeastType' => 'fresh',
                'oilPercentage' => 0.0,
                'sugarPercentage' => 0.5,
                'fermentationRtHours' => 8.0,
                'fermentationCtHours' => 24.0,
                'description' => 'Těsto s pevným italským prefermentem (Biga 44–45% hydratace). Výsledkem je neuvěřitelná vůně, lehkost a dokonalé natrávení.',
                'flourName' => 'Caputo Cuoco + Manitoba (W 340)',
                'instructions' => [
                    'Den 1: Připravte Bigu ze 100 % mouky, 45 % vody a 1 % droždí. Těsto pouze spojte, nehněťte dohladka.',
                    'Nechte Bigu fermentovat 16–18 hodin při 16–18°C.',
                    'Den 2: Nakrájejte Bigu do mísy, přidejte zbytek vody na 68 % celkové hydratace, slad a sůl.',
                    'Hněťte dohladka, dokud se těsto neuzavře.',
                    'Bochánky stočte a nechte dokynout 3–4 hodiny před pečením.',
                ],
            ],
            [
                'name' => 'Kvasová Pizza (Lievito Madre)',
                'pizzaStyle' => 'neapolitan',
                'prefermentType' => 'sourdough',
                'doughBallsCount' => 4,
                'ballWeightGrams' => 260,
                'hydrationPercentage' => 66.0,
                'saltPercentage' => 2.8,
                'yeastPercentage' => 15.0,
                'yeastType' => 'sourdough',
                'oilPercentage' => 0.0,
                'sugarPercentage' => 0.0,
                'fermentationRtHours' => 10.0,
                'fermentationCtHours' => 24.0,
                'description' => 'Pizza kynutá výhradně přírodním kvasem (Lievito Madre nebo pšeničný aktivní rozkvas). Výjimečná chuťová hloubka a stravitelnost.',
                'flourName' => 'Caputo Cuoco Tipo 00 (W 300)',
                'instructions' => [
                    'Použijte kvas na vrcholu aktivity (zdvojnásobený objem po nakrmení).',
                    'Kvas rozmíchejte ve vodě do mléčné pěny.',
                    'Přidejte mouku, po zapracování sůl.',
                    'Odpočinek 30 minut, následně série překladů.',
                    'Zrání v chladu 24 hodin, vytažení a dokynutí bochánků 5 hodin před pečením.',
                ],
            ],
        ];

        $count = 0;
        foreach ($presets as $p) {
            $existing = $repo->findOneBy(['name' => $p['name']]);
            if ($existing instanceof Recipe) {
                continue;
            }

            $recipe = new Recipe(
                name: $p['name'],
                pizzaStyle: $p['pizzaStyle'],
                prefermentType: $p['prefermentType'],
                doughBallsCount: $p['doughBallsCount'],
                ballWeightGrams: $p['ballWeightGrams'],
                hydrationPercentage: $p['hydrationPercentage'],
                saltPercentage: $p['saltPercentage'],
                yeastPercentage: $p['yeastPercentage'],
                yeastType: $p['yeastType'],
                oilPercentage: $p['oilPercentage'],
                sugarPercentage: $p['sugarPercentage'],
                fermentationRtHours: $p['fermentationRtHours'],
                fermentationCtHours: $p['fermentationCtHours'],
                description: $p['description'],
                flourName: $p['flourName'],
                instructions: $p['instructions'],
                isPreset: true
            );

            $this->entityManager->persist($recipe);
            $count++;
        }

        $this->entityManager->flush();
        $io->success(sprintf('Seeded %d recipe presets successfully.', $count));

        return Command::SUCCESS;
    }
}
