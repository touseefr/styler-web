@include('frontend.review.reviews-modal')
{{-- {!! HTML::script("build/js/app-demo.js") !!} --}}
<style type="text/css">
    .footer-font-setting{
        font-size: 20px !important;
        font-weight: 700;
    }


</style>
<!--footer start from here-->
<footer class="footerback">
    <div class="container">
        <div class="row">
            <div class="col-sm-4 col-xs-12 footerleft margintop">
                <div class="footer_header heading7 footer-font-setting">STYLERZONE</div>
                <p>
                    Welcome to Stylerzone, your one stop online platform for everything beauty related. We’re here to connect you with the right services, people and opportunities – because we know how hard it can be to find what you’re looking for. Whether you’re a beauty business, a distributor, a job hunter, offering beauty education or you’re just looking for great service, we offer the best deals through a caring community and honest reviews.
                </p>
                <p><i class="fa fa-map-marker" aria-hidden="true"></i>363-369 Warrigal Rd, Cheltenham VIC 3192</p>
                <!-- <p><i class="fas fa-phone"></i> Phone : +1 35 555 866</p> -->
                <p><i class="fa fa-envelope"></i> E-mail : contact@stylerzone.com.au</p>

            </div>

            <div class="col-sm-8 col-xs-12">
                <div class="row">
                    <div class="col-sm-6 col-xs-12 margintop">
                        <div class="heading7 linkmargin m-l-0 footer-font-setting" style="float:left;width: 100%;margin-bottom: 15px;">
                            <span style="width: 50%;float:left;">LINKS</span>
                            <span style="width: 50%;float:left;">DOCUMENTS</span>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-sm-6 col-xs-6">
                                <ul class="footer-ul">
                                    <li><a href="../auth/login"> Log In</a></li>
                                    <li><a href="../aboutus"> About Us</a></li>
                                    <li><a href="../contact-us"> Contact Us</a></li>
                                    <li><a href="/pricing"> Pricing</a></li>
                                    <li><a href="../faq"> FAQ's</a></li>
                                    <li><a href="../blog"> Blog</a></li>
                                    <li><a href="/our_vission_value_and_success/#vission"> Our Vision</a></li>   
                                    
                                </ul>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6" style="margin-left: 0;padding-left: 0;">
                                <ul class="footer-ul">
                                    <li><a href="../privacy_policy"> Privacy Policy</a></li>
                                    <li><a href="../termsandconditions"> Terms & Conditions</a></li>
                                     <li><a href="../uploads/Guideline for customers.pdf">Support</a></li>
                                    <!-- <li><a href="/our_vission_value_and_success/#success"> Vision of Success</a></li>
                                    <li><a href="../privacy_policy"> Privacy Policy</a></li> -->
                                    <!--<li><a href="../termsandconditions"> Terms & Conditions</a></li>-->
                                    <!-- <li><a href="../copyrights"> Copyright</a></li>
                                    <li><a href="../support"> Support</a></li> -->
                                    <!--<li><a href="/pricing"> Pricing</a></li>-->
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xs-12">
                        <div class="footer-social-icons">
                            <div class="heading7 margintop followus footer-font-setting">FOLLOW US</div>
                            <ul class="social-icons">
                                <li><a href="https://www.facebook.com/stylerzoneau/" class="social-icon"> <i class="fab fa-facebook-f"></i></a></li>
                                <li><a href="https://www.instagram.com/stylerzone_beauty/" class="social-icon"> <i class="fab fa-twitter"></i></a></li>
                                <!-- <li><a href="" class="social-icon"> <i class="fas fa-rss"></i></a></li> -->
                                <li><a href="https://www.youtube.com/channel/UCNfKpQFLk1Lon5GXy2d3Wpw" class="social-icon"> <i class="fab fa-youtube"></i></a></li>
                                <li><a href="https://au.linkedin.com/company/stylerzone" class="social-icon"> <i class="fab fa-linkedin"></i></a></li>
                                <!-- <li><a href="" class="social-icon"> <i class="fab fa-google-plus"></i></a></li> -->
                            </ul>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xs-12">
                        <h3 class="heading7 margintop followus" style="margin-top: 40px;font-size: 16px;">Share your thoughts</h3>
                        <div class="col-sm-12 footer-subscribe padd0" style="margin-top: 0">
                            <div class="search-box">
                                <div class="clearfix">
                                    <div class="col-xs-8">
                                        <i class="fas fa-envelope pull-left"></i>
                                        <input type="text" placeholder="Email..." />
                                    </div>
                                    <div class="col-xs-4">
                                        <button type="submit" class="btn-green-1"> Join</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="row">
                      <div class="col-md-12 col-sm-12 col-xs-12 subscribeback">
                           <div class="col-sm-6 col-xs-12">
                             <div class="subscribetext">SUBSCRIBE:</div>
                           </div>
                           <div class="col-sm-6 col-xs-12">
                             <div class="subscribeform">
                                  <form class="subscribeformback">
                                    <i class="fa fa-envelope" style="padding-left: 5px;color: #dadada"></i>
                                    <input type="email" class="subscribe_email" placeholder="E-mail">
                                        <button  type="submit" class="subcribe_btn">Join</button>
                                </form>
                               </div>
                           </div>
                          </div>
                      </div>  
                </div> -->

            </div>
        </div>
    </div>
</footer>
<!--footer start from here-->
{{-- @include('frontend.includes.popup.review_confirm_popup') 
<div class="copyright">
  <div class="container">
    <div class="col-md-6 col-sm-6 paddleft0">
                    <p>© {{date('Y')}} - All Rights with BeautyCollective</p>                                
                                </div>
                                <div class="col-md-6 col-sm-6 paddright0">
                                    <ul class="bottom_ul">
                                        <li> <a href="../termsandconditions">Terms & Conditions</a></li>
                                        <li><a href="../legal">Legal</a></li>
                                        <li><a href="../support">Support</a></li>
                                    </ul>
                                </div>                        
                            </div>
                        </div> --}}