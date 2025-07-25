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
        Schema::create('SYSAREAS', function (Blueprint $table) {
            $table->id();
            $table->string('ARE_CODIGO', 100)->unique();
            $table->string('ARE_NOMBRE', 100)->unique();
            $table->string('ARE_DETALL', 100);
            $table->string('ARE_EQUIPO', 100);
            $table->bigInteger('ARE_ESTADO')->default(0);
            $table->bigInteger('ARE_DELETE')->default(0);
            $table->bigInteger('ARE_CODOPE')->default(1);
            $table->bigInteger('ARE_CODUSU')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('SYSAREAS');
    }
};
