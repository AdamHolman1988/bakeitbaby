<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class RecipeControllerTest extends WebTestCase
{
    public function testListRecipesReturnsSeededPresets(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/recipes');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');

        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('data', $data);
        self::assertArrayHasKey('total', $data);
        self::assertGreaterThanOrEqual(5, $data['total']);
    }

    public function testFilterRecipesByStyle(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/recipes?style=canotto');

        self::assertResponseIsSuccessful();
        $data = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        self::assertNotEmpty($data['data']);
        self::assertSame('canotto', $data['data'][0]['pizzaStyle']);
    }

    public function testCreateUpdateDeleteCustomRecipe(): void
    {
        $client = static::createClient();

        // 1. Create
        $client->request(
            'POST',
            '/api/recipes',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Custom Detroit Style Pizza',
                'pizzaStyle' => 'focaccia',
                'prefermentType' => 'direct',
                'doughBallsCount' => 2,
                'ballWeightGrams' => 450,
                'hydrationPercentage' => 70.0,
                'saltPercentage' => 2.5,
                'yeastPercentage' => 0.30,
                'yeastType' => 'instant_dry',
                'oilPercentage' => 2.0,
                'description' => 'Crispy buttery crust baked in blue steel pan',
                'instructions' => [
                    'Mix flour and water',
                    'Proof in Detroit pan for 4 hours',
                    'Bake with Wisconsin brick cheese',
                ],
            ], JSON_THROW_ON_ERROR)
        );

        self::assertResponseStatusCodeSame(201);
        $res = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $newId = $res['data']['id'];
        self::assertIsInt($newId);
        self::assertSame('Custom Detroit Style Pizza', $res['data']['name']);

        // 2. Update
        $client->request(
            'PUT',
            '/api/recipes/' . $newId,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Custom Detroit Style Pizza 2.0',
                'hydrationPercentage' => 72.0,
            ], JSON_THROW_ON_ERROR)
        );

        self::assertResponseIsSuccessful();
        $up = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Custom Detroit Style Pizza 2.0', $up['data']['name']);
        self::assertEquals(72.0, $up['data']['hydrationPercentage']);

        // 3. Delete
        $client->request('DELETE', '/api/recipes/' . $newId);
        self::assertResponseIsSuccessful();

        // 4. Verify 404
        $client->request('GET', '/api/recipes/' . $newId);
        self::assertResponseStatusCodeSame(404);
    }
}
