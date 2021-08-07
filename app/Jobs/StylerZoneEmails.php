<?php

namespace App\Jobs;

use App\Podcast;
use App\AudioProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

class StylerZoneEmails implements ShouldQueue {

    use Dispatchable,
        InteractsWithQueue,
        Queueable,
        SerializesModels;
    /*
     * message_data email send data;
     */

    protected $message_data;
    /*
     * email_type which email to sent
     */
    protected $email_type;
    public $tries = 50;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($message_data, $email_type) {
        $this->message_data = $message_data;
        $this->email_type = $email_type;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {

        if ($this->email_type == 'emails.profileUrl') {
            /*
             * Auth controller,Post register,line number 158, registration process
             */
            $datas = $this->message_data;
            Mail::send('emails.profileUrl', $datas, function ($message) use ($datas) {
                $subject = "QRcode of " . $datas['BusinessName'];
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to(getenv('ADMIN_EMAIL'))->subject($subject);
            });
        } elseif ($this->email_type == 'emails.confirm') {
            $datas = $this->message_data['data'];
            $user = $this->message_data['user'];
            Mail::send('emails.confirm', $datas, function ($message) use ($user) {
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($user->email, $user->name)->subject("You’re Just a Click Away from Enjoying Stylerzone!");
            });
        } elseif ($this->email_type == 'emails.review_confirmation') {
            $datas = $this->message_data;
            Mail::send('emails.review_confirmation', $datas, function($message) use ($datas) {
                $subject = "Your review matters";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.review_confirmation_business') {
            $datas = $this->message_data;
            Mail::send('emails.review_confirmation_business', $datas, function($message) use ($datas) {
                $subject = "Guess what? You’ve got a new fab review!";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.review_bad_words') {
            $datas = $this->message_data;
            Mail::send('emails.review_bad_words', $datas, function($message) use ($datas) {
                $subject = 'Uh-oh! We can’t post your review.';
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.requestreview') {
            $datas = $this->message_data['data'];
            $user = $this->message_data['user'];
            Mail::send('emails.requestreview', $datas, function ($message) use ($user) {
                $message->from('info@createyour.com.au', getenv('ADMIN_FROM'));
                $message->to($user['customerEmail'], $user['customerEmail'])->subject('How was your service?');
            });
        } elseif ($this->email_type == 'emails.reportfake') {
            $email_data = $this->message_data;
            Mail::send('emails.reportfake', $email_data, function ($message) use ($email_data) {
                $subject = "Fake Review Reported";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($email_data['admin']['email'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.password_generated') {
            $datas = $this->message_data;
            Mail::send('emails.password_generated', $datas, function ($message) use ($datas) {
                $subject = "Password reset";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.password') {
            $datas = $this->message_data;
            Mail::send('emails.password', $datas, function ($message) use ($datas) {
                $subject = "Choose a New Password";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.notification_confirmation') {
            $data = $this->message_data;
            Mail::send('emails.notification_confirmation', ['data' => $data], function($message) use ($data) {
                $subject = 'NOTIFICATION CONFIRMATION | ' . $data['title'];
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($data['email_to'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.expiring_users') {
            $user = $this->message_data;
            Mail::send('emails.expiring_users', $user, function ($messages) use ($user) {
                $subject = "Let’s make it official";
                $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $messages->to($user['business_email'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.contact_us') {
            $data = $this->message_data;
            Mail::send('emails.contact_us', $data, function($send) use ($data) {
                $send->from(getenv('ADMIN_EMAIL'), $data['NAME']);
                $send->to('hitesh.iquincesoft@gmail.com')->subject($data['NAME'] . ' ' . getenv('CONTACT_US'));
            });
        } elseif ($this->email_type == 'emails.businessinfo') {
            $datas = $this->message_data;
            Mail::send('emails.businessinfo', $datas, function ($messages) use ($datas) {
                $subject = getenv('BUSINESS_INFO_UPDATED');
                $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $messages->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.business-report') {
            $datas = $this->message_data;
            Mail::send('emails.business-report', $datas, function ($message) use ($datas) {
                $subject = ucfirst($datas['type']) . " Reported";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.business-contact') {
            $datas = $this->message_data;
            Mail::send('emails.business-contact', $datas, function ($message) use ($datas) {
                $subject = "Business Query";
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($datas['EMAIL'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.applyjob') {
            $email_parameters = $this->message_data['email_parameters'];
            $servicesProvider = $this->message_data['servicesProvider'];
            $input = $this->message_data['input'];
            $user = $this->message_data['user'];
            Mail::send('emails.applyjob', $email_parameters, function ($message) use ($servicesProvider, $input, $user) {
                $message->from($user->email, getenv('ADMIN_FROM'));
                $pathToFile = public_path() . '/assets/user/resume/' . $input['resume'];
                $message->attach($pathToFile);
                $message->to($servicesProvider->email, $servicesProvider->name)->subject('This Candidate Might Be Your Next Rock Star Employee!');
            });
        } elseif ($this->email_type == 'emails.applyjob_applicant') {
            $email_parameters = $this->message_data['email_parameters'];
            $servicesProvider = $this->message_data['servicesProvider'];
            $input = $this->message_data['input'];
            $user = $this->message_data['user'];
            Mail::send('emails.applyjob_applicant', $email_parameters, function ($message) use ($servicesProvider, $input, $user) {
                $message->from($user->email, getenv('ADMIN_FROM'));
                $pathToFile = public_path() . '/assets/user/resume/' . $input['resume'];
                $message->attach($pathToFile);
                $message->to($user->email, $user->name)->subject("Your application was submitted to " . $servicesProvider->name . ".");
            });
        } elseif ($this->email_type == 'emails.subscription.subscribe_again_later') {
            $email_Detail = $this->message_data;
            Mail::send('emails.subscription.subscribe_again_later', $email_Detail, function ($messages) use ($email_Detail) {
                $subject = "Uh-oh! We failed to process your payment.";
                $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $messages->to($email_Detail['useremail'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.subscription.subscribe_cancel') {
            $email_Detail = $this->message_data;
            Mail::send('emails.subscription.subscribe_cancel', $email_Detail, function ($messages) use ($email_Detail) {
                $subject = "Your membership has been cancelled.";
                $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $messages->to($email_Detail['useremail'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.subscription.subscribe_sucessfully') {
            $email_Detail = $this->message_data;
            Mail::send('emails.subscription.subscribe_sucessfully', $email_Detail, function ($messages) use ($email_Detail) {
                $subject = "Amazing! Your Stylerzone Premier Subscription is All Set.";
                $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $messages->to($email_Detail['useremail'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.listing.create') {
            $Detail = $this->message_data;
            $data = $this->message_data['data'];

            Mail::send('emails.listing.create', $Detail, function($message) use ($data) {
                if ($data['type'] == 'deal') {
                    $subject = "Your Business sell ad Listing Has Been Successfully Created.";
                } elseif ($data['type'] == 'job') {
                    $subject = "Your job listing has been successfully created.";
                } elseif ($data['type'] == 'classifieds') {
                    $subject = "Your Product Ad Listing Has Been Successfully Created.";
                } else {
                    $subject = "Your Business sell ad Listing Has Been Successfully Created.";
                }
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
                $message->to($data['business_email'])->subject($subject);
            });
        } elseif ($this->email_type == 'emails.booking.deal_book_customer') {
            $bookDetail = $this->message_data;
            Mail::send('emails.booking.deal_book_customer', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail['customer_info']['uemail'], ($bookDetail['customer_info']['fname'] . " " . $bookDetail['customer_info']['lname']))->subject('Booking Confirmation');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.booking.deal_book_sp') {
            $bookDetail = $this->message_data;
            Mail::send('emails.booking.deal_book_sp', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail['sevrice_provider']['business_email'], $bookDetail['sevrice_provider']['business_email'])->subject('Booking Confirmation');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.booking.deal_booking_create_user') {
            $userDetail = $this->message_data;
            Mail::send('emails.booking.deal_booking_create_user', $userDetail, function ($message) use ($userDetail) {
                $message->to($userDetail['email'], $userDetail['name'])->subject('StylerZone Login Details');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.booking.services_booking_customer') {
            $bookDetail = $this->message_data;
            Mail::send('emails.booking.services_booking_customer', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail['customer_info']['email'], $bookDetail['customer_info']['name'])->subject(' Booking Confirmation');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.booking.services_booking_sp') {
            $bookDetail = $this->message_data;
            Mail::send('emails.booking.services_booking_sp', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail["sevrice_provider"]['business_email'], $bookDetail["sevrice_provider"]['business_name'])->subject('Booking Confirmation');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.subscription.customer_sms_purchase') {
            $bookDetail = $this->message_data;
            Mail::send('emails.subscription.customer_sms_purchase', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail["useremail"], $bookDetail['customer_name'])->subject('Purchase SMS Notification');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.subscription.admin_notify_sms_purchase') {
            $bookDetail = $this->message_data;
            Mail::send('emails.subscription.admin_notify_sms_purchase', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail["useremail"], $bookDetail['customer_name'])->subject('Purchase SMS Notification');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        } elseif ($this->email_type == 'emails.subscription.customer_notify_sms_purchase') {
            $bookDetail = $this->message_data;
            Mail::send('emails.subscription.customer_notify_sms_purchase', $bookDetail, function ($message) use ($bookDetail) {
                $message->to($bookDetail["email"], $bookDetail['customer'])->subject('Sms Package Active Successfully.');
                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
            });
        }
    }

}
