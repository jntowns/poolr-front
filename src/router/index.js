import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import OfferRidePage from "../views/OfferRidePage.vue";
import DriverSetupPage from "../views/DriverSetupPage.vue";
import FindRidePage from "../views/FindRidePage.vue";
import AboutPage from "../views/AboutPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import MapPage from "../views/MapPage.vue";
import ErrorPage from "../views/ErrorPage.vue";
import MyProfilePage from "../views/MyProfilePage.vue";
import RideDetailsPage from "../views/RideDetailsPage.vue";
import TransactionPage from "../views/TransactionPage.vue";
import SettingsPage from "../views/SettingsPage.vue";
import RideHistoryPage from "../views/RideHistoryPage.vue";
import TicketsPage from "../views/TicketsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { title: "Home" },
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage,
      meta: { title: "About" },
    },
    {
      path: "/offer-ride",
      name: "offerRide",
      component: OfferRidePage,
      meta: { title: "Offer Ride" },
    },
    {
      path: "/find-ride",
      name: "findRide",
      component: FindRidePage,
      meta: { title: "Find Ride" },
    },
    {
      path: "/tickets",
      name: "tickets",
      component: TicketsPage,
      meta: { title: "Tickets Page" },
    },
    {
      path: "/ride-results",
      name: "RideResults",
      component: RideDetailsPage,
      meta: { title: "Ride Details" },
    },
    {
      path: "/transaction",
      name: "transaction",
      component: TransactionPage,
      meta: { title: "Confirm Ride" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { title: "Login" },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: { title: "Register" },
    },
    {
      path: "/map",
      name: "map",
      component: MapPage,
      meta: { title: "Map" },
    },
    {
      path: "/me",
      name: "MyProfile",
      component: MyProfilePage,
      meta: { title: "My Profile" },
    },
    {
      path: "/rideHistory",
      name: "rideHistory",
      component: RideHistoryPage,
      meta: { title: "Ride History" },
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsPage,
      meta: { title: "Settings" },
      children: [
        {
          path: "profile",
          name: "settingsProfile",
          component: MyProfilePage,
          meta: { title: "My Profile" },
        },
        {
          path: "/driver-setup",
          name: "DriverSetup",
          component: DriverSetupPage,
          meta: { title: "Driver Setup" },
        },
        {
          path: "rideHistory",
          name: "rideHistory",
          component: RideHistoryPage,
          meta: { title: "Ride History" },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error",
      component: ErrorPage,
      meta: { title: "404" },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  document.title = `Poolr - ${to.meta.title}`;
  next();
});

export default router;
