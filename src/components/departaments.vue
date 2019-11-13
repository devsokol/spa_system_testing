<template>
  <div class="departaments">
    <!-- pre loader -->
    <preLoader v-if="preLoader"></preLoader>

    <div class="departamentContent" v-else>
        <!-- header -->
        <cabinetHeader isShowDepartamentPage @modalAddDep="selectDepartament({})"></cabinetHeader>

        <h1 class="display-1 educationTitle">{{ this.education.title }}</h1>
        <h3 v-if="!departaments.length" class="text-center nothingDepartament">Немає кафедр</h3>

        <table class="table" v-else>
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Назва</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(departament, index) in departaments" :key="index">
              <th scope="row">{{ departament.id }}</th>
              <td>{{ departament.title }}</td>
              <td align="right" id="tdTableGetEducations">
                <i
                  class="far fa-edit"
                  @click="selectDepartament(departament)"
                  data-toggle="modal"
                  title="Редагувати"
                  data-target="#exampleModalCenter"
                ></i>
                <i
                  class="far fa-trash-alt"
                  data-target="#myModal"
                  data-toggle="modal"
                  title="Видалити"
                  @click="selectDepartament(departament)"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal add | edit departament-->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">{{ (!Object.keys(this.activeDepartament).length ? 'Додати' : 'Редагувати') + ' кафедру' }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <input type="text" class="form-control" v-model="newDepartament" placeholder="Введіть підрозділ">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                <button type="button" class="btn btn-primary" @click="updateDepartament" v-if="Object.keys(this.activeDepartament).length">
                  Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
                </button>
                <button type="button" class="btn btn-success" @click="saveDepartament" v-else>
                  Зберегти <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- The Modal delete education -->
        <div class="modal" id="myModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <!-- Modal body -->
              <div class="modal-body text-center">
                <img src="@/assets/deleteModal.png" class="mx-auto d-block" alt="видалення користувача" width="200">
                <span class="text-secondary">Ви впевнені що хочете видалити?</span>
              </div>

              <!-- Modal footer -->
              <div class="modal-footer mx-auto d-block">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                <button
                  type="button"
                  class="btn btn-danger"
                  data-loading-text="<i class='fa fa-spinner fa-spin fa-fw' aria-hidden='true'></i>"
                  @click="deleteDepartament"
                >
                  Видалити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
                </button>
              </div>

            </div>
          </div>
        </div>

    </div>
  </div>
</template>

<script>

// import store from '@/store'
import toastr from 'toastr'
// import isEmpty from 'lodash/isEmpty'
import 'toastr/build/toastr.min.css'
import api from '@/api'

import preLoader from '@/components/preLoader'
import cabinetHeader from '@/components/cabinetHeader'
import '@/css/departaments.css'

export default {
  name: 'departaments',
  data () {
    return {
      educationId: false,
      departaments: [],
      education: {},
      preLoader: true,
      btnLoader: false,
      activeDepartament: {},
      newDepartament: ''
    }
  },
  methods: {
    getDepartaments () {
      api.getFixedDepartaments(this.educationId)
        .then(res => {
          if (!res.data.success) {
            this.$router.push('/')

            return
          }

          this.departaments = res.data.data.departaments
          this.education = res.data.data.education[0]

          this.preLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    },
    selectDepartament (departament = {}) {
      this.activeDepartament = departament
      this.newDepartament = (this.activeDepartament.title) ? this.activeDepartament.title : ''
    },
    saveDepartament () {
      if (!this.newDepartament) {
        toastr.error('Введіть назву навчального підрозділу!')
        return
      }

      this.btnLoader = true

      api.addDepartament({title: this.newDepartament, edicationId: this.educationId})
        .then(res => {
          if (res.data.success) {
            this.departaments.push(res.data.data.departament)
            toastr.success(res.data.message)
          }

          this.newDepartament = ''
          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    },
    updateDepartament () {
      this.btnLoader = true

      let params = {
        id: this.activeDepartament.id,
        title: this.newDepartament
      }

      api.editDepartament(params)
        .then(res => {
          if (res.data.success) {
            let index = this.departaments.findIndex(item => item.id === this.activeDepartament.id)
            this.departaments[index] = res.data.data.departament

            toastr.success(res.data.message)
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    },
    deleteDepartament () {
      this.btnLoader = true

      api.deleteDepartament({id: this.activeDepartament.id})
        .then(res => {
          if (res.data.success) {
            this.getDepartaments()

            toastr.success(res.data.message)
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    }
  },
  created () {
    if (!localStorage.getItem('adminUser')) {
      this.$router.push('/')

      return
    }

    this.educationId = this.$route.params.education_id
    this.getDepartaments()
  },
  components: {
    preLoader,
    cabinetHeader
  }
}
</script>
