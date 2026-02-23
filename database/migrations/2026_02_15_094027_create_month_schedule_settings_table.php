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
        Schema::create('month_schedule_settings', function (Blueprint $table) {
            $table->id();
            $table->string('month_code');
            $table->foreign('month_code')
                ->references('month_code')
                ->on('monthly_schedules')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->time('opening_time')->default('00:00:00');
            $table->time('noon_break_start')->default('00:00:00');
            $table->time('noon_break_end')->default('00:00:00');
            $table->time('closing_time')->default('00:00:00');
            $table->string('time_per_session');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('month_schedule_settings');
    }
};
