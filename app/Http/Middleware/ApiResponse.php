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
            'success' => true == preg_match('/[2][0-9]{2}/',$response->status()),
            'status' => $response->status(),
            'data' => $response->getOriginalContent()
        ]);
    }
}
