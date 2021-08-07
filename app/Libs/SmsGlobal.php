<?php

namespace App\Libs;

class SmsGlobal {

    /**
     * API key
     * @var string
     */
    protected $key;

    /**
     * API secret
     * @var string
     */
    protected $secret;

    /**
     * Constructor
     *
     * @param string $key    API key
     * @param string $secret API secret
     */
    public function __construct($key, $secret) {
        $this->key = (string) $key;
        $this->secret = (string) $secret;
    }

    public function getAuthorizationHeader(
    $method, $requestUri, $host, $port, $ext = ''
    ) {
        $timestamp = time();
        $nonce = md5(microtime() . mt_rand());

        $hash = $this->hashRequest(
                $timestamp, $nonce, $method, $requestUri, $host, $port, $ext
        );

        $header = 'MAC id="%s", ts="%s", nonce="%s", mac="%s"';
        $header = sprintf($header, $this->key, $timestamp, $nonce, $hash);

        return $header;
    }

    /**
     * Hashes a request using the API secret, for use in the Authorization
     * header
     *
     * @param int    $timestamp  Unix timestamp of request time
     * @param string $nonce      Random unique string
     * @param string $method     HTTP method (e.g. GET)
     * @param string $requestUri Request URI (e.g. /v1/sms/)
     * @param string $host       Hostname
     * @param int    $port       Port (e.g. 80, 443)
     * @param string $ext        Optional extra data. Not currently used
     * @return string
     */
    public function hashRequest(
    $timestamp, $nonce, $method, $requestUri, $host, $port = 80, $ext = ''
    ) {
        // Could use func_get_args() for this but it causes lint errors
        $string = array(
            $timestamp,
            $nonce,
            $method,
            $requestUri,
            $host,
            $port,
            $ext,
        );

        $string = sprintf("%s\n", implode("\n", $string));

        $hash = hash_hmac('sha256', $string, $this->secret, true);
        $hash = base64_encode($hash);

        return $hash;
    }

    public function sendRequest($method, $requestUri, $content = null) {
        try {
            $baseUrl = 'api.smsglobal.com';
            $header = $this->getAuthorizationHeader($method, $requestUri, $baseUrl, 443, '');
            $headers = [
                'Accept: application/json',
                'Authorization: ' . $header,
                'Content-Type: application/json',
            ];
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://' . $baseUrl . $requestUri);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($content));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
            $rawBody = curl_exec($ch);
            $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $header_len = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $header = substr($rawBody, 0, $header_len);
            $body = substr($rawBody, $header_len);
            curl_close($ch);
            if ($responseCode == 200 || $responseCode == 201 || $responseCode == 202 || $responseCode == 204) {                
                return array('status' => 'success', 'code' => $responseCode, 'data' => $body);
            } else {                
                $data = $this->errorsParsing(\GuzzleHttp\json_decode($body));                
                if ($data) {
                    return array('status' => 'error', 'code' => $responseCode, 'data' => $data);
                } else {
                    return array('status' => 'success', 'code' => $responseCode, 'data' => "");
                }
            }
        } catch (\Exception $e) {
            return array('status' => 'error', 'code' => $e->getCode(), 'data' => $e->getMessage());
        }
    }

    public function errorsParsing($body) {
        $errors = array();        
        foreach ($body->errors as $error_index => $error_value) {            
            if (strtolower($error_index) != "email") {
                $errors[] = $error_value->errors[0];
            }
        }
        return (!empty($errors))?$errors[0]:'';
    }

}
