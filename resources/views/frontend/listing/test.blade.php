  <div class="row classified_contact">
            <div class="col-md-4 col-sm-8 col-xs-8 col-md-offset-1 col-xs-offset-2">
                <div class="row">
                    <div class="col-md-12  text-center">
                        <div class="cls_pic">
							@if($item->assets && count($item->assets))
								@if(File::exists(public_path().$item->assets[0]['path'].$item->assets[0]['name']))
									<img src="{{$item->assets[0]['path']}}{{$item->assets[0]['name']}}" alt="" class="center-block img-circle img-center" width="200" height="200" /> 
							     @else
									<img src="images/no-image.png" alt="" class="center-block img-circle img-center" width="200" height="200" /> 
								 @endif
							@else
								<img src="images/no-image.png" alt="" class="center-block img-circle img-center" width="200" height="200" />	 
							@endif
							
							@if($item->user->profilepic)
							@if(File::exists(public_path().$item->user->profilepic->path.$item->user->profilepic->name))
									<span>
										<img src="{{$item->user->profilepic->path}}{{$item->user->profilepic->name}}" class="center-block img-circle img-center" width="118" height="118" /></span> 
								@else
									<span>
										<img src="images/user_pic.jpg" class="center-block img-circle img-center" width="118" height="118" /></span>  
								 @endif
							@endif 
							@if(Auth::check())
                            <addto-watch id="{{$item->id}}" type="Deal"></addto-watch>
                            @else {!! link_to('auth/login', 'Watch', array("class"=>'green_watch')) !!} @endif
                        </div>
                    </div>
                </div>
                <div class="row">
                    @if(count($item->assets))
                    <div class="col-md-12">
                        <span class="border_top photo_title padd_top_btm">Photos:</span>
                        <ul class="class_pic">
                            @foreach($item->assets as $asset)
								@if(File::exists(public_path().$asset->path.$asset->name))
									<li>
										<div class="thumbContainer">
											<div class="thumb" style="background-image:url({{$asset->path}}{{$asset->name}})">
											</div>
										</div>
									</li>
								@endif	
                            @endforeach
                        </ul>
                    </div>
                    @endif
                    @if(Auth::check())
                    <div class="col-md-12 contact_provid">
                        <label class="padd_top_btm contact" style="width: 100%">Contact Information</label>
                        <table class="table">
                                @if( isset($item->user->UserBusiness->business_name) && !empty($item->user->UserBusiness->business_name))
                                <tr>
                                    <th>Business Name</th>
                                    <td>{{ $item->user->UserBusiness->business_name }}</td>
                                </tr>
                                @endif @if( isset($item->user->UserBusiness->business_email) && !empty($item->user->UserBusiness->business_email) )
                                <tr>
                                    <th>Business Email</th>
                                    <td>{{ $item->user->UserBusiness->business_email }}</td>
                                </tr>
                                @endif @if( isset($item->user->UserBusiness->contact_number) && !empty($item->user->UserBusiness->contact_number))
                                <tr>
                                    <th>Contact Number</th>
                                    <td>{{ $item->user->UserBusiness->contact_number }}</td>
                                </tr>
                                @endif
                            </table>

                        @include('frontend.listing.emaildialog', array('item' => $item))
                    </div>
                    @endif
                </div>
            </div>
            <div class="col-md-6 col-sm-12">
                <div class="right_list text-right">
                    <h4 class="title_h4">{{ $item->title}}</h4>
                    <a href="profile?id={{$item->user->id}}" class="padd_top_btm service">{{$item->user->name}}</a>
                    <span>{{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans() }}</span> @if(isset($item->locations[0]))
                    <span>{{ $item->locations[0]->name}},{{ $item->locations[0]->state}}</span> @endif
                    @if($item->price !=='')
                    <span class="price">
                        <span class="original_price"><strike> ${{ $item->price }}</strike> {{ $item->discount }}%off</span>
                        ${{ $item->price - $item->price*$item->discount/100}}
                    </span>
                    @else
                        POA
                    @endif
                    <ul class="social_links">
                        <li>
                            <a href="#" socialshare socialshare-provider="facebook" socialshare-text="{{ $item->title}}" socialshare-type="feed" socialshare-via="229619774120606"  socialshare-description="{{ substr($item->description,0,100).'...' }}" socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" @if(isset($item->assets[0]))
                                socialshare-media="{{ url('/').$item->assets[0]->path}}{{$item->assets[0]->name}}"   @endif class="facebook">
                               </a>
                        </li>
                        <li>
                            <a href="#" socialshare socialshare-provider="twitter" socialshare-text="{{ $item->title}}" socialshare-hashtags="{{ $item->title}}" socialshare-url="{{     url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="twitter">
                            </a>
                        </li>
                        <li>
                            <a href="#" socialshare socialshare-provider="linkedin" socialshare-text="{{ $item->title}}" socialshare-description="{{ substr($item->description,0,200).'...' }}" socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="in_icon">
                            </a>
                        </li>
                        <li>
                            <a href="#" class="wifi"></a>
                        </li>
                        <li>
                            <a href="#" socialshare socialshare-provider="pinterest" socialshare-text="{{ $item->title}}" @if(isset($item->assets[0]))
                                socialshare-media="{{ url('/').$item->assets[0]->path}}{{$item->assets[0]->name}}"
                                @endif
                                socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?' . Request::getQueryString()) : '') }}" class="globe">
                                </a>
                        </li>
                    </ul>
                    <p>{{ $item->description}}</p>
                </div>
            </div>