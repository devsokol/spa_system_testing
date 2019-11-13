<template>
<div>
  <!-- Page Content -->
    <div id="page-content-wrapper">

      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <button class="btn btn-primary" id="menu-toggle" @click="togleMenu()" v-if="!isShowDepartamentPage">Перемикання меню</button>
        <router-link to="/cabinet">
          <button class="btn btn-info" id="backToCabinet" v-if="isShowDepartamentPage">Повернутись назад</button>
        </router-link>

        <button class="btn btn-success" v-if="isShowDepartamentPage" @click="$emit('modalAddDep')" data-toggle="modal" data-target="#exampleModalCenter">Додати кафедру</button>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
            <!-- <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li> -->
            <li class="nav-item">
              <span class="nav-link">{{ getNameUser }}</span>
            </li>
            <li class="nav-item">
              <span class="nav-link" @click="logout">Вийти</span>
            </li>
          </ul>
        </div>
      </nav>

      <!-- <div class="container-fluid"> -->
        <!-- <h1 class="mt-4">Simple Sidebar</h1>
        <p>The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will change.</p>
        <p>Make sure to keep all page content within the <code>#page-content-wrapper</code>. The top navbar is optional, and just for demonstration. Just create an element with the <code>#menu-toggle</code> ID which will toggle the menu when clicked.</p> -->
      <!-- </div> -->
    </div>
    <!-- /#page-content-wrapper -->
  </div>
</template>

<script>

import store from '@/store'
import api from '@/api'

import '@/css/slim_side_bar.css'
import '@/css/header.css'

export default {
  name: 'cabinetHeader',
  props: {
    isShowDepartamentPage: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    togleMenu () { document.getElementById('wrapper_bar').classList.toggle('toggled') }, // toogle slimSideBar,
    logout () {
      api.logout()
        .then(res => {
          localStorage.removeItem('token')
          localStorage.removeItem('adminUser')

          store.commit('user/fillAuthUser', {})
          store.dispatch('user/authResponse', false)

          this.$router.push('/')
        })
        .catch(rej => {
          console.log('Помилка в блоці catch fucntion logout')
        })
    }
  },
  computed: {
    getNameUser () {
      return store.state.user.authUser.name
    }
  }
}
</script>
