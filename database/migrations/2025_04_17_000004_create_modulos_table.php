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
        Schema::create('SYSMODULO', function (Blueprint $table) {
            $table->id();
            $table->string('MOD_CODIGO', 50)->unique();
            $table->string('MOD_NOMBRE', 100)->unique();
            $table->string('MOD_DETALL', 200);
            $table->string('MOD_URL', 100)->unique();
            $table->string('MOD_ICONO', 50);
            $table->string('MOD_PARENT');
            $table->string('MOD_TIPO');
            $table->string('MOD_EQUIPO', 100);
            $table->bigInteger('MOD_ESTADO')->default(0);
            $table->bigInteger('MOD_DELETE')->default(0);
            $table->bigInteger('MOD_CODOPE')->default(1);
            $table->bigInteger('MOD_CODUSU')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('SYSMODULO');
    }
};
