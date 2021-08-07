<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Class AppServiceProvider
 * @package App\Providers
 */
class AppServiceProvider extends ServiceProvider {

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot() {
        //
    }

    /**
     * Register any application services.
     *
     * This service provider is a great spot to register your various container
     * bindings with the application. As you can see, we are registering our
     * "Registrar" implementation here. You can add your own bindings too!
     *
     * @return void
     */
    public function register() {
        if ($this->app->environment() == 'local') {            
            $this->app->register(\Laracasts\Generators\GeneratorsServiceProvider::class);
        }
        $this->app->singleton(\App\Repositories\Backend\SmsPackage\SmsPackageContract::class, \App\Repositories\Backend\SmsPackage\EloquentSmsPackageRepository::class);
        $this->app->singleton(\App\Repositories\Backend\ListingPackage\ListingPackageContract::class, \App\Repositories\Backend\ListingPackage\EloquentListingPackageRepository::class);
        $this->app->singleton(\App\Repositories\Backend\Plans\PlansContract::class, \App\Repositories\Backend\Plans\EloquentPlansRepository::class);
        $this->app->singleton(\App\Repositories\Backend\SubscriptionPlanType\SubscriptionPlanTypeContract::class, \App\Repositories\Backend\SubscriptionPlanType\EloquentPlanTypeRepository::class);
    }

}
