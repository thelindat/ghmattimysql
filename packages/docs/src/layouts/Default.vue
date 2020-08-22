<template>
  <div class="layout">
    <b-navbar fixed="top" type="dark" variant="primary" toggleable="md">
      <b-navbar-brand>ghmattimysql</b-navbar-brand>
      <b-navbar-toggle target="navbarSupportedContent" />
    
      <b-collapse id="navbarSupportedContent" is-nav>
        <b-navbar-nav class="mr-auto">
          <b-nav-item href="/">About</b-nav-item>
          <b-nav-item href="/setup">Quick Setup</b-nav-item>
          <b-nav-item href="/config">Config</b-nav-item>
          <b-nav-item href="/queries">Querying</b-nav-item>
          <b-nav-item href="/gui">GUI &amp; Dev</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main class="container-md mt-2 bg-light" style="padding-top: 56px;">
      <slot/>
    </main>
  </div>
</template>

<script>
import { BNavbar, BNavbarBrand, BNavbarNav, BNavItem, BCollapse, BNavbarToggle } from 'bootstrap-vue';

export default {
  components: {
    BNavbar,
    BNavbarBrand,
    BNavbarToggle,
    BNavbarNav,
    BNavItem,
    BCollapse
  },
}
</script>