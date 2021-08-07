<?php

namespace App\Models\Blog;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model {

    protected $table = 'admin_blog_post';
    
    
    public function scopeIsPublished($query, $type){
        return $type ? $query->where('post_status', $type) : $query;
    }

}
