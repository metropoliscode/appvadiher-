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
        Schema::create('movconfig', function (Blueprint $table) {
            $table->id();
            $table->string('MOV_CONMOV')->unique();
            $table->string('MOV_EVENTO');
            $table->string('MOV_CODOPE');
            $table->string('MOV_CODALM');
            $table->string('MOV_DETALL');
            $table->string('MOV_CODMOD');
            $table->string('MOV_EQUIPO');
            $table->string('MOV_PERIOD');
            $table->date('MOV_FECOPE')->default(now());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movconfig');
    }
};
