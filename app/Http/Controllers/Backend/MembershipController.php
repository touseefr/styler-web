<?php namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Plan;
use Input;
/**
 * Class MembershipController
 * @package App\Http\Controllers\Backend
 */
class MembershipController extends Controller {

	/**
	 * @return \Illuminate\View\View
	 */
	public function index() {
		
		return view('backend.membership.add');
	}
	
	public function plans(){
		$plans = Plan::all();
		return view('backend.membership.plans')->with(array('plans' => $plans));
	}
	
	public function add() {
		
		/*
		 * Set POST array arguments;
		 **/
		$args = array(
					'name'			=> 		Input::get('name'),
					'desc' 			=>  	Input::get('desc'),
					'price' 		=> 		Input::get('price'),
					'currency'		=> 		Input::get('currency_type'),
					'discount' 		=> 		Input::get('discount'),
					'duration' 		=> 		Input::get('duration'),
					'features'		=>		serialize(Input::get('features'))
				);
				
		if(Plan::create($args)) {
			$data = array('message' => 'You plan has baan added successfully.', 'type' => 'success');
		} else {
			$data = array('message' => 'Sorry! your plan has not beedn addedd. Please check your details and try again.', 'type' => 'error');
		}
		
		return redirect('admin/membership/add')->with($data);
	}
	
	public function delete_plan($id){
		$plan = Plan::find($id);
		if($plan->delete()){
			$args = array('type'=>'success','message' => 'Plan deleted successfully');
		} else{
			$args = array('type'=>'error','message' => 'Sorry! plan is unable to delete');
		}
		return redirect('admin/membership')->with($args);
	}
	
	public function edit($id = ''){
		
		if($id) {
			$plan = Plan::find($id);
			return view('backend.membership.edit')->with(array('plan' => $plan));
		} else {
			/*
			 * Set POST array arguments;
			 **/
			$discount = Input::get('discount');
			$discount = empty($discount) ? 0.00 : $discount; 
			$args = array(
						'name'			=> 		Input::get('name'),
						'desc' 			=>  	Input::get('desc'),
						'price' 		=> 		Input::get('price'),
						'currency'		=> 		Input::get('currency_type'),
						'discount' 		=> 		$discount,
						'duration' 		=> 		Input::get('duration'),
						'features'		=>		serialize(Input::get('features'))
					);
					
			$id = Input::get('id');
			
			$plan = Plan::find($id);
			$plan->fill($args);
			
			if($plan->save()) {
				$data = array('message' => 'Your plan has baan updated successfully.', 'type' => 'success');
			} else {
				$data = array('message' => 'Sorry! your plan has not beedn updated. Please check your details and try again.', 'type' => 'error');
			}
			return redirect("admin/membership/edit/$id")->with($data);
		}
		
	}
}