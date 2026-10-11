<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Dough;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Dough>
 */
class DoughRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Dough::class);
    }

    /**
     * @return Dough[]
     */
    public function searchAndFilter(?string $search = null, ?string $style = null): array
    {
        $qb = $this->createQueryBuilder('d')
            ->orderBy('d.id', 'ASC');

        if ($search !== null && trim($search) !== '') {
            $qb->andWhere('LOWER(d.name) LIKE :search OR LOWER(d.description) LIKE :search')
                ->setParameter('search', '%' . mb_strtolower(trim($search)) . '%');
        }

        if ($style !== null && $style !== '' && $style !== 'all') {
            $qb->andWhere('d.pizzaStyle = :style')
                ->setParameter('style', $style);
        }

        /** @var Dough[] */
        return $qb->getQuery()->getResult();
    }
}
