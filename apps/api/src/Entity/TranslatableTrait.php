<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Per-locale overrides of an entity's content fields.
 *
 * The entity's own columns hold the base (Czech) content; `translations` stores
 * e.g. ['en' => ['name' => '...', 'instructions' => [...]]]. Fields missing from a
 * translation fall back to the base value.
 */
trait TranslatableTrait
{
    /**
     * @var array<string, array<string, mixed>>
     */
    #[ORM\Column(type: Types::JSON, options: ['default' => '{}'])]
    private array $translations = [];

    /**
     * Content fields that may be overridden per locale.
     *
     * @return list<string>
     */
    abstract public static function translatableFields(): array;

    /**
     * @return array<string, array<string, mixed>>
     */
    public function getTranslations(): array
    {
        return $this->translations;
    }

    /**
     * @param array<string, array<string, mixed>> $translations
     */
    public function setTranslations(array $translations): self
    {
        $this->translations = $translations;
        return $this;
    }

    public function hasTranslation(string $locale): bool
    {
        return isset($this->translations[$locale]);
    }

    /**
     * Merges the given fields into a locale's translation; non-translatable keys are ignored.
     *
     * @param array<string, mixed> $fields
     */
    public function mergeTranslation(string $locale, array $fields): self
    {
        $allowed = array_intersect_key($fields, array_flip(static::translatableFields()));
        $this->translations[$locale] = array_merge($this->translations[$locale] ?? [], $allowed);
        return $this;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    private function localize(array $data, ?string $locale): array
    {
        if ($locale === null || !isset($this->translations[$locale])) {
            return $data;
        }

        foreach (static::translatableFields() as $field) {
            if (array_key_exists($field, $this->translations[$locale])) {
                $data[$field] = $this->translations[$locale][$field];
            }
        }

        return $data;
    }

    /**
     * Case-insensitive match against the base and the localized content fields.
     *
     * @param list<string> $fields
     */
    public function matchesSearch(string $needle, ?string $locale, array $fields): bool
    {
        $needle = mb_strtolower(trim($needle));
        if ($needle === '') {
            return true;
        }

        foreach ([$this->toArray(), $this->toArray($locale)] as $data) {
            foreach ($fields as $field) {
                $value = $data[$field] ?? null;
                if (is_string($value) && str_contains(mb_strtolower($value), $needle)) {
                    return true;
                }
            }
        }

        return false;
    }
}
