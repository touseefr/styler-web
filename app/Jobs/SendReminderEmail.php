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
use zcrmsdk\crm\setup\restclient\ZCRMRestClient;
use zcrmsdk\crm\crud\ZCRMRecord;

class SendReminderEmail implements ShouldQueue
{

    use Dispatchable,
        InteractsWithQueue,
        Queueable,
        SerializesModels;

    public $tries = 2;
    protected $message_data;
    /*
     * email_type which email to sent
     */
    protected $email_type;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    { }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Mail::send('emails.test', ['user' => array()], function($messages) {
        //     $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
        //     $messages->to('asifnaveed2013@gmail.com')->subject("test queue job listerner..");
        // });
    }
}
