<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MasterDataController;
use App\Http\Controllers\Api\MappingController;
use App\Http\Controllers\Api\RpsController;

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::group(['middleware' => 'auth:api'], function () {
    // Master Data
    Route::get('dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);

    Route::group(['prefix' => 'master'], function () {
        Route::apiResource('profil-lulusan', MasterDataController::class)->parameters(['profil-lulusan' => 'profil_lulusan']);
        Route::apiResource('cpl', \App\Http\Controllers\Api\CplController::class);
        Route::apiResource('bahan-kajian', \App\Http\Controllers\Api\BahanKajianController::class);
        Route::apiResource('mata-kuliah', \App\Http\Controllers\Api\MataKuliahController::class);
        Route::apiResource('cpmk', \App\Http\Controllers\Api\CpmkController::class);
        Route::apiResource('program-studi', \App\Http\Controllers\Api\ProgramStudiController::class);
        Route::apiResource('standar-kurikulum', \App\Http\Controllers\Api\StandarKurikulumController::class);
        Route::apiResource('standar-mutu', \App\Http\Controllers\Api\StandarMutuController::class);
        Route::apiResource('kurikulum', \App\Http\Controllers\Api\KurikulumController::class);
        Route::get('kurikulum-aktif', [\App\Http\Controllers\Api\KurikulumController::class, 'aktif']);
        Route::apiResource('tahun-akademik', \App\Http\Controllers\Api\TahunAkademikController::class);
    });

    // Mapping
    Route::group(['prefix' => 'mapping'], function () {
        Route::get('cpl-mk', [MappingController::class, 'getCplMk']);
        Route::post('cpl-mk', [MappingController::class, 'saveCplMk']);
        Route::delete('cpl-mk', [MappingController::class, 'removeCplMk']);
        Route::post('cpl-to-mk', [MappingController::class, 'assignCplToMk']);
        Route::get('mk/{mk_id}/cpl', [MappingController::class, 'getMkCpl']);
        Route::post('cpmk', [MappingController::class, 'storeCpmk']);
        Route::post('sub-cpmk', [MappingController::class, 'storeSubCpmk']);
    });

    // AI Generator
    Route::post('generate-rps', [\App\Http\Controllers\Api\RpsGeneratorController::class, 'generate']);
    Route::post('rps-ai-draft', [\App\Http\Controllers\Api\RpsGeneratorController::class, 'storeAiDraft']);

    // RPS Builder
    Route::group(['prefix' => 'rps'], function () {
        Route::get('/', [RpsController::class, 'index']);
        Route::get('/{id}', [RpsController::class, 'show']);
        Route::post('/generate', [RpsController::class, 'generate']); // Builder Utama
        Route::put('/{id}', [RpsController::class, 'update']);
        Route::patch('/{id}/status', [RpsController::class, 'updateStatus']);
        Route::post('/{id}/signature', [RpsController::class, 'injectSignature']);
        Route::get('/{id}/export-pdf', [RpsController::class, 'exportPdf']);
        
        // AI Generator route
        Route::post('/generate-ai', [RpsController::class, 'generateWithAi']);
    });
});
