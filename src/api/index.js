import axios from 'axios'
// import toastr from 'toastr'
// import store from '@/store'
import config from '@/default_config'

axios.defaults.baseURL = config.serverName2

// store.getters['user/getUsers'] - example get getters

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let token = localStorage.getItem('token')

  if (token !== null) {
    config.headers['Authorization'] = 'Bearer ' + token
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // localStorage.removeItem('token')
  // localStorage.removeItem('adminUser')

  // store.dispatch('user/authResponse', false)
  // store.commit('user/fillAuthUser', {})

  // store.dispatch('user/redirect', 'login')

  return Promise.reject(error)
})

export default {
  getTestUsersAdmin () {
    return axios.get('show.json')
  },
  auth (formData, isRegistration) {
    let url = (isRegistration) ? 'registration' : 'login'

    return axios.post(url + '.json', formData)
  },
  testPostRequest () {
    return axios.post('test.json')
  },
  getMe () {
    return axios.post('get_me.json')
  },
  logout () {
    return axios.get('logout.json')
  },
  test () {
    return axios.get('test.json')
  },
  getAllAdminUsers () {
    return axios.get('getAdminUsers.json')
  },
  getEducations () {
    return axios.get('getEducations.json')
  },
  verifiedAdminUser (userId) {
    return axios.get('verifiedAdminUser.json?' + 'userId=' + userId)
  },
  deleteAdminUser (userId) {
    return axios.get('deleteUser.json?' + 'userId=' + userId)
  },
  updateEducation (data) {
    return axios.post('updateEducation.json', data)
  },
  addEducation (data) {
    return axios.post('addEducation.json', data)
  },
  deleteEducation (data) {
    return axios.post('deleteEducation.json', data)
  },
  getFixedDepartaments (educationId) {
    return axios.get('getFixedDepartaments.json?' + 'educationId=' + educationId)
  },
  addDepartament (data) {
    return axios.post('addDepartament.json', data)
  },
  editDepartament (data) {
    return axios.post('updateDepartament.json', data)
  },
  deleteDepartament (data) {
    return axios.post('deleteDepartament.json', data)
  },
  getSpecialtyForIdDepartament (data) {
    return axios.post('getSpecialtyForIdDepartament.json', data)
  },
  addSpecialty (data) {
    return axios.post('addSpecialty.json', data)
  },
  editSpecialty (data) {
    return axios.post('editSpecialty.json', data)
  },
  deleteSpecialty (data) {
    return axios.post('deleteSpecialty.json', data)
  },
  getTickets (specialtyId) {
    return axios.get('getTickets.json?specialtyId=' + specialtyId)
  },
  addTicket (data) {
    return axios.post('addTicket.json', data)
  },
  deleteTicket (id) {
    return axios.post('deleteTicket.json', {id: id})
  },
  updateTicket (data) {
    return axios.post('updateTicket.json', data)
  },
  getQuestions (ticketId) {
    return axios.get('getQuestions.json?ticketId=' + ticketId)
  },
  saveQuestion (data) {
    return axios.post('saveQuestion.json', data)
  },
  deleteQuestion (id) {
    return axios.post('deleteQuestion.json', {id: id})
  },
  editQuestion (data) {
    return axios.post('editQuestion.json', data)
  },
  searchHash (hash) {
    return axios.get('searchHash.json?hash=' + hash)
  },
  addAnswer (data) {
    return axios.post('addAnswer.json', data)
  },
  deleteAnswer (id) {
    return axios.post('deleteAnswer.json', {id: id})
  },
  updateAnswer (data) {
    return axios.post('updateAnswer.json', data)
  },
  addBundles (data) {
    return axios.post('addBundles.json', data)
  },
  updateBundle (data) {
    return axios.post('updateBundle.json', data)
  },
  getEntrants () {
    return axios.get('getEntrants.json')
  },
  addEntrant (data) {
    return axios.post('addEntrant.json', data)
  },
  updateEntrant (data) {
    return axios.post('updateEntrant.json', data)
  },
  deleteEntrant (id) {
    return axios.post('deleteEntrant.json', {id: id})
  },
  verificationEntrant (data) {
    return axios.post('verificationEntrant.json', data)
  },
  getDataAndCheckRootUser (data) {
    return axios.post('getDataAndCheckRootUser.json', data)
  },
  addAnswerEntant (data) {
    return axios.post('addAnswerEntant.json', data)
  },
  resultTesting (id) {
    return axios.get('resultTesting.json?id_entrant=' + id)
  },
  multipleSavedImages (data) {
    return axios.post('multipleSavedImages.json', data)
  }
}
