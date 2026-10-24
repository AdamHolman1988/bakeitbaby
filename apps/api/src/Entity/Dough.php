<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'doughs')]
#[ORM\HasLifecycleCallbacks]
class Dough
{
    use TranslatableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 160)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 160)]
    private string $name;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::STRING, length: 64)]
    #[Assert\NotBlank]
    private string $pizzaStyle = 'neapolitan';

    #[ORM\Column(type: Types::STRING, length: 32)]
    #[Assert\NotBlank]
    private string $prefermentType = 'direct';

    #[ORM\Column(type: Types::FLOAT)]
    private float $prefermentPercentage = 0.0;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 1, max: 100)]
    private int $doughBallsCount = 4;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 50, max: 1000)]
    private int $ballWeightGrams = 260;

    #[ORM\Column(type: Types::FLOAT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 40.0, max: 100.0)]
    private float $hydrationPercentage = 65.0;

    #[ORM\Column(type: Types::FLOAT)]
    #[Assert\NotNull]
    #[Assert\Range(min: 0.0, max: 10.0)]
    private float $saltPercentage = 2.8;

    #[ORM\Column(type: Types::FLOAT)]
    #[Assert\NotNull]
    private float $yeastPercentage = 0.15;

    #[ORM\Column(type: Types::STRING, length: 32)]
    #[Assert\NotBlank]
    private string $yeastType = 'fresh';

    #[ORM\Column(type: Types::FLOAT)]
    private float $oilPercentage = 0.0;

    #[ORM\Column(type: Types::FLOAT)]
    private float $sugarPercentage = 0.0;

    #[ORM\Column(type: Types::FLOAT)]
    private float $fermentationRtHours = 8.0;

    #[ORM\Column(type: Types::FLOAT)]
    private float $fermentationCtHours = 16.0;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $flourId = null;

    #[ORM\Column(type: Types::STRING, length: 128, nullable: true)]
    private ?string $flourName = null;

    /**
     * @var list<string>
     */
    #[ORM\Column(type: Types::JSON)]
    private array $instructions = [];

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isPreset = false;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $updatedAt;

    /**
     * @param list<string> $instructions
     */
    public function __construct(
        string $name,
        string $pizzaStyle = 'neapolitan',
        string $prefermentType = 'direct',
        int $doughBallsCount = 4,
        int $ballWeightGrams = 260,
        float $hydrationPercentage = 65.0,
        float $saltPercentage = 2.8,
        float $yeastPercentage = 0.15,
        string $yeastType = 'fresh',
        float $oilPercentage = 0.0,
        float $sugarPercentage = 0.0,
        float $fermentationRtHours = 8.0,
        float $fermentationCtHours = 16.0,
        ?string $description = null,
        ?int $flourId = null,
        ?string $flourName = null,
        array $instructions = [],
        float $prefermentPercentage = 0.0,
        bool $isPreset = false
    ) {
        $this->name = $name;
        $this->pizzaStyle = $pizzaStyle;
        $this->prefermentType = $prefermentType;
        $this->doughBallsCount = $doughBallsCount;
        $this->ballWeightGrams = $ballWeightGrams;
        $this->hydrationPercentage = $hydrationPercentage;
        $this->saltPercentage = $saltPercentage;
        $this->yeastPercentage = $yeastPercentage;
        $this->yeastType = $yeastType;
        $this->oilPercentage = $oilPercentage;
        $this->sugarPercentage = $sugarPercentage;
        $this->fermentationRtHours = $fermentationRtHours;
        $this->fermentationCtHours = $fermentationCtHours;
        $this->description = $description;
        $this->flourId = $flourId;
        $this->flourName = $flourName;
        $this->instructions = $instructions;
        $this->prefermentPercentage = $prefermentPercentage;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getPizzaStyle(): string
    {
        return $this->pizzaStyle;
    }

    public function setPizzaStyle(string $pizzaStyle): self
    {
        $this->pizzaStyle = $pizzaStyle;
        return $this;
    }

    public function getPrefermentType(): string
    {
        return $this->prefermentType;
    }

    public function setPrefermentType(string $prefermentType): self
    {
        $this->prefermentType = $prefermentType;
        return $this;
    }

    public function getPrefermentPercentage(): float
    {
        return $this->prefermentPercentage;
    }

    public function setPrefermentPercentage(float $prefermentPercentage): self
    {
        $this->prefermentPercentage = $prefermentPercentage;
        return $this;
    }

    public function getDoughBallsCount(): int
    {
        return $this->doughBallsCount;
    }

    public function setDoughBallsCount(int $doughBallsCount): self
    {
        $this->doughBallsCount = $doughBallsCount;
        return $this;
    }

    public function getBallWeightGrams(): int
    {
        return $this->ballWeightGrams;
    }

    public function setBallWeightGrams(int $ballWeightGrams): self
    {
        $this->ballWeightGrams = $ballWeightGrams;
        return $this;
    }

    public function getHydrationPercentage(): float
    {
        return $this->hydrationPercentage;
    }

    public function setHydrationPercentage(float $hydrationPercentage): self
    {
        $this->hydrationPercentage = $hydrationPercentage;
        return $this;
    }

    public function getSaltPercentage(): float
    {
        return $this->saltPercentage;
    }

    public function setSaltPercentage(float $saltPercentage): self
    {
        $this->saltPercentage = $saltPercentage;
        return $this;
    }

    public function getYeastPercentage(): float
    {
        return $this->yeastPercentage;
    }

    public function setYeastPercentage(float $yeastPercentage): self
    {
        $this->yeastPercentage = $yeastPercentage;
        return $this;
    }

    public function getYeastType(): string
    {
        return $this->yeastType;
    }

    public function setYeastType(string $yeastType): self
    {
        $this->yeastType = $yeastType;
        return $this;
    }

    public function getOilPercentage(): float
    {
        return $this->oilPercentage;
    }

    public function setOilPercentage(float $oilPercentage): self
    {
        $this->oilPercentage = $oilPercentage;
        return $this;
    }

    public function getSugarPercentage(): float
    {
        return $this->sugarPercentage;
    }

    public function setSugarPercentage(float $sugarPercentage): self
    {
        $this->sugarPercentage = $sugarPercentage;
        return $this;
    }

    public function getFermentationRtHours(): float
    {
        return $this->fermentationRtHours;
    }

    public function setFermentationRtHours(float $fermentationRtHours): self
    {
        $this->fermentationRtHours = $fermentationRtHours;
        return $this;
    }

    public function getFermentationCtHours(): float
    {
        return $this->fermentationCtHours;
    }

    public function setFermentationCtHours(float $fermentationCtHours): self
    {
        $this->fermentationCtHours = $fermentationCtHours;
        return $this;
    }

    public function getFlourId(): ?int
    {
        return $this->flourId;
    }

    public function setFlourId(?int $flourId): self
    {
        $this->flourId = $flourId;
        return $this;
    }

    public function getFlourName(): ?string
    {
        return $this->flourName;
    }

    public function setFlourName(?string $flourName): self
    {
        $this->flourName = $flourName;
        return $this;
    }

    /**
     * @return list<string>
     */
    public function getInstructions(): array
    {
        return $this->instructions;
    }

    /**
     * @param list<string> $instructions
     */
    public function setInstructions(array $instructions): self
    {
        $this->instructions = $instructions;
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
        return ['name', 'description', 'flourName', 'instructions'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(?string $locale = null): array
    {
        return $this->localize([
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'pizzaStyle' => $this->pizzaStyle,
            'prefermentType' => $this->prefermentType,
            'prefermentPercentage' => $this->prefermentPercentage,
            'doughBallsCount' => $this->doughBallsCount,
            'ballWeightGrams' => $this->ballWeightGrams,
            'hydrationPercentage' => $this->hydrationPercentage,
            'saltPercentage' => $this->saltPercentage,
            'yeastPercentage' => $this->yeastPercentage,
            'yeastType' => $this->yeastType,
            'oilPercentage' => $this->oilPercentage,
            'sugarPercentage' => $this->sugarPercentage,
            'fermentationRtHours' => $this->fermentationRtHours,
            'fermentationCtHours' => $this->fermentationCtHours,
            'flourId' => $this->flourId,
            'flourName' => $this->flourName,
            'instructions' => $this->instructions,
            'isPreset' => $this->isPreset,
            'createdAt' => $this->createdAt->format(\DateTimeInterface::ATOM),
            'updatedAt' => $this->updatedAt->format(\DateTimeInterface::ATOM),
        ], $locale);
    }
}
