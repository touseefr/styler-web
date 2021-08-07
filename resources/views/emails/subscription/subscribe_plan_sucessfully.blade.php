@extends('emails.emailTemplate') 
@section('email_content')
		<div>
			<p>Thanks for upgrading your Stylerzone account! We’ve received your payment.</p>
			<p>View Subscription Details:</p>
                        <ul>
                            <li>Plan :{{$plan_name}}</li>
                            <li>Type :{{$type}}</li>                            
                            <li>Price :{{$price}}</li>                            
                        </ul>
			<p>We can’t wait for you to start enjoying Stylerzone as a Premier subscriber! This is going to be exciting. Here are some of the things you can do with your upgraded account:</p>
		
                        <p><b>Build your brand. </b></p>
                        <p>You will be able to promote the best of what you do through more videos and photos on your page. Customers can get to know you more, like and share your content with others, and give you more business image-boosting points and exposure as a result.</p>                          
                        <p><b>Get more customers. </b></p>
                        <p>Excite more customers by posting your latest promotions on our classifieds page. Happy customers can also give you glowing reviews on your business page, and that makes you more attractive to potential customers.</p>                          
                        <p><b>Make online booking easy.</b></p>
                        <p>We’ll make online booking easy for you and your customers. No need to learn how to use complicated online booking systems! You can do it here at Stylerzone and your customers can book directly through your business page.</p>
                        <p><b>Locate suppliers and distributors quickly. </b></p>
                        <p>Need to buy beauty supplies? Stylerzone is your one-stop-shop for your supplies. Connect with the best suppliers in the industry. </p>
                        <p><b>Increase your income</b></p>
                        <p>Have products to sell? You can also post them on our classifieds page. </p>
                        <p><b>Find the right people to grow your team. </b></p>
                        <p>Hiring is easier when you have all the beauty professionals in one website! Post your job openings on our classifieds page. We gather beauty professionals and they will find your ads on our job listings page.</p>
                        <p><b>Stay up-to-date with what’s new in the beauty industry</b></p>
                        <p>Stylerzone is a dynamic place of learning. We want you to stay updated and we do that with beauty industry reports, articles, and training videos. </p>
                        
                        <p><b>Stay up-to-date with what’s new in the beauty industry</b></p>
                        <p>Stylerzone is a dynamic place of learning. We want you to stay updated and we do that with beauty industry reports, articles, and training videos. </p>
                        <p>Browse our <a href="{{url("/faq")}}">Quick Guide and Frequently Asked Questions.</a></p>                        
                        <p>We’re here to help you. Contact us for any questions about your account at support@stylerzone.com.au.</p>                        
                        <p>Stylerzone Team</p>
                        <br />
                        <br />
                        <p>If you want to unsubscribe from Stylerzone, please <a href="{{url('deactivateMe/' . $id) }}">click here.</a></p>
                        <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{url('deactivateMe/' . $id) }}">click here.</a></p>                                                
		</div>
@endsection