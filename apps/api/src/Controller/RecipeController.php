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
        $prefermentType = isset($payload['prefermentType']) ? (string) $payload['prefermentType'] : 'direct';
        $doughBallsCount = isset($payload['doughBallsCount']) ? (int) $payload['doughBallsCount'] : 4;
        $ballWeightGrams = isset($payload['ballWeightGrams']) ? (int) $payload['ballWeightGrams'] : 260;
        $hydrationPercentage = isset($payload['hydrationPercentage']) ? (float) $payload['hydrationPercentage'] : 65.0;
        $saltPercentage = isset($payload['saltPercentage']) ? (float) $payload['saltPercentage'] : 2.8;
        $yeastPercentage = isset($payload['yeastPercentage']) ? (float) $payload['yeastPercentage'] : 0.15;
        $yeastType = isset($payload['yeastType']) ? (string) $payload['yeastType'] : 'fresh';
        $oilPercentage = isset($payload['oilPercentage']) ? (float) $payload['oilPercentage'] : 0.0;
        $sugarPercentage = isset($payload['sugarPercentage']) ? (float) $payload['sugarPercentage'] : 0.0;
        $fermentationRtHours = isset($payload['fermentationRtHours']) ? (float) $payload['fermentationRtHours'] : 8.0;
        $fermentationCtHours = isset($payload['fermentationCtHours']) ? (float) $payload['fermentationCtHours'] : 16.0;
        $description = isset($payload['description']) ? (string) $payload['description'] : null;
        $flourId = isset($payload['flourId']) && is_numeric($payload['flourId']) ? (int) $payload['flourId'] : null;
        $flourName = isset($payload['flourName']) ? (string) $payload['flourName'] : null;

        /** @var list<string> $instructions */
        $instructions = isset($payload['instructions']) && is_array($payload['instructions'])
            ? array_values(array_map('strval', $payload['instructions']))
            : [];

        $recipe = new Recipe(
            name: $name,
            pizzaStyle: $pizzaStyle,
            prefermentType: $prefermentType,
            doughBallsCount: $doughBallsCount,
            ballWeightGrams: $ballWeightGrams,
            hydrationPercentage: $hydrationPercentage,
            saltPercentage: $saltPercentage,
            yeastPercentage: $yeastPercentage,
            yeastType: $yeastType,
            oilPercentage: $oilPercentage,
            sugarPercentage: $sugarPercentage,
            fermentationRtHours: $fermentationRtHours,
            fermentationCtHours: $fermentationCtHours,
            description: $description,
            flourId: $flourId,
            flourName: $flourName,
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
        if (isset($payload['prefermentType'])) $recipe->setPrefermentType((string) $payload['prefermentType']);
        if (isset($payload['doughBallsCount'])) $recipe->setDoughBallsCount((int) $payload['doughBallsCount']);
        if (isset($payload['ballWeightGrams'])) $recipe->setBallWeightGrams((int) $payload['ballWeightGrams']);
        if (isset($payload['hydrationPercentage'])) $recipe->setHydrationPercentage((float) $payload['hydrationPercentage']);
        if (isset($payload['saltPercentage'])) $recipe->setSaltPercentage((float) $payload['saltPercentage']);
        if (isset($payload['yeastPercentage'])) $recipe->setYeastPercentage((float) $payload['yeastPercentage']);
        if (isset($payload['yeastType'])) $recipe->setYeastType((string) $payload['yeastType']);
        if (isset($payload['oilPercentage'])) $recipe->setOilPercentage((float) $payload['oilPercentage']);
        if (isset($payload['sugarPercentage'])) $recipe->setSugarPercentage((float) $payload['sugarPercentage']);
        if (isset($payload['fermentationRtHours'])) $recipe->setFermentationRtHours((float) $payload['fermentationRtHours']);
        if (isset($payload['fermentationCtHours'])) $recipe->setFermentationCtHours((float) $payload['fermentationCtHours']);
        if (array_key_exists('flourId', $payload)) $recipe->setFlourId($payload['flourId'] !== null ? (int) $payload['flourId'] : null);
        if (isset($payload['flourName'])) $recipe->setFlourName((string) $payload['flourName']);
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
