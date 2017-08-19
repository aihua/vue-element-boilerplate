/* Components */
import Vue from 'vue';
import PageContainer from '../components/PageContainer';

/* Filters */
import Capitalize from './filters/Capitalize/Capitalize';
import Uppercase from './filters/Uppercase/Uppercase';

Vue.component(PageContainer.name, PageContainer);

Vue.filter('capitalize', Capitalize);
Vue.filter('uppercase', Uppercase);
