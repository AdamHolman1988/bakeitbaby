<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class LocalizedContentTest extends WebTestCase
{
    public function testRecipesAreServedInEnglishWhenRequested(): void
    {
        $client = static::createClient();

        $names = array_column($this->getData($client, '/api/recipes?locale=en'), 'name');
        self::assertContains('Gluten-Free Pizza Margherita (Caputo Fioreglut)', $names);

        $baseNames = array_column($this->getData($client, '/api/recipes'), 'name');
        self::assertContains('Bezlepková Pizza Margherita (Caputo Fioreglut)', $baseNames);
    }

    public function testRecipeIngredientsAndStagesAreTranslated(): void
    {
        $client = static::createClient();

        $recipes = $this->getData($client, '/api/recipes?locale=en&search=Margherita Verace');
        self::assertCount(1, $recipes);
        self::assertContains('Fresh basil', array_column($recipes[0]['ingredients'], 'name'));
        self::assertContains('after baking', array_column($recipes[0]['ingredients'], 'stage'));
    }

    public function testSearchMatchesTranslatedAndBaseContent(): void
    {
        $client = static::createClient();

        $english = array_column($this->getData($client, '/api/doughs?locale=en&search=gluten-free dough'), 'name');
        self::assertSame(['Gluten-Free Dough'], $english);

        $czech = array_column($this->getData($client, '/api/doughs?locale=en&search=bezlepkové'), 'name');
        self::assertSame(['Gluten-Free Dough'], $czech);
    }

    public function testFlourContentIsTranslatedAndUnknownLocaleFallsBackToBase(): void
    {
        $client = static::createClient();

        $flours = $this->getData($client, '/api/flours?locale=en&search=Nuvola Super');
        self::assertSame('Mulino Caputo (Naples)', $flours[0]['brand']);
        self::assertSame('36–48 h (cold)', $flours[0]['recommendedFermentationHours']);

        $fallback = $this->getData($client, '/api/flours?locale=de&search=Nuvola Super');
        self::assertSame('Mulino Caputo (Neapol)', $fallback[0]['brand']);
    }

    public function testUpdatingInEnglishOnlyChangesTheTranslation(): void
    {
        $client = static::createClient();

        $dough = $this->getData($client, '/api/doughs?locale=en&search=Gluten-Free Dough')[0];
        $id = $dough['id'];

        $this->putJson($client, "/api/doughs/{$id}?locale=en", ['name' => 'Renamed Gluten-Free Dough', 'hydrationPercentage' => 83]);
        self::assertResponseIsSuccessful();

        $this->getJson($client, "/api/doughs/{$id}?locale=en");
        $english = $this->decode($client)['data'];
        self::assertSame('Renamed Gluten-Free Dough', $english['name']);
        self::assertEquals(83, $english['hydrationPercentage']);

        $this->getJson($client, "/api/doughs/{$id}");
        $base = $this->decode($client)['data'];
        self::assertSame('Bezlepkové těsto (Gluten-Free)', $base['name']);
        self::assertEquals(83, $base['hydrationPercentage']);

        // Restore seeded values.
        $this->putJson($client, "/api/doughs/{$id}?locale=en", ['name' => 'Gluten-Free Dough', 'hydrationPercentage' => 82]);
        self::assertResponseIsSuccessful();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function getData(KernelBrowser $client, string $uri): array
    {
        $this->getJson($client, $uri);
        self::assertResponseIsSuccessful();

        /** @var list<array<string, mixed>> */
        return $this->decode($client)['data'];
    }

    private function getJson(KernelBrowser $client, string $uri): void
    {
        $client->request('GET', $uri);
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function putJson(KernelBrowser $client, string $uri, array $payload): void
    {
        $client->request('PUT', $uri, [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($payload, JSON_THROW_ON_ERROR));
    }

    /**
     * @return array<string, mixed>
     */
    private function decode(KernelBrowser $client): array
    {
        /** @var array<string, mixed> */
        return json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
    }
}
