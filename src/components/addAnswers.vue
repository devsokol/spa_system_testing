<template>
    <div class="w-100 wrapper-answers">
      <!-- pre loader -->
      <preLoader v-if="preLoader"></preLoader>

      <div class="content-answers" v-else>
        <nav class="navbar" id="nav-header-questions">
          <form class="form-inline my-2 my-lg-0" id="form-filter-questions">

            <!-- search hash -->
            <input type="text"
              class="form-control mr-sm-2"
              placeholder="Введіть hash"
              id="search-hash"
              v-model="hash"
            >
            <!-- btn search -->
            <button class="btn btn-success"
              @click="searchHash"
            >
              Пошук
            </button>

          </form>
        </nav>

        <div class="answer-block" v-if="isIssetQuestion">

          <!-- card question -->
          <div class="card" id="card-question-block-answer">
            <img class="card-img-top"
              :src="(question.pre_img)
                ? getServerName + question.pre_img
                : require('@/assets/placholder-no-question-image.jpg')"
              alt="Question image"
              id="preImgQuestionBlockAnswer"
              @click="toggleModal(question.pre_img)"
            >
            <div class="card-body">
              <h5 class="card-title" id="card-question-block-answer-title">
                {{ question.ticket.title }}
              </h5>
              <p class="card-text" id="card-question-block-answer-body">
                {{ question.title }}
              </p>
            </div>
            <ul class="list-group list-group-flush" id="ticket-list">
              <li class="list-group-item">Кількість балів: {{ question.points }}</li>
              <li class="list-group-item">Тип питання: {{ question.types_question.title }}</li>
            </ul>
          </div>

          <!-- one answer -->
          <div v-if="~[1,2,4].indexOf(question.id_type)" class="main-wrapper-asnwers">

            <!--input add answer -->
            <form class="form-inline my-2 my-lg-0" id="form-add-answer">
              <textarea type="text"
                class="form-control"
                placeholder="Введіть відповідь"
                rows="4"
                id="inp-add-answer"
                v-model="form.title"
              ></textarea>
              <div class="custom-file" id="block-load-image" v-if="question.id_type === 1">
                <input type="file" class="custom-file-input" id="customFile" @change="onLoadFile">
                <label class="custom-file-label" for="customFile" id="title-file-cust">{{ titleFile }}</label>
              </div>
            </form>

            <!-- checkbox -->
            <input type="checkbox" id="checkbox-is-true-answer" v-model="form.current_answer" v-if="question.id_type === 1 || question.id_type === 2">
            <label for="checkbox-is-true-answer" id="label-is-true-answer" v-if="question.id_type === 1 || question.id_type === 2">Це правильна відповідь</label>

            <!-- btn -->
            <button class="btn btn-primary"
              id="add-answer-one"
              @click="addAnswer"
            >
              Додати відповідь <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
            </button>

            <!-- list answers -->
            <div class="list-answers">
              <ul class="list-group" v-for="(answer, index) in answers" :key="index">
                <li
                  class="list-group-item list-group-item-action active-li-answer-false"
                  id="li-answers-group"
                  :class="{'active-li-answer-true' : answer.current_answer || question.id_type === 4}"
                >
                  {{ (answer.title) ? answer.title : '-' }}
                  <div class="action-answer-in-div">
                    <i
                      v-if="answer.pre_img"
                      class="far fa-eye"
                      title="Переглянути фото"
                      id="icon-ans-view-img"
                      @click="showImage(answer.pre_img)"
                    ></i>
                    <i
                      class="far fa-edit"
                      id="icon-ans-edit"
                      title="Редагувати"
                      data-toggle="modal"
                      data-target="#exampleModalCenter"
                      @click="activeAnswer = {...answer}"
                    ></i>
                    <i
                      class="far fa-trash-alt"
                      id="icon-ans-delete"
                      title="Видалити"
                      @click="deleteAnswer(answer.id)"
                    ></i>
                  </div>
                </li>
              </ul>
            </div>

          </div>
          <div v-else-if="question.id_type === 3" class="main-wrapper-asnwers">
            <div class="form-comp-assoc">

              <div class="assoc-form-component">
                <!-- bundles 1 -->
                <div class="assoc-bundle-content">
                  <input type="text" class="form-control" placeholder="Питання" v-model="bundlesForm[0].a_question">
                  <div class="file btn btn-lg btn-primary divv question-block-assoc">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input" @change="multipleLoadFile($event, 0)" />
                  </div>
                  <input type="text" class="form-control" placeholder="Відповідь" v-model="bundlesForm[0].a_answer">
                  <div class="file btn btn-lg btn-primary divv">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input" @change="multipleLoadFile($event, 0, 'a_pre_img')"/>
                  </div>
                </div>

                <!-- bundles 2 -->
                <div class="assoc-bundle-content">
                  <input type="text" class="form-control" placeholder="Питання" v-model="bundlesForm[1].a_question">
                  <div class="file btn btn-lg btn-primary divv question-block-assoc">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input" @change="multipleLoadFile($event, 1)" />
                  </div>
                  <input type="text" class="form-control" placeholder="Відповідь" v-model="bundlesForm[1].a_answer">
                  <div class="file btn btn-lg btn-primary divv">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input" @change="multipleLoadFile($event, 1, 'a_pre_img')" />
                  </div>
                </div>

                <!-- bundles 3 -->
                <div class="assoc-bundle-content">
                  <input type="text" class="form-control" placeholder="Питання" v-model="bundlesForm[2].a_question">
                  <div class="file btn btn-lg btn-primary divv question-block-assoc">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input" @change="multipleLoadFile($event, 2)" />
                  </div>
                  <input type="text" class="form-control" placeholder="Відповідь" v-model="bundlesForm[2].a_answer">
                  <div class="file btn btn-lg btn-primary divv">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input" @change="multipleLoadFile($event, 2, 'a_pre_img')" />
                  </div>
                </div>

                <!-- bundles 4 -->
                <div class="assoc-bundle-content">
                  <input type="text" class="form-control" placeholder="Питання" v-model="bundlesForm[3].a_question">
                  <div class="file btn btn-lg btn-primary divv question-block-assoc">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input"  @change="multipleLoadFile($event, 3)" />
                  </div>
                  <input type="text" class="form-control" placeholder="Відповідь" v-model="bundlesForm[3].a_answer">
                  <div class="file btn btn-lg btn-primary divv">
                    <i class="fas fa-file-upload"></i>
                    <input type="file" name="file" class="input"  @change="multipleLoadFile($event, 3, 'a_pre_img')" />
                  </div>
                </div>
              </div>

              <button class="btn btn-success" id="save-assoc-btn" @click="saveBundles" v-if="!isExistBundle">
                Зберегти
                <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoaderUpdate"></i>
              </button>
              <button class="btn btn-primary" id="save-assoc-btn" @click="updateBundles" v-else>
                Оновити
                <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoaderUpdate"></i>
              </button>
            </div>
          </div>

          <!-- modal window -->
          <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Редагувати відповідь</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <textarea type="text"
                    class="form-control"
                    placeholder="Введіть відповідь"
                    rows="4"
                    id="inp-add-answer"
                    v-model="activeAnswer.title"
                  ></textarea>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                  <button type="button" class="btn btn-primary" @click="updateAnswer">
                    Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoaderUpdate"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- end modal -->

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
      </div>

    </div>
</template>

<script>

import isEmpty from 'lodash/isEmpty'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import '@/css/answers.css'
import api from '@/api'
import preLoader from '@/components/preLoader'
import config from '@/default_config'

export default {
  name: 'addAnswers',
  data () {
    return {
      hash: 'q5d0ca5c00ae085.76438657',
      preLoader: false,
      question: {},
      answers: [],
      form: {
        title: '',
        current_answer: false
      },
      btnLoader: false,
      btnLoaderUpdate: false,
      activeAnswer: {},
      activeImg: '',
      bundlesForm: [
        {
          a_question: '',
          a_answer: '',

          a_pre_img: null,
          q_pre_img: null
        },
        {
          a_question: '',
          a_answer: '',

          a_pre_img: null,
          q_pre_img: null
        },
        {
          a_question: '',
          a_answer: '',

          a_pre_img: null,
          q_pre_img: null
        },
        {
          a_question: '',
          a_answer: '',

          a_pre_img: null,
          q_pre_img: null
        }
      ],
      isExistBundle: false,
      titleFile: 'Зображення не вибрано',
      pre_img: []
    }
  },
  methods: {
    searchHash () {
      if (isEmpty(this.hash)) {
        toastr.error('Hash не може бути пустим!')

        return false
      }

      this.preLoader = true

      api.searchHash(this.hash)
        .then(res => {
          if (res.data.success) {
            let data = res.data.data
            this.isExistBundle = false
            // reset
            this.bundlesForm = [
              {
                a_question: '',
                a_answer: '',
                a_pre_img: null,
                q_pre_img: null
              },
              {
                a_question: '',
                a_answer: '',
                a_pre_img: null,
                q_pre_img: null
              },
              {
                a_question: '',
                a_answer: '',
                a_pre_img: null,
                q_pre_img: null
              },
              {
                a_question: '',
                a_answer: '',
                a_pre_img: null,
                q_pre_img: null
              }
            ]

            if (data.question) {
              this.answers = data.answers
              this.question = data.question

              if (!isEmpty(this.answers) && this.answers.length === 1) {
                if (!isEmpty(this.answers[0].bundles)) {
                  this.bundlesForm = this.answers[0].bundles
                  this.isExistBundle = true
                }
              }
            }
          }

          this.preLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    addAnswer () {
      if (isEmpty(this.form.title) && isEmpty(this.pre_img)) {
        toastr.error('Поле не може бути пустим!')

        return false
      }

      this.btnLoader = true

      let data = this.appendDateForm({
        ...this.form,
        id_question: this.question.id,
        pre_img: this.pre_img
      })

      api.addAnswer(data)
        .then(res => {
          if (res.data.success) {
            this.answers.push(res.data.data.answer)
            this.form.title = ''

            // file
            this.titleFile = 'Зображення не вибрано'
            this.pre_img = []

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
    deleteAnswer (id) {
      api.deleteAnswer(id)
        .then(res => {
          if (res.data.success) {
            let index = this.answers.findIndex(i => i.id === id)
            this.$delete(this.answers, index)

            toastr.success(res.data.message)
          } else {
            toastr.success(res.data.message)
          }
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    updateAnswer () {
      if (isEmpty(this.activeAnswer.title)) {
        toastr.error('Поле не може бути пустим!')

        return false
      }

      this.btnLoaderUpdate = true
      let params = {
        title: this.activeAnswer.title,
        id: this.activeAnswer.id
      }

      api.updateAnswer(params)
        .then(res => {
          if (res.data.success) {
            let index = this.answers.findIndex(i => i.id === params.id)
            this.answers[index] = res.data.data.answer

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }

          this.btnLoaderUpdate = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    // photo view modal functions
    toggleModal (imgPath = '') {
      if (!isEmpty(imgPath)) {
        this.activeImg = this.getServerName + imgPath
        let modal = this.photoViewModal()

        modal.classList.toggle('photo-view-modal-show-or-hide')
      }
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
    async saveBundles () {
      for (let i = 0; i < this.bundlesForm.length; i++) {
        if ((this.bundlesForm[i].q_pre_img === null && isEmpty(this.bundlesForm[i].a_question)) ||
          (this.bundlesForm[i].a_pre_img === null && isEmpty(this.bundlesForm[i].a_answer))
        ) {
          toastr.error('Заповніть коректно форму!')

          return false
        }
      }

      var fd = new FormData()

      this.bundlesForm.forEach((bundle, index) => {
        if (bundle.a_pre_img !== null) {
          fd.append(`a_pre_img_${index}`, bundle.a_pre_img)
        }

        if (bundle.q_pre_img !== null) {
          fd.append(`q_pre_img_${index}`, bundle.q_pre_img)
        }
      })

      fd.append('data', JSON.stringify(this.bundlesForm))
      fd.append('id_question', JSON.stringify(this.question.id))

      let response = await api.addBundles(fd)

      if (response.data.success) {
        toastr.success(response.data.message)
      } else {
        toastr.error(response.data.message)
      }
    },
    updateBundles () {
      console.log(this.bundlesForm)
      return false

      // for (let i = 0; i < this.bundlesForm.length; i++) {
      //   if (isEmpty(this.bundlesForm[i].a_question) || isEmpty(this.bundlesForm[i].a_answer)) {
      //     toastr.error('Заповніть коректно форму!')
      //     return false
      //   }
      // }

      // this.btnLoaderUpdate = true

      // api.updateBundle({data: this.bundlesForm})
      //   .then(res => {
      //     if (res.data.success) {
      //       toastr.success(res.data.message)
      //     } else {
      //       toastr.error(res.data.message)
      //     }

      //     this.btnLoaderUpdate = false
      //   })
      //   .catch(resErr => {
      //     console.log('Помилка в блоці catch: ', resErr)
      //   })
    },
    onLoadFile (event) {
      this.pre_img = event.target.files

      this.titleFile = this.pre_img[0].name
    },
    multipleLoadFile (event, index, name = 'q_pre_img') {
      let file = event.target.files[0]
      this.bundlesForm[index][name] = file
    },
    appendDateForm (data) {
      let fd = new FormData()

      for (let item in data) {
        if (item === 'pre_img') {
          if (!isEmpty(data[item])) {
            fd.append(item, data[item][0])
          }

          continue
        } else if (item === 'current_answer') {
          let isCurrentAnswer = '0'

          if (data[item]) {
            isCurrentAnswer = '1'
          }

          fd.append(item, isCurrentAnswer)

          continue
        }

        fd.append(item, data[item])
      }

      return fd
    },
    showImage (pathImage) {
      window.open(this.getServerName + pathImage)
    }
  },
  computed: {
    isIssetQuestion () {
      if (isEmpty(this.question)) {
        return false
      }

      return true
    },
    getServerName () {
      return config.serverNameDomain
    }
  },
  created () {
    window.addEventListener('click', this.bindWindowClick)

    this.searchHash()
  },
  components: {
    preLoader
  }
}
</script>
