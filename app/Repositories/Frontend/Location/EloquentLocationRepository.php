<?php namespace App\Repositories\Frontend\Location;
use App\Exceptions\GeneralException;
use App\Models\Locations\Locations;
use App\Repositories\Frontend\Location\LocationContract;

/**
 * Class EloquentLocationRepository
 * @package App\Repositories\Location
 */
class EloquentLocationRepository implements LocationContract {

	/**
	 * [__construct description]
	 * @author Mohan Singh <mslogicmaster@gmail.com>
	 */
	public function __construct() {
	}


	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function all($q,$order_by = 'id', $sort = 'asc', $type="") {
		return Locations::where("name","Like","%{$q}%")->orWhere("postcode","Like","%{$q}%")->get(['id','name','postcode','state']);
	}

   
   	/**
	 * @param array
	 * @param string $sort
	 * @return mixed
	 */
	public function nearestlocation($input){

	if((isset($input['post']) && trim($input['post']) !='') || (isset($input['state']) && trim($input['state']) !='' )){
			$q = Locations::query();
			if(isset($input['post']) && trim($input['post']) !='' ){
				$q->where('postcode','=',$input['post']);
			}
			if(isset($input['state']) && trim($input['state']) !='' ){
				$q->where('state','=',$input['state']);
			}
			$state = $q->first();
			if(count($state)){
			$q = Locations::query();
				return $q->NearLatLng($state->latitude,$state->longitude,$input['radius'])->get();
			}else{
				return [];
			}
			
		}
	}	

}