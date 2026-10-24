<?php

declare(strict_types=1);

namespace App\Seed;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Builds English translations of seeded (Czech) preset content from a
 * Czech => English phrase dictionary. Unknown phrases are kept as-is.
 */
final class SeedTranslator
{
    /** @var array<string, string>|null */
    private ?array $dictionary = null;

    public function __construct(
        #[Autowire('%kernel.project_dir%/resources/seed/translations.en.json')]
        private readonly string $dictionaryPath
    ) {}

    public function translate(string $text): string
    {
        return $this->dictionary()[$text] ?? $text;
    }

    /**
     * Translates the given content fields of a seed item. Strings, string lists
     * (instructions) and ingredient lists ({name, amount, stage}) are supported.
     *
     * @param array<string, mixed> $item
     * @param list<string> $fields
     * @return array<string, mixed>
     */
    public function translateItem(array $item, array $fields): array
    {
        $translated = [];
        foreach ($fields as $field) {
            if (!array_key_exists($field, $item) || $item[$field] === null) {
                continue;
            }
            $translated[$field] = $this->translateValue($item[$field]);
        }

        return $translated;
    }

    private function translateValue(mixed $value): mixed
    {
        if (is_string($value)) {
            return $this->translate($value);
        }
        if (is_array($value)) {
            return array_map(fn (mixed $v): mixed => $this->translateValue($v), $value);
        }

        return $value;
    }

    /**
     * @return array<string, string>
     */
    private function dictionary(): array
    {
        if ($this->dictionary === null) {
            $json = file_get_contents($this->dictionaryPath);
            /** @var array<string, string> $decoded */
            $decoded = $json !== false ? json_decode($json, true, 512, JSON_THROW_ON_ERROR) : [];
            $this->dictionary = $decoded;
        }

        return $this->dictionary;
    }
}
