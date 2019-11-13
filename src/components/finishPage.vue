<template>
  <div class="result-wrapper">
    <div class="result-content">
      <h1>Тестування завершено</h1>
      <h2>Повідомте вчителя!</h2>
      <!-- <button class="btn btn-primary">Завантажити результат</button> -->
    </div>
    <vue-particles
        color="#494949"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#494949"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      ></vue-particles>
  </div>
</template>

<script>

import Vue from 'vue'
import VueParticles from 'vue-particles'
import '@/css/finishPage.css'

Vue.use(VueParticles)

export default {
  name: 'finishPage',
  methods: {
    loadParticleJs () {

    }
  },
  created () {
    this.loadParticleJs()
  }
}
</script>
