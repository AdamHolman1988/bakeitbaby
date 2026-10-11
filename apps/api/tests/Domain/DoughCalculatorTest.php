<?php

declare(strict_types=1);

namespace App\Tests\Domain;

use App\Domain\Calculator\DoughCalculator;
use PHPUnit\Framework\TestCase;

final class DoughCalculatorTest extends TestCase
{
    private DoughCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new DoughCalculator();
    }

    public function testCalculatesClassicNeapolitanBatch(): void
    {
        $result = $this->calculator->calculate([
            'pizzasCount' => 4,
            'ballWeightGrams' => 260,
            'hydrationPercentage' => 65.0,
            'yeastType' => 'fresh',
            'yeastPercentage' => 0.15,
            'saltPercentage' => 2.8,
            'flourWIndex' => 280,
            'hoursRoomTemp' => 8.0,
            'hoursColdTemp' => 16.0,
        ]);

        self::assertEqualsWithDelta(1040.0, $result['ingredients']['totalDoughGrams'], 1.0);
        self::assertSame(100.0, $result['percentages']['flour']);
        self::assertSame(65.0, $result['percentages']['water']);
        self::assertSame(2.8, $result['percentages']['salt']);
        self::assertSame('strong', $result['fermentation']['category']);
        self::assertTrue($result['fermentation']['isHydrationOk']);
    }

    public function testInstantDryYeastScaling(): void
    {
        $fresh = $this->calculator->calculate([
            'pizzasCount' => 4,
            'ballWeightGrams' => 250,
            'hydrationPercentage' => 60.0,
            'yeastType' => 'fresh',
            'yeastPercentage' => 0.30,
            'saltPercentage' => 2.5,
        ]);

        $instant = $this->calculator->calculate([
            'pizzasCount' => 4,
            'ballWeightGrams' => 250,
            'hydrationPercentage' => 60.0,
            'yeastType' => 'instant_dry',
            'yeastPercentage' => 0.30,
            'saltPercentage' => 2.5,
        ]);

        self::assertEqualsWithDelta(
            $fresh['ingredients']['yeastGrams'] * 0.33,
            $instant['ingredients']['yeastGrams'],
            0.1
        );
    }
}
