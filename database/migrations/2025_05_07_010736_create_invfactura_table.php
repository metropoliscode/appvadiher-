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
        Schema::create('invrefere', function (Blueprint $table) {
            $table->id();
            $table->string('ref_refere');
            $table->string('ref_nombre');
            $table->string('ref_codigo');
            $table->string('ref_undmed');
            $table->timestamps();
        });

        Schema::create('invfactura', function (Blueprint $table) {
            $table->id();
            $table->string('fac_tipdoc');
            $table->string('fac_numdoc');
            $table->integer('fac_nument');
            $table->date('fac_fecreg');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invrefere');
        Schema::dropIfExists('invfactura');
    }
};
