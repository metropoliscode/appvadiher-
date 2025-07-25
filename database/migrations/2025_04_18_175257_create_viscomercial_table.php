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
        Schema::create('viscomercial', function (Blueprint $table) {
            $table->id();
            $table->date('fecope');
            $table->string('period', 8);
            $table->string('mes', 2);
            $table->string('codalm', 4);
            $table->string('nomalm', 50);
            $table->string('nitven', 20);
            $table->string('nomven', 60);
            $table->string('nitpro', 20)->nullable();
            $table->string('nompro', 60);
            $table->string('codcla', 4);
            $table->string('nomcla', 60);
            $table->string('codgru', 4);
            $table->string('nomgru', 60);
            $table->string('refere', 10);
            $table->string('produc', 255);
            $table->string('tipmov', 30);
            $table->string('tipdoc', 30);
            $table->string('predoc', 20);
            $table->string('numdoc', 9);
            $table->string('dias',  5);
            $table->string('poriva', 10);
            $table->decimal('costo', 13, 2);
            $table->decimal('venta', 13, 2);
            $table->decimal('utilid', 13, 2);
            $table->decimal('valiva', 13, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viscomercial');
    }
};
