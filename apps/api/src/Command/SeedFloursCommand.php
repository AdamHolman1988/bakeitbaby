<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Flour;
use App\Seed\SeedTranslator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed:flours',
    description: 'Seeds reference and popular pizza flours into the database'
)]
final class SeedFloursCommand extends Command
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
        $repo = $this->entityManager->getRepository(Flour::class);

        $presets = [
            // Tier 1: W 160–200 (Weak / Slabá)
            [
                'name' => 'Babiččina volba Hladká pšeničná',
                'brand' => 'GoodMills Česko',
                'wIndex' => 180,
                'wRangeMax' => 200,
                'elasticityPL' => '0.50',
                'proteinPercentage' => 10.5,
                'flourType' => 'hladka_psenicna',
                'minHydration' => 50,
                'maxHydration' => 55,
                'recommendedFermentationHours' => '2–4 h (RT)',
                'usageNotes' => 'Sušenky, grissini, křehká a rychlá nekynutá nebo krátce kynutá těsta.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Caputo Classica Tipo 00',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 190,
                'wRangeMax' => 210,
                'elasticityPL' => '0.50–0.60',
                'proteinPercentage' => 11.5,
                'flourType' => 'tipo_00',
                'minHydration' => 50,
                'maxHydration' => 55,
                'recommendedFermentationHours' => '2–4 h (RT)',
                'usageNotes' => 'Tradiční lehká těsta, tenká křehká pizza, rychlá příprava.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],

            // Tier 2: W 220–260 (Medium / Střední)
            [
                'name' => 'Caputo Pizzeria Tipo 00',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 260,
                'wRangeMax' => 270,
                'elasticityPL' => '0.50–0.60',
                'proteinPercentage' => 12.5,
                'flourType' => 'tipo_00',
                'minHydration' => 55,
                'maxHydration' => 62,
                'recommendedFermentationHours' => '8–14 h (RT)',
                'usageNotes' => 'Světový etalon pro klasickou neapolskou pizzu na stejný den, přímé těsto, pečení v peci 450°C.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Babiččina volba Hladká na pizzu',
                'brand' => 'GoodMills Česko',
                'wIndex' => 240,
                'wRangeMax' => 250,
                'elasticityPL' => '0.55–0.65',
                'proteinPercentage' => 12.0,
                'flourType' => 'tipo_00',
                'minHydration' => 55,
                'maxHydration' => 60,
                'recommendedFermentationHours' => '8–12 h (RT)',
                'usageNotes' => 'Dostupná česká mouka s vyšším obsahem lepku, ideální na rychlou domácí pizzu na stejný den.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Le 5 Stagioni Pizza Napoletana',
                'brand' => 'Agugiaro & Figna',
                'wIndex' => 250,
                'wRangeMax' => 260,
                'elasticityPL' => '0.55–0.65',
                'proteinPercentage' => 12.0,
                'flourType' => 'tipo_00',
                'minHydration' => 55,
                'maxHydration' => 62,
                'recommendedFermentationHours' => '8–14 h (RT)',
                'usageNotes' => 'Certifikovaná mouka pro pravou neapolskou pizzu s vyváženou pružností a tažností.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],

            // Tier 3: W 270–310 (Strong / Silná)
            [
                'name' => 'Caputo Nuvola Tipo 0',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 270,
                'wRangeMax' => 290,
                'elasticityPL' => '0.50–0.60',
                'proteinPercentage' => 12.5,
                'flourType' => 'tipo_0',
                'minHydration' => 65,
                'maxHydration' => 72,
                'recommendedFermentationHours' => '18–36 h (chlad)',
                'usageNotes' => 'Vyvinuta speciálně pro moderní styl Pizza Canotto s extrémně vzdušnými a nadýchanými okraji.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Caputo Cuoco / Chef Tipo 00',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 300,
                'wRangeMax' => 320,
                'elasticityPL' => '0.50–0.60',
                'proteinPercentage' => 13.0,
                'flourType' => 'tipo_00',
                'minHydration' => 62,
                'maxHydration' => 70,
                'recommendedFermentationHours' => '24–48 h (chlad)',
                'usageNotes' => 'Silná mouka s elastickým lepkem pro dlouhé zrání v lednici, klasická neapolská pizza i focaccia.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Le 5 Stagioni Superiore',
                'brand' => 'Agugiaro & Figna',
                'wIndex' => 310,
                'wRangeMax' => 330,
                'elasticityPL' => '0.60',
                'proteinPercentage' => 13.0,
                'flourType' => 'tipo_00',
                'minHydration' => 62,
                'maxHydration' => 70,
                'recommendedFermentationHours' => '24–48 h (chlad)',
                'usageNotes' => 'Silná pšeničná mouka pro těsta s dlouhým odpočinkem a vyšší hydratací.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],

            // Tier 4: W 320–380+ (Very Strong / Manitoba & Super Cloud)
            [
                'name' => 'Caputo Nuvola Super (Super Cloud)',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 330,
                'wRangeMax' => 340,
                'elasticityPL' => '0.50–0.60',
                'proteinPercentage' => 13.5,
                'flourType' => 'tipo_0',
                'minHydration' => 70,
                'maxHydration' => 80,
                'recommendedFermentationHours' => '36–48 h (chlad)',
                'usageNotes' => 'Prémiová silná mouka pro Contemporary Canotto, Bigu a dlouhé zrání s masivními alveolami a lehkostí.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Perteghella Manitoba Tipo 0',
                'brand' => 'Molino Perteghella',
                'wIndex' => 360,
                'wRangeMax' => 380,
                'elasticityPL' => '0.65–0.75',
                'proteinPercentage' => 14.0,
                'flourType' => 'manitoba',
                'minHydration' => 70,
                'maxHydration' => 82,
                'recommendedFermentationHours' => '48–72 h (chlad)',
                'usageNotes' => 'Extrémní vaznost vody, vynikající do směsí pro posílení slabších mouk a prefermenty.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],
            [
                'name' => 'Caputo Manitoba Oro Tipo 0',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 380,
                'wRangeMax' => 400,
                'elasticityPL' => '0.70–0.80',
                'proteinPercentage' => 14.5,
                'flourType' => 'manitoba',
                'minHydration' => 70,
                'maxHydration' => 85,
                'recommendedFermentationHours' => '48–72 h (chlad)',
                'usageNotes' => 'Velmi silná mouka z prémiové severoamerické pšenice. Ideální základ pro Bigu, Poolish a hydrataci 75 %+.',
                'showInCalculator' => true,
                'isGlutenFree' => false,
            ],

            // Tier 5: Gluten-Free (Bezlepková)
            [
                'name' => 'Caputo Fioreglut (Gluten-Free)',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => null,
                'wRangeMax' => null,
                'elasticityPL' => 'N/A',
                'proteinPercentage' => 4.0,
                'flourType' => 'gluten_free',
                'minHydration' => 80,
                'maxHydration' => 85,
                'recommendedFermentationHours' => '3–6 h (RT) / 24 h (chlad)',
                'usageNotes' => 'Špičková bezlepková směs na bázi deglutinovaného pšeničného škrobu, rýžové mouky a psylliové vlákniny. Vytváří neuvěřitelně vláčnou a křupavou kůrku.',
                'showInCalculator' => true,
                'isGlutenFree' => true,
            ],
        ];

        $count = 0;
        foreach ($presets as $item) {
            $existing = $repo->findOneBy(['name' => $item['name']]);
            if ($existing instanceof Flour) {
                $existing->setBrand($item['brand']);
                $existing->setWIndex($item['wIndex']);
                $existing->setWRangeMax($item['wRangeMax']);
                $existing->setElasticityPL($item['elasticityPL']);
                $existing->setProteinPercentage((float) $item['proteinPercentage']);
                $existing->setFlourType($item['flourType']);
                $existing->setMinHydration($item['minHydration']);
                $existing->setMaxHydration($item['maxHydration']);
                $existing->setRecommendedFermentationHours($item['recommendedFermentationHours']);
                $existing->setUsageNotes($item['usageNotes']);
                $existing->setShowInCalculator($item['showInCalculator']);
                $existing->setIsGlutenFree($item['isGlutenFree']);
                $existing->setIsPreset(true);
                $existing->setTranslations(['en' => $this->translator->translateItem($item, Flour::translatableFields())]);
            } else {
                $flour = new Flour(
                    name: $item['name'],
                    wIndex: $item['wIndex'],
                    proteinPercentage: (float) $item['proteinPercentage'],
                    flourType: $item['flourType'],
                    minHydration: $item['minHydration'],
                    maxHydration: $item['maxHydration'],
                    recommendedFermentationHours: $item['recommendedFermentationHours'],
                    brand: $item['brand'],
                    usageNotes: $item['usageNotes'],
                    elasticityPL: $item['elasticityPL'],
                    showInCalculator: $item['showInCalculator'],
                    isGlutenFree: $item['isGlutenFree'],
                    isPreset: true
                );
                if ($item['wRangeMax'] !== null) {
                    $flour->setWRangeMax($item['wRangeMax']);
                }
                $flour->setTranslations(['en' => $this->translator->translateItem($item, Flour::translatableFields())]);
                $this->entityManager->persist($flour);
            }
            $count++;
        }

        $this->entityManager->flush();

        $io->success(sprintf('Seeded/Updated %d pizza flours with elasticity P/L and calculator visibility successfully.', $count));
        return Command::SUCCESS;
    }
}
