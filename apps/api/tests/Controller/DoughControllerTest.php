<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class DoughControllerTest extends WebTestCase
{
    public function testListDoughsReturnsSeededPresets(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/doughs');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');

        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('data', $data);
        self::assertArrayHasKey('total', $data);
        self::assertGreaterThanOrEqual(6, $data['total']);
    }

    public function testFilterDoughsByStyle(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/doughs?style=canotto');

        self::assertResponseIsSuccessful();
        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertNotEmpty($data['data']);
        self::assertSame('canotto', $data['data'][0]['pizzaStyle']);
    }

    public function testCreateUpdateDeleteCustomDough(): void
    {
        $client = static::createClient();

        // 1. Create
        $client->request(
            'POST',
            '/api/doughs',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Custom Detroit Dough',
                'pizzaStyle' => 'focaccia',
                'prefermentType' => 'direct',
                'doughBallsCount' => 2,
                'ballWeightGrams' => 450,
                'hydrationPercentage' => 70.0,
                'saltPercentage' => 2.5,
                'yeastPercentage' => 0.30,
                'yeastType' => 'instant_dry',
                'oilPercentage' => 2.0,
                'description' => 'Crispy buttery crust',
                'instructions' => [
                    'Mix flour and water',
                    'Proof in Detroit pan',
                ],
            ], JSON_THROW_ON_ERROR)
        );

        self::assertResponseStatusCodeSame(201);
        $res = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $newId = $res['data']['id'];
        self::assertIsInt($newId);
        self::assertSame('Custom Detroit Dough', $res['data']['name']);

        // 2. Update
        $client->request(
            'PUT',
            '/api/doughs/' . $newId,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Custom Detroit Dough 2.0',
                'hydrationPercentage' => 72.0,
            ], JSON_THROW_ON_ERROR)
        );

        self::assertResponseIsSuccessful();
        $up = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Custom Detroit Dough 2.0', $up['data']['name']);
        self::assertEquals(72.0, $up['data']['hydrationPercentage']);

        // 3. Delete
        $client->request('DELETE', '/api/doughs/' . $newId);
        self::assertResponseIsSuccessful();

        // 4. Verify 404
        $client->request('GET', '/api/doughs/' . $newId);
        self::assertResponseStatusCodeSame(404);
    }
}
