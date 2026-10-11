<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class HealthControllerTest extends WebTestCase
{
    public function testHealthEndpointReturnsOkAndDatabaseConnected(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/health');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');

        $content = (string) $client->getResponse()->getContent();
        /** @var array{status: string, app: string, database: string} $data */
        $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

        self::assertSame('ok', $data['status']);
        self::assertSame('bakeitbaby-api', $data['app']);
        self::assertSame('connected', $data['database']);
    }
}
