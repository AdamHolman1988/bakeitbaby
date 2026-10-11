<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Flour;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Flour>
 */
class FlourRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Flour::class);
    }

    /**
     * @return Flour[]
     */
    public function searchAndFilter(?string $search = null, ?string $strength = null): array
    {
        $qb = $this->createQueryBuilder('f')
            ->addSelect('CASE WHEN f.wIndex IS NULL THEN 999 ELSE f.wIndex END AS HIDDEN sortW')
            ->orderBy('sortW', 'ASC');

        if ($search !== null && trim($search) !== '') {
            $qb->andWhere('LOWER(f.name) LIKE :search OR LOWER(f.brand) LIKE :search OR LOWER(f.usageNotes) LIKE :search')
                ->setParameter('search', '%' . mb_strtolower(trim($search)) . '%');
        }

        if ($strength !== null && $strength !== '' && $strength !== 'all') {
            match ($strength) {
                'weak' => $qb->andWhere('f.wIndex < 220 AND f.isGlutenFree = false'),
                'medium' => $qb->andWhere('f.wIndex >= 220 AND f.wIndex <= 260 AND f.isGlutenFree = false'),
                'strong' => $qb->andWhere('f.wIndex >= 270 AND f.wIndex <= 310 AND f.isGlutenFree = false'),
                'manitoba' => $qb->andWhere('f.wIndex >= 320 AND f.isGlutenFree = false'),
                'gluten_free' => $qb->andWhere('f.isGlutenFree = true OR f.wIndex IS NULL'),
                default => null,
            };
        }

        /** @var Flour[] */
        return $qb->getQuery()->getResult();
    }
}
