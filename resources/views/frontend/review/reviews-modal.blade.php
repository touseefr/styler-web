<div class="modal fade" id="popup-1" role="dialog" style="background-color: rgb(0,0,0,0.5);position: fixed;top: 0">
        <div class="modal-dialog modal-lg">   
            <div class="modal-content">
                <div class="modal-header">
                        <button type="button" class="close modal_close" data-dismiss="modal">&times;</button>
                    <h2>Review Detail</h2>
                    <div class="msg" style="display:none;"></div>   
                </div>
                <p>&nbsp;</p>
                <div class="modal-body">
                <p id="review_detail"></p>
                <div class="clear"></div>
                <div class="reply_block col-md-12 col-ms-12 col-xs-12" style="display:none;">



                </div>
                <div class="clear"></div>
                <p>&nbsp;</p>



                <button class="btn-green-3"  id="write_reply" style=" display:none;" >Write a Reply</button>
                <div class="clear"></div>
                <div class="reply_comment" style=" display:none;margin-top: 10px;">
                    <div class="row">
                        <label class="col-sm-10 col-sm-offset-2" for="review"> 
                            <span>Your Reply :</span>
                        </label>
                        <div class="col-sm-7 col-sm-offset-2">
                            <input type="hidden" value=""  id="comment_id" name="comment_id"  />
                            <textarea id="reply_content" class="form-control ng-pristine ng-invalid ng-invalid-required ng-valid-minlength ng-touched"  placeholder="Your Reply" style="height: 120px;" ></textarea>               
                            <input type="hidden" value=""  id="to_user_id"  name="to_user_id" />
                            <input type="hidden" value=""  id="from-user-id"  name="from-user-id" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-10 col-sm-offset-2">
                    <button type="button" class="btn-green-1" id="btn-reply"  style="margin-top: 20px;margin-right: 15px;">Reply</button> </div>
                    </div>              
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-green-1 modal_close" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>