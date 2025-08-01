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
        Schema::create('siscladis', function (Blueprint $table) {
            $table->id();
            $table->string('cla_nombre', 10);
            $table->string('cla_usuari', 100);
            $table->string('cla_clave', 100);
            $table->string('cla_nomwif', 100)->nullable()->default('NO APLICA');
            $table->string('cla_clawif', 100)->nullable()->default('NO APLICA');
            $table->string('cla_ip', 100)->nullable();
            $table->string('cla_patron', 100)->nullable()->default('NO APLICA');
            $table->string('cla_serial', 100)->nullable();
            $table->string('cla_equipo', 100);
            $table->bigInteger('cla_estado')->default(0);
            $table->bigInteger('cla_delete')->default(0);
            $table->bigInteger('cla_codope')->default(1);
            $table->bigInteger('cla_codusu')->default(1);
            $table->timestamps();
        });

        Schema::create('sisclacor', function (Blueprint $table) {
            $table->id();
            $table->string('cla_correo');
            $table->string('cla_clave');
            $table->string('cla_equipo', 100);
            $table->bigInteger('cla_estado')->default(0);
            $table->bigInteger('cla_delete')->default(0);
            $table->bigInteger('cla_codope')->default(1);
            $table->bigInteger('cla_codusu')->default(1);
            $table->timestamps();
        });

        Schema::create('sisclacre', function (Blueprint $table) {
            $table->id();
            $table->string('cla_domnom');
            $table->string('cla_domurl');
            $table->string('cla_donusu');
            $table->string('cla_domcla');
            $table->string('cla_equipo', 100);
            $table->bigInteger('cla_estado')->default(0);
            $table->bigInteger('cla_delete')->default(0);
            $table->bigInteger('cla_codope')->default(1);
            $table->bigInteger('cla_codusu')->default(1);
            $table->timestamps();
        });

        Schema::create('sisequipo', function (Blueprint $table) {
            $table->id();
            $table->string('equ_nombre');
            $table->string('equ_marca');
            $table->string('equ_modelo');
            $table->string('equ_serial');
            $table->string('equ_ramtip');
            $table->string('equ_ramcap');
            $table->string('equ_hddtip');
            $table->string('equ_hddcap');
            $table->string('equ_progen');
            $table->string('equ_prodet');
            $table->string('equ_grafic');
            $table->string('equ_dirmac');
            $table->string('equ_usuasi');
            $table->string('equ_equipo', 100);
            $table->bigInteger('equ_estado')->default(0);
            $table->bigInteger('equ_delete')->default(0);
            $table->bigInteger('equ_codope')->default(1);
            $table->bigInteger('equ_codusu')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siscladis');
        Schema::dropIfExists('sisclacor');
        Schema::dropIfExists('sisclacre');
        Schema::dropIfExists('sisequipo');
    }
};
