<?php namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Class CategoryServicesServiceProvider
 * @package App\Providers
 */
class ReviewsServiceProvider extends ServiceProvider {
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
			\App\Repositories\Frontend\Reviews\ReviewsContract::class,
			\App\Repositories\Frontend\Reviews\EloquentReviewsRepository::class
		);
	}

}
