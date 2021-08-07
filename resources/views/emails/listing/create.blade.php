@extends('emails.emailTemplate') 
@section('email_content')
@if($data['type']=='deal')
<div>
    <p><b>Hello, {{$business_name}} </b></p>
    <p>Your business sell ad has been successfully added to our Sale Listings Page. Now your ad is visible to thousands of beauty service providers, customers interested in buy. Expect inquiries from interested buyers!</p>			
    <p><a href="{{env('APP_URL').'/deals?id='.$list_id}}"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          > View your ad here</a></p>
    <p>Need help maximizing your listing’s exposure? Here are some quick tips:</p>

    <ul>
        <li>Speak directly to your target buyers.</li>
        <li>Include features and specifications.</li>
        <li>Add professional graphics or photos.</li>
        <li>Address possible objections to the offer.</li>
        <li>Don’t forget your call to action--tell them what you want them to do when they see your ad.</li>
        <li>Include your contact details.</li>        
    </ul>  
    <p>**Note** Your deal will be available starting from today till the next 30 days. Please note your listing will automatically expire after 30 days</p>
    <p>Got questions? Please contact us on <a href="mailto:<?php env('CONTACT_MAIL'); ?>"><?php env('CONTACT_MAIL'); ?></a> and we will get back to you.</p>  
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/'.$id }}">click here.</a></p>                                                
</div>
@elseif($data['type']=='job')
<div>
    <p><b>Hey,  {{$business_name}} </b></p>
    <p>Your job ad has been successfully added to our Job Listings page. We’d like to let you know that your listing is now visible to thousands of potential applicants who are searching for jobs on the Stylerzone website daily. Isn’t it exciting?</p>			
    <p><a href="{{env('APP_URL').'/jobs?id='.$list_id}}"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          > View your listing</a></p>
    <p>Need help maximizing your promotions? Here are quick tips to attract more customers with your offer:</p>
    <ul>
        <li>Write a specific and descriptive job title.</li>
        <li>Tell a story about your company</li>
        <li>Sell the position by showcasing what the candidate will do and the benefits that come with the job.</li>
        <li>Explain the application process.</li>
        <li>Tell them good reasons why they should apply for the job.</li>        
    </ul>    
    <p>**Note** Your job will be available starting from today till the next 30 days. Please note your listing will automatically expire after 30 days</p>
    <p>Got questions? Please contact us on <a href="mailto:<?php env('CONTACT_MAIL'); ?>"><?php env('CONTACT_MAIL'); ?></a> and we will get back to you.</p>  
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />    

    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/'.$id }}">click here.</a></p>                                                
</div>

@elseif($data['type']=='classifieds')
<div>
    <p><b>Hello,  {{$business_name}} </b></p>
    <p>Your product ad has been successfully added to our Sale Listings Page. Now your ad is visible to thousands of beauty service providers, customers, and traders who are looking for the particular product/s you’re selling. Expect inquiries from interested shoppers in the next few days!</p>			
    <p><a href="{{env('APP_URL').'/classifieds?id='.$list_id}}"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          > View your listing</a></p>
    <p>Need help maximizing your listing’s exposure? Here are some quick tips:</p>
    <ul>
        <li>Speak directly to your target buyer using the language they’d normally use.</li>
        <li>Focus on how the product would help the shopper.</li>
        <li>Include product specifications.</li>
        <li>Add professional graphics or photo.</li>
        <li>Don’t forget your call to action--tell them what you want them to do when they see your ad.</li>        
        <li>Include your contact details.</li>        
    </ul>    
    <p>**Note** Your Product will be available starting from today till the next 30 days. Please note your listing will automatically expire after 30 days</p>
    <p>Got questions? Please contact us on <a href="mailto:<?php env('CONTACT_MAIL'); ?>"><?php env('CONTACT_MAIL'); ?></a> and we will get back to you.</p>  
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/'.$id }}">click here.</a></p>                                                
</div>

@else
<div>
    <p><b>Hello ,  {{$business_name}} </b></p>
    <p>Your business sell ad has been successfully added to our Sale Listings Page. Now your ad is visible to thousands of beauty service providers, customers interested in buy. Expect inquiries from interested buyers!</p>			
    <p><a href="{{env('APP_URL').'/business?id='.$list_id}}"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          > View your ad here</a></p>
    
    
    <p>Need help maximizing your listing’s exposure? Here are some quick tips:</p>
    <ul>
        <li>Speak directly to your target buyer.</li>
        <li>Include features and specifications.</li>
        <li>Add professional graphics or photo.</li>
        <li>Don’t forget your call to action--tell them what you want them to do when they see your ad.</li>        
        <li>Include your contact details.</li>        
    </ul>    
    <p>**Note** Your business will be available starting from today till the next 30 days. Please note your listing will automatically expire after 30 days</p>
    <p>Got questions? Please contact us on <a href="mailto:<?php env('CONTACT_MAIL'); ?>"><?php env('CONTACT_MAIL'); ?></a> and we will get back to you.</p>  
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/'.$id }}">click here.</a></p>                                                
</div>
<!--else
<div>
    <p>Dear, {{$data['username']}}</p>
    <p>You have successfully created your {{$data['type']}} listing <b>{{$data['data']['title']}}</b>.</p>
    <p>click the link below for view.</p>
    <a href="{{$data['url']}}">{{$data['url']}}</a>
    <br/>
    <div>
        <b><p>Thanks & Regards,</p>
            <p>Stylerzone Team</p></b>
    </div>
</div>-->
@endif
@endsection
