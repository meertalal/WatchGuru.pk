<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\SeederService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed',
    description: 'Seed the catalogue, admin account, coupons and warranty serials.',
)]
final class SeedCommand extends Command
{
    public function __construct(private readonly SeederService $seeder)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'fresh',
            null,
            InputOption::VALUE_NONE,
            'Replace the catalogue with the bundled seed file before seeding the rest.',
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('WatchGuru.pk database seed');

        $report = $this->seeder->run((bool) $input->getOption('fresh'));

        $rows = [];
        foreach ($report as $dataset => $count) {
            $rows[] = [$dataset, (string) $count];
        }

        $io->table(['Dataset', 'Rows'], $rows);
        $io->success('Seeding complete.');

        return Command::SUCCESS;
    }
}
