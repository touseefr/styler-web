<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Class PackagesServiceProviderProvider
 * @package App\Providers
 */
class PackagesServiceProvider extends ServiceProvider {
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
			\App\Repositories\Backend\Packages\PackagesContract::class,
			\App\Repositories\Backend\Packages\EloquentPackagesRepository::class
		);
	}

}
