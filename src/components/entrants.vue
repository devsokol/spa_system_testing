<template>
  <div class="entrants-wrapper w-100">

    <!-- pre loader -->
    <preLoader v-if="preLoader"></preLoader>

    <div class="content-entrants" v-else>
      <div class="header-entrants">
        <button class="btn btn-success"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          @click="selectEntrant()"
        >
        Додати абітурієнта
        </button>
      </div>

      <!-- table list antrants -->
      <table class="table table-sm" v-if="getEntrants.length">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">І'мя</th>
            <th scope="col">Прізвище</th>
            <th scope="col">По батькові</th>
            <th scope="col">Рік народження</th>
            <th scope="col">Село/Місто</th>
            <th scope="col">Спеціальність</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i, index) in getEntrants" :key="index">
            <th>{{ i.id }}</th>
            <th>{{ i.first_name }}</th>
            <th>{{ i.last_name }}</th>
            <th>{{ i.middle_name }}</th>
            <th>{{ i.age }}</th>
            <th>{{ i.city }}</th>
            <th>{{ i.specialty.title }}</th>
            <th align="right" id="tdTableGetEducations">
              <i
                class="far fa-edit"
                @click="selectEntrant(i)"
                data-toggle="modal"
                title="Редагувати"
                data-target="#exampleModalCenter"
              ></i>
              <i
                class="far fa-trash-alt"
                title="Видалити"
                @click="deleteEntrant(i.id)"
              ></i>
            </th>
          </tr>
        </tbody>
      </table>
      <div class="placeholder-entrant-nothing" v-else>
        <h1>Абітурієнтів не знайдено!</h1>
      </div>
    </div>

    <!-- modal -->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{ (!Object.keys(this.activeEntrant).length ? 'Додати' : 'Редагувати') + ' абітурієнта' }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- last name -->
            <label for="basic-url">Прізвище</label>
            <input type="text"
              class="form-control"
              placeholder="Введіть прізвище"
              v-model="form.last_name"
            >

            <!-- first name -->
            <label for="basic-url">Ім'я</label>
            <input type="text"
              class="form-control"
              placeholder="Введіть ім'я"
              v-model="form.first_name"
            >

            <!-- middle name -->
            <label for="basic-url">По батькові</label>
            <input type="text"
              class="form-control"
              placeholder="Введіть по батькові"
              v-model="form.middle_name"
            >

            <!-- age -->
            <label for="basic-url">Виберіть рік народження</label>
            <input type="date"
              class="form-control"
              v-model="form.age"
            >

            <!-- city -->
            <label for="basic-url">Місто/Село</label>
            <input type="text"
              class="form-control"
              placeholder="Введіть місце проживання"
              v-model="form.city"
            >

            <!-- specialty -->
            <label for="basic-url">Спеціальність</label>
            <select class="form-control mr-sm-2" v-model="form.id_specialty">
              <option value="" disabled selected>Виберіть спеціальність</option>
              <option v-for="(item, index) in specialty" :key="index" :value="item.id">
                {{item.title}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
            <button type="button" class="btn btn-primary" @click="editEntrant" v-if="Object.keys(this.activeEntrant).length">
              Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
            </button>
            <button type="button" class="btn btn-success" @click="saveEntrant" v-else>
              Зберегти <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end modal -->

  </div>
</template>

<script>

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import api from '@/api'
import '@/css/entrants.css'
import preLoader from '@/components/preLoader'
import {mapState} from 'vuex'
import isEmpty from 'lodash/isEmpty'

export default {
  name: 'entrants',
  data () {
    return {
      preLoader: false,
      entrants: [],
      activeEntrant: {},
      btnLoader: false,
      form: {
        first_name: '',
        last_name: '',
        middle_name: '',
        age: '',
        city: '',
        id_specialty: 0
      }
    }
  },
  methods: {
    getAllEntrants () {
      this.preLoader = true

      api.getEntrants()
        .then(res => {
          if (res.data.success) {
            this.entrants = res.data.data.entrants
          }

          this.preLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    editEntrant () {
      if (!this.form.id_specialty) {
        toastr.error('Виберіть спеціальність!')
        return false
      }

      this.btnLoader = true

      api.updateEntrant({...this.form, id: this.activeEntrant.id})
        .then(res => {
          if (res.data.success) {
            let index = this.entrants.findIndex(i => i.id === this.activeEntrant.id)
            this.entrants[index] = res.data.data.entrant

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
    deleteEntrant (id) {
      api.deleteEntrant(id)
        .then(res => {
          if (res.data.success) {
            let index = this.entrants.findIndex(i => i.id === id)
            this.$delete(this.entrants, index)

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    selectEntrant (entrant = {}) {
      this.activeEntrant = entrant

      if (!isEmpty(entrant)) {
        this.form.first_name = entrant.first_name
        this.form.last_name = entrant.last_name
        this.form.middle_name = entrant.middle_name
        this.form.age = entrant.age
        this.form.city = entrant.city
        this.form.id_specialty = entrant.id_specialty
      } else {
        for (let i in this.form) {
          if (typeof this.form[i] === 'string') {
            this.form[i] = ''
          } if (typeof this.form[i] === 'number') {
            this.form[i] = 0
          }
        }
      }
    },
    saveEntrant () {
      if (!this.form.id_specialty) {
        toastr.error('Виберіть спеціальність!')
        return false
      }

      this.btnLoader = true

      api.addEntrant(this.form)
        .then(res => {
          if (res.data.success) {
            this.entrants.push(res.data.data.entrant)

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
    getEntrants () {
      return this.entrants
    },
    ...mapState('general', [
      'specialty'
    ])
  },
  created () {
    this.getAllEntrants()
  },
  components: {
    preLoader
  }
}
</script>
