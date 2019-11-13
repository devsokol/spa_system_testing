<template>
  <div class="admin_users w-100">

    <preLoader v-if="pre_loader"></preLoader>

    <!-- start table -->
    <table class="table table-striped" v-else>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Ім`я</th>
          <th scope="col">Прізвище</th>
          <th scope="col">Логін</th>
          <!-- <th scope="col">Примітка</th> -->
          <th scope="col">Роль</th>
          <!-- <th scope="col">Підрозділ</th> -->
          <th scope="col">Кафедра</th>
          <th></th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="(user, index) in adminUsers" :key="index">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.login }}</td>
          <!-- <td>{{ (user.about) ? user.about : '-' }}</td> -->
          <td>{{ user.admin_role.title }}</td>
          <!-- <td>{{ (user.id_education) ? user.educational_subdivision.title : '-' }}</td> -->
          <td>{{ (user.id_departament) ? user.departament.title : '-' }}</td>

          <td class="actions">
            <i class="fas fa-user-check" data-toggle="modal" :class="{'active': !user.is_ver}" data-target="#exampleModalCenter" style="color: green; margin-right: 10px;" @click="activeUser = user"></i>
            <i class="fas fa-trash-alt" title="Видалити" style="color: red;" @click="activeUser = user" data-target="#myModal" data-toggle="modal"></i>
          </td>

        </tr>
      </tbody>
    </table>
    <!-- end table -->

    <!-- Modal ver users-->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">{{ (activeUser.is_ver) ? 'Забрати доступ' : 'Надати доступ' }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{ (activeUser.is_ver) ? 'Користувач не буде мати доступа до адмін панелі' : 'Надати доступ в адмін панель' }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
            <button type="button" class="btn btn-primary" @click="verifiedUser" data-dismiss="modal">Підтвердити</button>
          </div>
        </div>
      </div>
    </div>

    <!-- delete user -->
    <!-- The Modal -->
    <div class="modal" id="myModal">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header ">
            <h4 class="modal-title text-secondary">Видалення користувача</h4>
          </div>

          <!-- Modal body -->
          <div class="modal-body text-center">
            <img src="@/assets/deleteModal.png" class="mx-auto d-block" alt="видалення користувача" width="200">
            <span class="text-secondary">Ви впевнені що хочете видалити?</span>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer mx-auto d-block">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
            <button type="button" class="btn btn-danger" data-loading-text="<i class='fa fa-spinner fa-spin fa-fw' aria-hidden='true'></i>" @click="deleteUser">Видалити</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>

// import store from '@/store'
import toastr from 'toastr'
// import _ from 'lodash'
// import 'toastr/build/toastr.min.css'
import api from '@/api'
import preLoader from '@/components/preLoader'
import '@/css/admin_users.css'

export default {
  name: 'adminUsers',
  data () {
    return {
      adminUsers: [],
      pre_loader: true,
      activeUser: {},
      showModalDeleteUser: true
    }
  },
  methods: {
    getAdminUsers () {
      api.getAllAdminUsers()
        .then(res => {
          this.adminUsers = res.data.data.adminUsers
          this.pre_loader = false
        })
        .catch(resErr => {
          console.log('Сталась помилка файл adminUsers ', resErr)
        })
    },
    verifiedUser () {
      api.verifiedAdminUser(this.activeUser.id)
        .then(res => {
          if (res.data.success) {
            toastr.info(res.data.message)

            this.getAdminUsers()
          } else {
            toastr.error(res.data.message)
          }
        })
        .catch(resErr => {
          toastr.error('Помилка сервера')
          console.log('помилка в блоці catch function verifiedUser', resErr)
        })
    },
    deleteUser (e) {
      let nativeText = e.target.innerHTML
      e.target.innerHTML = "<i class='fa fa-spinner fa-spin fa-fw'></i>"

      api.deleteAdminUser(this.activeUser.id)
        .then(res => {
          this.getAdminUsers()

          toastr.info(res.data.message)
          e.target.innerHTML = nativeText
        })
        .catch(resErr => {
          console.log('Помилка в блоці catch function deleteUser', resErr)
        })
    }
  },
  created () {
    this.getAdminUsers()
  },
  components: {
    preLoader
  }
}
</script>
