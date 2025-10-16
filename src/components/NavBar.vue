<template>
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
    </nav>
</template>

<style scoped>
nav {
    background: #333;
    color: white;
    padding: 1em;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 1em;
}

nav a:hover {
    text-decoration: underline;
}
</style>