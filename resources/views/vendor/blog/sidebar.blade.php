<div id="sidebar" class="col-md-4 col-sm-4">
    <div id="sidebar-widgets" class="four columns">

        <div id="recent-posts-2" class="widget widget_recent_entries clearfix">
            <h4 class="mt-0">Articles recents</h4>
            <ul class="clearfix">               
                @foreach($posts as $post)
                <li class="no-flaot">
                    <a href="{{url('blog/'.$post->slug)}}">{{ $post->title }}</a>
                </li>
                @endforeach
            </ul>
        </div>
        <div id="categories-2" class="widget widget_categories clearfix mt-15">
            <h4>Categories</h4>
            <ul class="clearfix">
                @foreach($categories as $category)
                @if (isset($active_category) && $active_category == $category->id )
                <li class="active no-flaot"><a href="{{ url('blog/category/'.$category->id) }}">{{ $category->name }}</a></li>
                @else
                <li class="no-flaot"><a href="{{ url('blog/category/'.$category->id) }}"> {{ $category->name }}</a></li>
                @endif
                @endforeach
            </ul>
        </div>
    </div>
</div>