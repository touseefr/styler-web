<script>
    function showModelBusiness() {
        $("#businessemail-popup").modal("show");
    }

</script>

{{-- <div class="col-md-3 contact_provid"> --}}
    {{--@if($item->user->UserBusiness->business_email && $item->user->id!=Auth::id())--}}
    @if($item->user->UserBusiness->business_email)
{{--         <a href="#" onclick="showModelBusiness()" title="Eamil"><img style="width: 40px;" src="images/contact-icon.png"></a> --}}

         <div class="btn btn-contact-email">
            <a href="#" onclick="showModelBusiness()" title="Eamil"><img src="images/email-24.png">Contact</a>
        </div>
    @endif
{{-- </div> --}}
    <div class="modal-dialog" id="businessemail-popup" style="display: none;margin-top: 7%" ng-controller="BusinessNewController">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Contact Owner</h4>
            </div>
            <div class="modal-body">
                <input type="hidden" name="email_to" id="email_to" value="{{$item->user->UserBusiness->business_email}}">
                <div>Your email: <input type="text" class="form-control" name="from_email_business" id="from_email_business"></div>
                <div>Message: <textarea class="form-control width580" name="email_message_business" id="email_message_business"></textarea> </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn bg-teal" ng-click="sendEmail()">Submit</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>

    </div>
