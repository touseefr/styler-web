@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Dear {{$NAME}}!,</b></p>
    <p>Thanks for joining Stylerzone! We’re absolutely thrilled you’ve decided to join our thriving beauty community of service providers and customers. You’ll have access to all the information need to make the best choice for your beauty needs.</p>
    <h4>Here’s a quick way to get you started:<h4>
            <p><b>Find the best beauty service providers</b></p>
            <p>Search for the best beauty business in your area. Read what others have to say about the business. Get new deals every day and contact as many providers as you like to learn more about their services. You can make a quick search <a href="{{$search_page}}">click here</a></p>                          
            <p><b>Make appointments</b></p>
            <p>Choose from a wide range of services for your every beauty and pampering need. Once you’re ready, make an appointment through your chosen provider’s page. You will be sent a confirmation of your appointment.</p>
            <p><b>Get rewards</b></p>
            <p>Enjoy rewards from Stylerzone! Watch out for exciting promotions and discounts from service providers.(coming soon )</p>
            <p>Ready to take Stylerzone for a spin? Sign in to your account now:<a href="{{$login_link}}">Login here</a></p>
            <p>Got questions? Please contact us on Support@stylerzone.com.au and we will get back to you.</p>
            <p>See you around!</p>
            <p>Stylerzone Team</p>
            <br />
            <br />    
            <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{$unsubscribe_me}}">click here.</a></p>                                                
            </div>
            @endsection