<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('SYSSEDES', function (Blueprint $table) {
            $table->id();
            $table->string('SED_CODIGO', 100)->unique();
            $table->string('SED_NOMBRE', 100);
            $table->string('SED_DETALL', 100);
            $table->string('SED_NIT', 100)->unique();
            $table->string('SED_TELEFO', 100);
            $table->string('SED_EMAIL', 100)->unique();
            $table->string('SED_DIRECC', 100);
            $table->string('SED_CODZON', 100);
            $table->string('SED_CODSUB', 100);
            $table->string('SED_CODALM', 100);
            $table->string('SED_EQUIPO', 100);
            $table->bigInteger('SED_ESTADO')->default(0);
            $table->bigInteger('SED_DELETE')->default(0);
            $table->bigInteger('SED_CODOPE')->default(1);
            $table->bigInteger('SED_CODUSU')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('SYSSEDES');
    }
};
