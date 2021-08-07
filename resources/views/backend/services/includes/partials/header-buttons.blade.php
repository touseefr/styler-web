<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a class="toolbar_btn" title="{{ trans('labels.services.services') }}" href="{!!route('backend.services.index')!!}">
                <i class="fa  fa-tags tool-icon"></i>
                <div>{{ trans('labels.services.services') }}</div>
            </a>
        </li>
        <li>
            <a href="{!!route('backend.services.create')!!}" class="toolbar_btn" title="{{ trans('labels.services.add_new_service') }}">
                <i class="fa fa-plus tool-icon"></i>
                <div>{{ trans('labels.services.add_new_service') }}</div>
            </a>
        </li>
        <li>
            <a class="toolbar_btn" href="#" title="Help">
                <i class="fa fa-question-circle tool-icon"></i>
                <div>Help</div>
            </a>
        </li>
    </ul>
</div>
<div class="clearfix"></div>
