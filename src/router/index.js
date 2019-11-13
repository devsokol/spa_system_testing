import Vue from 'vue'
import Router from 'vue-router'
import point from '@/components/point'
import auth from '@/components/auth'
import cabinet from '@/components/cabinet'
import departaments from '@/components/departaments'
import accessEntrants from '@/components/accessEntrants'
import testing from '@/components/testing'
import finishPage from '@/components/finishPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'point',
      component: point
    },
    {
      path: '/login',
      name: 'sign_in',
      component: auth
    },
    {
      path: '/registration',
      name: 'sign_up',
      component: auth
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: cabinet
    },
    {
      path: '/departaments/:education_id',
      name: 'departaments',
      component: departaments,
      props: true
    },
    {
      path: '/access-entrants',
      name: 'accessEntrants',
      component: accessEntrants
    },
    {
      path: '/testing',
      name: 'testing',
      component: testing
    },
    {
      path: '/result',
      name: 'result',
      component: finishPage
    }
  ]
})
