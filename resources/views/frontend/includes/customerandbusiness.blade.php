@if( !Auth::Check() || Auth::user()->roles[0]->name=="Individual" || Auth::user()->roles[0]->name=="JobSeeker" || Auth::user()->roles[0]->name=="Administrator" || Auth::user()->roles[0]->name=="Admin" )
<!------------START : Customer Guide Block------------>
<div class="customer-guide customersection">
    <div class="clearfix hidden-xs">
        <div class="pull-right">
        </div>
    </div>
    <div class="container">
        <div class="homeBusinessTabs">
            <ul class="nav nav-tabs">
                <li class="active svg-wrapper individual">
                    <a data-toggle="tab" href="#clients" class="client">Individual</a>
                    <svg height="50" width="99%" xmlns="http://www.w3.org/2000/svg" class="svg">
                        <rect class="shape" height="50" width="100%" fill="none" stroke="#ffcb0e" />
                    </svg>
                </li>
                <li class="svg-wrapper businessPlan">
                    <a data-toggle="tab" href="#freelance" class="freelance">Business</a>
                    <svg height="50" width="99%" xmlns="http://www.w3.org/2000/svg" class="svg">
                        <rect class="shape" height="50" width="100%"  fill="none" stroke="#4abdac"/>
                    </svg>
                </li>
            </ul>
            <div class="tab-content">
                <div id="clients" class="tab-pane fade in active">
                    <h3>Stylerzone Services for our Clients</h3>
                    <div class="row">
                        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 text-center">
                            <div class="customer-guide-link py-0">
                                <!-- Video Guide -->
                                <button class="btn-yellow-1" onclick="window.open('./auth/register?type=individual', '_self')">Create a FREE account Now</button>
                            </div>
                        </div>
                        <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 text-center posRelative">
                            <a class="icon-block" href="/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=">
                                <div class="findService"></div>
                                <span>Find a Service</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">Find a Service</h4>
                                            <p class="">Finding a service has never been this easy! At Stylerzone, you can browse from a wide range of service providers in your area and trust our review system to help you make the best choices.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="icon-block" href="/search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=">
                                <div class="booking"></div>
                                <span>Make a booking</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">Make a booking</h4>
                                            <p class="">Our smart booking system provides the simplest way to book your next service with your choice of salon or beauty professionals. Make a booking from any device and get confirmation in seconds.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="icon-block" href="/search?filter_for=&label=Service+Provider&location_address=&locations=&page=1&q=&rating=&searchFor=deal&sub_category==">
                                <div class="viewDeals"></div>
                                <span>view deals</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">view deals</h4>
                                            <p class="">Looking for great deals in your area? We’ve got your back. Redeem deals straight away or save them for later.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="icon-block" href="/galleryall">
                                <div class="videoGuideGallery"></div>
                                <span>gallery</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">gallery</h4>
                                            <p class=""> Be inspired by our wide range of images uploaded by our beauty partners. Let our gallery help you choose your next style and book in with them in just a click.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <a class="icon-block" href="/search?filter_for=&label=Service+Provider&location_address=&locations=&page=1&q=&rating=&searchFor=job&sub_category=">
                                <div class="findJob"></div>
                                <span>Find Jobs</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">Find Jobs</h4>
                                            <p class=""> At Stylerzone we understand the difficulty of finding your next job. Get ready to be seen by hundreds of businesses who are looking for professionals like you to add to their team.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="icon-block" href="javascript:;">
                                <div class="findCourses"></div>
                                <span>FIND COURSES</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">FIND COURSES</h4>
                                            <p class="">We've got you the best courses and diplomas offered by professionals in the industry. Join now and choose from our list of school and colleges with direct access.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="icon-block" href="javascript:;">
                                <div class="actionService"></div>
                                <span>Auction a service</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">Auction a service</h4>
                                            <p class=""><strong>(Coming Soon)</strong> </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="icon-block" href="/marketplace">
                                <div class="rewards"></div>
                                <span>MARKETPLACE</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">MARKETPLACE</h4>
                                            <p class="">Have equipment to sell? List your items on our beauty industry marketplace and be seen by relevant buyers.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="row">
                            <div class="col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3">
                                <div class="heading-underline"></div>
                            </div>
                        </div>
                        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 text-center">

                            <div class="customer-guide-link">
                                <a class="video-link2" data-toggle="modal" data-target="#sz-video-customer" ><i class="fas fa-play-circle"></i>
                                    Watch Our Video Now</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="freelance" class="tab-pane fade">
                    <h3>Stylerzone Services for our Salon & Freelance Partner</h3>
                    <div class="row">
                        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 text-center">
                            <button class="btn-green-1" onclick="window.open('./auth/register?type=register', '_self')">Signup For Free Trial Today</button>
                        </div>
                        <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 text-center">
                            <div class="icon-block">
                                <div class="apointment"></div>
                                <span>Manage Appointment</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">MANAGE APPOINTMENTS</h4>
                                            <p class="">Our online booking system is designed to suit your business needs in the most simple and smart way. Plus, stay on track with real-time notifications.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="icon-block">
                                <div class="offerDeals"></div>
                                <span>offer deals</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">offer deals</h4>
                                            <p class="">Get more customers through your doors by creating deals. You stay in control, no third-party coupon companies - you work with the client directly.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="icon-block">
                                <div class="videoGallery"></div>
                                <span>Gallery</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">Gallery</h4>
                                            <p class="">Share your inspo photos and get exposure for your styles and brand.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="icon-block">
                                <div class="postJob"></div>
                                <span>post jobs</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">post jobs</h4>
                                            <p class="">Looking for staff? Use Stylerzone’s customised job board to find beauty industry job seekers who are ready to join your team.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="icon-block">
                                <div class="business"></div>
                                <span>business for sale</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">business for sale</h4>
                                            <p class=""> Stylerzone will help you present your business to potential buyers with the right images and videos to show it's true potential.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="icon-block">
                                <div class="connection"></div>
                                <span>CONNECT WITH DISTRIBUTORS</span>
                                <div class="boxInfo">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">CONNECT WITH DISTRIBUTORS</h4>
                                            <p class="">Stylerzone connects you to distributors and wholesalers via a quick and easy search. Save time, money and be the first to be notified about new and upcoming deals from distributors.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a class="icon-block" href="/marketplace">
                                <div class="classifieds"></div>
                                <span>MARKETPLACE</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">MARKETPLACE</h4>
                                            <p class="">Have equipment to sell? List your items on our beauty industry marketplace and be seen by relevant buyers.</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <div class="icon-block">
                                <div class="education"></div>
                                <span>education</span>
                                <div class="boxInfo box-right">
                                    <div class="media">
                                        <div class="media-body text-left">
                                            <h4 class="media-heading">education</h4>
                                            <p class=""> Are you and education provider wanting to get more students enrolled? Promote your course on Stylerzone to gain exposure to the right audience of potential students.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3">
                                <div class="heading-underline"></div>
                            </div>
                        </div>
                        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 text-center">
                            <div class="business-guide-link">
                                <a class="video-link" data-toggle="modal" data-target="#sz-video-business">
                                    <i class="fas fa-play-circle"></i>
                                    Watch Our Video Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!------------END : Customer Guide Block------------>
@endif
@if( !Auth::Check()  || Auth::user()->roles[0]->name=="ServiceProvider" || Auth::user()->roles[0]->name=="Distributor" || Auth::user()->roles[0]->name=="SchoolCollege" || Auth::user()->roles[0]->name=="Administrator" || Auth::user()->roles[0]->name=="Admin")
<div class="modal fade" id="sz-video-customer">
    <div class="modal-dialog modal-lg" style="height: 561px;">
        <div class="modal-content bmd-modalContent" style="background: transparent;box-shadow: none;border: none;">
            <div class="modal-body">
                <div class="close-button">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/b_ft2yifePw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>              </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<div class="modal fade" id="sz-video-business">
    <div class="modal-dialog modal-lg" style="height: 561px;">
        <div class="modal-content bmd-modalContent" style="background: transparent;box-shadow: none;border: none;">
            <div class="modal-body">
                <div class="close-button">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="embed-responsive embed-responsive-16by9">
                <iframe  src="https://www.youtube.com/embed/XwyI6cajHoA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
@endif
