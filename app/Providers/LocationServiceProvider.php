<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Class LocationServiceProvider
 * @package App\Providers
 */
class LocationServiceProvider extends ServiceProvider {
	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * [boot description]
	 * @author Mohan Singh <mslogicmaster@gmail.com>
	 * @return [type] [description]
	 */
	public function boot() {
		//
	}
	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register() {
		$this->registerBindings();
	}

	/**
	 * Register service provider bindings
	 */
	public function registerBindings() {

		$this->app->bind(
			\App\Repositories\Frontend\Location\LocationContract::class,
			\App\Repositories\Frontend\Location\EloquentLocationRepository::class
		);
	}

}
