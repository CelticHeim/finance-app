<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExampleController extends Controller
{
    /**
     * Get example data
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Datos obtenidos exitosamente',
            'data' => [
                [
                    'id' => 1,
                    'title' => 'Primer item',
                    'description' => 'Descripción del primer item'
                ],
                [
                    'id' => 2,
                    'title' => 'Segundo item',
                    'description' => 'Descripción del segundo item'
                ],
                [
                    'id' => 3,
                    'title' => 'Tercer item',
                    'description' => 'Descripción del tercer item'
                ],
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Store a new item
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        return response()->json([
            'message' => 'Item creado exitosamente',
            'data' => [
                'id' => rand(1000, 9999),
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'created_at' => now()->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * Get a single item by ID
     */
    public function show(int $id): JsonResponse
    {
        return response()->json([
            'message' => 'Item encontrado',
            'data' => [
                'id' => $id,
                'title' => "Item #{$id}",
                'description' => "Esta es la descripción del item #{$id}",
            ],
        ]);
    }

    /**
     * Update an existing item
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        return response()->json([
            'message' => 'Item actualizado exitosamente',
            'data' => [
                'id' => $id,
                'title' => $validated['title'] ?? "Item #{$id}",
                'description' => $validated['description'] ?? null,
                'updated_at' => now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * Delete an item
     */
    public function destroy(int $id): JsonResponse
    {
        return response()->json([
            'message' => 'Item eliminado exitosamente',
            'data' => [
                'id' => $id,
                'deleted_at' => now()->toIso8601String(),
            ],
        ]);
    }
}
