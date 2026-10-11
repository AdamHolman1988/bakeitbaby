<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Recipe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Recipe>
 */
class RecipeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Recipe::class);
    }

    /**
     * @return Recipe[]
     */
    public function searchAndFilter(?string $search = null, ?string $style = null): array
    {
        $qb = $this->createQueryBuilder('r')
            ->orderBy('r.id', 'ASC');

        if ($search !== null && trim($search) !== '') {
            $qb->andWhere('LOWER(r.name) LIKE :search OR LOWER(r.description) LIKE :search')
                ->setParameter('search', '%' . mb_strtolower(trim($search)) . '%');
        }

        if ($style !== null && $style !== '' && $style !== 'all') {
            $qb->andWhere('r.pizzaStyle = :style')
                ->setParameter('style', $style);
        }

        /** @var Recipe[] */
        return $qb->getQuery()->getResult();
    }
}
