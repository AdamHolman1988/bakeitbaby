<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'recipes')]
#[ORM\HasLifecycleCallbacks]
class Recipe
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

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $doughId = null;

    #[ORM\Column(type: Types::STRING, length: 160, nullable: true)]
    private ?string $doughName = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private int $prepTimeMinutes = 15;

    #[ORM\Column(type: Types::SMALLINT)]
    private int $bakeTemperature = 450;

    #[ORM\Column(type: Types::SMALLINT)]
    private int $bakeTimeSeconds = 90;

    /**
     * @var list<array{name: string, amount: string, stage: string}>
     */
    #[ORM\Column(type: Types::JSON)]
    private array $ingredients = [];

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
     * @param list<array{name: string, amount: string, stage: string}> $ingredients
     * @param list<string> $instructions
     */
    public function __construct(
        string $name,
        string $pizzaStyle = 'neapolitan',
        ?string $description = null,
        ?int $doughId = null,
        ?string $doughName = null,
        int $prepTimeMinutes = 15,
        int $bakeTemperature = 450,
        int $bakeTimeSeconds = 90,
        array $ingredients = [],
        array $instructions = [],
        bool $isPreset = false
    ) {
        $this->name = $name;
        $this->pizzaStyle = $pizzaStyle;
        $this->description = $description;
        $this->doughId = $doughId;
        $this->doughName = $doughName;
        $this->prepTimeMinutes = $prepTimeMinutes;
        $this->bakeTemperature = $bakeTemperature;
        $this->bakeTimeSeconds = $bakeTimeSeconds;
        $this->ingredients = $ingredients;
        $this->instructions = $instructions;
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

    public function getDoughId(): ?int
    {
        return $this->doughId;
    }

    public function setDoughId(?int $doughId): self
    {
        $this->doughId = $doughId;
        return $this;
    }

    public function getDoughName(): ?string
    {
        return $this->doughName;
    }

    public function setDoughName(?string $doughName): self
    {
        $this->doughName = $doughName;
        return $this;
    }

    public function getPrepTimeMinutes(): int
    {
        return $this->prepTimeMinutes;
    }

    public function setPrepTimeMinutes(int $prepTimeMinutes): self
    {
        $this->prepTimeMinutes = $prepTimeMinutes;
        return $this;
    }

    public function getBakeTemperature(): int
    {
        return $this->bakeTemperature;
    }

    public function setBakeTemperature(int $bakeTemperature): self
    {
        $this->bakeTemperature = $bakeTemperature;
        return $this;
    }

    public function getBakeTimeSeconds(): int
    {
        return $this->bakeTimeSeconds;
    }

    public function setBakeTimeSeconds(int $bakeTimeSeconds): self
    {
        $this->bakeTimeSeconds = $bakeTimeSeconds;
        return $this;
    }

    /**
     * @return list<array{name: string, amount: string, stage: string}>
     */
    public function getIngredients(): array
    {
        return $this->ingredients;
    }

    /**
     * @param list<array{name: string, amount: string, stage: string}> $ingredients
     */
    public function setIngredients(array $ingredients): self
    {
        $this->ingredients = $ingredients;
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
        return ['name', 'description', 'doughName', 'ingredients', 'instructions'];
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
            'doughId' => $this->doughId,
            'doughName' => $this->doughName,
            'prepTimeMinutes' => $this->prepTimeMinutes,
            'bakeTemperature' => $this->bakeTemperature,
            'bakeTimeSeconds' => $this->bakeTimeSeconds,
            'ingredients' => $this->ingredients,
            'instructions' => $this->instructions,
            'isPreset' => $this->isPreset,
            'createdAt' => $this->createdAt->format(\DateTimeInterface::ATOM),
            'updatedAt' => $this->updatedAt->format(\DateTimeInterface::ATOM),
        ], $locale);
    }
}
