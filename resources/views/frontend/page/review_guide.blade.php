@extends('frontend.layouts.account') @section('content')

    @include('frontend.includes.hearderportion')

<div class="clear"></div>
<section class="review-guideline-container">
    <div class="container">
        <div class="row" style="padding-bottom: 30px;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8 col-lg-9">
                            <div class="review-panel">

                                <h2>
                                    Review Guidelines - The Basics
                                </h2>
                                <br>
                                <h6>
                                    DO
                                </h6>
                                <ul class="alert alert-success-review danger-list">
                                    <li>
                                        Be clear, objective and detailed in expressing your honest opinion
                                    </li>
                                    <li>
                                        Check your review for spelling and grammar - make sure it communicates clearly
                                    </li>
                                    <li>
                                        Leave a review if you are a paying customer
                                    </li>
                                    <li>
                                        Disclose any personal connection or special treatment
                                    </li>
                                </ul>
                                <h6>
                                    DON'T
                                </h6>
                                <ul class="alert alert-danger-review danger-list">
                                    <li>
                                        Use offensive, discriminatory or abusive language
                                    </li>
                                    <li>
                                        Exaggerate the facts, use generalisations or leave inflammatory remarks
                                    </li>
                                    <li>
                                        Single out individuals (remember you’re reviewing the business)
                                    </li>
                                    <li>
                                        Advertise, spam, or mention other business names in your review
                                    </li>
                                </ul>
                                <p>
                                    To ensure the integrity of the Reviews, we use a range of verification measures (which we obviously can't explain in detail).
                                </p>
                                <p>
                                    Please only provide a review if you are a customer of the business - don't make us remove your review!
                                </p>
                                <p>
                                    <a target="_blank" href="fair-play-policy">Read our Fair Play Policy here.</a>
                                </p>

                            </div>
                        </div>

                </div>
            </div>
        </div>
    </div>
</section>
@endsection
