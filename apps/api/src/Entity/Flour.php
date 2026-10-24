<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'flours')]
#[ORM\HasLifecycleCallbacks]
class Flour
{
    use TranslatableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 128)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 128)]
    private string $name;

    #[ORM\Column(type: Types::STRING, length: 128, nullable: true)]
    #[Assert\Length(max: 128)]
    private ?string $brand = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Assert\Range(min: 0, max: 500)]
    private ?int $wIndex = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Assert\Range(min: 0, max: 500)]
    private ?int $wRangeMax = null;

    #[ORM\Column(type: Types::STRING, length: 32, nullable: true)]
    #[Assert\Length(max: 32)]
    private ?string $elasticityPL = null;

    #[ORM\Column(type: Types::FLOAT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 1.0, max: 25.0)]
    private float $proteinPercentage;

    #[ORM\Column(type: Types::STRING, length: 64)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 64)]
    private string $flourType = 'tipo_00';

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 40, max: 100)]
    private int $minHydration = 55;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 40, max: 100)]
    private int $maxHydration = 65;

    #[ORM\Column(type: Types::STRING, length: 128)]
    #[Assert\NotBlank]
    private string $recommendedFermentationHours;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $usageNotes = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $showInCalculator = true;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isGlutenFree = false;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isPreset = false;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $updatedAt;

    public function __construct(
        string $name,
        ?int $wIndex,
        float $proteinPercentage,
        string $flourType = 'tipo_00',
        int $minHydration = 55,
        int $maxHydration = 65,
        string $recommendedFermentationHours = '8–14 h (RT)',
        ?string $brand = null,
        ?string $usageNotes = null,
        ?string $elasticityPL = null,
        bool $showInCalculator = true,
        bool $isGlutenFree = false,
        bool $isPreset = false
    ) {
        $this->name = $name;
        $this->wIndex = $wIndex;
        $this->proteinPercentage = $proteinPercentage;
        $this->flourType = $flourType;
        $this->minHydration = $minHydration;
        $this->maxHydration = $maxHydration;
        $this->recommendedFermentationHours = $recommendedFermentationHours;
        $this->brand = $brand;
        $this->usageNotes = $usageNotes;
        $this->elasticityPL = $elasticityPL;
        $this->showInCalculator = $showInCalculator;
        $this->isGlutenFree = $isGlutenFree;
        $this->isPreset = $isPreset;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(?string $brand): self
    {
        $this->brand = $brand;
        return $this;
    }

    public function getWIndex(): ?int
    {
        return $this->wIndex;
    }

    public function setWIndex(?int $wIndex): self
    {
        $this->wIndex = $wIndex;
        return $this;
    }

    public function getWRangeMax(): ?int
    {
        return $this->wRangeMax;
    }

    public function setWRangeMax(?int $wRangeMax): self
    {
        $this->wRangeMax = $wRangeMax;
        return $this;
    }

    public function getElasticityPL(): ?string
    {
        return $this->elasticityPL;
    }

    public function setElasticityPL(?string $elasticityPL): self
    {
        $this->elasticityPL = $elasticityPL;
        return $this;
    }

    public function getProteinPercentage(): float
    {
        return $this->proteinPercentage;
    }

    public function setProteinPercentage(float $proteinPercentage): self
    {
        $this->proteinPercentage = $proteinPercentage;
        return $this;
    }

    public function getFlourType(): string
    {
        return $this->flourType;
    }

    public function setFlourType(string $flourType): self
    {
        $this->flourType = $flourType;
        return $this;
    }

    public function getMinHydration(): int
    {
        return $this->minHydration;
    }

    public function setMinHydration(int $minHydration): self
    {
        $this->minHydration = $minHydration;
        return $this;
    }

    public function getMaxHydration(): int
    {
        return $this->maxHydration;
    }

    public function setMaxHydration(int $maxHydration): self
    {
        $this->maxHydration = $maxHydration;
        return $this;
    }

    public function getRecommendedFermentationHours(): string
    {
        return $this->recommendedFermentationHours;
    }

    public function setRecommendedFermentationHours(string $recommendedFermentationHours): self
    {
        $this->recommendedFermentationHours = $recommendedFermentationHours;
        return $this;
    }

    public function getUsageNotes(): ?string
    {
        return $this->usageNotes;
    }

    public function setUsageNotes(?string $usageNotes): self
    {
        $this->usageNotes = $usageNotes;
        return $this;
    }

    public function isShowInCalculator(): bool
    {
        return $this->showInCalculator;
    }

    public function setShowInCalculator(bool $showInCalculator): self
    {
        $this->showInCalculator = $showInCalculator;
        return $this;
    }

    public function isGlutenFree(): bool
    {
        return $this->isGlutenFree;
    }

    public function setIsGlutenFree(bool $isGlutenFree): self
    {
        $this->isGlutenFree = $isGlutenFree;
        return $this;
    }

    public function isPreset(): bool
    {
        return $this->isPreset;
    }

    public function setIsPreset(bool $isPreset): self
    {
        $this->isPreset = $isPreset;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    /**
     * @return list<string>
     */
    public static function translatableFields(): array
    {
        return ['name', 'brand', 'recommendedFermentationHours', 'usageNotes'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(?string $locale = null): array
    {
        return $this->localize([
            'id' => $this->id,
            'name' => $this->name,
            'brand' => $this->brand,
            'wIndex' => $this->wIndex,
            'wRangeMax' => $this->wRangeMax,
            'elasticityPL' => $this->elasticityPL,
            'proteinPercentage' => $this->proteinPercentage,
            'flourType' => $this->flourType,
            'minHydration' => $this->minHydration,
            'maxHydration' => $this->maxHydration,
            'recommendedFermentationHours' => $this->recommendedFermentationHours,
            'usageNotes' => $this->usageNotes,
            'showInCalculator' => $this->showInCalculator,
            'isGlutenFree' => $this->isGlutenFree,
            'isPreset' => $this->isPreset,
            'strengthCategory' => $this->getStrengthCategory(),
            'createdAt' => $this->createdAt->format(\DateTimeInterface::ATOM),
            'updatedAt' => $this->updatedAt->format(\DateTimeInterface::ATOM),
        ], $locale);
    }

    public function getStrengthCategory(): string
    {
        if ($this->isGlutenFree || $this->wIndex === null) {
            return 'gluten_free';
        }
        if ($this->wIndex < 220) {
            return 'weak';
        }
        if ($this->wIndex <= 260) {
            return 'medium';
        }
        if ($this->wIndex <= 310) {
            return 'strong';
        }
        return 'manitoba';
    }
}
