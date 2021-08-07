<article>
    <div class="row">
        <div class="col-md-12">
            <a href="{{url('blog/'.$post->slug)}}"><img src="{{ url('assets/posts/'.$post->image) }}" alt="" class="img-responsive"></a>
        </div>
        <div class="col-md-12">
            <div class="post-time">
                <span class="month"><?php echo date('M', strtotime($post->published_at)); ?></span>
                <span class="day"><?php echo date('d', strtotime($post->published_at)); ?></span>
            </div>
            <div class="entry-wrap">
                <div class="entry-title">
                    <h4><a href="{{url('blog/'.$post->slug)}}" title="Permalink to Et ta soeur, elle est artificielle ?" rel="bookmark">{{ $post->title }}</a></h4>
                </div>
                <div class="entry-meta">
                    <ul>
                        <li class="meta-date"><?php echo date('d F Y', strtotime($post->published_at)); ?></li>
                    </ul>
                </div>
                <div class="entry-content">
                    {!! strip_tags($post->chapo) !!}
                    <p> <a class="read-more-link read-more" href="{{url('blog/'.$post->slug)}}">read more</a> </p>
                </div>
            </div>
        </div>
    </div>
</article>

