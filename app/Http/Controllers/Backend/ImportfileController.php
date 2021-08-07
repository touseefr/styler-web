<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Access\User\User;
use Illuminate\Support\Facades\DB;
use App\Models\UserBusiness\UserBusiness;

class ImportfileController extends Controller {

    public function index($user_id) {
        $user = \App\Models\Access\User\User::with('UserBusiness')->where('id', $user_id)->first()->toArray();
        $bookingfiles = (isset($user['user_business']['booking_files']) && !empty($user['user_business']['booking_files'])) ? \GuzzleHttp\json_decode($user['user_business']['booking_files']) : array();
        return view('backend.importfile.index')->withUserid($user_id)->withBookingfiles((count($bookingfiles) > 0) ? $bookingfiles : array());
    }

    public function SaveFile(Request $request) {

        if ($request->file('file_data')->isValid()) {
            
        }
    }

    public function save_info(Request $request) {
        $filepath = null;
        if ($request->has('file_status') && $request->input('file_status') == '1') {
            $filepath = "public/assets/booking/" . $request->input('file_path');
            // $content = Excel::load("public/assets/booking/" . $request->input('file_path'))->get();
        } else {
            $file = $request->file('image');
            $originalName = $file->getClientOriginalName();
            $destinationPath = public_path() . '/assets/tmpImportFile';
            $file->move($destinationPath, $originalName);
            // $content = Excel::load($destinationPath . "/" . $originalName)->get();
            $filepath = $destinationPath . "/" . $originalName;
        }
        $user_id = $request->input('user_id');
        $page = $request->input('page_title');
        $map_fields = array_filter(json_decode(json_encode(json_decode($request->input('maping')))));
        ob_start();
        header("HTTP/1.1 200");
        header('Content-Type: application/json');
        ob_flush();
        flush();
        $data = [];
        $return_data = [];
        Excel::filter('chunk')->load($filepath)->chunk(2000, function ($content) use (&$data, &$user_id, &$page, &$map_fields, &$return_data) {

            $file_data = $content;
            $return_data = array("status" => "210", "msg" => "Somthing went wrong Please try later.");
            $categories_are = array();
            $old_customer_id = \App\Models\Customers\Customers::where('parent_id', $user_id)->select('customer_id')->orderBy('id', 'desc')->pluck('customer_id');
            if ($old_customer_id->count() > 0) {
                $old_customer_id = (int) $old_customer_id[0];
                $old_customer_id++;
            } else {
                $old_customer_id = 1000;
            }
            if ($user_id) {
                if ($page == "basif_info") {
                    $updata_user_buiness = array();
//                 print_r($map_fields);
                    foreach ($map_fields as $values) {
                        $values = (array) $values;
                        if (!empty($values)) {
                            $updata_user_buiness[trim($values['define_value'])] = $file_data[0][trim($values['file_value'])];
                        }
                    }
                    $objuser = UserBusiness::where('user_id', $user_id)->update($updata_user_buiness);
                    if ($objuser) {
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    }
                } else if ($page == "product_maker") {
                    $product_maker = array();
                    $created_at = date('Y-m-d h:i:s');


                    foreach ($map_fields as $values) {
                        $values = (array) $values;
                        foreach ($file_data as $key => $data) {
                            $product_maker[$key][$values['define_value']] = $data[$values['file_value']];
                            $product_maker[$key]['user_id'] = $user_id;
                            $product_maker[$key]['created_at'] = $created_at;
                            $product_maker[$key]['updated_at'] = $created_at;
                        }
                    }
                    $objuser = \Illuminate\Support\Facades\DB::table('make')->insert($product_maker);
                    if ($objuser) {
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    }
                } else if ($page == "product") {
                    $prdoucts = array();
                    $file_data = $file_data;
                    $keys = array();
                    foreach ($map_fields as $values) {
                        $values = (array) $values;
                        foreach ($file_data as $key => $data) {
                            $info = "";
                            if (is_array($values)) {
                                if (trim($values['define_value']) == 'category_id') {
                                    $info = $this->getSystemCategoryId($data[trim($values['file_value'])]);
                                } else if (trim($values['define_value']) == 'make_id') {
                                    $info = $this->getMakerId($data[trim($values['file_value'])], $user_id);
                                } else {
                                    if (trim($values['file_value'])) {
                                        $info = $data[trim($values['file_value'])];
                                    }
                                }
                                if (!in_array($key, $keys)) {
                                    $prdoucts[$key]['parent_id'] = $user_id;
                                    $keys[$key] = $key;
                                }
                                $prdoucts[$key][trim($values['define_value'])] = $info;
                            }
                        }
                    }
                    $objuser = \Illuminate\Support\Facades\DB::table('products')->insert($prdoucts);
                    if ($objuser) {
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    }
                } else if ($page == "service_categories") {
                    $service_categories = array();
                    $created_at = date('Y-m-d h:i:s');
                    foreach ($map_fields as $values) {
                        $values = (array) $values;
                        foreach ($file_data as $key => $data) {
                            $service_categories[$key][$values['define_value']] = $data[$values['file_value']];
                            $service_categories[$key]['user_id'] = $user_id;
                            $service_categories[$key]['created_at'] = $created_at;
                            $service_categories[$key]['updated_at'] = $created_at;
                            $service_categories[$key]['category_color'] = "#000000";
                            $service_categories[$key]['type_code'] = "stylerbook";
                        }
                    }

                    $objuser = \Illuminate\Support\Facades\DB::table('categories')->insert($service_categories);
                    if ($objuser) {
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    }
                } else if ($page == "service") {
                    $services = array();
                    $created_at = date('Y-m-d h:i:s');
                    foreach ($map_fields as $map_index => $values) {
                        $values = (array) $values;
                        foreach ($file_data as $key => $data) {

                            if ($values['define_value'] == 'category_id') {
                                $info = $this->getServiceCategory($data[$values['file_value']], $user_id);
                            } else {
                                $info = $data[$values['file_value']];
                            }

                            $services[$key][$values['define_value']] = $info;
                            if ($map_index == 0) {
                                $services[$key]['author'] = $user_id;
                                $services[$key]['created_at'] = $created_at;
                                $services[$key]['updated_at'] = $created_at;
                                $services[$key]['service_online'] = '1';
                                $services[$key]['active'] = '1';
                                $services[$key]['popular_service'] = '1';
                            }
                        }
                    }
                    $objuser = \Illuminate\Support\Facades\DB::table('businessservices')->insert($services);
                    if ($objuser) {
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    }
                } else if ($page == "customer") {
                    try {
                        $prodoucts = array();
                        $file_data = $file_data;
                        $keys = array();

                        foreach ($map_fields as $values) {
                            $values = (array) $values;
                            foreach ($file_data as $key => $data) {
                                if (is_array($values)) {

                                    if (in_array(trim($values['define_value']), array("first_name", "last_name", "email"))) {
                                        $prodoucts[$key]['user'][trim($values['define_value'])] = isset($data[(trim($values['file_value']))]) ? $data[(trim($values['file_value']))] : '';
                                    } else if (in_array(trim($values['define_value']), array("history"))) {
                                        $prodoucts[$key]['history'] = isset($data[(trim($values['file_value']))]) ? $data[(trim($values['file_value']))] : '';
                                    } else {
                                        if (in_array(trim($values['define_value']), array("notification_emails", "notification_postal", "notification_phone", "notification_sms", "notification_appoinment"))) {
                                            $notification = '1';
                                            if ($data[trim($values['file_value'])] == 'FALSE') {
                                                $notification = '0';
                                            }
                                            $prodoucts[$key]['user'][trim($values['define_value'])] = $notification;
                                        } else {
                                            $prodoucts[$key]['user'][trim($values['define_value'])] = isset($data[(trim($values['file_value']))]) ? $data[(trim($values['file_value']))] : '';
                                        }
                                    }
                                }
                            }
                        }

                        $userInfoData = [];
                        $spCustomerData = [];
                        $sp_customer = null;
                        foreach ($prodoucts as $key => $values) {

                            if (isset($values['user'])) {
                                $objCustomer = new \App\Models\Customers\Customers();
                                
                                foreach ($values['user'] as $index => $dataValue) {

                                    if (!in_array($index, array("comment"))) {
                                        $objCustomer->{$index} = $dataValue;
                                    }
                                    if ($index == 'dob' && $dataValue) {
                                        $objDate = new \DateTime($dataValue);
                                        $objDate->format('Y-m-d');
                                        $objCustomer->{$index} = $objDate->format('Y-m-d');
                                    }
                                }                                
                                $objCustomer->parent_id = $user_id;
                                $objCustomer->customer_id = $old_customer_id++;
                                $objCustomer->save();
                            }

                            if (isset($values['history']) && !empty($values['history']) && empty($sp_customer)) {
                                $insert_notes['created_at'] = date('Y-m-d H:i:s');
                                $insert_notes['notes'] = $values['history'];
                                $insert_notes['updated_at'] = date('Y-m-d H:i:s');
                                $insert_notes['user_id'] = $objCustomer->id;
                                $insert_notes['sp_id'] = $user_id;
                                DB::table('notes')->insert([$insert_notes]);
                            }
                        }
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    } catch (Exception $e) {
                        $return_data['status'] = "210";
                        $return_data['msg'] = "Some thing went wrong.Please try again later";
                    }
                } else if ($page == "employee") {
                    try {
                        $prodoucts = array();
                        $file_data = $file_data;
                        $prodoucts = $this->mapArray($map_fields, $file_data, $page);
                        foreach ($prodoucts as $key => $values) {

                            if (strtolower($values['gender']) == strtolower('M')) {
                                $prodoucts[$key]['gender'] = 'male';
                            } elseif (strtolower($values['gender']) == strtolower('Y')) {
                                $prodoucts[$key]['gender'] = 'female';
                            } else {
                                $prodoucts[$key]['gender'] = '';
                            }
                            $prodoucts[$key]['parent_id'] = $user_id;
                        }
                        \App\Employee::insert($prodoucts);
                        $return_data['status'] = "200";
                        $return_data['msg'] = "Successfully done.";
                    } catch (Exception $e) {
                        $return_data['status'] = "210";
                        $return_data['msg'] = "Some thing went wrong.Please try again later";
                    }
                }
            }
        }, $shouldQueue = false);
        return \GuzzleHttp\json_encode($return_data);
    }

    public function mapArray($map_fields, $file_data, $page_title) {
        $return_array = array();
        if ($page_title == 'employee') {
            foreach ($map_fields as $values) {
                $values = (array) $values;
                foreach ($file_data as $key => $data) {
                    if (is_array($values)) {
                        $return_array[$key][trim($values['define_value'])] = isset($data[(trim($values['file_value']))]) ? $data[(trim($values['file_value']))] : '';
                    }
                }
            }
        }
        return $return_array;
    }

    public function getSystemCategoryId($cat_name) {
        $catory_id = \Illuminate\Support\Facades\DB::table('categories')->where('type_code', 'service')->where('name', $cat_name)->first();
        if ($catory_id) {
            $categories_are = $catory_id->id;
        } else {
            $categories_are = '';
        }
        return $categories_are;
    }

    public function getSystemCategoryIds($product_categories) {
        $categories_are = array();
        $count_cats = 0;
        $cat_column = 0;
        for ($i = 2; $i < count($product_categories); $i++) {
            foreach ($product_categories[$i] as $cat_key => $cat_value) {
                if ($cat_key != "__rowNum__") {
                    if ($cat_column == 0) {
                        $cat_id = $cat_value;
                        $cat_column = 1;
                    } else {
                        $catory_id = \Illuminate\Support\Facades\DB::table('categories')->where('type_code', 'service')->where('name', $cat_value)->first();
                        if ($catory_id) {
                            $categories_are[$cat_id] = $catory_id->id;
                        } else {
                            $categories_are[$cat_id] = '';
                        }
                        $cat_column = 0;
                    }
                }
            }
            $count_cats++;
        }
        return $categories_are;
    }

    public function getMakerId($makerTitle, $user_id) {
        $makeInfo = \Illuminate\Support\Facades\DB::table('make')->select('id')->where('title', $makerTitle)->where('user_id', $user_id)->first();
        if ($makeInfo) {
            return $makeInfo->id;
        } else {
            return '';
        }
    }

    public function getServiceCategory($title, $user_id) {
        $makeInfo = \Illuminate\Support\Facades\DB::table('categories')->select('id')->where('name', $title)->where('user_id', $user_id)->first();
        if ($makeInfo) {
            return $makeInfo->id;
        } else {
            return '';
        }
    }

    public function loadFileContent(Request $request) {
        if ($request->has('path')) {
            $filepath = $request->input('path');
            $content = Excel::load(public_path() . "/assets/booking/" . $filepath)->get()->toArray();
            return array("status" => "200", "msg" => "Successfully parse", "file_content" => \GuzzleHttp\json_encode($content));
        } else {
            return array("status" => "210", "msg" => "Some thing went wrong please try later", "file_content" => []);
        }
    }

}
