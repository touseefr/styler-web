@extends ('backend.layouts.master') @section ('title', 'Catrgories') @section('page-header')
<h1>
    {{ trans('menus.categories.main') }}
</h1>
@include('backend.categories.includes.partials.header-buttons') @endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.categories.index', trans('menus.categories.main')) !!}</li>
@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="panel-heading">
                <button type="button" class="btn btn-md btn-primary" onclick="createNode()" style="margin-bottom: 0;">
                    <i class="glyphicon glyphicon-plus"></i> Create</button>
                <button type="button" class="btn btn-warning btn-md" onclick="renameNode()">
                    <i class="glyphicon glyphicon-pencil"></i> Rename</button>
                <button type="button" class="btn btn-danger btn-md" onclick="deleteNode()">
                    <i class="glyphicon glyphicon-remove"></i> Delete</button>
            </div>
            <div class="box-body table-responsive ">
                <div id="categoriesTree"></div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
<script type="text/javascript">
var TREE = $('#categoriesTree')
    .jstree({
        'core': {
            'data': {
                'url': function(node) {
                    return node.id === '#' ?
                        '/admin/categories/all' :
                        '/admin/categories/all?parent=' + node.id;
                },
                'data': function(node) {
                    return {
                        'id': node.id,
                        'parent': node.parentCat,
                        'categorytype': node.type_code,
                        'categoryname': node.name,
                    };
                }
            },
            'check_callback': true,
            "animation": 1,
            "themes": {
                'name': 'proton',
                'responsive': true,
                'variant' : 'large'
            },
        },
        'force_text': true,
        'plugins': ['state', 'dnd', 'contextmenu']
    })
    .on('delete_node.jstree', function(e, data) {
        $.ajax({
                method: "DELETE",
                url: "/admin/categories/" + data.node.id,
            })
            .done(function(msg) {
                toastr.success("Category has  been deleted.");
            }).fail(function() {
                data.instance.refresh();
            });

    })
    .on('create_node.jstree', function(e, data) {
        var parent = data.instance.get_selected(data.node.parent)[0];

        $.post('/admin/categories', {
                'parent': data.node.parent,
                'position': data.position,
                'categorytype': parent.data.type_code,
                'categoryname': data.node.text,
            })
            .done(function(d) {
                data.instance.set_id(data.node, d.data.id);
                data.instance.get_selected(d.data.id).data = d.data;
                toastr.success("Category has  been created. Rename it if you want to do.");
            })
            .fail(function() {
                data.instance.refresh();
            });
    })
    .on('rename_node.jstree', function(e, data) {
        var parent = data.instance.get_selected(data.node.parent)[0];
        $.ajax({
                method: "PUT",
                url: "/admin/categories/" + data.node.id,
                data: {
                    'id': data.node.id,
                    'categoryname': data.text,
                    'parent': data.node.parent,
                    'categorytype': parent.data.type_code
                }
            })
            .done(function(msg) {
                toastr.success("Category has  been renamed.");
            }).fail(function() {
                data.instance.refresh();
            });


    })
    .on('move_node.jstree', function(e, data) {
        var parent = data.instance.get_selected(data.node.parent)[0];
        $.ajax({
                method: "PUT",
                url: "/admin/categories/" + data.node.id,
                data: {
                    'id': data.node.id,
                    'categoryname': data.node.text,
                    'categorytype': parent.data.type_code,
                    'parent': data.node.parent
                }
            })
            .done(function(msg) {}).fail(function() {
                data.instance.refresh();
                toastr.success("Category(s) has been  moved to selected target.");
            });

    })
    .on('copy_node.jstree', function(e, data) {
        /*var parent = data.instance.get_selected(data.node.parent)[0];
        $.ajax({
                method: "PUT",
                url: "/admin/categories/" + data.node.id,
                data: {
                    'id': data.original.id,
                    'categoryname': data.node.text,
                    'categorytype': parent.data.type_code,
                    'parent': data.node.parent
                }
            })
            .done(function(msg) {}).fail(function() {
                data.instance.refresh();
                toastr.success("Category(s) has been  moved to selected target.");
            });*/
    })
    .on('changed.jstree', function(e, data) {
        if (data && data.selected && data.selected.length) {
            $.get('/admin/categories/all?parent=' + data.selected.join(':'), function(d) {
                $('#data .default').html(d.content).show();
            });
        } else {
            $('#data .content').hide();
            $('#data .default').html('Select a file from the tree.').show();
        }
    });

function createNode() {
    var ref = $('#categoriesTree').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) {
        return false;
    }
    sel = sel[0];
    sel = ref.create_node(sel, {
        "type": "file"
    });
    if (sel) {
        ref.edit(sel);
    }
}

function renameNode() {
    var ref = $('#categoriesTree').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) {
        return false;
    }
    sel = sel[0];
    ref.edit(sel);
}

function deleteNode() {
    var ref = $('#categoriesTree').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) {
        return false;
    }
    ref.delete_node(sel);
}
</script>
@stop
