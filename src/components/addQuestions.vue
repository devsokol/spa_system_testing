<template>
    <div class="w-100 wrapper-questions">
      <!-- header -->
      <nav class="navbar" id="nav-header-questions">
        <form class="form-inline my-2 my-lg-0" id="form-filter-questions">
          <!-- Educations -->
          <select class="form-control mr-sm-2"
            v-model="activeIdEducation"
          >
            <option value="" disabled selected>Виберіть навчальний підрозділ</option>
            <option v-for="(item, index) in educations" :key="index" :value="item.id">
              {{item.title}}
            </option>
          </select>

          <!-- Departament -->
          <select class="form-control mr-sm-2"
            v-if="activeIdEducation"
            v-model="activeIdDepartament"
          >
            <option value="" disabled selected>Виберіть кафедру</option>
            <option v-for="(item, index) in getDepartaments" :key="index" :value="item.id">
              {{item.title}}
            </option>
          </select>

          <!-- Specialty -->
          <select class="form-control mr-sm-2"
            v-if="activeIdDepartament"
            v-model="activeIdSpecialty"
          >
            <option value="" disabled selected>Виберіть спеціальність</option>
            <option v-for="(item, index) in getSpecialty" :key="index" :value="item.id">
              {{item.title}}
            </option>
          </select>

          <!-- Tickets -->
          <select class="form-control mr-sm-2"
            v-if="tickets.length"
            v-model="activeIdTicket"
          >
            <option value="" disabled selected>Виберіть білет</option>
            <option v-for="(item, index) in getTickets" :key="index" :value="item.id">
              {{item.title}}
            </option>
          </select>

        </form>
        <button
          class="btn btn-success"
          v-if="activeIdTicket"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          @click="selectQuestion({})"
        >
          Додати питання
        </button>
      </nav>

      <!-- table -->
      <div class="block-table" v-if="questions.length">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Питання</th>
              <th scope="col">Фото</th>
              <th scope="col">Тип питання</th>
              <th scope="col">Кількість балів</th>
              <th scope="col">Hash</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in getQuestions" :key="index">
              <td>{{ item.title }}</td>
              <td v-if="item.pre_img">
                <img class="previewImgQuestion"
                  height="30"
                  :src="getServerName + item.pre_img"
                  @click="toggleModal(item.pre_img)"
                >
              </td>
              <td v-else>
                -
              </td>
              <td>{{item.types_question.title}}</td>
              <td>{{ item.points }}</td>
              <td>{{ item.search_hash }}</td>
              <td align="right" id="tdTableGetEducations">
                <i
                  class="far fa-edit"
                  @click="selectQuestion(item)"
                  data-toggle="modal"
                  title="Редагувати"
                  data-target="#exampleModalCenter"
                ></i>
                <i
                  class="far fa-trash-alt"
                  title="Видалити"
                  @click="deleteQuestion(item.id)"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center playholder-table" v-else>
        <img src="@/assets/search_playcholder.png" alt="" width="100">
        <h2>Нічого не знайдено</h2>
        <h2 >Спробуйте налаштувати фільтри</h2>
      </div>
      <!-- end table -->

      <!-- modal window -->
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">{{ (!Object.keys(this.activeQuestion).length ? 'Додати' : 'Редагувати') + ' питання' }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- title -->
              <label for="basic-url">Заголовок</label>
              <textarea type="text"
                class="form-control"
                placeholder="Введіть заголовок"
                v-model="form.title"
                rows="4"
                id="titleArea"
              ></textarea>

              <!-- type -->
              <label for="basic-url">Тип питання</label>
              <select class="form-control" v-model="form.id_type" id="titleArea">
                <option value=""></option>
                <option v-for="(item, index) in typeQuestions" :key="index" :value="item.id">
                  {{ item.title }}
                </option>
              </select>

              <!-- count scores -->
              <label for="basic-url">Кількість балів</label>
              <input type="number" class="form-control" v-model="form.points">

              <!-- load img -->
              <label for="basic-url">Загрузка зображення</label>
              <!-- <input type="file" @change="onLoadFile" id="inp-file" style="color:transparent;"> -->
              <div class="custom-file">
                <input type="file" class="custom-file-input" id="customFile" @change="onLoadFile">
                <label class="custom-file-label" for="customFile" id="title-file-cust">{{ titleFileLable }}</label>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
              <button type="button" class="btn btn-primary" @click="updateQuestion" v-if="Object.keys(this.activeQuestion).length">
                Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
              </button>
              <button type="button" class="btn btn-success" @click="saveQuestions" v-else>
                Зберегти <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- modal full view photo -->
      <div class="photo-view-modal">
        <div class="modal-view-content">
          <img class="pre-img"
              v-if="activeImg"
              :src="activeImg"
            >
        </div>
      </div>
      <!-- end modal -->

    </div>
</template>

<script>

import isEmpty from 'lodash/isEmpty'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import api from '@/api'
import '@/css/questions.css'
import {mapState} from 'vuex'
import config from '@/default_config'

export default {
  name: 'addQuestions',
  data () {
    return {
      activeIdEducation: 0,
      activeIdDepartament: 0,
      activeIdSpecialty: 0,
      activeIdTicket: 0,
      tickets: [],
      questions: [],
      activeQuestion: {},
      btnLoader: false,
      form: {
        title: '',
        pre_img: [],
        points: '',
        id_type: 0
      },
      typeQuestions: [
        {
          id: 1,
          title: 'Одна відповідь'
        },
        {
          id: 2,
          title: 'Багато відповідей'
        },
        {
          id: 3,
          title: 'Відповідність сутностей'
        },
        {
          id: 4,
          title: 'Слово'
        }
      ],
      activeImg: '',
      valueInputFile: '',
      titleFileLable: 'Зображення не вибрано'
    }
  },
  methods: {
    updateQuestion () {
      if (!this.validForm()) {
        return false
      }

      this.btnLoader = true
      let data = this.appendDateForm()

      api.editQuestion(data)
        .then(res => {
          if (res.data.success) {
            let index = this.questions.findIndex(i => i.id === this.activeQuestion.id)
            this.questions[index] = res.data.data.question

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
    saveQuestions () {
      if (!this.validForm()) {
        return false
      }

      this.btnLoader = true
      let data = this.appendDateForm()

      api.saveQuestion(data)
        .then(res => {
          if (res.data.success) {
            this.questions.push(res.data.data.question)

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
    deleteQuestion (id) {
      api.deleteQuestion(id)
        .then(res => {
          if (res.data.success) {
            let index = this.questions.findIndex(i => i.id === id)
            this.$delete(this.questions, index)

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    selectQuestion (question = {}) {
      this.activeQuestion = question

      if (!isEmpty(this.activeQuestion)) {
        this.form = {...this.activeQuestion}
      } else {
        this.form = {
          title: '',
          pre_img: [],
          points: '',
          id_type: 0
        }
      }

      this.titleFileLable = 'Зображення не вибрано'
    },
    onLoadFile (event) {
      this.form.pre_img = event.target.files[0]

      this.titleFileLable = this.form.pre_img.name
    },
    validForm () {
      let field = {
        title: '`Заголовок`',
        points: '`Кількість балів`',
        id_type: '`Тип питання`'
      }

      for (let item in this.form) {
        if (~['title', 'points', 'id_type'].indexOf(item)) {
          if (!this.form[item]) {
            toastr.error('Поле ' + field[item] + ' не може бути пустим!')
            return false
          }
        }
      }

      return true
    },
    // photo view modal functions
    toggleModal (imgPath = '') {
      this.activeImg = this.getServerName + imgPath
      let modal = this.photoViewModal()

      modal.classList.toggle('photo-view-modal-show-or-hide')
    },
    bindWindowClick (event) {
      let modal = this.photoViewModal()

      if (event.target === modal) {
        modal.classList.toggle('photo-view-modal-show-or-hide')
      }
    },
    photoViewModal () {
      return document.querySelector('.photo-view-modal')
    }, // end view modal functions
    appendDateForm () {
      let fd = new FormData()

      console.log(this.form.pre_img.length)

      for (let item in this.form) {
        // if (item === 'pre_img' && this.form[item]) {
        if (item === 'pre_img' && this.form.pre_img.length !== 0) {
          fd.append('image', this.form[item], this.form[item].name)

          continue
        }

        fd.append(item, this.form[item])
      }

      fd.append('id_ticket', this.activeIdTicket)

      return fd
    }
  },
  computed: {
    ...mapState('general', [
      'educations',
      'departaments',
      'specialty'
    ]),
    getDepartaments () {
      return this.departaments.filter(i => i.id_educations === this.activeIdEducation)
    },
    getSpecialty () {
      return this.specialty.filter(i => i.id_departament === this.activeIdDepartament)
    },
    getTickets () {
      return this.tickets
    },
    getQuestions () {
      return this.questions
    },
    getServerName () {
      return config.serverNameDomain
    }
  },
  watch: {
    activeIdSpecialty () {
      if (this.activeIdSpecialty) {
        api.getTickets(this.activeIdSpecialty)
          .then(res => {
            if (res.data.success) {
              this.tickets = res.data.data.tickets
            }
          })
          .catch(resErr => {
            console.log('Помилка в блоці catch: ', resErr)
          })
      }
    },
    activeIdEducation () {
      this.activeIdDepartament = 0
      this.tickets = []
    },
    activeIdDepartament () {
      this.tickets = []
    },
    activeIdTicket () {
      api.getQuestions(this.activeIdTicket)
        .then(res => {
          if (res.data.success) {
            this.questions = res.data.data.questions
          }
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    }
  },
  created () {
    // !delete
    this.activeIdTicket = 1

    window.addEventListener('click', this.bindWindowClick)
  }
}
</script>
