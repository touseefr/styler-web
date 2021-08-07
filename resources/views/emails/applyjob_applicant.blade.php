@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Dear {{$user->name}}, </b></p>
    <p>Hooray! Your application was successfully sent to {{$business->name}}. We’re happy that you’re interested in the job. </p>			
    <p>You can view your application anytime by clicking on this link:</p>
    <p><a href="{{ env('APP_URL').'/account#/job/preferences'  }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          >Application</a></p>
    <p>Prepare your resume and portfolio. Get ready to be seen by hundreds of businesses who are looking for professionals like you to add to their team. Remember to:</p>
    <ul>
        <li>Add a professional photo.</li>
        <li>Make a detailed list of your work experience.</li>
        <li>Include details about your talents and key skills that will make you stand out</li>
        <li>List down trainings or educational qualifications</li>
        <li>Include references</li>
        <li>And don’t forget your contact details.</li>        
    </ul>    
    <p>You can keep looking for similar job openings by clicking on this link:</p>  
    <p><a href="{{ env('APP_URL').'/search?q=&label=job&searchFor=job&location_address'  }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          >Take Me to Stylerzone</a></p> 
    <p><b>What should you do next?</b></p>  
    <p>You will be contacted by the company if they find your qualifications suitable for the position and for their business. If so, they will reach out to learn more about:</p>  
    <ul>
        <li>You and your skills.</li>
        <li>What you’re looking for in a job </li>
        <li>What you’re looking for in a company.</li>        
    </ul>
    <p>If the job you applied for is not a good fit, we will also let you know through email as we know that searching for a job can sometimes be a frustrating experience and we don't want to keep you waiting.</p>  
    <p>Thanks for taking the time to apply and we wish you the best of luck with your job search!</p>  
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/'.$id }}">click here.</a></p>                                                
</div>
@endsection
