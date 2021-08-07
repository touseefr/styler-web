<?php namespace App\Repositories\Frontend\Listing;

/**
 * Interface ListingContract
 * @package App\Repositories\Frontend\Listing
 */
interface ListingContract {

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 */
	public function findOrThrowException($id);

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function all($order_by = 'id', $sort = 'asc', $type ='');

	/**
	 * @param $per_page
	 * @param string $order_by
	 * @param string $sort
	 * @param $status
	 * @return \Illuminate\Pagination\Paginator
	 */
	public function paginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc');

	/**
	 * @param $input
	 * @return mixed
	 */
	public function create($input);

	/**
	 * @param $input
	 * @return mixed
	 */
	public function addbusiness($input);

	/**
	 * @param $id
	 * @param $input
	 * @param $roles
	 * @return mixed
	 */
	public function update($id, $input);


	/**
	 * @param $id
	 * @return mixed
	 */
	public function delete($id);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function restore($id);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function search($input,$type,$api);

	/**
	 * @param $input
	 * @return mixed
	 */
	public function getListingByTypePaginated($input,$type,$per_page);
	
	/**
	 * @param $input
	 * @return mixed
	 */
	public function getListingByType($type,$per_page);

	/**
	 * @param $input
	 * @return mixed
	 */
	public function getSimilarDeals($input,$type);


	/**
	 * @param $input
	 * @return mixed
	 */
	public function updateListingView($id,$userid);

	/**
	 * @param $input
	 * @return mixed
	 */
	public function activatejob($input);
        
        public function jobapplications($job_id);
        
        public function AllCourses();
        
        public function getJobGalleryImages($user_id);
        
        public function MarketplaceSearchByCat($per_page,$query,$status = 1, $order_by = 'id', $sort = 'asc');
}
