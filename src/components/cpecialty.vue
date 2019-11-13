<template>
  <div class="specialty w-100">
    <div id="selectComponent">
      <button class="btn btn-success" id="add_specialty" data-toggle="modal" data-target="#exampleModalCenter" @click="selectSpecialty({})">Додати спеціальність</button>

      <select class="form-control form-control-sm" id="selectEducation" v-on:change="selectEducation">
        <option value="" disabled selected>Виберіть навчальний підрозділ</option>
        <option v-for="(education, index) in educations" :key="index" :value="education.id">
          {{ education.title }}
        </option>
      </select>

      <select class="form-control form-control-sm" :disabled="!activeDepartaments.length" v-on:change="selectDepartament" id="depSel">
        <option value="" disabled selected>Виберіть кафедру</option>
        <option v-for="(departamet, index) in activeDepartaments" :key="index" :value="departamet.id">
          {{ departamet.title }}
        </option>
      </select>
    </div>

    <!-- pre loader -->
    <preLoader v-if="preLoader"></preLoader>

    <div v-else>
      <!-- table -->
      <table class="table table-striped" v-if="specialtys.length">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Заголовок</th>
            <th scope="col">Короткий заголовок</th>
            <th scope="col">Повне ім'я</th>
            <th scope="col">Кафедра</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(specialty, index) in specialtys" :key="index">
            <th scope="row">{{ specialty.id }}</th>
            <td>{{ specialty.title }}</td>
            <td>{{ (specialty.short_title) ? specialty.short_title : '-' }}</td>
            <td>{{ (specialty.full_name) ? specialty.full_name : '-' }}</td>
            <td>{{ specialty.departament.title }}</td>
            <td class="tableSpecialty">
              <i
                  class="far fa-edit"
                  @click="selectSpecialty(specialty)"
                  data-toggle="modal"
                  title="Редагувати"
                  data-target="#exampleModalCenter"
                ></i>
                <i
                  class="far fa-trash-alt"
                  data-target="#myModal"
                  data-toggle="modal"
                  title="Видалити"
                  @click="selectSpecialty(specialty)"
                ></i>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center playholder-table" v-else>
        <img src="@/assets/search_playcholder.png" alt="" width="100">
        <h2>Нічого не знайдено</h2>
        <h2 >Спробуйте налаштувати фільтри</h2>
      </div>
    </div>

    <!-- Modal add | edit specialty-->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{ (!Object.keys(this.activeSpecialty).length ? 'Додати' : 'Редагувати') + ' спеціальність' }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body specialty_group_inp">
            <input type="text" class="form-control" v-model="form.title" placeholder="Заголовок">
            <input type="text" class="form-control" v-model="form.short_title" placeholder="Короткий заголовок">
            <input type="text" class="form-control" v-model="form.full_name" placeholder="Повне ім'я">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
            <button type="button" class="btn btn-primary" @click="updateSpecialty" v-if="Object.keys(this.activeSpecialty).length">
              Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
            </button>
            <button type="button" class="btn btn-success" @click="saveSpecialty" v-else>
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
              @click="deleteSpecialty"
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

// import store from '@/store'
import {mapState} from 'vuex'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import api from '@/api'

import preLoader from '@/components/preLoader'
import '@/css/cpecialty.css'

export default {
  name: 'specialty',
  data () {
    return {
      activeDepartaments: [],
      specialtys: [],
      preLoader: false,
      activeSpecialty: {},
      form: {
        title: '',
        short_title: '',
        full_name: ''
      },
      btnLoader: false,
      departamentId: false
    }
  },
  methods: {
    selectEducation (event) {
      let educationId = parseInt(event.target.options[event.target.selectedIndex].value)
      this.activeDepartaments = this.departaments.filter(i => i.id_educations === educationId)

      let depSel = document.getElementById('depSel')

      if (depSel) { depSel.options.selectedIndex = 0 } // reset index 2 select
      this.departamentId = false
    },
    selectDepartament (event) {
      this.preLoader = true
      this.departamentId = parseInt(event.target.options[event.target.selectedIndex].value)

      this.getAnySpecialty()
    },
    getAnySpecialty () {
      api.getSpecialtyForIdDepartament({'departamentId': this.departamentId})
        .then(res => {
          if (res.data.success) {
            this.specialtys = res.data.data.specialtys
          }

          this.preLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    selectSpecialty (specialty = {}) {
      this.activeSpecialty = specialty

      if (this.activeSpecialty) {
        this.form.title = specialty.title
        this.form.short_title = specialty.short_title
        this.form.full_name = specialty.full_name
      }
    },
    updateSpecialty () {
      if (!this.form.title) {
        toastr.error('Введіть заголовок!')

        return
      }

      this.btnLoader = true
      this.form.id = this.activeSpecialty.id

      api.editSpecialty(this.form)
        .then(res => {
          if (res.data.success) {
            this.getAnySpecialty()
            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    saveSpecialty () {
      if (!this.departamentId) {
        toastr.error('Виберіть кафедру!')

        return
      }

      this.btnLoader = true

      let params = this.form
      params.id_departament = this.departamentId

      api.addSpecialty(params)
        .then(res => {
          if (res.data.success) {
            this.getAnySpecialty()

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    deleteSpecialty () {
      this.btnLoader = true

      api.deleteSpecialty({id: this.activeSpecialty.id})
        .then(res => {
          if (res.data.success) {
            this.getAnySpecialty()

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }

          this.btnLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    }
  },
  computed: {
    ...mapState('general', [
      'educations',
      'departaments'
    ])
  },
  components: {
    preLoader
  }
}
</script>
