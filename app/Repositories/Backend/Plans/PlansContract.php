<?php
namespace App\Repositories\Backend\Plans;

interface PlansContract {
    
    
    public function fetchAll();    
    public function savePlan($Plandata);
    
    
}
