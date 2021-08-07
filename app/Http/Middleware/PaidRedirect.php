<?php namespace App\Http\Middleware;

use Closure;
use App\Transaction;
use App\User;
use Auth;
class PaidRedirect {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$user_role = User::get_role(Auth::user()->id);
		$paid_roles = User::paid_roles();
		
		if(Auth::check() && in_array($user_role, $paid_roles)){
			$current_plan = Transaction::get_current_plan(Auth::user()->id);
		
			if($current_plan['status'] == 'true'){
				return $next($request);
			}
			else{
				//return redirect('plans');
				return $next($request);
			}
			//return $next($request);
		}
		else{
			//return redirect('auth/login');
			return $next($request);
		}
	}

}
