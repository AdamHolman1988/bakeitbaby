<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Flour;
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
        private readonly EntityManagerInterface $entityManager
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
                'proteinPercentage' => 10.5,
                'flourType' => 'hladka_psenicna',
                'minHydration' => 50,
                'maxHydration' => 55,
                'recommendedFermentationHours' => '2–4 h (RT)',
                'usageNotes' => 'Sušenky, grissini, křehká a rychlá nekynutá nebo krátce kynutá těsta.',
            ],
            [
                'name' => 'Caputo Classica Tipo 00',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 190,
                'wRangeMax' => 210,
                'proteinPercentage' => 11.5,
                'flourType' => 'tipo_00',
                'minHydration' => 50,
                'maxHydration' => 55,
                'recommendedFermentationHours' => '2–4 h (RT)',
                'usageNotes' => 'Tradiční lehká těsta, tenká křehká pizza, rychlá příprava.',
            ],

            // Tier 2: W 220–260 (Medium / Střední)
            [
                'name' => 'Caputo Pizzeria Tipo 00',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 260,
                'wRangeMax' => 270,
                'proteinPercentage' => 12.5,
                'flourType' => 'tipo_00',
                'minHydration' => 55,
                'maxHydration' => 62,
                'recommendedFermentationHours' => '8–14 h (RT)',
                'usageNotes' => 'Světový etalon pro klasickou neapolskou pizzu na stejný den, přímé těsto, pečení v peci 450°C.',
            ],
            [
                'name' => 'Babiččina volba Hladká na pizzu',
                'brand' => 'GoodMills Česko',
                'wIndex' => 240,
                'wRangeMax' => 250,
                'proteinPercentage' => 12.0,
                'flourType' => 'tipo_00',
                'minHydration' => 55,
                'maxHydration' => 60,
                'recommendedFermentationHours' => '8–12 h (RT)',
                'usageNotes' => 'Dostupná česká mouka s vyšším obsahem lepku, ideální na rychlou domácí pizzu na stejný den.',
            ],
            [
                'name' => 'Le 5 Stagioni Pizza Napoletana',
                'brand' => 'Agugiaro & Figna',
                'wIndex' => 250,
                'wRangeMax' => 260,
                'proteinPercentage' => 12.0,
                'flourType' => 'tipo_00',
                'minHydration' => 55,
                'maxHydration' => 62,
                'recommendedFermentationHours' => '8–14 h (RT)',
                'usageNotes' => 'Certifikovaná mouka pro pravou neapolskou pizzu s vyváženou pružností a tažností.',
            ],

            // Tier 3: W 270–310 (Strong / Silná)
            [
                'name' => 'Caputo Cuoco / Chef Tipo 00',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 300,
                'wRangeMax' => 320,
                'proteinPercentage' => 13.0,
                'flourType' => 'tipo_00',
                'minHydration' => 62,
                'maxHydration' => 70,
                'recommendedFermentationHours' => '24–48 h (chlad)',
                'usageNotes' => 'Silná mouka s elastickým lepkem pro dlouhé zrání v lednici, klasická neapolská pizza i focaccia.',
            ],
            [
                'name' => 'Caputo Nuvola Tipo 0',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 270,
                'wRangeMax' => 290,
                'proteinPercentage' => 12.5,
                'flourType' => 'tipo_0',
                'minHydration' => 65,
                'maxHydration' => 72,
                'recommendedFermentationHours' => '18–36 h (chlad)',
                'usageNotes' => 'Vyvinuta speciálně pro moderní styl Pizza Canotto s extrémně vzdušnými a nadýchanými okraji.',
            ],
            [
                'name' => 'Le 5 Stagioni Superiore',
                'brand' => 'Agugiaro & Figna',
                'wIndex' => 310,
                'wRangeMax' => 330,
                'proteinPercentage' => 13.0,
                'flourType' => 'tipo_00',
                'minHydration' => 62,
                'maxHydration' => 70,
                'recommendedFermentationHours' => '24–48 h (chlad)',
                'usageNotes' => 'Silná pšeničná mouka pro těsta s dlouhým odpočinkem a vysokou hydratací.',
            ],

            // Tier 4: W 320–380+ (Very Strong / Manitoba)
            [
                'name' => 'Caputo Manitoba Oro Tipo 0',
                'brand' => 'Mulino Caputo (Neapol)',
                'wIndex' => 380,
                'wRangeMax' => 400,
                'proteinPercentage' => 14.5,
                'flourType' => 'manitoba',
                'minHydration' => 70,
                'maxHydration' => 85,
                'recommendedFermentationHours' => '48–72 h (chlad)',
                'usageNotes' => 'Velmi silná mouka z prémiové severoamerické pšenice. Ideální základ pro Bigu, Poolish a hydrataci 75 %+.',
            ],
            [
                'name' => 'Perteghella Manitoba Tipo 0',
                'brand' => 'Molino Perteghella',
                'wIndex' => 360,
                'wRangeMax' => 380,
                'proteinPercentage' => 14.0,
                'flourType' => 'manitoba',
                'minHydration' => 70,
                'maxHydration' => 82,
                'recommendedFermentationHours' => '48–72 h (chlad)',
                'usageNotes' => 'Extrémní vaznost vody, vynikající do směsí pro posílení slabších mouk a prefermenty.',
            ],
        ];

        $count = 0;
        foreach ($presets as $p) {
            $existing = $repo->findOneBy(['name' => $p['name']]);
            if ($existing instanceof Flour) {
                continue;
            }

            $flour = new Flour(
                name: $p['name'],
                wIndex: $p['wIndex'],
                proteinPercentage: $p['proteinPercentage'],
                flourType: $p['flourType'],
                minHydration: $p['minHydration'],
                maxHydration: $p['maxHydration'],
                recommendedFermentationHours: $p['recommendedFermentationHours'],
                brand: $p['brand'],
                usageNotes: $p['usageNotes'],
                isPreset: true
            );
            $flour->setWRangeMax($p['wRangeMax']);

            $this->entityManager->persist($flour);
            $count++;
        }

        $this->entityManager->flush();
        $io->success(sprintf('Seeded %d flour presets successfully.', $count));

        return Command::SUCCESS;
    }
}
