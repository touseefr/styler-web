@if(isset($bannerpath))
<div class="bannerUpload">
    <div class="uploadIcon">
        <img id="imgBanner" src="{{url($bannerpath)}}" alt="Banner image">
    </div>
    @if(Request::is('account'))    
    <form id="upload_form" enctype="multipart/form-data" method="post" class="m-0">
        <label class="uploadBtn">
            <div class="boxcontainer">
            <i class="fa fa-pencil text-white edit"></i>
            <div class="text-white textsize">Edit Image</div>
            </div>
            <input type="file" name="userbanner" id="userbanner" onchange="uploadFile()"><br>
            <progress ng-non-bindable id="progressBar" value="60" max="100" style="display:none;position: absolute;bottom: -13px;right: 0px;height: 10px;width: 120px;background-color: red !important;"></progress>
            <h6 id="status" style="display:none;"></h6>
            <p id="loaded_n_total" style="display:none;"></p>
        </label>
    </form>
    @endif
</div>

@else
<div class="banner gallery_banner">
    <!-- <img src="{{url('images/listing-pg-banner.png')}}" alt="Banner image"> -->
</div>

@endif
<style>
    progress[value] {-webkit-appearance: none;appearance: none;width: 250px;height: 20px;}
    progress[value]::-webkit-progress-value {
        background-image:
            -webkit-linear-gradient(-45deg, rgba(74,189,172,1) 50%, rgba(74,189,172,1) 50%, rgba(74,189,172,1) 80%, rgba(74,189,172,1) 80%),
            -webkit-linear-gradient(top, rgba(74, 189, 172, 1), rgba(245, 76, 78, 1)),
            -webkit-linear-gradient(left, #4abdac , #f54c4e);
        border-radius: 2px; 
        background-size: 35px 20px, 100% 100%, 100% 100%;
    }
</style>