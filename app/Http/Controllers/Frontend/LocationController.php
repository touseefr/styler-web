<?php namespace App\Http\Controllers\Frontend;
use App\Http\Controllers\Controller;
use App\Models\Locations\Locations;
use App\Repositories\Frontend\Location\LocationContract;
/**
 * Class DashboardController
 * @package App\Http\Controllers\Frontend
 */
class LocationController extends Controller {

	/**
	 * [$location description]
	 * @var [type]
	 */
	
	function __construct(LocationContract $location) {
		$this->location = $location;
	}
	/**
	* @return mixed
	*/
	public function index() {
		
		$q = \Input::has('q') ? \Input::get('q'):'';
		// Set your API key: remember to change this to your live API key in production
		$apiKey = env('AUSPOST_API_KEY');

		// Set the URL for the Domestic Parcel Size service
		$baseUrl = env('AUSPOST_API_URL');

		// Lookup domestic parcel types (different kinds of standard boxes etc)
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $baseUrl . '?q=' . $q);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('AUTH-KEY: ' . $apiKey));
		$rawBody = curl_exec($ch);
		curl_close($ch);                
                
		// // Check the response: if the body is empty then an error occurred
		if(isset($rawBody) &&  !json_decode($rawBody)->localities){
		  return response()->json([array("no_found"=>"Record Not Found.")], 200);
//		  return response()->json([], 200);
		}
//                echo "<pre>";
//                                
//                print_r(json_decode($rawBody,true));
//                exit;
                   
		$rawBody = json_decode($rawBody)->localities->locality;
                if(is_array($rawBody)){
                    return response()->json($rawBody, 200);
                }else{                                                           
                    return response()->json([$rawBody], 200);
                }
		// // All good, lets parse the response into a JSON object
		// $psmaSuggextionsJSON = json_decode($rawBody);
		
		// return response()->json($rawBody, 200);
		// return response()->json($this->location->all($q),200);
		
	}

}