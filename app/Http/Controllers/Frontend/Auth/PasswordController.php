<?php

namespace App\Http\Controllers\Frontend\Auth;

use App\Exceptions\GeneralException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Access\ChangePasswordRequest;
use App\Models\Access\User\User;
use App\Repositories\Frontend\User\UserContract;
use Exception;
use App\Jobs\StylerZoneEmails;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Class PasswordController
 * @package App\Http\Controllers\Auth
 */
class PasswordController extends Controller {


	use ResetsPasswords;

	/**
	 * @var string
	 */
	protected $redirectPath = "/account";

	/**
	 * @param Guard $auth
	 * @param PasswordBroker $passwords
	 * @param UserContract $user
	 */
	public function __construct(Guard $auth, PasswordBroker $passwords, UserContract $user) {
		$this->auth = $auth;
		$this->passwords = $passwords;
		$this->user = $user;
	}

	/**
	 * @return \Illuminate\View\View
	 */
	public function getEmail() {          
		return view('frontend.auth.password');
	}

	/**
	 * @param Request $request
	 * @return $this|\Illuminate\Http\RedirectResponse
	 * @throws GeneralException
	 */
	public function postEmail(Request $request) {
		//Make sure user is confirmed before resetting password.
		$user = User::where('email', $request->get('email'))->first();
		if ($user) {
			if ($user->confirmed == 0) {
				throw new GeneralException("Your account is not confirmed. Please click the confirmation link in your e-mail, or " . '<a href="' . route('account.confirm.resend', $user->id) . '">click here</a>' . " to resend the confirmation e-mail.");
			}
		} else {
			return redirect()->back()->withErrors(['email' => trans('This email does not exist.')]);
		}

		$this->validate($request, ['email' => 'required|email']);

        try {
            if (is_null($user)) {
                return PasswordBrokerContract::INVALID_USER;
            }

            // Once we have the reset token, we are ready to send the message out to this
            // user with a link to reset their password. We will then redirect back to
            // the current URI having nothing set in the session to indicate errors.
            $token = $token = app('auth.password.broker')->createToken($user);
            $to = $request->get('email');
            $datas = array('token' => $token, 'EMAIL' => $to, "id" => base64_encode($user->id));
            $this->dispatch((new StylerZoneEmails($datas, 'emails.password')));
//            Mail::send('emails.password', $datas, function ($message) use ($datas) {
//                $subject = "Choose a New Password";
//
//                $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM'));
//
//                $message->to($datas['EMAIL'])->subject($subject);
//            });

            return redirect()->back()->withFlashSuccess('Reset password link has been sent to your email.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['email' => trans($e->getMessage())]);
        }
    }

    /**
     * @param null $token
     * @return mixed
     */
    public function getReset($token = null) {
        if (is_null($token)) {
            throw new NotFoundHttpException;
        }

        return view('frontend.auth.reset')->withToken($token);
    }

    /**
     * @return \Illuminate\View\View
     */
    public function getChangePassword() {             
        return view('frontend.auth.change-password');
    }

    /**
     * @param ChangePasswordRequest $request
     * @return mixed
     */
    public function postChangePassword(ChangePasswordRequest $request) {               
        $this->user->changePassword($request->all());               
        return redirect('login');
//        return redirect()->route('auth.password.change')->withFlashSuccess(trans("strings.password_successfully_changed"));
    }
    
    
    public function postReset(Request $request)
    {
        $this->validate($request, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        $credentials = $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );

        $response = Password::reset($credentials, function ($user, $password) {
            $this->resetPassword($user, $password);
        });

        switch ($response) {
            case Password::PASSWORD_RESET:                
                return redirect($this->redirectPath);
            default:
                return redirect()->back()
                            ->withInput($request->only('email'))
                            ->withErrors(['email' => trans($response)]);
        }
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @param  string  $password
     * @return void
     */
    protected function resetPassword($user, $password)
    {
        $user->password = bcrypt($password);

        $user->save();

        $this->auth->login($user);       
    }

}
