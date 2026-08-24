<?php

namespace App\Models\PatchUpdates\Base;

use Illuminate\Database\Eloquent\Model;
use App\Helpers\DatabaseManager;
use Illuminate\Support\Facades\Config;

abstract class SchoolBaseModel extends Model
{
    protected $connection = null;
    protected $schoolCode = null;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->setDynamicConnection();
    }

    /**
     * Set the dynamic database connection using DatabaseManager
     */
    protected function setDynamicConnection(): void
    {
        try {
            // Get the database name from DatabaseManager
            $databaseName = DatabaseManager::getCurrentDatabaseName();
            
            // Use DatabaseManager to connect (this registers the connection)
            DatabaseManager::connect($databaseName);
            
            // Set the connection
            $this->setConnection($databaseName);
        } catch (\Exception $e) {
            // Fallback to default connection if no school detected
            $this->setConnection(config('database.default'));
        }
    }

    public function setSchoolCode(string $schoolCode): self
    {
        $this->schoolCode = $schoolCode;
        return $this;
    }

    public function getSchoolCode(): ?string
    {
        return $this->schoolCode ?? DatabaseManager::getCurrentSchoolCode();
    }

    public function getConnectionName()
    {
        if ($this->connection) {
            return $this->connection;
        }

        try {
            $databaseName = DatabaseManager::getCurrentDatabaseName();
            DatabaseManager::connect($databaseName);
            return $databaseName;
        } catch (\Exception $e) {
            return config('database.default');
        }
    }

    public function newQuery()
    {
        $this->setDynamicConnection();
        return parent::newQuery();
    }

    public function newModelQuery()
    {
        $this->setDynamicConnection();
        return parent::newModelQuery();
    }
}