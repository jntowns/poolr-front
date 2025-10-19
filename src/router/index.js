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
            component: HomePage,
            meta: { title: 'Home' }
        },
        {
            path: '/about',
            name: 'about',
            component: AboutPage,
            meta: { title: 'About' }
        },
        {
            path: '/offer-ride',
            name: 'offerRide',
            component: OfferRidePage,
            meta: { title: 'Offer Ride' }
        },
        {
            path: '/find-ride',
            name: 'findRide',
            component: FindRidePage,
            meta: { title: 'Find Ride' }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { title: 'Login' }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage,
            meta: { title: 'Register' }
        },
        {
            path: '/map',
            name: 'map',
            component: MapPage,
            meta: { title: 'Map' }
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = `Poolr - ${to.meta.title}`
    next()
})

export default router