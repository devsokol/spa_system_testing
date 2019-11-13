<template>
  <div class="wrapper_ticket w-100">
    <!-- pre loader -->
    <preLoader v-if="preLoader"></preLoader>

    <div class="content_tickets" v-else>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <button class="btn btn-success"
                data-toggle="modal"
                data-target="#exampleModalCenter"
                @click="selectTicket({})"
              >
                Додати білет
              </button>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <select class="form-control mr-sm-2" id="select-specialty-filter" v-on:change="selectSpecialtyFilter">
              <option value="" disabled selected>Виберіть спеціальність</option>
              <option value="-1">Всі</option>
              <option v-for="(item, index) in specialty" :key="index" :value="item.id">
                {{item.title}}
              </option>
            </select>
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="searchTicketsBySpecialty">Пошук</button>
          </form>
        </div>
      </nav>
      <div class="ticket-content" v-if="getAllTickets.length">
        <!-- cards table -->
        <div class="block-tikets" v-for="(ticket, index) in getAllTickets" :key="index">
          <div class="card" style="width: 18rem;">
            <img :src="require('@/assets/tickets_image/'+ticket.specialty.pre_path)" class="card-img-top" alt="logo ticket" v-if="ticket.specialty.pre_path" height="200">
            <img src="@/assets/tickets_image/placeholder.png" class="card-img-top" alt="placeholder" height="200" v-else>
            <div class="card-body">
              <div class="card-body-cust">
                <h5 class="card-title">{{ ticket.title }}</h5>
                <div class="ticket-actions">
                  <i
                    class="far fa-edit"
                    data-toggle="modal"
                    title="Редагувати"
                    data-target="#exampleModalCenter"
                    @click="selectTicket(ticket)"
                  ></i>
                  <i
                    class="far fa-trash-alt"
                    title="Видалити"
                    @click="deleteTicket(ticket.id)"
                  ></i>
                  <i
                    class="far fa-eye"
                    title="Переглянути питання"
                  ></i>
                </div>
              </div>
            </div>
            <ul class="list-group list-group-flush" id="ticket-list">
              <li class="list-group-item">Час проходження білета: {{ ticket.time_of_passing }}хв</li>
              <li class="list-group-item">Загальна кількість питань: {{ ticket.count_question }}</li>
              <li class="list-group-item">Поточна кількість питань: {{ ticket.count_questions_marge }}</li>
              <li class="list-group-item">Спеціальність: {{ ticket.specialty.title }}</li>
            </ul>
          </div>
        </div>
        <!-- end card table -->
      </div>
      <div class="text-center playholder-table" v-else>
        <img src="@/assets/search_playcholder.png" alt="" width="100">
        <h2>Нічого не знайдено</h2>
        <h2 >Спробуйте налаштувати фільтр</h2>
      </div>

      <!-- Modal add ticket-->
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">{{ (!Object.keys(this.activeTicket).length ? 'Додати' : 'Редагувати') + ' білет' }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label for="basic-url">Заголовок</label>
              <input type="text" class="form-control" placeholder="Білет 1" v-model="form.title">
              <label for="basic-url">Час проходження в (хв)</label>
              <input type="number" class="form-control" placeholder="наприклад 60" v-model="form.time_of_passing">
              <label for="basic-url">Загальна кількість питань</label>
              <input type="number" class="form-control" placeholder="наприклад 20" v-model="form.count_question">
              <label for="basic-url">Спеціальність</label>
              <select class="form-control" v-model="form.id_specialty">
                <option selected></option>
                <option v-for="(item, index) in specialty" :key="index" :value="item.id">
                  {{item.title}}
                </option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
              <button type="button" class="btn btn-primary" @click="updateTicket" v-if="Object.keys(this.activeTicket).length">
                Оновити <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
              </button>
              <button type="button" class="btn btn-success" @click="saveTicket" v-else>
                Зберегти <i class='fa fa-spinner fa-spin fa-fw' v-if="btnLoader"></i>
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
import isEmpty from 'lodash/isEmpty'
import 'toastr/build/toastr.min.css'
import api from '@/api'
import '@/css/tickets.css'
import preLoader from '@/components/preLoader'
import {mapState} from 'vuex'

export default {
  name: 'addTickets',
  data () {
    return {
      tickets: [],
      preLoader: true,
      specialtyId: false,
      activeTicket: {},
      btnLoader: false,
      form: {
        title: '',
        time_of_passing: 60,
        count_question: 20,
        id_specialty: 0
      }
    }
  },
  methods: {
    getTickets () {
      api.getTickets(this.specialtyId)
        .then(res => {
          this.tickets = res.data.data.tickets

          this.preLoader = false
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch function getTickets', resErr)
        })
    },
    selectSpecialtyFilter (event) {
      this.specialtyId = parseInt(event.target.options[event.target.selectedIndex].value)
    },
    searchTicketsBySpecialty () {
      if (!this.specialtyId) {
        toastr.error('Виберіть спеціальність')
        return false
      }

      if (this.specialtyId === -1) {
        this.specialtyId = false
      }

      this.preLoader = true
      this.getTickets()
    },
    selectTicket (ticket = {}) {
      this.activeTicket = ticket

      if (!isEmpty(this.activeTicket)) {
        this.form.title = this.activeTicket.title
        this.form.time_of_passing = this.activeTicket.time_of_passing
        this.form.count_question = this.activeTicket.count_question
        this.form.id_specialty = this.activeTicket.id_specialty
      } else {
        this.form.title = ''
        this.form.time_of_passing = 60
        this.form.count_question = 20
        this.form.id_specialty = 0
      }
    },
    saveTicket () {
      if (!this.form.id_specialty) {
        toastr.error('Виберіть спеціальність')
        return false
      }

      this.btnLoader = true

      api.addTicket(this.form)
        .then(res => {
          if (res.data.success) {
            this.tickets.push(res.data.data.ticket)

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }

          this.btnLoader = false
        }).catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    },
    updateTicket () {
      if (!this.form.id_specialty) {
        toastr.error('Виберіть спеціальність')
        return false
      }

      this.btnLoader = true

      let params = this.form
      params.id = this.activeTicket.id

      api.updateTicket(params)
        .then(res => {
          if (res.data.success) {
            let index = this.tickets.findIndex(i => i.id === params.id)
            this.tickets[index] = res.data.data.ticket

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
    deleteTicket (id) {
      api.deleteTicket(id)
        .then(res => {
          if (res.data.success) {
            let index = this.tickets.findIndex(i => i.id === id)
            this.$delete(this.tickets, index)

            toastr.success(res.data.message)
          } else {
            toastr.error(res.data.message)
          }
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch', resErr)
        })
    }
  },
  computed: {
    ...mapState('general', [
      'specialty'
    ]),
    getAllTickets () {
      return this.tickets
    }
  },
  created () {
    this.getTickets()
  },
  components: {
    preLoader
  }
}
</script>
