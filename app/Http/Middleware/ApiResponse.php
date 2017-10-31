<?php

namespace App\Http\Middleware;

use Closure;

class ApiResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        return response()->json([
            'success' => $response->status() == 200,
            'status' => $response->status(),
            'data' => $response->getOriginalContent(),
            'errors' => [],
        ]);
    }
}
