<div class="row">
    <div class="state_icons">
        <div class="col-md-12 padd0">
            <ul>
                <li>
                 <?php if(app('request')->input('searchFor'))
                 {$searchFor=app('request')->input('searchFor');
                }else{
                    $searchFor="serviceprovider";
                    }
					$route = \Request::route()->getName();
                    ?>
                    <a id="vVIC" class="<?php (app('request')->input('state')=='VIC')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/vic.png" />
                    <div  class="state">VIC </div></a>
                </li>
                <li>
                    <a id="vNSW" class="<?php (app('request')->input('state')=='NSW')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/nsw.png" />
                    <div class="state">NSW</div></a>
                </li>
                <li>
                    <a id="vQUE" class="<?php (app('request')->input('state')=='QUE')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/que.png" />
                    <div class="state">QUE</div></a>
                </li>
                <li>
                    <a  id="vWA" class="<?php (app('request')->input('state')=='WA')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/wa.png" />
                    <div class="state">WA</div></a>
                </li>
                <li>
                    <a id="vSA" class="<?php (app('request')->input('state')=='SA')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/sa.png" />
                    <div class="state">SA</div></a>
                </li>
                <li>
                    <a id="vNT" class="<?php (app('request')->input('state')=='NT')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/nt.png" />
                    <div class="state">NT</div></a>
                </li>
                <li>
                    <a id="vTAS" class="<?php (app('request')->input('state')=='TAS')? $class="active":$class=""; echo $class;?>" href="javascript:void(0);"><img src="/build/images/state-icons/tas.png" /><div class="state">TAS</div></a>
                </li>
            </ul>
        </div>
    </div>
</div>