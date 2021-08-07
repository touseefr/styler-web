@extends('frontend.layouts.account') 
@section('content')
@include('frontend.includes.hearderportion')
@foreach($records as $user)

<!------------START : Feature Banner Block------------>
<div class="profile">
    <div class="container">
        <div class="row">

            <?php
            if ($previous)
                $previous_link = "onclick=\"window.open('/profile?id=" . base64_encode($previous) . "','_self')\" ";
            else
                $previous_link = "";


            if ($next)
                $next_link = "onclick=\"window.open('/profile?id=" . base64_encode($next) . "','_self')\" ";
            else
                $next_link = "";
            ?>
            <div class="col-sm-12 col-md-12 clearfix py-15">
                <div class="pull-right ml-15" data-tooltip="Next" <?php echo!empty($previous_link) ? $previous_link : ''; ?>>
                    <div class="slider-button d-inlineB">
                        <i class="fas fa-angle-right"></i>
                    </div>
                </div>
                <div class="pull-right" data-tooltip="Previous" <?php echo!empty($next_link) ? $next_link : ''; ?>>
                    <div class="slider-button d-inlineB">
                        <i class="fas fa-angle-left"></i>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-2 service-provider-info1 text-center">
                @if($user->profilepic) @if(File::exists(public_path().$user->profilepic['path'].'thumb_small_'.$user->profilepic['name']))
                <img class="w100p" src="{{$user -> profilepic['path'].'thumb_small_'.$user -> profilepic['name']}}" alt="Profile image" />                    @else
                <img class="w100p" src="images/user_pic.jpg" alt="Profile image" /> @endif @else
                <img class="w100p" src="images/user_pic.jpg" alt="Profile image" /> @endif
                <div class="profile-date mt-10px-imp">{{ date('M d Y', strtotime($user -> created_at))}}</div>
                <div class="profile-stars mt-10px-imp" ng-init="rate = {{$user -> rating}}">
                    <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating"
                                class="rating font-size-rating"></uib-rating>
                </div>
                @if(!Auth::id())
                <div widget-rating userto="{{$user -> id}}" userfrom="0" businesstitle="" /></div>
            @endif
            <div class="profile-review">{{ count($user -> ReviewTo)}} reviews</div>
            @if(Auth::id() && $user->id != Auth::id())
            <div widget-rating userto="{{$user -> id}}" userfrom="{{ Auth::id() }}" businesstitle="" /></div>
        @endif
    </div>
    <div class="col-sm-12 col-md-10">
        <h3 class="mt-0">{{$user -> name}} &nbsp; 
            @if($user->roles[0]->name=="JobSeeker" && !empty($user->userInfo))            
            <small><i class="fa fa-users"></i>{{$user -> userInfo -> jobtitle}}</small>
            @endif
        </h3>       
        <small><i class="fa fa-map-marker"></i> 
            <?php if ($user->userInfo) { ?>
                {{($user -> userInfo && isset($user -> userInfo -> suburb))?$user -> userInfo -> suburb:''.' '.
                            ($user -> userInfo && isset($user -> userInfo -> state))?$user -> userInfo -> state:''.' '.
                            ($user -> userInfo && isset($user -> userInfo -> postcode))?$user -> userInfo -> postcode:''}}
            <?php } else {
                echo "";
            } ?>
        </small><br>        
        @if($user->roles[0]->name=="JobSeeker")
        <div class="category mt-10">
                <?php if ($user->userInfo && $user->userInfo->cat_name) { ?>
                <ul>
                    <?php
                    $user_categories = GuzzleHttp\json_decode($user->userInfo->cat_name);
                    foreach ($user_categories as $cat) {
                        ?>
                        <li class="btn-primary px-10 round3p" style="cursor: default;">
                        <?php echo $cat; ?>
                        </li>
                <?php } ?>
                </ul>
<?php } ?>
        </div>
        @endif
        <br>
        <div class="clearfix mt-25"></div>
        <div class="clearfix border-bottom mt-25">
            <div class="pull-left">
                <h3 class="mt-0">About</h3>
            </div>
            <div class="pull-right" ng-app="BeautyCollective.Core">
                @if(Auth::check() && $user->id != Auth::user()->id)
                @if($show_more_button==1  && Auth::user()->roles[0]->name!='JobSeeker' && Auth::user()->roles[0]->name!='Individual')
                <div class="dropdown" ng-controller="ApplicantSelectedProfile as applicationingCtrl" style="display:inline;">
                    <a href="#" data-toggle="dropdown" class="dropdown-toggle btn btn-primary btn-sm">More<b class="caret"></b></a>
                    <ul class="dropdown-menu">                   
                        <li><a href="#" ng-click="applicationingCtrl.shortListCandidate('{{$app_id}}', '2')">Shortlist</a></li>
                        <li><a href="#" ng-click="applicationingCtrl.shortListCandidate('{{$app_id}}', '3')">Call For Interview</a></li>
                        <li><a href="#" ng-click="applicationingCtrl.shortListCandidate('{{$app_id}}', '4')">Rejected</a></li>                                                                     
                    </ul>
                </div>            
                @endif
                @if($user->roles[0]->name=="JobSeeker")
                <?php
                if ($user->userMetaCoverletter() && isset($user->userMetaCoverletter()['resumeid'])) {
                    $cvInfo = $user->profileResume($user->userMetaCoverletter()['resumeid']);
                    ?>
                    <button type="button" class="btn btn-primary btn-sm mr-5" onclick="window.open('{{$cvInfo -> path.''.$cvInfo -> name}}')" >Download Resume</button>
<?php }
?>
                @endif
                <button type="button" class="btn btn-primary btn-sm mr-5" data-toggle="modal" data-target=".bs-example-modal-review">Write a Review</button>
                <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">Contact</button>                @endif
                <!-- Modal -->
                <div id="myModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Contact Us</h4>
                            </div>
                            <form id="frmContactMe">
                                <div class="modal-body">
                                    <div class="msgStatus" style="display: none;"></div>
                                    <div class="form-group">
                                        <label for="fromname">Name:</label>
                                        <input type="text" class="form-control" id="fromname" name="fromname" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email address:</label>
                                        <input type="email" class="form-control" id="email" name="sendfrom" required>
                                        <input type="hidden" name="sendto" value="{{$user -> email}}" />
                                        <input type="hidden" name="sendtoid" value="{{$user -> id}}" />
                                    </div>
                                    <div class="form-group">
                                        <label for="comment">Messsage:</label>
                                        <textarea class="form-control" name="senderMsg" rows="5" id="comment" required></textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" id="btnSendMail" class="btn btn-default">Submit</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-10">
            <div class="col-sm-12 col-md-8">
                <ul class="candidate-info clearfix">
                    <li><i class="fa fa-phone mr-5 text-teal"></i><strong>Contact:</strong> {{($user->userInfo)?$user->userInfo->contact_number:''}}</li>
                    <li><i class="fa fa-envelope mr-5 text-teal"></i><strong>Email:</strong> {{$user -> email}}</li>
                    @if($user->roles[0]->name=="JobSeeker" && $user->userInfo )
                    <li><i class="fa fa-money mr-5 text-teal"></i><strong>Exp Salary:</strong> ${{$user -> userInfo -> exp_salary}}</li>
                    <?php 
                        $job_type='';
                        if($user->userInfo->jobtype){
                            $jobss= \GuzzleHttp\json_decode($user->userInfo->jobtype);                            
                            $job_type=$jobss->name;                            
                        }
                    ?>
                    
                    <li><i class="fa fa-briefcase mr-5 text-teal"></i><strong>Job Type:</strong> {{$job_type}}</li>
                    @endif
                    <li><i class="fa fa-venus-double mr-5 text-teal"></i><strong>Gender:</strong> <span style="text-transform: capitalize;">{{($user->userInfo)?$user->userInfo->gender:''}}</span></li>
                </ul>
                @if($user->roles[0]->name=="JobSeeker")
                <div class="clearfix">
                    @if($user->userMetaCoverletter())
                    <h4>Cover Letter</h4>                                                                             
                    <p> {{$user -> userMetaCoverletter()['coverletter']}}</p>
                    @else
                    <p> </p>
                    @endif
                </div>
                @endif
            </div>
            <div class="col-sm-12 col-md-4">
                @if($user->userInfo && $user->userInfo ->youtube_video)
                <?php
                $videId = '';
                $videourl = explode('=', $user->userInfo->youtube_video);
                if ($videourl) {
                    $videId = $videourl[(count($videourl) - 1)];
                }
                ?> 
                <iframe width="100%" height="220" src="https://www.youtube.com/embed/{{$videId}}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>    
                @endif
            </div>
        </div>

    </div>
</div>
</div>
</div>
<!------------END : Feature Banner Block------------>


<div class="set_height_50px"></div>

<!------------START : Latest Reviews Block------------>
<latest-reviews user='{{$user -> id}}' bind-to-window="true"></latest-reviews>
<!------------END : Latest Reviews Block------------>
@endforeach
@endsection