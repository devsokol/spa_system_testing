<template>
  <div class="cabinet">
    <div id="preloader" v-if="preloader">
      <div id="loader"></div>
    </div>

    <div class="cab_wrapper" v-if="!preloader">
      <cabinetHeader></cabinetHeader>

      <slimSideBar></slimSideBar>
    </div>
  </div>
</template>

<script>

// import toastr from 'toastr'
// import 'toastr/build/toastr.min.css'
import api from '@/api'
import store from '@/store'
import '@/css/preloader.css'
import slimSideBar from '@/components/slimSideBar'
import cabinetHeader from '@/components/cabinetHeader'

export default {
  name: 'Cabinet',
  data () {
    return {
      preloader: true
    }
  },
  methods: {
    getEducAndDepat () {
      return new Promise((resolve, reject) => {
        api.getEducations()
          .then(res => {
            resolve(res)
          })
          .catch(resErr => {
            console.log('Помилка в блоці catch function getEducAndDepat', resErr)
          })
      })
    }
  },
  created () {
    if (!store.state.user.isAuthorized) {
      store.dispatch('user/checkIsAuthorized')
        .then(res => {
          (res) ? this.preloader = false : this.router.push('/')
        })
        .catch(rej => {
          console.log('Помилка сталась у компоненті cabinet хук created', rej)
        })
    } else {
      this.preloader = false
    }

    this.getEducAndDepat()
      .then(res => {
        let data = res.data.data

        store.commit('general/updateEducations', data.educations)
        store.commit('general/updateDepartament', data.departaments)
        store.commit('general/specialtyDepartament', data.specialty)
      })
  },
  components: {
    slimSideBar,
    cabinetHeader
  }
}
</script>
