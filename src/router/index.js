import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import OfferRidePage from '../views/OfferRidePage.vue'
import FindRidePage from '../views/FindRidePage.vue'
import AboutPage from '../views/AboutPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import MapPage from '../views/MapPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/about',
            name: 'about',
            component: AboutPage
        },
        {
            path: '/offer-ride',
            name: 'offerRide',
            component: OfferRidePage
        },
        {
            path: '/find-ride',
            name: 'findRide',
            component: FindRidePage
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage
        },
        {
            path: '/map',
            name: 'map',
            component: MapPage
        }
    ]
})

export default router