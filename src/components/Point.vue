<template>
  <div class="wrapper">

    <!-- navs -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo03"
        aria-controls="navbarTogglerDemo03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div>
        <img src="@/assets/herb.png" width="40" height="40" alt="logo DDPU">
        <span class="navbar-brand" id="title">Дрогобицький педагогічний університет імені Івана Франка</span>
      </div>

      <div class="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo03">
        <ul class="navbar-nav" v-if="!checkAuth">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Увійти</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/registration">Зареєструватися</router-link>
          </li>
        </ul>
        <ul class="navbar-nav" v-else>
          <li class="nav-item">
            <router-link class="nav-link" to="/cabinet">Адмін панель</router-link>
          </li>
          <li class="nav-item">
            <span class="nav-link" @click="logout" id="logout">Вийти</span>
          </li>
        </ul>
      </div>
    </nav>
    <!-- end navs -->

    <!-- slider -->
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <button class="btn btn-success btn-lg" id="beginTest" @click="beginTest()">Почати тестування</button>
        <div class="carousel-item active">
          <img src="@/assets/8.jpg" class="d-block w-100" alt="photo one">
        </div>
        <div class="carousel-item">
          <img src="@/assets/10.jpg" class="d-block w-100" alt="photo two">
        </div>
        <div class="carousel-item">
          <img src="@/assets/12.jpg" class="d-block w-100" alt="photo three">
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
    <!-- end slider -->

  </div>
</template>

<script>

import store from '@/store'
import isEmpty from 'lodash/isEmpty'
import api from '@/api'
import '@/css/point.css'

export default {
  name: 'Point',
  data () {
    return {
      btnNameGetUsers: 'Get Users',
      storeBtnName: 'Get store variable',
      authUser: {}
    }
  },
  methods: {
    beginTest () {
      this.$router.push('access-entrants')
    },
    logout () {
      api.logout()
        .then(res => {
          localStorage.removeItem('token')
          localStorage.removeItem('adminUser')

          store.commit('user/fillAuthUser', {})
          store.dispatch('user/authResponse', false)

          this.authUser = {}
        })
        .catch(rej => {
          console.log('Помилка в блоці catch')
        })
    }
  },
  computed: {
    checkAuth () {
      return !isEmpty(this.authUser)
    }
  },
  created () {
    this.authUser = JSON.parse(localStorage.getItem('adminUser')) || {}
  }
}
</script>
