@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hello, {{$business->UserBusiness->business_name}}.</b></p>    
    <p>Congratulations! You have a new candidate to review for your (name of job) job post. You're making great progress in your recruiting efforts.</p>			
    <p>To quickly view the application, please click on the link below:</p>
    <p><a href="{{ env('APP_URL').'/profile?id='.$user_id  }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          >View Candidate</a></p>
    <p>You can also go through all your candidates for this job post by clicking on this link:</p>
    <p><a href="{{ env('APP_URL').'/account#/jobs/applications/appliedsall'  }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          >View All Candidates</a></p>

    <p>If you like to learn more about this candidate, please respond as quickly as you can to let him or her know about the next step of the hiring process.</p>  
    <p>We hope you’ll find the right person for the job very soon! Good luck!</p>    
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/'.$id }}">click here.</a></p>                                                
</div>
@endsection