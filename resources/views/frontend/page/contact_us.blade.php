@extends('frontend.layouts.account') @section('content')

@include('frontend.includes.hearderportion')

<div class="clear"></div>
<section class="contactus_container" style="padding-bottom:0px;">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-sm-12">
                        @if(Session::has('message'))
                        <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
                        @endif

                        <h1>Contact Stylerzone </h1>
                        <div class="col-md-8">
                            <p>Join the Stylerzone community and get connected to beauty opportunities in your field. We are here to help you grow your business, or find what you are looking for, so feel free to send us a message with any queries you have. </p>
                        </div>
                        <div class="col-md-8">
                            <div class="well well-sm">
                                <form name="contact_us" action="" method="post">
                                    <input type="hidden" name="_token" value="{{csrf_token()}}" />
                                    <div class="row">

                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="name">
                                                    Name</label>
                                                <input type="text" name="name" class="form-control" id="name" placeholder="Enter name" required="required" />
                                            </div>
                                            <div class="form-group">
                                                <label for="email">
                                                    Email Address</label>
                                                <div class="input-group">
                                                    <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span>
                                                    </span>
                                                    <input name="email" type="email" class="form-control" id="email" placeholder="Enter email" required="required" /></div>
                                            </div>
                                            <div class="form-group">
                                                <label for="phone">
                                                    Phone Number</label>
                                                <div class="input-group">
                                                    <span class="input-group-addon"><span class="glyphicon glyphicon-phone"></span>
                                                    </span>
                                                    <input name="phone" type="text" class="form-control" id="phone" placeholder="Enter phone" required="required" /></div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="msg">
                                                    Message</label>
                                                <textarea name="message" id="message" class="form-control" rows="9" cols="25" required="required" placeholder="Message"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <button type="submit" class="btn btn-green-1 pull-right" id="btnContactUs">
                                                Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                        <div class="col-md-4">
                            <form>
                                <legend><span class="glyphicon glyphicon-globe"></span> Our office</legend>
                                <address>
                                    <strong><i class="fas fa-map-marker-alt text-teal mt-5"></i></strong>
                                    363-369 Warrigal Rd,
                                    <span>Cheltenham VIC 3192</span><br>
                                    <br />
                                    <abbr title="Phone">
                                        <i class="fas fa-phone text-teal mt-5"></i></abbr>
                                    (+1) 35 555 866
                                </address>
                                <address>
                                    <strong><i class="fas fa-at text-teal mt-5"></i></strong>
                                    <a style="color:#000;" href="mailto:#">info@stylerzone.com.au</a>
                                </address>
                            </form>
                        </div>


                    </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
    <div class="contactus_bottom_portion">
        <div class="container">
            <h2>What you can find on Stylerzone</h2>
            <hr />
            <br />
            <div class="row">
                <div class="col-md-4">
                    <div class="contactus_bottom_tabs">
                        <div class="offerDeals imagshow"></div>
                        <div class="tabsContent">
                            <h4>Deals and offers</h4>
                            <p>Find the nearest deals offered by top service providers in your area.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 contactus_bottom_tabs">
                    <div class="contactus_bottom_tabs">
                        <div class="business imagshow"></div>
                        <div class="tabsContent">
                            <h4>Businesses for sale:</h4>
                            <p>Looking to start a new business or want to sell your business? We do it all for you.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 contactus_bottom_tabs">
                    <div class="contactus_bottom_tabs">
                        <div class="education imagshow"></div>
                        <div class="tabsContent">
                            <h4>Schools and colleges</h4>
                            <p>Get the job you want with the right qualification. Browse through these courses.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="contactus_bottom_tabs">
                        <div class="apointment imagshow"></div>
                        <div class="tabsContent">
                            <h4>Service provider</h4>
                            <p>Select from a wide range of service providers in your area with the best reviews and book your next appointment.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 contactus_bottom_tabs">
                    <div class="contactus_bottom_tabs">
                        <div class="connection imagshow"></div>
                        <div class="tabsContent">
                            <h4>Distributor</h4>
                            <p>Browse through a variety of product offered by distributors and wholesalers to find the bestÂ deal that fits your business needs.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 contactus_bottom_tabs">
                    <div class="contactus_bottom_tabs">
                        <div class="postJob imagshow"></div>
                        <div class="tabsContent">
                            <h4>Jobs</h4>
                            <p>Find the nearest deals offered by top service providers in your area.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="contactus_bottom_tabs">
                        <div class="classifieds imagshow"></div>
                        <div class="tabsContent">
                            <h4>Classifieds</h4>
                            <p>Looking to redesign your business or sell your old equipment? One manâ€™s trash is another man's treasure â€“ check out these fabulous deals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection