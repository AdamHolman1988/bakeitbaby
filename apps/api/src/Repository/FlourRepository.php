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
            ->orderBy('f.wIndex', 'ASC');

        if ($search !== null && trim($search) !== '') {
            $qb->andWhere('LOWER(f.name) LIKE :search OR LOWER(f.brand) LIKE :search OR LOWER(f.usageNotes) LIKE :search')
                ->setParameter('search', '%' . mb_strtolower(trim($search)) . '%');
        }

        if ($strength !== null && $strength !== '' && $strength !== 'all') {
            match ($strength) {
                'weak' => $qb->andWhere('f.wIndex < 220'),
                'medium' => $qb->andWhere('f.wIndex >= 220 AND f.wIndex <= 260'),
                'strong' => $qb->andWhere('f.wIndex >= 270 AND f.wIndex <= 310'),
                'manitoba' => $qb->andWhere('f.wIndex >= 320'),
                default => null,
            };
        }

        /** @var Flour[] */
        return $qb->getQuery()->getResult();
    }
}
