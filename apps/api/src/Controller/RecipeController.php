<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Recipe;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/recipes', name: 'api_recipes_')]
final class RecipeController extends AbstractController
{
    public function __construct(
        private readonly RecipeRepository $recipeRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $search = $request->query->getString('search', '');
        $style = $request->query->getString('style', 'all');

        $recipes = $this->recipeRepository->searchAndFilter(
            search: $search !== '' ? $search : null,
            style: $style !== '' ? $style : null
        );

        return new JsonResponse([
            'data' => array_map(static fn (Recipe $r) => $r->toArray(), $recipes),
            'total' => count($recipes),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $recipe = $this->recipeRepository->find($id);
        if (!$recipe instanceof Recipe) {
            return new JsonResponse(['error' => 'Recipe not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(['data' => $recipe->toArray()]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $payload */
        $payload = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $name = isset($payload['name']) ? (string) $payload['name'] : '';
        $pizzaStyle = isset($payload['pizzaStyle']) ? (string) $payload['pizzaStyle'] : 'neapolitan';
        $description = isset($payload['description']) ? (string) $payload['description'] : null;
        $doughId = isset($payload['doughId']) && is_numeric($payload['doughId']) ? (int) $payload['doughId'] : null;
        $doughName = isset($payload['doughName']) ? (string) $payload['doughName'] : null;
        $prepTimeMinutes = isset($payload['prepTimeMinutes']) ? (int) $payload['prepTimeMinutes'] : 15;
        $bakeTemperature = isset($payload['bakeTemperature']) ? (int) $payload['bakeTemperature'] : 450;
        $bakeTimeSeconds = isset($payload['bakeTimeSeconds']) ? (int) $payload['bakeTimeSeconds'] : 90;

        /** @var list<array{name: string, amount: string, stage: string}> $ingredients */
        $ingredients = isset($payload['ingredients']) && is_array($payload['ingredients'])
            ? array_values($payload['ingredients'])
            : [];

        /** @var list<string> $instructions */
        $instructions = isset($payload['instructions']) && is_array($payload['instructions'])
            ? array_values(array_map('strval', $payload['instructions']))
            : [];

        $recipe = new Recipe(
            name: $name,
            pizzaStyle: $pizzaStyle,
            description: $description,
            doughId: $doughId,
            doughName: $doughName,
            prepTimeMinutes: $prepTimeMinutes,
            bakeTemperature: $bakeTemperature,
            bakeTimeSeconds: $bakeTimeSeconds,
            ingredients: $ingredients,
            instructions: $instructions,
            isPreset: false
        );

        $errors = $this->validator->validate($recipe);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->persist($recipe);
        $this->entityManager->flush();

        return new JsonResponse(['data' => $recipe->toArray()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $recipe = $this->recipeRepository->find($id);
        if (!$recipe instanceof Recipe) {
            return new JsonResponse(['error' => 'Recipe not found'], Response::HTTP_NOT_FOUND);
        }

        /** @var array<string, mixed> $payload */
        $payload = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        if (isset($payload['name'])) $recipe->setName((string) $payload['name']);
        if (isset($payload['description'])) $recipe->setDescription((string) $payload['description']);
        if (isset($payload['pizzaStyle'])) $recipe->setPizzaStyle((string) $payload['pizzaStyle']);
        if (array_key_exists('doughId', $payload)) $recipe->setDoughId($payload['doughId'] !== null ? (int) $payload['doughId'] : null);
        if (array_key_exists('doughName', $payload)) $recipe->setDoughName($payload['doughName'] !== null ? (string) $payload['doughName'] : null);
        if (isset($payload['prepTimeMinutes'])) $recipe->setPrepTimeMinutes((int) $payload['prepTimeMinutes']);
        if (isset($payload['bakeTemperature'])) $recipe->setBakeTemperature((int) $payload['bakeTemperature']);
        if (isset($payload['bakeTimeSeconds'])) $recipe->setBakeTimeSeconds((int) $payload['bakeTimeSeconds']);
        if (isset($payload['ingredients']) && is_array($payload['ingredients'])) {
            $recipe->setIngredients(array_values($payload['ingredients']));
        }
        if (isset($payload['instructions']) && is_array($payload['instructions'])) {
            $recipe->setInstructions(array_values(array_map('strval', $payload['instructions'])));
        }

        $errors = $this->validator->validate($recipe);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->flush();

        return new JsonResponse(['data' => $recipe->toArray()]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $recipe = $this->recipeRepository->find($id);
        if (!$recipe instanceof Recipe) {
            return new JsonResponse(['error' => 'Recipe not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($recipe);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'deleted', 'id' => $id]);
    }
}
