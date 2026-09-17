<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\DatabaseManager;

class MigrateNotificationsToSchoolDb extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'notifications:migrate-to-school-db
                            {--dry-run : Show what would be migrated without actually inserting}';

    /**
     * The console command description.
     */
    protected $description = 'One-time migration: copy push_devices and notification_logs from users_main into each school\'s own dynamic database';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');

        if ($isDryRun) {
            $this->warn('--- DRY RUN MODE: No data will be inserted ---');
        }

        $this->info('Starting migration of push_devices and notification_logs to school databases...');
        $this->newLine();

        // ── Step 1: Get all distinct school codes from users_main.push_devices ──
        $schoolCodes = DB::connection('users_main')
            ->table('push_devices')
            ->whereNotNull('school_code')
            ->where('school_code', '!=', '')
            ->distinct()
            ->pluck('school_code');

        if ($schoolCodes->isEmpty()) {
            $this->info('No push_devices found in users_main. Nothing to migrate.');
            return 0;
        }

        $this->info("Found " . $schoolCodes->count() . " school code(s): " . $schoolCodes->implode(', '));
        $this->newLine();

        foreach ($schoolCodes as $schoolCode) {
            $this->info("── Processing school: {$schoolCode} ──");

            try {
                // Connect to the school's dynamic database
                $schoolDb = DatabaseManager::connectBySchoolCode($schoolCode);

                // ── Migrate push_devices ──
                $devices = DB::connection('users_main')
                    ->table('push_devices')
                    ->where('school_code', $schoolCode)
                    ->get();

                $deviceInserted = 0;
                $deviceSkipped  = 0;

                foreach ($devices as $device) {
                    // Skip if already exists in school DB (by player_id to avoid duplicates)
                    $exists = $schoolDb->table('push_devices')
                        ->where('player_id', $device->player_id)
                        ->exists();

                    if ($exists) {
                        $deviceSkipped++;
                        continue;
                    }

                    if (!$isDryRun) {
                        $schoolDb->table('push_devices')->insert([
                            'user_id'    => $device->user_id,
                            'school_code'=> $device->school_code,
                            'player_id'  => $device->player_id,
                            'platform'   => $device->platform,
                            'is_active'  => $device->is_active,
                            'created_at' => $device->created_at,
                            'updated_at' => $device->updated_at,
                        ]);
                    }
                    $deviceInserted++;
                }

                $this->line("  push_devices   → inserted: {$deviceInserted}, skipped (already exists): {$deviceSkipped}");

                // ── Migrate notification_logs ──
                $logs = DB::connection('users_main')
                    ->table('notification_logs')
                    ->where('school_code', $schoolCode)
                    ->get();

                $logInserted = 0;
                $logSkipped  = 0;

                foreach ($logs as $log) {
                    // Skip if already exists (composite unique: user_id + school_code + record_type + record_id)
                    $exists = $schoolDb->table('notification_logs')
                        ->where('user_id',      $log->user_id)
                        ->where('school_code',  $log->school_code)
                        ->where('record_type',  $log->record_type)
                        ->where('record_id',    $log->record_id)
                        ->exists();

                    if ($exists) {
                        $logSkipped++;
                        continue;
                    }

                    if (!$isDryRun) {
                        $schoolDb->table('notification_logs')->insert([
                            'user_id'          => $log->user_id,
                            'school_code'      => $log->school_code,
                            'record_type'      => $log->record_type,
                            'record_id'        => $log->record_id,
                            'sent_successfully'=> $log->sent_successfully,
                            'notified_at'      => $log->notified_at,
                            'created_at'       => $log->created_at,
                            'updated_at'       => $log->updated_at,
                        ]);
                    }
                    $logInserted++;
                }

                $this->line("  notification_logs → inserted: {$logInserted}, skipped (already exists): {$logSkipped}");

            } catch (\Exception $e) {
                $this->error("  ERROR for school {$schoolCode}: " . $e->getMessage());
                Log::error("MigrateNotificationsToSchoolDb: Error for school {$schoolCode}: " . $e->getMessage());
            }

            $this->newLine();
        }

        if ($isDryRun) {
            $this->warn('--- DRY RUN complete. Run without --dry-run to apply. ---');
        } else {
            $this->info('Migration complete. ✅');
            $this->info('You can now verify by checking push_devices and notification_logs in each school database.');
        }

        return 0;
    }
}
