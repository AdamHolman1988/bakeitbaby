<?php

declare(strict_types=1);

namespace App\Domain\Calculator;

final class DoughCalculator
{
    public const YEAST_RATIO_FRESH = 1.0;
    public const YEAST_RATIO_INSTANT_DRY = 0.33;
    public const YEAST_RATIO_ACTIVE_DRY = 0.5;
    public const YEAST_RATIO_SOURDOUGH = 15.0;

    /**
     * @param array{
     *     pizzasCount: int,
     *     ballWeightGrams: int,
     *     hydrationPercentage: float,
     *     yeastType: string,
     *     yeastPercentage?: float,
     *     saltPercentage: float,
     *     oilPercentage?: float,
     *     sugarPercentage?: float,
     *     hoursRoomTemp?: float,
     *     hoursColdTemp?: float,
     *     flourWIndex?: int
     * } $input
     * @return array{
     *     ingredients: array{
     *         flourGrams: float,
     *         waterGrams: float,
     *         yeastGrams: float,
     *         saltGrams: float,
     *         oilGrams: float,
     *         sugarGrams: float,
     *         totalDoughGrams: float
     *     },
     *     percentages: array{
     *         flour: float,
     *         water: float,
     *         yeast: float,
     *         salt: float,
     *         oil: float,
     *         sugar: float
     *     },
     *     fermentation: array{
     *         category: string,
     *         idealHydrationMin: int,
     *         idealHydrationMax: int,
     *         isHydrationOk: bool,
     *         warnings: string[]
     *     }
     * }
     */
    public function calculate(array $input): array
    {
        $count = max(1, $input['pizzasCount']);
        $ballWeight = max(50, $input['ballWeightGrams']);
        $totalTarget = $count * $ballWeight;

        $hydration = max(40.0, min(100.0, $input['hydrationPercentage']));
        $salt = max(0.0, min(10.0, $input['saltPercentage']));
        $oil = max(0.0, min(20.0, $input['oilPercentage'] ?? 0.0));
        $sugar = max(0.0, min(20.0, $input['sugarPercentage'] ?? 0.0));

        $hoursTotal = ($input['hoursRoomTemp'] ?? 8.0) + ($input['hoursColdTemp'] ?? 0.0);

        $baseFreshYeastPct = $input['yeastPercentage'] ?? null;
        if ($baseFreshYeastPct === null || $baseFreshYeastPct <= 0) {
            $baseFreshYeastPct = match (true) {
                $hoursTotal <= 4.0 => 0.50,
                $hoursTotal <= 12.0 => 0.25,
                $hoursTotal <= 24.0 => 0.15,
                default => 0.10,
            };
        }

        $yeastRatio = match ($input['yeastType']) {
            'instant_dry' => self::YEAST_RATIO_INSTANT_DRY,
            'active_dry' => self::YEAST_RATIO_ACTIVE_DRY,
            'sourdough' => self::YEAST_RATIO_SOURDOUGH,
            default => self::YEAST_RATIO_FRESH,
        };

        $actualYeastPct = $input['yeastType'] === 'sourdough'
            ? self::YEAST_RATIO_SOURDOUGH
            : $baseFreshYeastPct * $yeastRatio;

        $totalPercentage = 100.0 + $hydration + $salt + $actualYeastPct + $oil + $sugar;

        $flourGrams = round(($totalTarget / ($totalPercentage / 100.0)), 1);
        $waterGrams = round(($flourGrams * ($hydration / 100.0)), 1);
        $yeastGrams = round(($flourGrams * ($actualYeastPct / 100.0)), 2);
        $saltGrams = round(($flourGrams * ($salt / 100.0)), 1);
        $oilGrams = round(($flourGrams * ($oil / 100.0)), 1);
        $sugarGrams = round(($flourGrams * ($sugar / 100.0)), 1);

        $totalDough = round($flourGrams + $waterGrams + $yeastGrams + $saltGrams + $oilGrams + $sugarGrams, 1);

        $w = $input['flourWIndex'] ?? 260;
        [$category, $idealHydrMin, $idealHydrMax] = match (true) {
            $w < 220 => ['weak', 50, 55],
            $w <= 260 => ['medium', 55, 62],
            $w <= 310 => ['strong', 60, 70],
            default => ['manitoba', 70, 85],
        };

        $warnings = [];
        $isHydrationOk = ($hydration >= $idealHydrMin - 2) && ($hydration <= $idealHydrMax + 3);
        if ($hydration > $idealHydrMax + 3) {
            $warnings[] = sprintf('Hydratace %.1f%% překračuje maximum pro W %d (%d%%).', $hydration, $w, $idealHydrMax);
        } elseif ($hydration < $idealHydrMin - 2) {
            $warnings[] = sprintf('Hydratace %.1f%% je pod minimem pro W %d (%d%%).', $hydration, $w, $idealHydrMin);
        }

        return [
            'ingredients' => [
                'flourGrams' => $flourGrams,
                'waterGrams' => $waterGrams,
                'yeastGrams' => $yeastGrams,
                'saltGrams' => $saltGrams,
                'oilGrams' => $oilGrams,
                'sugarGrams' => $sugarGrams,
                'totalDoughGrams' => $totalDough,
            ],
            'percentages' => [
                'flour' => 100.0,
                'water' => $hydration,
                'yeast' => round($actualYeastPct, 2),
                'salt' => $salt,
                'oil' => $oil,
                'sugar' => $sugar,
            ],
            'fermentation' => [
                'category' => $category,
                'idealHydrationMin' => $idealHydrMin,
                'idealHydrationMax' => $idealHydrMax,
                'isHydrationOk' => $isHydrationOk,
                'warnings' => $warnings,
            ],
        ];
    }
}
