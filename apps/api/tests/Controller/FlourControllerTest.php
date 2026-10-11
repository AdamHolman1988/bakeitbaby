<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class FlourControllerTest extends WebTestCase
{
    public function testListFloursReturnsPreSeededFlours(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/flours');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');

        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('data', $data);
        self::assertArrayHasKey('total', $data);
        self::assertGreaterThanOrEqual(12, $data['total']);
    }

    public function testFilterFloursByStrengthCategory(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/flours?strength=manitoba');

        self::assertResponseIsSuccessful();
        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        foreach ($data['data'] as $flour) {
            self::assertGreaterThanOrEqual(320, $flour['wIndex']);
            self::assertSame('manitoba', $flour['strengthCategory']);
        }
    }

    public function testGlutenFreeFlourReturnedCorrectly(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/flours?strength=gluten_free');

        self::assertResponseIsSuccessful();
        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertNotEmpty($data['data']);
        self::assertSame('gluten_free', $data['data'][0]['strengthCategory']);
        self::assertTrue($data['data'][0]['isGlutenFree']);
    }

    public function testCreateAndUpdateCustomFlour(): void
    {
        $client = static::createClient();

        // 1. Create
        $client->request(
            'POST',
            '/api/flours',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Test Molino Artisan 00',
                'brand' => 'Artisan Mills',
                'wIndex' => 280,
                'elasticityPL' => '0.55',
                'proteinPercentage' => 12.8,
                'flourType' => 'tipo_00',
                'minHydration' => 60,
                'maxHydration' => 68,
                'recommendedFermentationHours' => '16–24 h',
                'usageNotes' => 'Super test flour',
                'showInCalculator' => true,
            ], JSON_THROW_ON_ERROR)
        );

        self::assertResponseStatusCodeSame(201);
        $createData = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $newId = $createData['data']['id'];
        self::assertIsInt($newId);
        self::assertSame('Test Molino Artisan 00', $createData['data']['name']);
        self::assertSame('0.55', $createData['data']['elasticityPL']);
        self::assertSame('strong', $createData['data']['strengthCategory']);

        // 2. Update
        $client->request(
            'PUT',
            '/api/flours/' . $newId,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Test Molino Artisan 00 Modified',
                'wIndex' => 290,
                'showInCalculator' => false,
            ], JSON_THROW_ON_ERROR)
        );

        self::assertResponseIsSuccessful();
        $updateData = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Test Molino Artisan 00 Modified', $updateData['data']['name']);
        self::assertSame(290, $updateData['data']['wIndex']);
        self::assertFalse($updateData['data']['showInCalculator']);

        // 3. Delete
        $client->request('DELETE', '/api/flours/' . $newId);
        self::assertResponseIsSuccessful();

        // 4. Verify 404
        $client->request('GET', '/api/flours/' . $newId);
        self::assertResponseStatusCodeSame(404);
    }
}
