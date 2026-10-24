<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Dough;
use App\Http\RequestLocale;
use App\Repository\DoughRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/doughs', name: 'api_doughs_')]
final class DoughController extends AbstractController
{
    public function __construct(
        private readonly DoughRepository $doughRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $search = $request->query->getString('search', '');
        $style = $request->query->getString('style', 'all');

        $locale = RequestLocale::fromRequest($request);

        // Localized content isn't searchable in SQL, so translated searches are filtered below.
        $doughs = $this->doughRepository->searchAndFilter(
            search: $search !== '' && $locale === null ? $search : null,
            style: $style !== '' ? $style : null
        );

        if ($search !== '' && $locale !== null) {
            $doughs = array_values(array_filter(
                $doughs,
                static fn (Dough $d) => $d->matchesSearch($search, $locale, ['name', 'description'])
            ));
        }

        return new JsonResponse([
            'data' => array_map(static fn (Dough $d) => $d->toArray($locale), $doughs),
            'total' => count($doughs),
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, Request $request): JsonResponse
    {
        $dough = $this->doughRepository->find($id);
        if (!$dough instanceof Dough) {
            return new JsonResponse(['error' => 'Dough formulation not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(['data' => $dough->toArray(RequestLocale::fromRequest($request))]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $payload */
        $payload = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        $name = isset($payload['name']) ? (string) $payload['name'] : '';
        $pizzaStyle = isset($payload['pizzaStyle']) ? (string) $payload['pizzaStyle'] : 'neapolitan';
        $prefermentType = isset($payload['prefermentType']) ? (string) $payload['prefermentType'] : 'direct';
        $prefermentPercentage = isset($payload['prefermentPercentage']) ? (float) $payload['prefermentPercentage'] : 0.0;
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
        $instructions = isset($payload['instructions']) && is_array($payload['instructions'])
            ? array_values(array_map('strval', $payload['instructions']))
            : [];

        $dough = new Dough(
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
            prefermentPercentage: $prefermentPercentage,
            isPreset: false
        );

        $errors = $this->validator->validate($dough);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->persist($dough);
        $this->entityManager->flush();

        return new JsonResponse(['data' => $dough->toArray(RequestLocale::fromRequest($request))], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $dough = $this->doughRepository->find($id);
        if (!$dough instanceof Dough) {
            return new JsonResponse(['error' => 'Dough formulation not found'], Response::HTTP_NOT_FOUND);
        }

        /** @var array<string, mixed> $payload */
        $payload = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        // Editing in a translated locale updates that translation rather than the base content.
        $locale = RequestLocale::fromRequest($request);
        if ($locale !== null && $dough->hasTranslation($locale)) {
            $translatable = array_flip(Dough::translatableFields());
            $dough->mergeTranslation($locale, array_intersect_key($payload, $translatable));
            $payload = array_diff_key($payload, $translatable);
        }

        if (isset($payload['name'])) $dough->setName((string) $payload['name']);
        if (isset($payload['description'])) $dough->setDescription((string) $payload['description']);
        if (isset($payload['pizzaStyle'])) $dough->setPizzaStyle((string) $payload['pizzaStyle']);
        if (isset($payload['prefermentType'])) $dough->setPrefermentType((string) $payload['prefermentType']);
        if (isset($payload['prefermentPercentage'])) $dough->setPrefermentPercentage((float) $payload['prefermentPercentage']);
        if (isset($payload['doughBallsCount'])) $dough->setDoughBallsCount((int) $payload['doughBallsCount']);
        if (isset($payload['ballWeightGrams'])) $dough->setBallWeightGrams((int) $payload['ballWeightGrams']);
        if (isset($payload['hydrationPercentage'])) $dough->setHydrationPercentage((float) $payload['hydrationPercentage']);
        if (isset($payload['saltPercentage'])) $dough->setSaltPercentage((float) $payload['saltPercentage']);
        if (isset($payload['yeastPercentage'])) $dough->setYeastPercentage((float) $payload['yeastPercentage']);
        if (isset($payload['yeastType'])) $dough->setYeastType((string) $payload['yeastType']);
        if (isset($payload['oilPercentage'])) $dough->setOilPercentage((float) $payload['oilPercentage']);
        if (isset($payload['sugarPercentage'])) $dough->setSugarPercentage((float) $payload['sugarPercentage']);
        if (isset($payload['fermentationRtHours'])) $dough->setFermentationRtHours((float) $payload['fermentationRtHours']);
        if (isset($payload['fermentationCtHours'])) $dough->setFermentationCtHours((float) $payload['fermentationCtHours']);
        if (array_key_exists('flourId', $payload)) $dough->setFlourId($payload['flourId'] !== null ? (int) $payload['flourId'] : null);
        if (array_key_exists('flourName', $payload)) $dough->setFlourName($payload['flourName'] !== null ? (string) $payload['flourName'] : null);
        if (isset($payload['instructions']) && is_array($payload['instructions'])) {
            $dough->setInstructions(array_values(array_map('strval', $payload['instructions'])));
        }

        $errors = $this->validator->validate($dough);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->flush();

        return new JsonResponse(['data' => $dough->toArray($locale)]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $dough = $this->doughRepository->find($id);
        if (!$dough instanceof Dough) {
            return new JsonResponse(['error' => 'Dough formulation not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($dough);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'deleted', 'id' => $id]);
    }
}
