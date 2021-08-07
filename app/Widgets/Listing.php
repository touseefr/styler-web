<?php

namespace App\Widgets;

use Arrilot\Widgets\AbstractWidget;
use App\Repositories\Frontend\Listing\ListingContract;

class Listing extends AbstractWidget {

    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];

    /**
     * Treat this method as a controller action.
     * Return view() or other content to display.
     */
    public function run(ListingContract $listing) {
        $this->listing = $listing;                
        $jobs = $this->listing->getListingByType('job', $this->config['count'],$this->config['user_id']);                
        $classifieds = $this->listing->getListingByType('classified', $this->config['count'],$this->config['user_id']);
        $deals = $this->listing->getListingByType('deal', $this->config['count'],$this->config['user_id']);
        $businessforsale = $this->listing->getListingByType('businessforsale', $this->config['count'],$this->config['user_id']);
//        $jobs = $this->listing->getListingByTypeWidget('job', $this->config['count'],$this->config['user_id']);                
//        $classifieds = $this->listing->getListingByTypeWidget('classified', $this->config['count'],$this->config['user_id']);
//        $deals = $this->listing->getListingByTypeWidget('deal', $this->config['count'],$this->config['user_id']);
//        $businessforsale = $this->listing->getListingByTypeWidget('businessforsale', $this->config['count'],$this->config['user_id']);
//        
        
        
        
        
        return view("widgets." . $this->config['type'], [
            'config' => $this->config,
            'jobs' => $jobs,
            'deals' => $deals,
            'classifieds' => $classifieds,
            'businessforsale' => $businessforsale,
            'sponcer' => ''
        ]);
    }

}
