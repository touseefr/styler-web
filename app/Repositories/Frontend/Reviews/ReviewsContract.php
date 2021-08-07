<?php namespace App\Repositories\Frontend\Reviews;

/**
 * Interface ReviewsContract
 * @package App\Repositories\Frontend\Reviews
 */
interface ReviewsContract {

	/**
	 * @param $id
	 * @return mixed
	 */
	public function findOrThrowException($id);

	
	/**
	 * @param $input
	 * @return mixed
	 */
	public function create($input);

	/**
	 * @param $id
	 * @param $input
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
	 * @param $input
	 * @return mixed
	 */
	public function userReviews($input);

	/** save rating
	 * @param $input
	 * @return mixed
	 */
	public function saveRating($inputs);

	/** get user ratinf rating
	 * @param $id
	 * @return mixed
	 */
	public function getRating($id);
	
	/** get Latest Review
	 * @param $limit
	 * @return mixed
	 */
	public function getLatestReview($limit);
	
	/** Request Review
	 * @param $input
	 * @return mixed
	 */
	public function requestReview($inputs);


}