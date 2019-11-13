<template>
  <div class="wrapper-access-entrants">
    <div class="content-access-entrant">
      <form class="form-group form-entrants-access">
        <!-- name -->
        <div class="form-destination">
          <label for="first_name">І'мя</label>
          <input type="text" class="form-control" name="first_name" v-model="form.first_name">
        </div>

        <!-- sirname -->
        <div class="form-destination">
          <label for="last_name">Прізвище</label>
          <input type="text"  class="form-control mr-sm-2" name="last_name" v-model="form.last_name">
        </div>

        <!-- age -->
        <div class="form-destination">
          <label for="age">Рік народження д/м/р</label>
          <input type="date"  class="form-control mr-sm-2" name="age" v-model="form.age">
        </div>

        <!-- btn verification -->
        <div class="form-destination">
          <label>&#8194;</label>
          <button class="form-control btn btn-success" @click="verification">
            Верифікація
            <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
          </button>
        </div>
      </form>

      <button class="btn btn-primary"
        id="next-btn1"
        data-toggle="modal"
        data-target="#exampleModalLong"
        v-if="Object.keys(this.entrant).length"
      >
        Далі
      </button>
    </div>

    <!-- agreee modal -->
    <!-- Modal -->
    <div class="modal fade agree-modal" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" v-if="Object.keys(this.entrant).length">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Угода</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <b>
              <center>
              &emsp; ПОЯСНЮВАЛЬНА ЗАПИСКА ДО ТЕСТУ З ФАХОВИХ ДИСЦИПЛІН <br> СПЕЦІАЛЬНОСТІ {{ this.entrant.specialty.title.toUpperCase() }}
              <br>
              {{ this.ticket.title.toUpperCase() }}
              </center>
            </b>
            &emsp; Зміст тесту визначається на основі Програми фахового випробування для вступників, які вступають на навчання за спеціальністю {{ this.entrant.specialty.full_name }} для здобуття освітнього ступеня бакалавра або магістра. <br>
            &emsp; Фахове випробування проводиться у формі тестування. Загальна кількість завдань тесту – {{ this.ticket.count_question }}. Тривалість фахового випробування – {{ this.ticket.time_of_passing }} хвилин. <br>
            &emsp; Тест складається із завдань трьох форм: <br>
            <b>
              &emsp;1.&nbsp;Завдання з вибором однієї правильної відповіді.
            </b>
            До кожного завдання подано чотири варіанти відповіді, з яких лише один правильний.
            Завдання вважається виконаним, якщо вступник вибрав і записав у бланк письмової роботи правильну відповідь у такому форматі:
            <br>
            <b>
              &emsp;2.&nbsp;Завдання на встановлення відповідності (логічні пари).
            </b>
            До кожного завдання подано інформацію, позначену цифрами від 1 до 4 (ліворуч) і буквами від А до Г (праворуч).
            Щоб виконати завдання, необхідно встановити відповідність інформації, позначеної цифрами та буквами (утворити логічні пари).
            Завдання вважається виконаним, якщо вступник утворив і записав у бланк письмової роботи правильні логічні пари у такому форматі:
            <br>
            <b>
              &emsp;3.&nbsp;Завдання відкритої форми з короткою відповіддю.
            </b>
            Під час виконання цих завдань потрібно записати у бланк письмової роботи отриманий результат у такому форматі:
            <br><br>
            <b>
              <center>Критерії оцінювання завдань тесту:</center>
            </b><br>
            &emsp; <b> Завдання з вибором однієї правильної відповіді </b> оцінюється в <b> 0 </b> або <b> 1 </b> тестовий бал. <b> 1 </b> бал, якщо вказано правильну відповідь; 0 балів, якщо вказано неправильну відповідь, або вказано більше однієї відповіді, або відповіді не надано.
            <br>
            &emsp; <b> Завдання на встановлення відповідності (логічні пари) </b> оцінюється в <b> 0, 1, 2, 3 </b> або <b> 4 </b> тестових бали: <b> 1 </b> бал за кожну правильно встановлену відповідність (логічну пару); <b> 0 </b> балів, якщо не вказано жодної правильної логічної пари або відповіді на завдання не надано.
            <br>
            &emsp; <b> Завдання відкритої форми з короткою відповіддю </b> оцінюється <b> 0 </b> або <b> 2 </b> тестових балів: <b> 2 </b> бали за кожну правильну відповідь; <b> 0 </b> балів, якщо зазначено неправильні відповіді або завдання взагалі не виконано.
            <br>
            &emsp; Максимальна кількість балів, яку може набрати вступник, правильно виконавши всі завдання, –<b>50</b>.
            <br><br>
            &emsp; Отриманий тестовий бал переводиться у бал за шкалою 100 - 200 балів за таблицею.

            <table class="table-agree">
              <tr>
                <th>Тестовий бал</th>
                <th>Бал 100-200</th>
                <th>Тестовий бал</th>
                <th>Бал 100-200</th>
                <th>Тестовий бал</th>
                <th>Бал 100-200</th>
                <th>Тестовий бал</th>
                <th>Бал 100-200</th>
                <th>Тестовий бал</th>
                <th>Бал 100-200</th>
              </tr>
              <tr v-for="(i, index) in fixtureForTable" :key="index">
                <td>{{ i.c1 }}</td>
                <td>{{ i.c2 }}</td>
                <td>{{ i.c3 }}</td>
                <td>{{ i.c4 }}</td>
                <td>{{ i.c5 }}</td>
                <td>{{ i.c6 }}</td>
                <td>{{ i.c7 }}</td>
                <td>{{ i.c8 }}</td>
                <td>{{ i.c9 }}</td>
                <td>{{ i.c10 }}</td>
              </tr>
            </table>
            <br>
            &emsp; Тут буде писати що це все офіційно і якщо ви згідні із всіма вимогами підтвердіть!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Не погоджуюсь</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="agree">Погоджуюсь</button>
          </div>
        </div>
      </div>
    </div>
    <!-- end modal -->

  </div>
</template>

<script>

import isEmpty from 'lodash/isEmpty'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import '@/css/access-entrants.css'
import api from '@/api'

export default {
  name: 'accessEntrants',
  data () {
    return {
      form: {
        first_name: '',
        last_name: '',
        age: ''
      },
      btnLoader: false,
      entrant: {},
      ticket: {},
      fixtureForTable: [
        {
          c1: 0,
          c2: 'не склав',
          c3: 11,
          c4: 102.5,
          c5: 22,
          c6: 130.0,
          c7: 33,
          c8: 157.5,
          c9: 44,
          c10: 185.0
        },
        {
          c1: 1,
          c2: 'не склав',
          c3: 12,
          c4: 105.0,
          c5: 23,
          c6: 132.5,
          c7: 34,
          c8: 160,
          c9: 45,
          c10: 187.5
        },
        {
          c1: 2,
          c2: 'не склав',
          c3: 13,
          c4: 107.5,
          c5: 24,
          c6: 135,
          c7: 35,
          c8: 162.5,
          c9: 46,
          c10: 190
        },
        {
          c1: 3,
          c2: 'не склав',
          c3: 14,
          c4: 110,
          c5: 25,
          c6: 137.5,
          c7: 36,
          c8: 165,
          c9: 47,
          c10: 192.5
        },
        {
          c1: 4,
          c2: 'не склав',
          c3: 15,
          c4: 112.5,
          c5: 26,
          c6: 140,
          c7: 37,
          c8: 167.5,
          c9: 48,
          c10: 195
        },
        {
          c1: 5,
          c2: 'не склав',
          c3: 16,
          c4: 115.0,
          c5: 27,
          c6: 142.5,
          c7: 38,
          c8: 170,
          c9: 49,
          c10: 197.5
        },
        {
          c1: 6,
          c2: 'не склав',
          c3: 17,
          c4: 117.5,
          c5: 28,
          c6: 145,
          c7: 39,
          c8: 172.5,
          c9: 50,
          c10: 200
        },
        {
          c1: 7,
          c2: 'не склав',
          c3: 18,
          c4: 120,
          c5: 29,
          c6: 147.5,
          c7: 40,
          c8: 175,
          c9: '-',
          c10: '-'
        },
        {
          c1: 8,
          c2: 'не склав',
          c3: 19,
          c4: 122.5,
          c5: 30,
          c6: 150.0,
          c7: 41,
          c8: 177.5,
          c9: '-',
          c10: '-'
        },
        {
          c1: 9,
          c2: 'не склав',
          c3: 20,
          c4: 125,
          c5: 31,
          c6: 152.5,
          c7: 42,
          c8: 180,
          c9: '-',
          c10: '-'
        },
        {
          c1: 10,
          c2: 100.00,
          c3: 21,
          c4: 127.5,
          c5: 32,
          c6: 155,
          c7: 43,
          c8: 182.5,
          c9: '-',
          c10: '-'
        }
      ]
    }
  },
  methods: {
    verification (e) {
      e.preventDefault()

      let map = {
        first_name: 'Ім\'я',
        last_name: 'Прізвище',
        age: 'Рік народження'
      }

      for (let item in this.form) {
        if (isEmpty(this.form[item])) {
          toastr.error('Поле ' + map[item] + ' не може бути пустим!')
          return false
        }
      }

      this.btnLoader = true
      this.entrant = {}
      localStorage.removeItem('entrant')

      api.verificationEntrant(this.form)
        .then(res => {
          if (res.data.success) {
            this.entrant = res.data.data.entrant
            this.ticket = res.data.data.ticket

            console.log(this.ticket)
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
    agree () {
      localStorage.setItem('entrant', JSON.stringify(this.entrant))

      this.$router.push('testing')
    }
  }
}
</script>
