<template>
  <div class="auth">
    <div class="d-flex justify-content-center h-100">
      <div class="card-auth">
        <div class="card-header">
          <h3>{{ (this.isRegistration) ? 'Реєстрація' : 'Увійти' }}</h3>
          <div class="d-flex justify-content-end social_icon">
            <span><i class="fab fa-facebook-square"></i></span>
            <span><i class="fab fa-google-plus-square"></i></span>
            <span><i class="fab fa-twitter-square"></i></span>
          </div>
        </div>
        <div class="card-body">
          <form action="javascript:void(0);">

            <!-- login -->
            <div class="input-group form-group">
              <div class="input-group-prepend" v-if="!isRegistration">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
              </div>
              <input type="text" class="form-control" placeholder="Логін:" v-model="form.login" :disabled="disableForm">
            </div>

            <!-- name -->
            <div class="input-group form-group" v-if="isRegistration">
              <input type="text" class="form-control" placeholder="Ім'я:" v-model="form.name" :disabled="disableForm">
            </div>

            <!-- surname -->
            <div class="input-group form-group" v-if="isRegistration">
              <input type="text" class="form-control" placeholder="Прізвище:" v-model="form.last_name" :disabled="disableForm">
            </div>

            <!-- Навчальна підрозділи -->
            <div v-if="isRegistration">
              <span class="input-group-addon" v-if="spinner_select">
                  <i class="fa fa-refresh fa-spin" style="color: white;"></i>
              </span>
              <select class="form-control form-group" id="sel1" v-on:change="selectEducations">
                <option value="" disabled selected>Навчальний підрозділ</option>
                <option v-for="(item, index) in educations" :key="index" :value="item.id">{{ item.title }}</option>
              </select>

              <!-- Кафедри -->
              <select class="form-control form-group" id="sel2" v-if="this.showDepartaments.length" v-on:change="selectDepartament">
                <option value="" disabled selected>Кафедра</option>
                <option v-for="(item, index) in showDepartaments" :key="index" :value="item.id">{{ item.title }}</option>
              </select>
            </div>

            <!-- password -->
            <div class="input-group form-group">
              <div class="input-group-prepend" v-if="!isRegistration">
                <span class="input-group-text"><i class="fas fa-key"></i></span>
              </div>
              <input type="password" class="form-control" placeholder="Пароль:" v-model="form.password" :disabled="disableForm">
            </div>

            <!-- confirm password -->
            <div class="input-group form-group" v-if="isRegistration">
              <input type="password" class="form-control" placeholder="Повторити пароль:" v-model="form.retryPassword" :disabled="disableForm">
            </div>

            <!-- about -->
            <div class="input-group form-group" v-if="isRegistration">
              <textarea class="form-control" rows="5" placeholder="Про себе..." :disabled="disableForm" v-model="form.about"></textarea>
            </div>

            <!-- remember me -->
            <div class="row align-items-center remember" v-if="!isRegistration">
              <input type="checkbox" :disabled="disableForm">Запам'ятати мене
            </div>

            <!-- Sign in | up -->
            <div class="form-group">
              <button
                class="btn float-right login_btn"
                @click="signIn"
                id="signBtn"
                data-loading-text="<i class='fa fa-spinner fa-spin fa-fw' aria-hidden='true'></i>"
                :disabled="disableForm"
              >
                {{ (isRegistration) ? 'Зареєструватися' : 'Увійти' }}
              </button>
            </div>

          </form>

        </div>
        <div class="card-footer" v-if="!isRegistration">
          <div class="d-flex justify-content-center">
            <a href="#">Забули свій пароль?</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import api from '@/api'
import store from '@/store'
import '@/css/auth.css'

export default {
  name: 'Point',
  data () {
    return {
      isRegistration: false, // isRegistration - cheked url is registration
      disableForm: false,
      form: {
        login: '',
        password: '',
        retryPassword: '',
        name: '',
        last_name: '',
        about: '',
        idEducation: -1,
        idDepartament: false
      },
      spinner_select: false,
      educations: [],
      departaments: [],
      showDepartaments: []
    }
  },
  methods: {
    signIn () {
      var signBtn = document.getElementById('signBtn')
      this.disableForm = true
      let textBtn = (this.isRegistration) ? 'Зареєструватися' : 'Увійти'

      if (!this.isRegistration) {
        delete this.form.retryPassword
        delete this.form.name
        delete this.form.last_name
        delete this.form.about
        delete this.form.idEducation
        delete this.form.idDepartament
      }

      let onOffDisable = (isCheck = true) => {
        signBtn.innerHTML = textBtn // add inner text
        this.disableForm = isCheck // disable false
      }

      signBtn.innerHTML = "<i class='fa fa-spinner fa-spin fa-fw'></i> " + textBtn

      var that = this

      api.auth(this.form, this.isRegistration)
        .then(function (response) {
          if (response.data.success) {
            let resJson = response.data.data

            if (resJson) {
              localStorage.setItem('token', resJson.token)
              localStorage.setItem('adminUser', JSON.stringify(resJson.user))

              store.commit('user/fillAuthUser', resJson.user)
              store.dispatch('user/authResponse', true)

              that.$router.push('cabinet')
            }

            toastr.success(response.data.message)

            onOffDisable(false)
          } else {
            toastr.options.timeOut = 3000
            toastr.error(response.data.message)

            onOffDisable(false)
          }
        })
        .catch(function (error) {
          console.log('error', error)

          onOffDisable(false)
        })
    },
    getEducations () {
      api.getEducations()
        .then(res => {
          this.educations = res.data.data.educations
          this.departaments = res.data.data.departaments

          this.spinner_select = false
        })
        .catch(error2 => {
          this.spinner_select = false
          console.log('Помилка в блоці catch file auth function getEducations')
        })
    },
    selectEducations (event) {
      this.form.idEducation = parseInt(event.target.options[event.target.selectedIndex].value)
      let sel2 = document.getElementById('sel2')

      if (sel2) { sel2.options.selectedIndex = 0 } // reset index 2 select

      this.showDepartaments = this.departaments.map(item => {
        if (item.id_educations === this.form.idEducation) {
          return item
        }

        return false
      }).filter(itemDeep => {
        return itemDeep
      })
    },
    selectDepartament (event) {
      this.form.idDepartament = parseInt(event.target.options[event.target.selectedIndex].value)
    }
  },
  created () {
    if (location.hash === '#/registration') {
      this.spinner_select = true
      this.getEducations()
      this.isRegistration = true
    }
  }
}
</script>
