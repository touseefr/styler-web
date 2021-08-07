@extends('frontend.layouts.business-register-layout') @section('content')  
<div class="container-fluid bg-teal">
  <div class="container py-20">
    <div class="row d-flex mb-0Force" style="background: transparent">
      <div class="col-xs-12 col-sm-9">
        <h1 class="text-white">Introduction to<br>Registering Your Business</h1>
      </div>
      <div class="col-xs-12 col-sm-3">
        <button type="button" class="btn btn-block bg-black font-double py-15"  onclick="javascript:window.open('/auth/register','_self')">Register Now</button>
      </div>
    </div>
  </div>
</div>
<div class="container my-25">
  <p>Stylerzone is a new professional online community for businesses in the beauty industry that helps business to show their business better .communicate, trade and find new potential customers in the area. </p>
  <p>Stylerzone has been created from a place of need to bring the beauty industry into a smart professional place to be found in a much easier way by saving time searching for the right service needed with best reviews, photos and detailed service provider page. </p>
  <p>We in stylerzone believe that to find the right business with the right services, you need more than just a quick search online and most of the time we find it very hard to match up the businesses to our needs so after hard work and many days and hours we came up with an amazing concept that works well for business and consumers to find exactly what they are after. </p>
  <p>We build a smart online booking system and app that will connect you in no time to your new customer.</p>
  <p>And we created around 8 services and more to come that will help you to control your business needs on day to day work. All so we going to bring most of the wholesalers. Distributors. Schools and colleges to stylerzone so you don’t need to spend hours of search to find them. With everything on top we all so use very smart technology to make your user experience on stylerzone the easier fun and professional that can be. The beauty industry need to be presented in a better way with better feel and look when you search online. And this is way we here save you time money and search.</p>
</div>
<div class="container-fluid bg-gray">
  <div class="container py-20">
    <h3 class="vine h1">Stylesone has divided the platform into 2 areas.<br>Business & Customer</h3>
  </div>
</div>
<div class="container-fluid px-0">
  <ul class="nav  nav-tabs nav-justified businessTabs">
    <li class="active"><a  data-toggle="tab" href="#business" class="no-round bg-teal h2 m-0">Business</a></li>
    <li><a data-toggle="tab" href="#customers"   class="no-round bg-yellow h2 m-0">Customers</a></li>
  </ul>
  <div class="tab-content business-tab-content container">
    <div id="business" class="tab-pane fade in active">
      <div class="display-flex mt-25">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_appointment.svg')}}" alt="MANAGE APPOINTMENTS" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">MANAGE APPOINTMENTS</h3>
          <p>In this section business owners can create as part of the premium membership the online booking system to aloud client to book direct to their salon any service from the app or the services provider page with a quick email confirmation to the business owner about another booking that been made .</p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_deals.svg')}}" alt="Offer Deals" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">OFFER DEALS</h3>
          <p>in this section the deals will show up for 30 days and you will be able to control the page and the price with the discount that you will give. No fees charge buy stylerzone .and you will be able to renew the deal again when its finish or start a new one. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_gallery.svg')}}" alt="Gallery" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">GALLERY</h3>
          <p>In this section we give you the option to show your photos and video art work in the best way you can. get likes and share it on social media .and all so by clicking on your photo client can get direct access to your profile. So be as creative as you can and take as much photos with your best camera and pot it on your page. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_jobs.svg')}}" alt="Jobs" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">POST A JOB</h3>
          <p>in this section you can find so many candidate that all so looking for you. What you need is to list a job on the job section and let the resumes come to your email. Or if there any new candidate that looking for a job in your area stylerzone will send you their resume to your email if you ask for. We are working hard to contact you as quick and easier as we can to your new staff members with a big data of candidates that will match your needs.</p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_sale.svg')}}" alt="Business for Sale" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">BUSINESS FOR SALE</h3>
          <p>we thought if we already going to have so many people looking on stylerzone way not to make it easy on you to sell your business with no headache from the middle man its mean no extra cost of what you paying as a member to list your business . We build this page very similar to the real thing in any business for sale website so you will done it in a very professional way and can have full control of it. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_connect.svg')}}" alt="Connect to Distribute" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">CONNECT TO DISTRIBUTORS</h3>
          <p>way not to make your life easier buy find what you need to your business and get every company that sale or trade in your industry on stylerzone and let you find them in no time. All so as a premium member you can get discount with some of our distributors. And find if there any sales happening at the moment. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_classifieds.svg')}}" alt="Classifieds" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">CLASSIFIEDS</h3>
          <p>premium members will be able to sale salon goods with the best price and discount.</p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/bus_learn.svg')}}" alt="Education" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">EDUCATION</h3>
          <p>We all love to learn new things to make our world more up to date and to gain more knowledge and experience in our filed . So what is the best way to do it if not good videos that will be done by talented people in their workplace and upload it on stylerzone in a very professional way on the education page .and every video will have to be check by us as we very particular in what we will show you. Only the best educational video will show on stylerzone and on the Facebook page. we all so want to get people with experience and influence in the beauty industry that will give there secretes and there tools to outer people about how to succeed in their field to make it better. Practice make it better. </p>
        </div>
      </div>
      <div class="mt-50 text-center">
        <button type="button" class="btn bg-black text-white font-double px-50 py-15"  onclick="javascript:window.open('/auth/register','_self')">Register Now</button>
      </div>
    </div>
    <div id="customers" class="tab-pane fade">
      <div class="display-flex mt-25">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_service.svg')}}" alt="Find a Service" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Find a Service</h3>
          <p>In this section business owners can create as part of the premium membership the online booking system to aloud client to book direct to their salon any service from the app or the services provider page with a quick email confirmation to the business owner about another booking that been made .</p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_booking.svg')}}" alt="Make a Booking" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Make a Booking</h3>
          <p>in this section the deals will show up for 30 days and you will be able to control the page and the price with the discount that you will give. No fees charge buy stylerzone .and you will be able to renew the deal again when its finish or start a new one. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_deals.svg')}}" alt="Deals" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Deals</h3>
          <p>In this section we give you the option to show your photos and video art work in the best way you can. get likes and share it on social media .and all so by clicking on your photo client can get direct access to your profile. So be as creative as you can and take as much photos with your best camera and pot it on your page. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_gallery.svg')}}" alt="Gallery" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Gallery</h3>
          <p>in this section you can find so many candidate that all so looking for you. What you need is to list a job on the job section and let the resumes come to your email. Or if there any new candidate that looking for a job in your area stylerzone will send you their resume to your email if you ask for. We are working hard to contact you as quick and easier as we can to your new staff members with a big data of candidates that will match your needs.</p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_jobs.svg')}}" alt="Find Jobs" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Find Jobs</h3>
          <p>we thought if we already going to have so many people looking on stylerzone way not to make it easy on you to sell your business with no headache from the middle man its mean no extra cost of what you paying as a member to list your business . We build this page very similar to the real thing in any business for sale website so you will done it in a very professional way and can have full control of it. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_courses.svg')}}" alt="Find Courses" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Find Courses</h3>
          <p>way not to make your life easier buy find what you need to your business and get every company that sale or trade in your industry on stylerzone and let you find them in no time. All so as a premium member you can get discount with some of our distributors. And find if there any sales happening at the moment. </p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_auction.svg')}}" alt="Auction a Service" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Auction a Service</h3>
          <p>premium members will be able to sale salon goods with the best price and discount.</p>
        </div>
      </div>
      <div class="display-flex">
        <div class="p-15">
          <img src="{{url('new_assets/images/cust_deals.svg')}}" alt="Rewards" class=""/>
        </div>
        <div class="border-bottom ml-20">
          <h3 class="mb-20">Rewards</h3>
          <p>We all love to learn new things to make our world more up to date and to gain more knowledge and experience in our filed . So what is the best way to do it if not good videos that will be done by talented people in their workplace and upload it on stylerzone in a very professional way on the education page .and every video will have to be check by us as we very particular in what we will show you. Only the best educational video will show on stylerzone and on the Facebook page. we all so want to get people with experience and influence in the beauty industry that will give there secretes and there tools to outer people about how to succeed in their field to make it better. Practice make it better. </p>
        </div>
      </div>
      <div class="mt-50 text-center">
          <button type="button" class="btn bg-black text-white font-double px-50 py-15" onclick="javascript:window.open('/auth/register','_self')">Register Now</button>
      </div>
    </div>
  </div>
</div>
<div class="container-fluid pt-50 pb-50 mt-50" style="background: #dfe4e8">
  <div class="container">
    <h2 class="vine">Your Stylerzone Profile Page</h2>
    <p class="mt-50">This is the very important part of the website as we called it the brain.</p>
    <p>In stylerzone we work and still working around the clock to make the user experience on stylerzone very easier and fun. So on your profile page we did our best to provide everything that your business need to look and run in the most professional way you can. It’s very important that you will do your best to implement as much details as you can on your profile business page as this is what people that coming to your page will see.</p>
    <p>Start with a good introduction about your business. And then photos. Videos. You’re Services. The team profile. Opening hours .the brands in your salon. With the right business details. Address. Phone number. Email. Social media like Facebook Instagram and more your chance to get more customer through the door are better.</p>
    <p>we all so add at the bottom of your page a button that you can ask anything that you want and we will respond as quick as we can with the right answer for you.</p>
    <p>At stylerzone we here for you with the best team for your business we will do our best to make everything in the most efficient and respected way to help you to get your business to the level you want to get.</p>
    <p>we happy to hear your thoughts about making stylerzone better for you and for everyone else. so lets start work our magic buy let everyone we know from our clients to our friend. family. and even our staff about stylerzone to go and write a review on your business and other business.</p>
    <div class="flex mt-50">
      <div class="badge bg-white text-darkGray round3p py-10 px-25 mr-10">Header Image</div>
      <div class="badge bg-white text-darkGray round3p py-10 px-25 mr-10">Business Name</div>
      <div class="badge bg-white text-darkGray round3p py-10 px-25 mr-10">Header Image</div>
      <div class="badge bg-white text-darkGray round3p py-10 px-25 mr-10">Video Uploads</div>
      <div class="badge bg-white text-darkGray round3p py-10 px-25 mr-10">Image Uploads</div>
      <div class="badge bg-white text-darkGray round3p py-10 px-25 mr-10">Review Section</div>
    </div>
    <div class="mt-50 mb-50">
      <img src="{{url('new_assets/images/screenshot.jpg')}}" alt="Not Found" class="img-responsive w100p">
    </div>
    <p>To search for the next services and deals and to create their personal profile page for free ...yes for free…...to be able claiming point back in to their account by booking services on stylerbook.recommending their friend to new business on the web. writing a review and sharing their experience on stylerzone. by doing this stylerzone will give a thank you gift vouchers for their choice to spend in one of stylerzone selected salon.</p>
    <p>And We wanna thank you to take your time and become stylerzone member by doing this you help our beautiful industry to have a better place to make a different and to show how good we are . it's just the beginning.</p>
    <p>thank you</p>
    <p>Stylerzone and the team</p>
    <div class="text-center mt-50">
      <button type="button" class="btn bg-black text-white font-double px-50 py-15"  onclick="javascript:window.open('/auth/register','_self')">Register Now</button>
    </div>
  </div>

</div>
@endsection

