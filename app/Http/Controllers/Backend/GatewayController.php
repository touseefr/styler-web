<?php namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Input;
use Settings;
/**
 * Class GatewayController
 * @package App\Http\Controllers\Backend
 */
class GatewayController extends Controller {

	/**
	 * @return \Illuminate\View\View
	 */
	public function index() {
		
		return view('backend.gateway.settings');
	}
	
	public function save_settings(){
		$paypal_setting = Input::all();
		unset($paypal_setting['_token']);
		Settings::set('paypal_settings', serialize($paypal_setting));
		return redirect('admin/gateway')->with(array('type' => 'success', 'message' => 'Settings saved successfully.'));
	}
}