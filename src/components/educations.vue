<template>
  <div class="educations w-100">

    <div class="btn-group">
      <button class="btn btn-success" id="btnAddEducation" data-toggle="modal" data-target="#exampleModalCenter" @click="selectEducation()">Додати підрозділ</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Навчальні підозділи</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in getEducations" :key="index">
          <td>{{ item.title }}</td>
          <td align="right" id="tdTableGetEducations">
            <router-link :to="'/departaments/'+item.id">
              <i class="far fa-eye"
                title="Переглянути кафедри"
                id="cust-fa-eye"
              >
              </i>
            </router-link>
            <i
              class="far fa-edit"
              @click="selectEducation(item)"
              data-toggle="modal"
              title="Редагувати"
              data-target="#exampleModalCenter"
            ></i>
            <i
              class="far fa-trash-alt"
              data-target="#myModal"
              data-toggle="modal"
              title="Видалити"
              @click="selectEducation(item)"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal add educations-->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{ (!Object.keys(this.activeEducation).length ? 'Додати' : 'Редагувати') + ' навчальний підрозділ' }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" v-model="newEducation" placeholder="Введіть підрозділ">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
            <button type="button" class="btn btn-primary" @click="updateEducation" v-if="Object.keys(this.activeEducation).length">
              Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
            </button>
            <button type="button" class="btn btn-success" @click="saveEducation()" v-else>
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
              @click="deleteEducation"
            >
              Видалити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>

import store from '@/store'
import toastr from 'toastr'
// import isEmpty from 'lodash/isEmpty'
import 'toastr/build/toastr.min.css'
import '@/css/educations.css'
import api from '@/api'

export default {
  name: 'educations',
  data () {
    return {
      newEducation: '',
      activeEducation: {},
      btnLoader: false
    }
  },
  methods: {
    saveEducation () {
      if (!this.newEducation) {
        toastr.error('Введіть назву навчального підрозділу!')
        return
      }

      this.btnLoader = true

      api.addEducation({title: this.newEducation})
        .then(res => {
          if (res.data.success) {
            store.dispatch('general/addEducation', res.data.data.education)
            toastr.success(res.data.message)
          }

          this.newEducation = ''
          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    },
    updateEducation () {
      this.btnLoader = true

      let params = {
        id: this.activeEducation.id,
        title: this.newEducation
      }

      api.updateEducation(params)
        .then(res => {
          if (res.data.success) {
            store.dispatch('general/updateEducation', res.data.data)
            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch')
        })
    },
    selectEducation (education = {}) {
      this.activeEducation = education
      this.newEducation = (this.activeEducation.title) ? this.activeEducation.title : ''
    },
    deleteEducation () {
      this.btnLoader = true

      api.deleteEducation({id: this.activeEducation.id})
        .then(res => {
          if (res.data.success) {
            store.commit('general/updateEducations', res.data.data.educations)
            toastr.success('Навчальний підрозділ видалено!')
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch')
        })
    }
  },
  computed: {
    getEducations () {
      // console.log(store.state.general.educations)
      return store.state.general.educations
    }
  }
}
</script>
