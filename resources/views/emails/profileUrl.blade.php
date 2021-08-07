@extends('emails.emailTemplate')
@section('email_content')
<div>
        <p><b>Business Title : {{$BusinessName}}</b></p>
        <p><b>Profile url : </b>{{$profile_url}}</p>
        <p><b>Profile url Qrcode : </b></p>
        <img src="{!!$message->embedData(QrCode::format('png')->size(200)->generate($profile_url), 'QrCode.png', 'image/png')!!}">
        <br />
        <br />
</div>
@endsection