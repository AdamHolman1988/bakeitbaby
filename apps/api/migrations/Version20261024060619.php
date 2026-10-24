<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261024060619 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add per-locale content translations to flours, doughs and recipes';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE doughs ADD translations JSON DEFAULT \'{}\' NOT NULL');
        $this->addSql('ALTER TABLE flours ADD translations JSON DEFAULT \'{}\' NOT NULL');
        $this->addSql('ALTER TABLE recipes ADD translations JSON DEFAULT \'{}\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE doughs DROP translations');
        $this->addSql('ALTER TABLE flours DROP translations');
        $this->addSql('ALTER TABLE recipes DROP translations');
    }
}
