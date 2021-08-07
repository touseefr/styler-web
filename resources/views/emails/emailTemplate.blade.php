<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Stylerzone Email Template</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css">
    </head>
    <body style="margin: 0;padding: 0; font-family: Arial, Helvetica, sans-serif;">
        <table style="border: none; table-layout: auto; width: 100%; max-width: 600px; margin: 0 auto" cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th colspan="2" style="background: url(http://app.stylerzone.com.au/images/email_template_img/banner.png) no-repeat center / cover; height: 220px; padding: 10px; text-align: left">
                        <a href="javascript:;">
                            <img src="http://app.stylerzone.com.au/images/email_template_img/SZ.png" style="max-width: 150px">
                        </a>
                        <h2 style="margin: 20px 0 0;">ONE PLATFORM,</h2>
                        <h2 style="color: #fff; margin: 0;text-shadow: 0 0 5px rgba(0,0,0,0.25);">COUNTLESS OPPORTUNITIES</h2>
                        <h2 style="color: #fff; margin: 0;text-shadow: 0 0 5px rgba(0,0,0,0.25);">FOR YOUR BEAUTY</h2>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2" style="padding: 10px;">
                        @yield('email_content')
                    </td>
                </tr>
            </tbody>
            <tfoot style="background: rgb(27,27,27); padding: 10px;color: #ffffff">
                <tr>
                    <td colspan="2" style="text-align: center; padding: 10px; font-size: 12px">
                        You are receiving this email advertisement because you registered with Stylerzone and agreed to receive emails from us regarding new features, events and special offers.
                    </td>
                </tr>
                <tr>

                    <td colspan="2" style="text-align: center; padding: 10px">
                        <a href="https://www.youtube.com/channel/UCNfKpQFLk1Lon5GXy2d3Wpw" style="display: inline-block;text-align: center; margin: 0 5px;">
                            <img src="http://app.stylerzone.com.au/images/email_template_img/youtube.png" style="max-width: 32px;border-radius: 100px;">
                        </a>
<!--                        <a href="javascript:;" style="display: inline-block; border-radius: 100px; text-align: center; margin: 0 5px;">
                            <img src="http://app.stylerzone.com.au/images/email_template_img/twitter.png" style="max-width: 32px;border-radius: 100px;">
                        </a>-->
                        <a href="https://www.facebook.com/stylerzoneau/" style="display: inline-block;text-align: center; margin: 0 5px;">
                            <img src="http://app.stylerzone.com.au/images/email_template_img/facebook.png" style="max-width: 32px;border-radius: 100px;">
                        </a>
                        <a href="https://www.linkedin.com/company/stylerzone/" style="display: inline-block; text-align: center; margin: 0 5px;">
                            <img src="http://app.stylerzone.com.au/images/email_template_img/linkedin.png" style="max-width: 32px;border-radius: 100px;">
                        </a>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center; padding: 10px;">
                        <!--<a href="javascript:;" style="color: #fff;font-size: 12px; text-decoration: none">Privacy</a>-->    
                        <!--                        |
                                                <a href="javascript:;" style="color: #fff;font-size: 12px; text-decoration: none">Unsubscribe</a>    -->
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 10px;">
                        <a href="javascript:;" style="color: #fff;font-size: 12px; text-decoration: none">
                            <img src="http://app.stylerzone.com.au/images/email_template_img/sz-footer.png" style="max-width: 72px;">
                        </a>
                    </td>
                </tr>
            </tfoot>
        </table>
    </body>
</html>
