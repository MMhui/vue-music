import Vue from 'vue';
import Router from 'vue-router';
// import Rank from 'components/rank/rank';
// import Recommend from 'components/recommend/recommend';
// import Search from 'components/search/search';
// import Singer from 'components/singer/singer';
// import SingerDetail from 'components/singer-detail/singer-detail';
// import Disc from 'components/disc/disc';
// import RankList from 'components/rank-list/rank-list';
// import UserCenter from 'components/user-center/user-center';

Vue.use(Router);
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module);
  }).catch();
};

const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module);
  }).catch();
};

const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module);
  }).catch();
};

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module);
  }).catch();
};

const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module);
  }).catch();
};

const RankList = (resolve) => {
  import('components/rank-list/rank-list').then((module) => {
    resolve(module);
  }).catch();
};

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module);
  }).catch();
};

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module);
  }).catch();
};

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        { path: ':id', name: 'Disc', component: Disc }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        { path: ':id', name: 'SingerDetail', component: SingerDetail }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        { path: ':id', name: 'RankList', component: RankList }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        { path: ':id', name: 'SearchDetail', component: SingerDetail }
      ]
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: UserCenter
    }
  ]
});
