<?php

namespace App\Http\Controllers\Frontend;

use App\Faq;
use App\Businessservices;
use App\BusinessBrand;
use Input;
use Mail;
use App\Http\Controllers\Controller;
use App\Repositories\Frontend\Pages\PagesContract;
use App\Http\Requests\Frontend\Pages\GetPageRequest;
//use App\Http\Controllers\Frontend\Request;
use Auth;
use DB;
use Illuminate\Http\Request;
use App\Jobs\StylerZoneEmails;

/**
 * Class PageController
 * @package App\Http\Controllers\Frontend
 */
class PageController extends Controller {

    /**
     * [$user description]
     * @var [type]
     */
    function __construct(PagesContract $page) {
        $this->page = $page;
    }

    public function review_guide() {
        return view('frontend.page.review_guide');
    }

    /**
     * @return mixed
     */
    public function index() {
         $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('terms'));
    }

    /**
     * @return mixed
     */
    public function aboutus() {
        $msg = '';
        $show_error = 0;
        $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('aboutus'));
    }

    public function privacy_policy() {
         $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('privacy_policy'));
    }

    public function copyrights() {
        if (count($this->page->getPageDeatail('copyrights')) > 0) {
             $show_message=0;
            return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('copyrights'));
        } else {
            return redirect()->home();
        }
    }

    public function pricing() {
         $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('pricing'));
    }

    public function our_vission_value_and_success() {
         $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('our_vission_value_and_success'));
    }

    /**
     * @return mixed
     */
    public function contact_us() {
        //return view('frontend.page.dagedetail')->withPage($this->page->getPageDeatail('aboutus'));
        return view('frontend.page.contact_us');
    }

    /*
     * * contact form submit
     */

    public function contact_us_submit() {

        $name = Input::get('name');
        $email = Input::get('email');
        $phone = Input::get('phone');
        $message = Input::get('message');

        $data = array('NAME' => $name, 'EMAIL' => $email, 'PHONE' => $phone, 'MESSAGE' => $message);
        StylerZoneEmails::dispatch($data, 'emails.notification_confirmation');
//        $this->dispatch((new StylerZoneEmails($data, 'emails.notification_confirmation')));
//        Mail::send('emails.contact_us', $data, function($send) use ($data) {
//
//            $send->from(getenv('ADMIN_EMAIL'), $data['NAME']);
//            $send->to('hitesh.iquincesoft@gmail.com')->subject($data['NAME'] . ' ' . getenv('CONTACT_US'));
//        });
        return redirect('contact-us')->with(array('type' => 'success', 'message' => 'Your query has been submitted successfully. You will get response soon.'));
    }

    /**
     * @return mixed
     */
    public function legal() {
         $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('legal'));
    }

    /**
     * @return mixed
     */
    public function support(Request $request) {
        $msg = '';
        $show_error = 0;
        if ($request->session()->has('error_msg')) {
            $show_error = 1;
            $msg = $request->session()->pull('error_msg');
        }
        if ($request->session()->has('success_msg')) {
            $show_error = 2;
            $msg = $request->session()->pull('success_msg');
        }
        
         $show_message=0;
        return view('frontend.page.dagedetail')->withShowmsg($show_message)->withPage($this->page->getPageDeatail('support'))
                        ->withShowmsg($show_error)
                        ->withMsg($msg);
    }

    /*
     * * Faqs
     */

    public function faqs() {
        $faqs = Faq::all();
        return view('frontend.page.faqs')->with(array('faqs' => $faqs));
    }

    public function faqsave(GetPageRequest $request) {

        $faq = new Faq();
        if (!empty($request->input('question') && !empty($request->input('answer')))) {
            $faq->question = $request->input('question');
            $faq->answer = $request->input('answer');
            $faq->category_id = 0;
            $faq->author = Auth::user()->id;
            $faq->faq_type = 'bussiness_faq';
            $faq->save();
        }
    }

    public function updatefaqsave(GetPageRequest $request) {
        //print_r($request->all());
        foreach ($request->all() as $data) {

            //echo $data['id'];
            if (!$data['id']) {
                return response()->json([
                            'error' => [
                                'message' => 'FAQ id does not exits',
                            ],
                                ], 422);
            }

            $args = array(
                'question' => $data['question'],
                'answer' => $data['answer']
            );
        }
        \DB::table('faqs')->where('id', $data['id'])->limit(1)->update($args);
    }

    public function updatecreditform(GetPageRequest $request) {

        //print_r($request->all());
        $user_id = Auth::User()->id;

        $card_info = $request->all();
        $card_info['cardnumber'] = base64_encode($card_info['cardnumber']);
        $card_info['expirymonth'] = base64_encode($card_info['expirymonth']);
        $card_info['expiryyear'] = base64_encode($card_info['expiryyear']);
        $card_info['cvv'] = base64_encode($card_info['cvv']);

        $credit_card_info = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'credit_card_info'))->get();
        if ($credit_card_info) {

            \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'credit_card_info'))->update(['value' => serialize($card_info)]);
        } else {
            \DB::table('user_meta')->insert(['user_id' => $user_id, 'created_at' => date("Y-m-d H:i:s"), 'key' => 'credit_card_info', 'value' => serialize($card_info)]);
        }
    }

    public function updatebusinessservice(GetPageRequest $request) {
        //print_r($request->all());
        foreach ($request->all() as $data) {

            //echo $data['id'];
            if (!$data['id']) {
                return response()->json([
                            'error' => [
                                'message' => 'FAQ id does not exits',
                            ],
                                ], 422);
            }

            $args = array(
                'title' => $data['title'],
                'price' => $data['price'],
                'dicount' => $data['dicount'],
            );
        }
        \DB::table('businessservices')->where('id', $data['id'])->limit(1)->update($args);
    }

    public function updatebusinessbrand(GetPageRequest $request) {
        //print_r($request->all());
        foreach ($request->all() as $data) {

            //echo $data['id'];
            if (!$data['id']) {
                return response()->json([
                            'error' => [
                                'message' => 'Brand id does not exits',
                            ],
                                ], 422);
            }

            $args = array(
                'title' => $data['title'],
                'price' => $data['price'],
                'dicount' => $data['dicount'],
            );
        }
        \DB::table('business_brand')->where('id', $data['id'])->limit(1)->update($args);
    }

    public function getfaq() {
        //$faq_id  = $_GET['faq_id'];
        $user_id = Auth::user()->id;
        //$faqs = Faq::all();
        //$faqs = Faq::all();
        //if($faq_id){
        //$faqs = Faq::where(array('id'=>$faq_id,'author'=>$user_id))->get();
        //}else{
        $faqs = Faq::where('author', $user_id)->get();

        //}

        return response()->json($faqs, 200);
    }

    public function getfaqbyid() {
        $faq_id = $_GET['faq_id'];
        $user_id = Auth::user()->id;
        $faqs = Faq::where(array('id' => $faq_id, 'author' => $user_id))->get();
        return response()->json($faqs, 200);
    }

    public function getbussservicebyid() {

        $service_id = $_GET['service_id'];
        $user_id = Auth::user()->id;
        $Businessservices = Businessservices::where(array('id' => $service_id, 'author' => $user_id))->get();
        return response()->json($Businessservices, 200);
    }

    public function getbussbrandbyid() {

        $brand_id = $_GET['brand_id'];
        $user_id = Auth::user()->id;
        $Businessbrand = BusinessBrand::where(array('id' => $brand_id, 'author' => $user_id))->get();
        return response()->json($Businessbrand, 200);
    }

    public function deletefaq($id) {
        $faq_id = $id;
        $user_id = Auth::user()->id;
        \DB::table('faqs')->where(array('id' => $faq_id, 'author' => $user_id))->delete();
    }

    /*
     * * Business services
     */

    public function servicesave(GetPageRequest $request) {

        $Businessservices = new Businessservices();

        $discount = $request->input('discount') ? $request->input('discount') : 0;
        $Businessservices->title = $request->input('title');
        $Businessservices->price = $request->input('price');
        $Businessservices->dicount = $discount;
        $Businessservices->desc = $request->input('desc');
        $Businessservices->author = Auth::user()->id;
        $Businessservices->save();
    }

    public function getbusservices() {
        $user_id = Auth::user()->id;
        //$Businessservices = Businessservices::all();
        $Businessservices = Businessservices::where('author', $user_id)->get();
        return response()->json($Businessservices, 200);
    }

    public function getbusbrand() {
        $user_id = Auth::user()->id;
        $Businessbrand = BusinessBrand::where('author', $user_id)->orderBy('id', 'desc')->get();
        return response()->json($Businessbrand, 200);
    }

    public function brandsave(GetPageRequest $request) {

        $Businessbrand = new BusinessBrand();

        $discount = $request->input('discount') ? $request->input('discount') : 0;
        $Businessbrand->title = $request->input('title');
        $Businessbrand->price = $request->input('price');
        $Businessbrand->dicount = $discount;
        $Businessbrand->brand_desc = $request->input('desc');
        $Businessbrand->author = Auth::user()->id;
        $Businessbrand->save();
    }

    public function busservicedelete($id) {
        $service_id = $id;
        $user_id = Auth::user()->id;
        \DB::table('businessservices')->where(array('id' => $service_id, 'author' => $user_id))->delete();
    }

    public function bussbranddelete($id) {
        $service_id = $id;
        $user_id = Auth::user()->id;
        \DB::table('business_brand')->where(array('id' => $service_id, 'author' => $user_id))->delete();
    }

    /*
     * * get cc info
     */

    public function getccinfo() {

        $user_id = Auth::user()->id;

        $credit_card_info = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'credit_card_info'))->get();

        if (count($credit_card_info->toArray()) > 0) {
            $cc_info = @unserialize($credit_card_info[0]->value);
            $cc_info['cardnumber'] = base64_decode($cc_info['cardnumber']);
            $cc_info['expirymonth'] = base64_decode($cc_info['expirymonth']);
            $cc_info['expiryyear'] = base64_decode($cc_info['expiryyear']);
            $cc_info['cvv'] = base64_decode($cc_info['cvv']);
        } else {
            $cc_info = array();
        }
        return response()->json($cc_info, 200);
    }

    public function getCourses(GetPageRequest $request) {
        try {
            $user_id = Auth::user()->id;
            if (!$request->has('course_id')) {
                $Businessbrand = \App\Models\BusinessCourses\BusinessCourses::where('user_id', $user_id)->orderBy('id', 'desc')->get();
                return response()->json(array(
                            "status" => "200",
                            "msg" => "Successfully",
                            "data" => $Businessbrand->toJson(),
                                )
                                , 200);
            } else {
                $Businessbrand = \App\Models\BusinessCourses\BusinessCourses::where('id', $request->input('course_id'))->orderBy('id', 'desc')->get();
                return response()->json(array(
                            "status" => "200",
                            "msg" => "Successfully",
                            "data" => $Businessbrand->toJson(),
                                )
                                , 200);
            }
        } catch (Exception $e) {
            return \GuzzleHttp\json_encode(array(
                "status" => "210",
                "msg" => "SomeThing went wrong.Please Try later",
                "data" => $e->getMessage()
            ));
        }
    }

    public function ChangeCourseDetail(GetPageRequest $request) {
        try {
            $user_id = Auth::user()->id;
            if (Auth::check() && $request->has('course_title')) {
                if (!$request->has('course_id')) {
                    $objCourse = new \App\Models\BusinessCourses\BusinessCourses();
                    $objCourse->course_title = $request->input('course_title');
                    $objCourse->course_website = $request->input('course_website');
                    $objCourse->course_type = $request->input('course_type');
                    $objCourse->user_id = $user_id;
                    $objCourse->save();
                    return \GuzzleHttp\json_encode(array(
                        "status" => "200",
                        "msg" => "Successfully Course Created",
                        "data" => $objCourse->toJson(),
                    ));
                } else {
                    $objCourse = \App\Models\BusinessCourses\BusinessCourses::find($request->input("course_id"));
                    $objCourse->course_title = $request->input('course_title');
                    $objCourse->course_website = $request->input('course_website');
                    $objCourse->course_type = $request->input('course_type');
                    $objCourse->user_id = $user_id;
                    $objCourse->save();
                    return \GuzzleHttp\json_encode(array(
                        "status" => "200",
                        "msg" => "Successfully Course Created",
                        "data" => $objCourse->toJson(),
                    ));
                }
            }
        } catch (Exception $e) {
            return \GuzzleHttp\json_encode(array(
                "status" => "210",
                "msg" => "SomeThing went wrong.Please Try later",
                "data" => $e->getMessage()
            ));
        }
    }

    public function DeleteCourses(GetPageRequest $request) {
        try {
            if (Auth::check() && $request->has("course_id")) {
                $objcourse = \App\Models\BusinessCourses\BusinessCourses::find($request->input('course_id'));
                $objcourse->delete();
                return response()->json(array(
                            "status" => "200",
                            "msg" => "Successfully Deleted",
                            "data" => "",
                                )
                                , 200);
            }
        } catch (Exception $e) {
            return \GuzzleHttp\json_encode(array(
                "status" => "210",
                "msg" => "SomeThing went wrong.Please Try later",
                "data" => $e->getMessage()
            ));
        }
    }

    public function getBusinessRegister() {
        return view('frontend.page.business-register');
    }

}
