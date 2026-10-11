<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Flour;
use App\Repository\FlourRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/flours', name: 'api_flours_')]
final class FlourController extends AbstractController
{
    public function __construct(
        private readonly FlourRepository $flourRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $search = $request->query->getString('search', '');
        $strength = $request->query->getString('strength', 'all');

        $flours = $this->flourRepository->searchAndFilter(
            search: $search !== '' ? $search : null,
            strength: $strength !== '' ? $strength : null
        );

        return new JsonResponse([
            'data' => array_map(static fn (Flour $f) => $f->toArray(), $flours),
            'total' => count($flours),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $flour = $this->flourRepository->find($id);
        if (!$flour instanceof Flour) {
            return new JsonResponse(['error' => 'Flour not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(['data' => $flour->toArray()]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $payload */
        $payload = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $name = isset($payload['name']) ? (string) $payload['name'] : '';
        $wIndex = isset($payload['wIndex']) ? (int) $payload['wIndex'] : 0;
        $proteinPercentage = isset($payload['proteinPercentage']) ? (float) $payload['proteinPercentage'] : 0.0;
        $flourType = isset($payload['flourType']) ? (string) $payload['flourType'] : 'tipo_00';
        $minHydration = isset($payload['minHydration']) ? (int) $payload['minHydration'] : 55;
        $maxHydration = isset($payload['maxHydration']) ? (int) $payload['maxHydration'] : 65;
        $recommendedFermentationHours = isset($payload['recommendedFermentationHours']) ? (string) $payload['recommendedFermentationHours'] : '8–14 h';
        $brand = isset($payload['brand']) ? (string) $payload['brand'] : null;
        $usageNotes = isset($payload['usageNotes']) ? (string) $payload['usageNotes'] : null;

        $flour = new Flour(
            name: $name,
            wIndex: $wIndex,
            proteinPercentage: $proteinPercentage,
            flourType: $flourType,
            minHydration: $minHydration,
            maxHydration: $maxHydration,
            recommendedFermentationHours: $recommendedFermentationHours,
            brand: $brand,
            usageNotes: $usageNotes,
            isPreset: false
        );

        if (isset($payload['wRangeMax']) && is_numeric($payload['wRangeMax'])) {
            $flour->setWRangeMax((int) $payload['wRangeMax']);
        }

        $errors = $this->validator->validate($flour);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->persist($flour);
        $this->entityManager->flush();

        return new JsonResponse(['data' => $flour->toArray()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $flour = $this->flourRepository->find($id);
        if (!$flour instanceof Flour) {
            return new JsonResponse(['error' => 'Flour not found'], Response::HTTP_NOT_FOUND);
        }

        /** @var array<string, mixed> $payload */
        $payload = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        if (isset($payload['name'])) {
            $flour->setName((string) $payload['name']);
        }
        if (isset($payload['brand'])) {
            $flour->setBrand((string) $payload['brand']);
        }
        if (isset($payload['wIndex'])) {
            $flour->setWIndex((int) $payload['wIndex']);
        }
        if (array_key_exists('wRangeMax', $payload)) {
            $flour->setWRangeMax($payload['wRangeMax'] !== null ? (int) $payload['wRangeMax'] : null);
        }
        if (isset($payload['proteinPercentage'])) {
            $flour->setProteinPercentage((float) $payload['proteinPercentage']);
        }
        if (isset($payload['flourType'])) {
            $flour->setFlourType((string) $payload['flourType']);
        }
        if (isset($payload['minHydration'])) {
            $flour->setMinHydration((int) $payload['minHydration']);
        }
        if (isset($payload['maxHydration'])) {
            $flour->setMaxHydration((int) $payload['maxHydration']);
        }
        if (isset($payload['recommendedFermentationHours'])) {
            $flour->setRecommendedFermentationHours((string) $payload['recommendedFermentationHours']);
        }
        if (isset($payload['usageNotes'])) {
            $flour->setUsageNotes((string) $payload['usageNotes']);
        }

        $errors = $this->validator->validate($flour);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->flush();

        return new JsonResponse(['data' => $flour->toArray()]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $flour = $this->flourRepository->find($id);
        if (!$flour instanceof Flour) {
            return new JsonResponse(['error' => 'Flour not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($flour);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'deleted', 'id' => $id]);
    }
}
