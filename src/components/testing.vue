<template>
  <div class="wrapper-testing">
    <!-- pre loader -->
    <preLoader v-if="preLoader"></preLoader>

    <div class="content-testing" v-else>
      <!-- timer -->
      <div class="block-time">
        <i class="far fa-clock"></i> <span id="time">{{ timer }}</span>
      </div>
      <div class="test-page">
        <h1 class="test-title text-center2">{{ ticket.title }}</h1>
        <div class="test-container">

          <!-- navigator -->
          <div class="test-navigation">
            <button
              class="navi-btn"
              :class="{
                'active': paginationNumber === i,
                'passed': isPassEntrant(i)
              }"
              v-for="(i, index) in questions.length"
              :key="index"
              @click="changeNumberPagination(i)"
            >
            {{ i }}
            </button>
          </div>

          <!-- content testing -->
          <div class="test-content">

            <!-- question -->
            <div class="test-question">
              {{ currentQuestion.title }}
              <div v-if="currentQuestion.pre_img">
                <img :src="getServerName + currentQuestion.pre_img" class="q-img-testing">
              </div>
            </div>

            <!-- block answers -->
            <div class="answers-block">

              <div class="answer-element" v-for="(answer, index) in currentQuestion.answers" :key="index">

                <!-- One Assoc -->
                <div v-if="currentQuestion.id_type === 1">
                  <input type="radio" :value="answer.id" :id="'oneAssoc_' + answer.id" :name="'oneAssoc_' + currentQuestion.id" v-model="selectAnswer.oneAssoc">
                  <label :for="'oneAssoc_' + answer.id">
                    {{ answer.title }}
                  </label>
                </div>

                <!-- Many Assoc -->
                <div v-if="currentQuestion.id_type === 2">
                  <input type="checkbox" :value="answer.id" :id="'manyAssoc_' + answer.id" :name="currentQuestion.id" v-model="selectAnswer.manyAssoc">
                  <label :for="'manyAssoc_' + answer.id">
                    {{ answer.title }}
                  </label>
                </div>

                <!-- Assoc -->
                <div v-if="currentQuestion.id_type === 3" class="face-wrapper">
                  <!-- bundles questions -->
                  <div class="block-answer-1">
                    <ul id="ul-block-one">
                      <li
                        v-for="(i, index) in currentQuestion.move_bundles.questions"
                        :key="index"
                        @click="selectBubleQuestion"
                        :value="i.id"
                      >
                        {{ i.title }}
                      </li>
                    </ul>
                  </div>

                  <!-- bundles answers -->
                  <div class="block-answer-2">
                    <ul id="ul-block-two">
                      <li
                        v-for="(i, index) in currentQuestion.move_bundles.answers"
                        @click="selectBubleAnswer"
                        :key="index"
                        :value="i.id"
                      >
                        {{ i.title }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Word -->
                <div v-if="currentQuestion.id_type === 4">
                  <textarea type="text"
                  class="form-control"
                  placeholder="Введіть відповідь"
                  rows="4"
                  v-model="selectAnswer.word"
                  ></textarea>
                </div>

              </div>

            </div>

          </div>

          <!-- btn next and back -->
          <div class="test-control">
            <button class="test-control-btn" @click="nextPaginationSaveAnswer">
              Далі
            </button>
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
import '@/css/testing.css'
import preLoader from '@/components/preLoader'
import isEmpty from 'lodash/isEmpty'
import config from '@/default_config'

export default {
  name: 'testing',
  data () {
    return {
      entrant: {},
      preLoader: false,
      questions: [],
      currentQuestion: {},
      ticket: {},
      paginationNumber: 1,
      colors: [
        {
          color: '#8823ed',
          isAvailable: true
        },
        {
          color: '#ff7200',
          isAvailable: true
        },
        {
          color: '#e50658',
          isAvailable: true
        },
        {
          color: '#0bbf17',
          isAvailable: true
        }
      ],
      isOneTableToClick: false,
      isTwoTableToClick: false,
      activeOneLi: {},
      associations: [],
      // logic
      selectAnswer: {
        oneAssoc: false,
        manyAssoc: [],
        word: ''
      },
      resultData: [],
      timer: '',
      interval: null
    }
  },
  methods: {
    getDataAndCheckRootUser () {
      this.preLoader = true

      api.getDataAndCheckRootUser({id: this.entrant.id})
        .then(res => {
          if (res.data.success) {
            let data = res.data.data

            this.questions = data.questions
            this.ticket = data.ticket

            let pointQuestion = this.questions[0]

            if (!isEmpty(data.entrant_answers)) {
              this.resultData = data.entrant_answers

              // search не проходженого питанння
              for (let item in this.questions) {
                let res = this.resultData.find(i => i.id_question === this.questions[item].id)

                if (!res) {
                  pointQuestion = this.questions[item]
                  this.paginationNumber = parseInt(item) + 1

                  break
                }
              }
            }

            this.currentQuestion = pointQuestion

            // start timer
            this.startTimer()
          } else {
            toastr.error(res.data.message)
            this.$router.push('/access-entrants')
            return false
          }

          this.preLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    changeNumberPagination (number) {
      let nextQuestion = this.questions[number - 1]

      // find select answer
      let isIssetUserAnswer = this.resultData.find(i => i.id_question === nextQuestion.id)

      if (isIssetUserAnswer) {
        return false
      }

      // change answer
      this.currentQuestion = nextQuestion

      // change navigator number
      this.paginationNumber = number

      // clear
      this.clearAnswersUser()
    },
    selectBubleQuestion (e) {
      let li = e.target

      if (li.style['0'] || this.isOneTableToClick) {
        return false
      }

      this.isTwoTableToClick = false
      this.isOneTableToClick = true

      let findColor = this.colors.find(i => i.isAvailable)

      if (!findColor) return false

      li.style.borderColor = findColor.color
      li.style.borderRightWidth = '5px'

      this.activeOneLi.color = findColor.color
      this.activeOneLi.value = li.value

      this.colors.forEach((i, index) => {
        if (i.color === findColor.color) {
          i.isAvailable = false
        }
      })
    },
    selectBubleAnswer (e) {
      let li = e.target

      if (isEmpty(this.activeOneLi) || this.isTwoTableToClick || li.style['0']) {
        return false
      }

      this.isTwoTableToClick = true
      this.isOneTableToClick = false

      li.style.borderColor = this.activeOneLi.color
      li.style.borderLeftWidth = '5px'

      this.associations.push(
        {
          id_question: this.activeOneLi.value,
          id_answer: li.value
        }
      )
    },
    nextPaginationSaveAnswer () {
      if (!this.checkValidSelectAnswerAndSave()) {
        return false
      }

      this.clearAnswersUser()

      let isTrue = true
      let index = this.paginationNumber

      if (this.resultData.length === this.questions.length) {
        this.finishTesting()

        return false
      }

      while (isTrue) {
        if (index >= this.questions.length) {
          index = 0
        }

        let isPassed = this.resultData.find(i => i.id_question === this.questions[index].id)

        if (!isPassed) {
          this.currentQuestion = this.questions[index]
          this.paginationNumber = index + 1

          isTrue = false
        }

        index++
      }
    },
    clearAnswersUser () {
      this.selectAnswer.oneAssoc = false
      this.selectAnswer.manyAssoc = []
      this.selectAnswer.word = ''

      this.clearAssoc()
    },
    clearAssoc () {
      let ulQuestionsAssoc = document.getElementById('ul-block-one')
      let ulAnswersAssoc = document.getElementById('ul-block-two')

      if (!ulQuestionsAssoc || !ulAnswersAssoc) {
        return false
      }

      this.associations = []
      this.activeOneLi = {}

      this.isOneTableToClick = false
      this.isTwoTableToClick = false

      this.colors.forEach(i => {
        i.isAvailable = true
      })

      for (let i = 0; i < ulQuestionsAssoc.children.length; i++) {
        ulQuestionsAssoc.children[i].style.borderColor = ''
        ulQuestionsAssoc.children[i].style.borderLeftWidth = ''
      }

      for (let i = 0; i < ulAnswersAssoc.children.length; i++) {
        ulAnswersAssoc.children[i].style.borderColor = ''
        ulAnswersAssoc.children[i].style.borderLeftWidth = ''
      }
    },
    checkValidSelectAnswerAndSave () {
      switch (this.currentQuestion.id_type) {
        case 1:
          if (!this.selectAnswer.oneAssoc) {
            toastr.error('Виберіть відповідь!')

            return false
          }

          this.saveDbAnswers(this.selectAnswer.oneAssoc)

          this.resultData.push({
            id_question: this.currentQuestion.id,
            id_answer: this.selectAnswer.oneAssoc
          })

          break

        case 2:
          if (isEmpty(this.selectAnswer.manyAssoc)) {
            toastr.error('Виберіть відповіді!')

            return false
          }

          this.saveDbAnswers(this.selectAnswer.manyAssoc)

          this.resultData.push({
            id_question: this.currentQuestion.id,
            id_answer: this.selectAnswer.manyAssoc
          })

          break

        case 3:
          if (isEmpty(this.associations) || this.associations.length !== 4) {
            toastr.error('Виберіть всі асоціації!')

            return false
          }

          this.saveDbAnswers(this.associations)

          this.resultData.push({
            id_question: this.currentQuestion.id,
            associations: this.associations
          })

          break

        case 4:
          if (isEmpty(this.selectAnswer.word)) {
            toastr.error('Введіть відповідь!')

            return false
          }

          this.saveDbAnswers(this.selectAnswer.word)

          this.resultData.push({
            id_question: this.currentQuestion.id,
            word: this.selectAnswer.word
          })

          break
      }

      return true
    },
    saveDbAnswers (answers) {
      api.addAnswerEntant({
        id_question: this.currentQuestion.id,
        id_entrant: this.entrant.id,
        answers: answers
      })
        .then(res => {
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch: ', resErr)
        })
    },
    isPassEntrant (index) {
      let indexQuestion = index - 1
      let findQuestionPass = this.resultData.find(i => i.id_question === this.questions[indexQuestion].id)

      return findQuestionPass
    },
    finishTesting () {
      // delete cookies and interval
      clearInterval(this.interval)
      this.deleteCokie('timer')

      // delete item store entant
      localStorage.removeItem('entrant')

      this.$router.push('result') // this is referer final page

      api.resultTesting(this.entrant.id)
        .then(res => {
          console.log(res)
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    },
    deleteCokie (name) {
      document.cookie = name + '=; Max-Age=-99999999;'
    },
    startTimer () {
      if (!this.getCookie('timer')) {
        this.setCookieTimer(this.ticket.time_of_passing * 60)
      }

      var pointTime = (time) => {
        let minutes = parseInt(timer / 60, 10)
        let seconds = parseInt(timer % 60, 10)

        let minutesD = minutes < 10 ? '0' + minutes : minutes
        let secondsD = seconds < 10 ? '0' + seconds : seconds

        return minutesD + ':' + secondsD
      }

      var timer = this.getCookie('timer')
      this.timer = pointTime(timer)

      this.interval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10)
        let seconds = parseInt(timer % 60, 10)

        let minutesD = minutes < 10 ? '0' + minutes : minutes
        let secondsD = seconds < 10 ? '0' + seconds : seconds

        this.timer = minutesD + ':' + secondsD

        if (--timer < 0) {
          clearInterval(this.interval)

          this.finishTesting()
        }

        this.setCookieTimer(timer)
      }, 1000)
    },
    setCookieTimer (time) {
      var date = new Date(new Date().getTime() + 4 * 60 * 60 * 1000) // 4 hours
      document.cookie = 'timer=' + time + '; path=/; expires=' + date.toUTCString()
    },
    getCookie (name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      if (match) return match[2]
    },
    deleteCookie () {
      var date = new Date(0)
      document.cookie = 'name=; path=/; expires=' + date.toUTCString()
    }
  },
  computed: {
    getServerName () {
      return config.serverNameDomain
    }
  },
  created () {
    if (!localStorage.getItem('entrant')) {
      this.$router.push('/access-entrants')
      return false
    }

    this.entrant = JSON.parse(localStorage.getItem('entrant'))

    this.getDataAndCheckRootUser()
  },
  components: {
    preLoader
  }
}
</script>
