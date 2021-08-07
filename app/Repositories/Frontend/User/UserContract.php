<?php

namespace App\Repositories\Frontend\User;

/**
 * Interface UserContract
 * @package App\Repositories\User
 */
interface UserContract {

    /**
     * @param $data
     * @return mixed
     */
    public function create($data);

    /**
     * @param $data
     * @return mixed
     */
    public function findByUserNameOrCreate($data, $provider);

    /**
     * @param $provider
     * @param $providerData
     * @param $user
     * @return mixed
     */
    public function checkIfUserNeedsUpdating($provider, $providerData, $user);

    /**
     * @param $input
     * @return mixed
     */
    public function updateProfile($input);

    /**
     * @param $input
     * @return mixed
     */
    public function changePassword($input);

    /**
     * @param $token
     * @return mixed
     */
    public function confirmAccount($token);

    /**
     * @param $user
     * @return mixed
     */
    public function sendConfirmationEmail($user);

    /**
     * @param $id
     * @return mixed
     */
    public function findUserFullDetail($id);

    /**
     * @param $id
     * @return mixed
     */
    public function getUserJobs($id);

    /** search user Serviceprovider
     * @param $id
     * @return mixed
     */
    public function search($input, $tab);

    /** search user Jobseaker
     * @param $id
     * @return mixed
     */
    public function searchJobSeeker($input);

    /** search user | ServiceProvider and Distributer
     * @param $id
     * @return mixed
     */
    public function searchUser($input);

    /** get user detail
     * @param $id
     * @return mixed
     */
    public function getUserDetail($input);

    /** Short ListJob
     * @param $Array
     * @return mixed
     */
    public function getShortlistJob($input);

    /** Save Payments
     * @param $Array
     * @return mixed
     */
    public function savepaymentsDetail($input);

    /** Save Payments
     * @param $Array
     * @return mixed
     */
    public function getpackageDetail($input);

    /** Watch List
     * @param $Array
     * @return mixed
     */
    public function getUserWatchList($input);

    /** Send Email To Jobseeker
     * @param $Array
     * @return mixed
     */
    public function SendEmailToJobseeker($input);

    public function userEmailCheck($email);
}
