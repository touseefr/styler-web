<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Route;

//class Authenticate extends Middleware
class Authenticate {

	/**
	 * The Guard implementation.
	 *
	 * @var Guard
	 */
	protected $auth;

	/**
	 * Create a new filter instance.
	 *
	 * @param  Guard  $auth
	 * @return void
	 */
	public function __construct(Guard $auth)
	{
		$this->auth = $auth;
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
        
		if ($this->auth->guest())
		{
//			if ($request->ajax())
//			{
//				return response('Unauthorized.', 401);
//			}
//			else
//			{                               
				$path = Route::currentRouteName();
				if (strpos($path, 'admin/') !== false){
					return redirect('admin/login');
				}
				else{
					return redirect()->guest('auth/login');
				}
//			}
		}

		return $next($request);
	}
}
