<?php

declare(strict_types=1);

namespace App\Http;

use Symfony\Component\HttpFoundation\Request;

/**
 * Resolves the content locale from the `?locale=` query parameter.
 *
 * Base content is stored in Czech, so only non-base locales are returned;
 * null means "serve base content".
 */
final class RequestLocale
{
    public const SUPPORTED = ['en'];

    public static function fromRequest(Request $request): ?string
    {
        $locale = strtolower($request->query->getString('locale', ''));

        return in_array($locale, self::SUPPORTED, true) ? $locale : null;
    }
}
