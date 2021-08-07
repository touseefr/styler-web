<?php

namespace App\Repositories\Frontend\Listing;

use App\Exceptions\GeneralException;
use App\Models\Access\User\User;
use App\Models\Categories\Categories;
use App\Models\Dealservices\DealServices;
use App\Models\Listing\Listing;
use App\Models\UserBusiness\UserBusiness;
use App\Models\UsersListingViews\UsersListingViews;
use App\Repositories\Frontend\Listing\ListingContract;
use Illuminate\Support\Facades\DB;
use Log;
use Request;

/**
 * Class EloquentListingRepository
 * @package App\Repositories\Listing
 */
class EloquentListingRepository implements ListingContract {

    /**
     * [__construct description]
     * @author
     */
    public function __construct() {

    }

    /**
     * @param $id
     * @param bool $withRoles
     * @return mixed
     * @throws GeneralException
     */
    public function findOrThrowException($id) {
        $list = Listing::with('locations')->with('assets')
                ->with('categories.parentcategories')->withTrashed()
                ->with('classifiedCategories')->withTrashed()
                ->with('listingMeta')
                ->with('listService')
                ->with('getAllCourses')
                ->with('getListingCourses.getcourses')
                ->find($id);
        if (!is_null($list)) {

            if (isset($list['listingMeta'])) {
                $meta_key_value = array();

                foreach ($list['listingMeta'] as $meta) {
                    if ($meta['meta_key'] == 'days_valid') {
                        $meta['meta_value'] = json_decode($meta['meta_value']);
                    }
                    $meta_key_value[$meta['meta_key']] = $meta['meta_value'];
                }
                unset($list['listingMeta']);
                $list['listing_meta'] = $meta_key_value;
            }
            if (isset($list->getListingCourses) && count($list->getListingCourses) > 0) {
                $services = array();
                foreach ($list->getListingCourses as $service) {
                    $courses[] = $service->getcourses;
                }
                unset($list->getListingCourses);
                $list['getListingCourses'] = $courses;
            }
            if (isset($list->listService) && count($list->listService) > 0) {
                $services = array();
                foreach ($list->listService as $service) {
                    $services[] = $service->service;
                }

                unset($list->listService);
                $list['listService'] = $services;
            }
            $list['description'] = htmlspecialchars_decode($list['description']);
            $list['discount'] = (int) $list['discount'];
            $list['area'] = (int) $list['area'];
            $list['turnover'] = (int) $list['turnover'];
            $list['rent'] = (int) $list['rent'];
            return $list;
        }
        throw new GeneralException('That listing does not exist.');
    }

    /**
     * @param string $order_by
     * @param string $sort
     * @return mixed
     */
    public function all($order_by = 'id', $sort = 'asc', $type = "") {
        return Listing::with('locations')->with('categories')->with('assets')->orderBy($order_by, $sort)->get();
    }

    public function alllistingcount($order_by = 'id', $sort = 'asc', $type = "") {
        return Listing::OfTypeIn(array('deal', 'classified', 'job', 'businessforsale'))->where('user_id', auth()->user()->id)->get()->count();
    }

    public function paginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc') {
        $q = Listing::query()
                ->with('locations')
                ->with('assets')
                ->with('categories')
                ->with('getAllCourses');
//        $q->OfTypeIn(array('deal', 'classified', 'job', 'businessforsale', 'gallery'));
        $q->OfTypeIn(array('deal', 'businessforsale', 'gallery'));
        return $q->where('user_id', auth()->user()->id)
                        ->orderBy($order_by, $sort)
                        ->paginate($per_page);

        /*
          ->where('status', $status)
          return Listing::with('locations')->with('assets')->with('categories')->where('status', $status)->where('user_id', auth()->user()->id)->orderBy($order_by, $sort)->paginate($per_page); */
    }

    public function update($id, $inputs) {

        if ($inputs['type'] === 'job') {
            $business_feature_stock = $inputs['industry'];
        } else {
            $business_feature_stock = array(
                "business_feature" => isset($inputs['business_feature']) ? $inputs['business_feature'] : '',
                "business_stock" => isset($inputs['business_stock']) ? $inputs['business_stock'] : ''
            );
        }
        $list = Listing::find($id);
        $list->title = $inputs['title'];
        $list->business_feature_stock = \GuzzleHttp\json_encode($business_feature_stock);
        $list->description = isset($inputs['description']) ? htmlspecialchars($inputs['description'], ENT_QUOTES) : '';
        $list->email = isset($inputs['email']) ? $inputs['email'] : '';
        $list->contact = (isset($inputs['contact']) && trim($inputs['contact']) != '') ? $inputs['contact'] : 0;
        $list->price = (isset($inputs['price']) && trim($inputs['price']) != '') ? $inputs['price'] : 0;
        $list->saving = (isset($inputs['saving']) && trim($inputs['saving']) != '') ? $inputs['saving'] : 0;
        $list->dealprice = (isset($inputs['price']) && trim($inputs['price']) != '') ? $inputs['price'] : 0;
        $list->discount = (isset($inputs['discount']) && trim($inputs['discount']) != '') ? $inputs['discount'] : 0;
        $list->expiry = isset($inputs['expire']) ? date('Y-m-d H:i:s', strtotime($inputs['expire'])) : date('Y-m-d H:i:s', strtotime("+30 days"));
        if ($inputs['type'] == 'classified') {
            $list->status = isset($inputs['classifiedActive']) ? $inputs['classifiedActive'] : 1;
            $list->visa_id = isset($inputs['isSold']) ? $inputs['isSold'] : 0;
        } else {
            $list->status = 1;
            $list->visa_id = isset($inputs['visa_id']) ? $inputs['visa_id'] : null;
        }

        $list->type = $inputs['type'];
        $list->is_show_phone = isset($inputs['is_show_phone']) ? $inputs['is_show_phone'] : 0;
        $list->turnover = isset($inputs['turnover']) ? $inputs['turnover'] : '';
        $list->rent = isset($inputs['rent']) ? $inputs['rent'] : '';
        $list->area = isset($inputs['area']) ? $inputs['area'] : '';
        $list->listing_video = isset($inputs['listing_video']) ? $inputs['listing_video'] : '';
        if (isset($inputs['sc_deal_duration']))
            $list->sc_deal_duration = isset($inputs['sc_deal_duration']) ? $inputs['sc_deal_duration'] : '';
        if (isset($inputs['sc_deal_course_type']))
            $list->sc_deal_course_type = isset($inputs['sc_deal_course_type']) ? $inputs['sc_deal_course_type'] : '';
        if (isset($inputs['sc_deal_enrolment']))
            $list->sc_deal_enrolment = isset($inputs['sc_deal_enrolment']) ? $inputs['sc_deal_enrolment'] : '';
        if (isset($inputs['sc_deal_total_tuition_hours']))
            $list->sc_deal_total_tuition_hours = isset($inputs['sc_deal_total_tuition_hours']) ? $inputs['sc_deal_total_tuition_hours'] : '';
        if (isset($inputs['sc_deal_delivery_mode']))
            $list->sc_deal_delivery_mode = isset($inputs['sc_deal_delivery_mode']) ? $inputs['sc_deal_delivery_mode'] : '';
        if (isset($inputs['sc_deal_intakes']))
            $list->sc_deal_intakes = isset($inputs['sc_deal_intakes']) ? $inputs['sc_deal_intakes'] : '';
        if (isset($inputs['sc_deal_prerequisite']))
            $list->sc_deal_prerequisite = isset($inputs['sc_deal_prerequisite']) ? $inputs['sc_deal_prerequisite'] : '';
        if (isset($inputs['sc_deal_assessment']))
            $list->sc_deal_assessment = isset($inputs['sc_deal_assessment']) ? $inputs['sc_deal_assessment'] : '';
        if (isset($inputs['sc_deal_requirements']))
            $list->sc_deal_requirements = isset($inputs['sc_deal_requirements']) ? $inputs['sc_deal_requirements'] : '';

        if (isset($inputs['gender_require'])) {
            $list->gender_require = $inputs['gender_require'];
        }
        if (isset($inputs['min_salary'])) {
            $list->min_salary = $inputs['min_salary'];
        }
        if (isset($inputs['max_salary'])) {
            $list->max_salary = $inputs['max_salary'];
        }
        if (isset($inputs['post_title'])) {
            $list->post_title = \GuzzleHttp\json_encode($inputs['post_title']);
        }

        if (!empty($inputs['suburb'])) {
            $list->suburb = $inputs['suburb'];
        }
        if (!empty($inputs['state'])) {
            $list->state = $inputs['state'];
        }

        if (!empty($inputs['postcode'])) {
            $list->postcode = $inputs['postcode'];
        }
        if (!empty($inputs['latitude'])) {
            $list->latitude = $inputs['latitude'];
        }
        if (!empty($inputs['longitude'])) {
            $list->longitude = $inputs['longitude'];
        }

        if (isset($inputs['status'])) {
            $list->status = $inputs['status'];
        }
        if (isset($inputs['services'])) {
            $deal_duration = $this->calculateDuration($inputs['services']);
            $list->duration = $deal_duration;
        }

        if (isset($inputs['job_summary'])) {
            $list->job_summary = $inputs['job_summary'];
        }
        if (isset($inputs['expected_salary'])) {
            $list->expected_salary = $inputs['expected_salary'];
        }
        $list->save();

        if (isset($inputs['courses']) && !empty($inputs['courses'])) {
            $this->saveCourses($inputs['courses'], $list->id);
        }
        if (isset($inputs['services']) && !empty($inputs['services'])) {
            $this->saveServices($inputs['services'], $list->id);
        }
        if (isset($inputs['listing_meta'])) {
            $listing_meta = $inputs['listing_meta'];
            $lastInsertedID = $list->id;

            if ($lastInsertedID) {
                DB::table('listing_meta')->where('listing_id', $lastInsertedID)->delete();

                foreach ($listing_meta as $key => $meta) {
                    $data = array();

                    $data['listing_id'] = $lastInsertedID;

                    $data['meta_key'] = $key;

                    if (is_array($meta)) {
                        $data['meta_value'] = json_encode($meta);
                    } else {
                        $data['meta_value'] = $meta;
                    }

                    \DB::table('listing_meta')->insert($data);
                }
            }
        }
        $list->Locations()->sync($inputs['locations']);

//        print_r($inputs);
//        if($inputs['type']=='job'){
//            $inputs['categories']=[$inputs['parentCategory']['id']];
//            $list->Categories()->sync($inputs['categories']);
//        }else{
        if ($inputs['type'] == "classified") {
            $data2 = array();
            $created_at = date('Y-m-d H:i:s');
            $updated_at = date('Y-m-d H:i:s');
            foreach ($inputs['categories'] as $key => $cat) {
                $cat_id = $cat['id'];
                $data2[] = ['listing_id' => $list->id, 'category_id' => $cat_id, 'created_at' => $created_at, 'updated_at' => $updated_at];
            }
            $inputs['categories'] = $data2;
            DB::table('listing_categories')->where('listing_id', $list->id)->delete();
            DB::table('listing_categories')->insert($data2);
//            $list->Categories()->delete();
//            print_r($list->id);
        } else {
            $list->Categories()->sync($inputs['categories']);
        }
//        }
//        exit;
        return $list;
    }

    public function activatejob($inputs) {

        $list = Listing::find($inputs['id']);
        if ($inputs['action']) {
            $list->status = '1';
            if (strtotime($list->expiry) < strtotime(date('Y-m-d'))) {
                $list->expiry = date('Y-m-d H:i:s', strtotime("+30 days"));
            }
            $mess = 'Job has been activated successfully.';
            $title = 'Job Activated';
        } else {
            $list->status = '0';
            $mess = 'Job has been de-activated successfully.';
            $title = 'Job De-Activated';
        }

        $list->save();
        return array('status' => 1, 'title' => $title, 'message' => $mess);
    }

    /**
     * @param $input
     * @param $roles
     * @param $permissions
     * @return bool
     * @throws GeneralException
     * @throws UserNeedsRolesException
     */
    public function create($input) {
        $list = new Listing();
        $data = $input['data'];
        $business_feature_stock = array();

        if (isset($data['title'])) {

            if ($input['type'] === 'job') {
                $business_feature_stock = $data['industry'];
            } else {
                $business_feature_stock = array(
                    "business_feature" => isset($data['business_feature']) ? $data['business_feature'] : '',
                    "business_stock" => isset($data['business_stock']) ? $data['business_stock'] : ''
                );
            }
            $list->title = $data['title'];
            $list->business_feature_stock = \GuzzleHttp\json_encode($business_feature_stock);
            $list->description = isset($data['description']) ? htmlspecialchars($data['description'], ENT_QUOTES) : '';
            $list->email = isset($data['email']) ? $data['email'] : '';
            $list->contact = (isset($data['contact']) && trim($data['contact']) != '') ? $data['contact'] : 0;
            $list->price = (isset($data['price']) && trim($data['price']) != '') ? $data['price'] : 0;
            $list->saving = (isset($data['saving']) && trim($data['saving']) != '') ? $data['saving'] : 0;
            $list->dealprice = (isset($data['price']) && trim($data['price']) != '') ? $data['price'] : 0;
            $list->discount = (isset($data['discount']) && trim($data['discount']) != '') ? $data['discount'] : 0;
            $list->expiry = isset($data['expire']) ? date('Y-m-d H:i:s', strtotime($data['expire'])) : date('Y-m-d H:i:s', strtotime("+30 days"));

            $list->type = $input['type'];
            $list->user_id = (isset($input['sp_id']))?$input['sp_id']:auth()->user()->id;
            $list->created_at = date('Y-m-d H:i:s');
            $list->updated_at = date('Y-m-d H:i:s');
            if ($input['type'] == 'classified') {
                $list->status = strval(isset($data['classifiedActive']) ? $data['classifiedActive'] : 1);
                $list->visa_id = isset($data['isSold']) ? $data['isSold'] : 0;
            } else {
                $list->status = strval(1);
                $list->visa_id = isset($data['visa_id']) ? $data['visa_id'] : null;
            }

            if (isset($data['gender_require'])) {
                $list->gender_require = $data['gender_require'];
            }
            if (isset($data['min_salary'])) {
                $list->min_salary = $data['min_salary'];
            }
            if (isset($data['max_salary'])) {
                $list->max_salary = $data['max_salary'];
            }
            if (isset($data['post_title'])) {
                $list->post_title = json_encode($data['post_title']);
            }

            if (isset($data['job_summary'])) {
                $list->job_summary = $data['job_summary'];
            }
            if (isset($data['expected_salary'])) {
                $list->expected_salary = $data['expected_salary'];
            }


            if (isset($data['status'])) {
                $list->status = strval($data['status']);
//                $list->status = strval(2);
            }

            $list->is_show_phone = isset($data['is_show_phone']) ? $data['is_show_phone'] : 0;
            $list->turnover = isset($data['turnover']) ? $data['turnover'] : '';
            $list->rent = isset($data['rent']) ? $data['rent'] : '';
            $list->area = isset($data['area']) ? $data['area'] : '';

            if (isset($data['sc_deal_duration']) && !empty($data['sc_deal_duration']))
                $list->sc_deal_duration = isset($data['sc_deal_duration']) ? $data['sc_deal_duration'] : '';
            if (isset($data['sc_deal_course_type']) && !empty($data['sc_deal_course_type']))
                $list->sc_deal_course_type = isset($data['sc_deal_course_type']) ? $data['sc_deal_course_type'] : '';
            if (isset($data['sc_deal_enrolment']) && !empty($data['sc_deal_enrolment']))
                $list->sc_deal_enrolment = isset($data['sc_deal_enrolment']) ? $data['sc_deal_enrolment'] : '';
            if (isset($data['sc_deal_total_tuition_hours']) && !empty($data['sc_deal_total_tuition_hours']))
                $list->sc_deal_total_tuition_hours = isset($data['sc_deal_total_tuition_hours']) ? $data['sc_deal_total_tuition_hours'] : '';
            if (isset($data['sc_deal_delivery_mode']) && !empty($data['sc_deal_delivery_mode']))
                $list->sc_deal_delivery_mode = isset($data['sc_deal_delivery_mode']) ? $data['sc_deal_delivery_mode'] : '';
            if (isset($data['sc_deal_intakes']) && !empty($data['sc_deal_intakes']))
                $list->sc_deal_intakes = isset($data['sc_deal_intakes']) ? $data['sc_deal_intakes'] : '';
            if (isset($data['sc_deal_prerequisite']) && !empty($data['sc_deal_prerequisite']))
                $list->sc_deal_prerequisite = isset($data['sc_deal_prerequisite']) ? $data['sc_deal_prerequisite'] : '';
            if (isset($data['sc_deal_assessment']) && !empty($data['sc_deal_assessment']))
                $list->sc_deal_assessment = isset($data['sc_deal_assessment']) ? $data['sc_deal_assessment'] : '';
            if (isset($data['sc_deal_requirements']) && !empty($data['sc_deal_requirements']))
                $list->sc_deal_requirements = isset($data['sc_deal_requirements']) ? $data['sc_deal_requirements'] : '';


            if (!empty($data['suburb'])) {
                $list->suburb = $data['suburb'];
            }
            if (!empty($data['state'])) {
                $list->state = $data['state'];
            }
            if (!empty($data['postcode'])) {
                $list->postcode = $data['postcode'];
            }
            if (!empty($data['latitude'])) {
                $list->latitude = $data['latitude'];
            }
            if (!empty($data['longitude'])) {
                $list->longitude = $data['longitude'];
            }
            if (isset($data['services'])) {
                $deal_duration = $this->calculateDuration($data['services']);
                $list->duration = $deal_duration;
            }
            $list->save();
            $list->Locations()->sync($data['locations']);
            /*
             * * insert other category if any
             */
            if (isset($data['other_subcat'])) {
                $cat_name = $data['other_subcat'];
                $type_code = $data['parentCategory']['type_code'];
                $parent = $data['parentCategory']['id'];
                $created_at = date('Y-m-d H:i:s');
                $updated_at = date('Y-m-d H:i:s');
                $data2 = ['name' => $cat_name, 'type_code' => $type_code, 'parent' => $parent, 'created_at' => $created_at, 'updated_at' => $updated_at];
                $lastInsertedID = DB::table('categories')->insertGetId($data2);
                $data['categories'] = array($lastInsertedID);
            }

            if (isset($data['flowFiles']) && count($data['flowFiles']) > 0) {
                $list->Assets()->attach(preg_replace('/\s\s+/', '', $data['flowFiles']));
            }
            if (isset($data['categories'])) {
                if (isset($data['categories'][0]) && !empty($data['categories'][0])) {

                    if ($input['type'] == "classified") {
                        $data2 = array();
                        $created_at = date('Y-m-d H:i:s');
                        $updated_at = date('Y-m-d H:i:s');
                        foreach ($data['categories'] as $key => $cat) {
                            $cat=(Array) $cat;
                            $cat_id = $cat['id'];
                            $data2[] = ['listing_id' => $list->id, 'category_id' => $cat_id, 'created_at' => $created_at, 'updated_at' => $updated_at];
                        }
                        DB::table('listing_categories')->where('listing_id', $list->id)->delete();
                        DB::table('listing_categories')->insert($data2);
                    } else {
                        $list->Categories()->sync($data['categories']);
                    }
                }
            }
            if (isset($data['listing_meta'])) {
                $listing_meta = $data['listing_meta'];
                $lastInsertedID = $list->id;

                if ($lastInsertedID) {
                    DB::table('listing_meta')->where('listing_id', $lastInsertedID)->delete();

                    foreach ($listing_meta as $key => $meta) {
                        $data1 = array();

                        $data1['listing_id'] = $lastInsertedID;

                        $data1['meta_key'] = $key;

                        if (is_array($meta)) {
                            $data1['meta_value'] = json_encode($meta);
                        } else {
                            if ($key == 'pulic_holidays') {
                                $data1['meta_value'] = (!empty($meta) ? 'true' : 'false');
                            } else {
                                $data1['meta_value'] = $meta;
                            }
                        }

                        \DB::table('listing_meta')->insert($data1);
                    }
                }
            }
            if (isset($data['services']) && !empty($data['services'])) {
                $this->saveServices($data['services'], $list->id);
            }
            if (isset($data['courses']) && !empty($data['courses'])) {
                $this->saveCourses($data['courses'], $list->id);
            }
            return $list;
        } else {
            return 'There was a problem creating this listing.Please try again.';
        }
    }

    public function calculateDuration($services) {
        $deal_duration = 0;
        foreach ($services as $service) {
            $deal_duration = $deal_duration + $service['duration'];
        }
        return $deal_duration;
    }

    public function saveServices($services, $listing_id) {
        $ser = array();
        foreach ($services as $service) {
            $ser[] = array(
                "deal_id" => $listing_id,
                "service_id" => $service['id'],
            );
        }
        DealServices::where('deal_id', $listing_id)->delete();
        DealServices::insert($ser);
    }

    public function saveCourses($services, $listing_id) {
        $ser = array();
        foreach ($services as $service) {
            $ser[] = array(
                "deal_id" => $listing_id,
                "course_id" => $service['id'],
            );
        }
        \App\Models\ListingCourses\ListingCourses::where('deal_id', $listing_id)->delete();
        \App\Models\ListingCourses\ListingCourses::insert($ser);
    }

    /**
     * @param $input
     * @return bool
     * @throws GeneralException
     * @throws UserNeedsRolesException
     */
    public function addbusiness($input) {
        $list = new Listing();
        $data = $input;
        if (isset($data['title'])) {
            $list->title = $data['title'];
            $list->type = $input['type'];
            $list->email = $input['email'];
            $list->user_id = $input['user_id'];
            $list->contact = $input['contact'];
            $list->description = '';
            $list->created_at = date('Y-m-d H:i:s');
            $list->updated_at = date('Y-m-d H:i:s');
            $list->expiry = date('Y-m-d H:i:s');
            $list->status = 1;
            $list->save();
            $list->Locations()->sync(array('id' => $data['locations']));
            return $list;
        } else {
            return 'There was a problem creating this listing. Please try again.';
        }
    }

    /**
     * @param $id
     * @return boolean|null
     * @throws GeneralException
     */
    public function delete($id) {
        $list = $this->findOrThrowException($id, true);
        //print_r($list);
        try {
            $list->delete();
        } catch (\Exception $e) {
            throw new GeneralException($e->getMessage());
        }
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function restore($id) {
        $list = $this->findOrThrowException($id);
        if ($list->restore()) {
            return true;
        }
        throw new GeneralException("There was a problem restoring this listing. Please try again.");
    }

    public function searchJobSeeker($input, $type, $api, $filters = array()) {
        $q = User::query()
                ->selectRaw('users.*,(SELECT COUNT(*) FROM  rating_reviews WHERE status=1 and `to_user_id`=users.id) as review_count')
                ->with('profilepic')
                ->with('UserInfo')
                ->with('roles')
                ->with('ReviewTo')
                ->with('UserMeta')
                ->where('name', 'like', "%{$input['q']}%");
        $roles = array('JobSeeker');
        $q->OfRolesin($roles);
        if ((isset($filters['sortBy'])) && (isset($filters['sortType']))) {
            if ($filters['sortBy'] == 'review') {
                $q->orderBy("review_count", $filters['sortType']);
            }
            if ($filters['sortBy'] == 'rating') {
                $q->orderBy("users.rating", $filters['sortType']);
            }
        }
        if (isset($filters['name']) && $filters['state'] && $filters['postcode']) {
            $q->whereHas('UserInfo', function ($q) use ($filters) {
                $q->where('suburb', $filters['name']);
            });
            $q->whereHas('UserInfo', function ($q) use ($filters) {
                $q->where('state', $filters['state']);
            });
            $q->whereHas('UserInfo', function ($q) use ($filters) {
                $q->where('postcode', $filters['postcode']);
            });
        }
        if (isset($input['q']) && trim($input['q']) != '') {
            $q->orWhereHas('UserInfo', function ($q2) use ($input) {
                $q2->where('cat_name', 'like', '%\"%' . $input['q'] . '%"%');
            });
        }





        $userdata = array();
        $records = $q->paginate(9)->toArray();
        foreach ($records['data'] as $index => $value) {
            $userdata[$index] = $value;
            foreach ($value['user_meta'] as $value) {

                if ($value['key'] == "coverletter_resume") {

                    $userdata[$index]['resuma'] = unserialize($value['value']);
                }
            }
        }
        $records['data'] = $userdata;
        return $records;
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function search($input, $type, $api, $filters = array()) {
        if ($type == "findcourses") {
            $type = "SchoolCollege";
        }
        $results = array();
        if ($api == 1) {
            $q = Categories::query()->groupBy('name');
            if (isset($input['q']) && trim($input['q']) != '') {
                $q->where('name', 'like', "%" . $input['q'] . "%");
            }
            $results = $q->get();
        }

        if ($type == 'Distributor' or $type == 'ServiceProvider' or $type == 'SchoolCollege' or $api == 1) {
            if (isset($input['searchWidget']) && $input['searchWidget'] == 1) {                
                $q = User::query()
                        ->selectRaw('users.*,(SELECT user_business.`state` FROM user_business WHERE user_business.`user_id`=users.`id`  ) AS state')
                        ->with('UserBusiness');
                $q->WhereHas('UserBusiness', function ($q2) use ($input) {
                    // $q2->Where('business_name', 'like', "%{$input['q']}%");
                    $q2->Where('business_name', 'like', $input['q']."%");
                //    $q2->Where('business_name', 'RLIKE',"[[:<:]]".$input['q']."[[:>:]]");
                
                });
            } else {
                $q = User::query()
                        ->selectRaw('users.*,(SELECT COUNT(*) FROM  rating_reviews WHERE status=1 and `to_user_id`=users.id) as review_count,(SELECT user_business.`state` FROM user_business WHERE user_business.`user_id`=users.`id`  ) AS state')
                        ->with('profilepic')
                        ->with('UserBusiness')
                        ->with('UserInfo')
                        ->with('roles')
                        ->with('ReviewTo');

                if (!empty($type)) {
                    $roles = array($type);
                } else {
                    $roles = array('Distributor', 'ServiceProvider');
                }

//                 if (isset($input['q']) && trim($input['q']) != '') {
//                     $q->WhereHas('UserBusiness', function ($q2) use ($input) {
//                         $q2->Where('business_name', 'like', "%{$input['q']}%");
//                     });
//                 }
                $q->OfRolesin($roles);
                $q->where('status', '=', 1);
//             if (isset($input['q']) && trim($input['q']) != '') {
// //               $q->where('name', 'like', "%{$input['q']}%");
//                 $q->orWhereHas('UserBusiness', function ($q2) use ($input) {
//                     $q2->whereHas('categories', function ($q3) use ($input) {
//                         $q3->where('name', 'like', "%{$input['q']}%");
//                     });
// //                    $q2->orWhere('business_name', 'like', "%{$input['q']}%");
//                 });
//             }
                // if (isset($input['sercat']) && trim($input['sercat']) != '') {
                //     $input['sercat'] = trim($input['sercat']);
                //     $q->WhereHas('UserBusiness', function ($q2) use ($input) {
                //         $q2->whereHas('categories', function ($q3) use ($input) {
                //             $q3->where('name', 'like', "%{$input['sercat']}%");
                //         });
                //     });
                // }

                if (isset($filters['zipcodes']) && $filters['zipcodes']) {
                    $q->whereHas('UserBusiness', function ($q) use ($filters) {
                        $q->where('postcode', $filters['zipcodes']);
                    });
                }

//            if (isset($filters['statess']) || isset($filters['names'])) {
//                if (isset($filters['statess'])) {
//                    $q->whereHas('UserBusiness', function ($q) use ($filters) {
//                        $q->where('state', $filters['statess']);
//                    });
//                } elseif (isset($filters['names'])) {
//                    $q->whereHas('UserBusiness', function ($q) use ($filters) {
//                        $q->where('suburb', $filters['names']);
//                    });
//                }
//            }

                if (isset($input['serarea']) || isset($input['serarea'])) {
                    $q->whereHas('UserBusiness', function($q) use($input) {
                        $q->where('business_suburb', 'like', $input['serarea']);
                    });
                }

                if (isset($filters['name']) && $filters['state'] && $filters['postcode']) {
                    $q->whereHas('UserBusiness', function ($q) use ($filters) {
                        $q->where('business_suburb', $filters['name']);
                    });
                    $q->whereHas('UserBusiness', function ($q) use ($filters) {
                        $q->where('state', $filters['state']);
                    });
                    $q->whereHas('UserBusiness', function ($q) use ($filters) {
                        $q->where('postcode', $filters['postcode']);
                    });
                }

                if ((isset($filters['sortBy'])) && (isset($filters['sortType']))) {
                    if ($filters['sortBy'] == 'review') {
                        $q->orderBy("review_count", $filters['sortType']);
                    }
                    if ($filters['sortBy'] == 'rating') {
                        $q->orderBy("users.rating", $filters['sortType']);
                    }
                }
                if (isset($input['q']) && trim($input['q']) != '') {
                    $q->orWhereHas('UserBusiness', function ($q2) use ($input) {
                        $q2->where('business_categories', 'like', '%\"name":\"%' . $input['q'] . '%\"%');
                    });
                }
                // echo $q->toSql();
                // exit;
            }

            if ($api) {
                $results2 = $q->get();
                $results_f = array();
                foreach ($results as $result) {
                    $results_f['Category'][] = array(
                        'title' => $result->name,
                        'id' => $result->id,
                        'originalObject' => array('categories' => array(0 => array('name' => 'category'))),
                    );
                }
                foreach ($results2->toArray() as $result) {
                    $results_f['Service Provider'][] = array(
                        'title' => $result['user_business']['business_name'],
                        'id' => $result['user_business']['user_id'],
                        'originalObject' => array('categories' => array(0 => array('name' => $type))),
                    );
                }
                return $results_f;
            } else {
//                print_r($filters);
               
                 if (isset($filters['state']) ) {
                    $q->orderByRaw("Field(state,'".$filters['state']."') DESC");
                 }      
//                  print_r($q->toSql());
//                exit;
                return $q->paginate(9)->toArray();
            }
        }
        $q = Listing::leftJoin('users', function ($join) {
                    $join->on('listing.user_id', '=', 'users.id');
                })
                ->selectRaw('listing.*,(SELECT COUNT(*) FROM  rating_reviews WHERE status=1 and `to_user_id`=listing.user_id ) as review_count')
                ->with('categories')
                ->with('assets')
                ->with('locations')
                ->with('user.profilepic')
                ->with('user.UserBusiness')
                ->with('user.ReviewTo');

        if (isset($input['q']) && trim($input['q']) != '') {
            $q->OfKeyword($input);
        }
        if (trim($type) != '') {
            $q->OfType($type);
            if ($type == 'job' || $type == 'deal') {
                $q->OfExpire();
            }
        }

        $q->OfStatus();

        if (isset($filters['zipcodes']) && $filters['zipcodes']) {
            $q->OfLocation($filters);
        }

        if (isset($filters['statess']) || isset($filters['names'])) {
            $q->OfLocation3($filters);
        }
        /*
         * * If full address found then continue below
         */

        if (isset($filters['name']) && $filters['state'] && $filters['postcode']) {
            $q->OfLocation2($filters);
        }

        if (isset($filters['subCategory']) && $filters['subCategory']) {
            $q->OfCategory($filters['subCategory']);
        }

        if ((isset($filters['sortBy'])) && (isset($filters['sortType']))) {
            if ($filters['sortBy'] == 'review') {
                $q->orderBy("review_count", $filters['sortType']);
            }
            if ($filters['sortBy'] == 'rating') {
                $q->orderBy("users.rating", $filters['sortType']);
            }
        }

        $results_f = array();

        if ($api) {
            foreach ($results as $result) {
                $results_f[] = array(
                    'title' => $result->name,
                    'originalObject' => array('categories' => array(0 => array('name' => $type))),
                );
            }

            $results3 = $q->get();
            foreach ($results3 as $result) {
                $results_f[] = array(
                    'title' => $result->title,
                    'originalObject' => array('categories' => array(0 => array('name' => $result->type))),
                );
            }
            return $results_f;
        } else {
            if ($filters['rating'] == 1) {
                $order = 'DESC';
            } else {
                $order = 'ASC';
            }
            return $q->paginate(3)->toArray();
        }
        throw new GeneralException("There was a problem restoring this listing. Please try again.");
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function getListingByTypePaginated($input, $type = '', $per_page) {
        $q = Listing::query()
                ->with('locations')
                ->with('assets')
                ->with('categories')
                ->with('categories.parentcategories')
                ->with('user.profilepic')
                ->with('user.UserBusiness.userBusinessSuburb')
                ->with('user.ReviewTo')
                ->with('getAllCourses');

        if ($type == "deal") {
            $q->with('listingMeta');
        }
        if ($type != '') {
            $q->OfType($type);
//            if ( $type == 'deal') {
//                $q->OfExpire();
//            }
        }
        if (isset($input['id']) && trim($input['id']) != '') {
            $q->OfId(base64_decode($input['id']));
        } else {
            if (isset($input['q']) && trim($input['q']) != '') {
                $q->OfKeyword($input);
            }
            $q->OfLocation($input);
        }
        return $q->simplePaginate($per_page)->appends($input);
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function getListingByCatPaginated($type = '', $input, $per_page) {
        $q = Listing::query()
                ->with('categories')
                ->with('locations')
                ->with('assets')
                ->with('user.profilepic')
                ->with('user.UserBusiness.userBusinessSuburb')
                ->with('user.ReviewTo');
        if ($type != '') {
            $q->OfType($type);

            if ($type == 'job' || $type == 'deal' || $type == 'classified') {
                $q->OfExpire();
            }
        }

        $q->OfStatus();

        $q->orderBy('id', 'desc');
        if (isset($input['p_id'])) {
            $q->where('user_id', $input['p_id']);
        }

        return $q->paginate($per_page)->appends($input);
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function getListingByType($type = '', $per_page, $user_id = '') {
        $q = Listing::query()
                ->with('categories')
                ->with('locations')
                ->with('assets')
                ->with('user.profilepic')
                ->with('user.UserBusiness.userBusinessSuburb');
        if ($type != '') {
            $q->OfType($type);
        }
        if ($user_id) {
            $q->where("user_id", $user_id);
        }
        $q->limit($per_page);
        $q->orderBy('id', 'desc');
        $q->where('expiry', '>', \DB::raw('NOW()'));
        return $q->paginate($per_page);
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function getSimilarDeals($input, $type = '') {
        $q = Listing::query()->with('assets');
        if ($type != '') {
            $q->OfType($type);
        }
        if (isset($input['q']) && trim($input['q']) != '') {
            $q->OfKeyword($input);
        }
        $q->OfLocation($input);
        $q->OfExpire();
        return $q->get();
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function updateListingView($id, $userid) {
        if (access()->id() && access()->id() == $userid) {
            return;
        }
        $q = Listing::query()
                ->with('listingViews')
                ->where('id', $id);
        if (access()->id()) {
            $q->OfUserView(access()->id());
            $data = array('user_id' => access()->id(), 'ipaddress' => Request::ip());
        } else {
            $q->OfIpaddress(Request::ip());
            $data = array('user_id' => null, 'ipaddress' => Request::ip());
        }
        $res = $q->get();
        if (!count($res)) {
            Listing::find($id)
                    ->listingViews()
                    ->save(new UsersListingViews($data));
        }
    }

    public function getJobDetails($user_id) {
        $q = Listing::query()
                ->with('categories')
                ->with('locations')
                ->with('assets')
                ->with('user.profilepic')
                ->with('user.UserBusiness.userBusinessSuburb')
                ->with('JobsApplication.applicantInfo')
                ->with('JobViews.applicantInfo')
                ->with('ShortListed.applicantInfo')
                ->with('JobInterview.applicantInfo')
                ->with('JobCompleted.applicantInfo')
                ->with('listingViews');
        $q->OfType('job');
        if ($user_id) {
            $q->where("user_id", $user_id);
        }
        $q->limit('9999');
        $q->orderBy('id', 'desc');
//        $q->where('expiry', '>', \DB::raw('NOW()'));
        return $q->paginate('9999');
    }

    public function jobapplications($job_id) {

    }

    public function AllCourses() {

    }

    public function getJobGalleryImages($user_id) {
        $user_meta = \DB::table('user_meta')->where(array('user_id' => $user_id, 'key' => 'usergallery'))->get();

        $images_info = array();

        if (!empty($user_meta)) {
            $assets_ids = unserialize($user_meta[0]->value);

            $images_info = array();
            foreach ($assets_ids as $cat_id => $catimages) {
                $cate_id = $cat_id;
                $cate_info = \DB::table('categories')->where(array('id' => $cate_id))->get();

                foreach ($catimages as $imgid => $imagtitle) {
                    $image_id = $imgid;
                    $image_title = $imagtitle['title'];
                    if (!empty($image_id)) {
                        $assets = \DB::table('assets')->where(array('id' => trim(strip_tags($image_id))))->get();


                        foreach ($assets as $asset) {
                            $images_info[] = array(
                                'id' => $asset->id,
                                'name' => $asset->name,
                                'path' => $asset->path,
                                'title' => $image_title,
                                'image_cat' => $cate_info[0]->name,
                                'cat_id' => $cate_id
                            );
                        }
                    }
                }
            }
        }
        return $images_info;
    }

    public function getListingByTypeWidget($type = '', $per_page, $user_id = '') {
        $q = Listing::query()
                ->with('categories')
                ->with('locations')
                ->with('assets')
                ->with('user.profilepic')
                ->with('user.UserBusiness.userBusinessSuburb');
        if ($type != '') {
            $q->OfType($type);
        }
        if ($user_id) {
            $q->where("user_id", $user_id);
        }
        $q->limit($per_page);
        $q->orderBy('id', 'desc');
        $q->where('expiry', '>', \DB::raw('NOW()'));
        $listing = $q->paginate($per_page);
        $assets = array();
        foreach ($listing as $list) {
            unset($list->assets);
            $list->assets = $this->getJobGalleryImages($list->user_id);
        }
        return $listing;
    }

    public function getMarketplace($per_page, $status = 1, $order_by = 'id', $sort = 'Desc') {
        $q = Listing::query()
                ->with('locations')
                ->with('assets')
                ->with('categories')
                ->with('getAllCourses');
        $q->OfTypeIn(array('classified'));
        return $q->where('user_id', auth()->user()->id)
                        ->orderBy($order_by, $sort)
                        ->paginate($per_page);
    }

    public function MarketplaceSearch($per_page, $query, $status = 1, $order_by = 'id', $sort = 'desc') {
        $q = Listing::query()
                ->with('locations')
                ->with('assets')
                ->with('user')
                ->with('user.profilepic')
                ->with('listingCategories');
        $q->OfTypeIn(array('classified'));
        $q->OfStatus($query);
        $q->OfExpire($query);
        if (isset($query['q']) && trim($query['q']) != '') {
            if ((isset($results) && count($results) > 0)) {
                $q->OfOrKeyword($query);
            } else {
                $q->OfKeyword($query);
            }
        }
        if (isset($results) && count($results) > 0) {
            $q->OfCategoryListing($results);
        }
        if ((isset($query['minv']) && strlen($query['minv']) > 0 ) && (isset($query['maxv']) && strlen($query['maxv']) > 0)) {
            $q->where('price', '>=', $query['minv']);
            $q->where('price', '<=', $query['maxv']);
        } else {
            if ((isset($query['minv']) && !empty($query['minv']))) {
                $q->where('price', '>=', $query['minv']);
            }
            if ((isset($query['maxv']) && !empty($query['maxv']))) {
                $q->where('price', '<=', $query['maxv']);
            }
        }
        if (isset($query['zipcodes']) && $query['zipcodes']) {
            $q->OfLocation($query);
        }
        if (isset($query['statess']) || isset($query['names'])) {
            $q->OfLocation3($query);
        }
        if (isset($query['name']) && isset($query['state']) && isset($query['postcode'])) {
            $q->OfLocation2($query);
        }
        if (isset($query['category']) && $query['category']) {
            $q->where(function($q) use($query) {
                $q->whereHas('listingCategories', function ($q) use ($query) {
                    $q->where('category_id', $query['category']);
                });
            });
        }
        // $q->get()[0];
        // print_r($q->get()[0]);
        // $collection=collect($q->get()[0]);
        // $q->get()[0]->pakistan='pkr';
        // $q->get()[0]->save();
        // $collection->put('pakistan','pkr');
        // $q->get()[0]=$collection;
        // print_r($q->get());
        // exit;
        return $q->orderBy($order_by, $sort)->paginate($per_page);
    }

    public function MarketplaceSearchByCat($per_page, $query, $status = 1, $order_by = 'id', $sort = 'asc') {
        $q = Categories::find('243')
                ->with('Listing')
                ->with('Listing.locations')
                ->with('Listing.assets')
                ->with('Listingcategories');
        print_r($q->get());
    }

    public function getServiceProviderByName($input) {
        $q = User::query()
                ->selectRaw('id,email')
                ->with('UserBusiness');
        $q->OfRolesin(array('ServiceProvider'));
        $q->where('status', '=', 1);
        $q->whereHas('UserBusiness', function ($q1) use ($input) {
            $q1->where('business_name', 'like', $input . '%');
        });
        $sps = $q->get()->toArray();
        $results_f=array();
        foreach ($sps as $result) {
            $results_f['Service Provider'][] = array(
                'name' => $result['user_business']['business_name'],
                'id' => base64_encode($result['user_business']['user_id']),
                'originalObject' => array('categories' => array()),
            );
        }
        return $results_f;
    }

}
