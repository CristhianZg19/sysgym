<template>
  <div>
    <v-app-bar  class="flex-grow-0" app id="appbarfondo">
      <v-app-bar-nav-icon color="white" style="background-color: black;" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <img src="@/assets/logo.png" width="200">
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="salir" color="white" style="background-color: black;" title="SALIR">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" class="fondo">
      <v-list-item style="background-color: #000000a3;">
        <v-list-item-content>
          <v-list-item-title class="text-h6 white--text"> 
            <v-avatar>
              <img
                :src="urlImagen(logo)"
                alt="Logo"
              >
            </v-avatar>
            {{ nombreGimnasio }}
            </v-list-item-title>
          <v-list-item-subtitle  class="text-h6 white--text"> {{ nombreUsuario }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav style="background-color: #000000a3;">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.link"
          class="white--text"
        >
          <v-list-item-icon >
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import Utiles from '../Servicios/Utiles'
export default {
  name: "Encabezado",

  data: () => ({
    drawer: false,
    nombreUsuario: "",
    nombreGimnasio: "",
    logo: "",
    items: [
      { title: "Inicio", icon: "mdi-view-dashboard", link: "/" },
      { title: "Registrar visita", icon: "mdi-home-account", link: "/registrar-visita" },
      { title: "Usuarios", icon: "mdi-account-box", link: "/usuarios" },
      { title: "Miembros", icon: "mdi-weight-lifter", link: "/miembros" },
      {
        title: "Membresías",
        icon: "mdi-wallet-membership",
        link: "/membresias",
      },
      { title: "Pagos", icon: "mdi-account-cash", link: "/pagos" },
      { title: "Visitas", icon: "mdi-calendar-star", link: "/visitas" },
      { title: "Configurar", icon: "mdi-cog", link: "/configurar" },
      { title: "Mi perfil", icon: "mdi-account-key", link: "/perfil" },
    ],
  }),

  mounted(){
    this.nombreUsuario = localStorage.getItem("nombreUsuario")
    this.nombreGimnasio = localStorage.getItem("nombreGimnasio")
    this.logo = localStorage.getItem("logoGimnasio")

  },

  methods:{ 
    salir(){
      localStorage.removeItem('logeado')
      localStorage.removeItem('nombreUsuario')
      localStorage.removeItem('idUsuario')
      window.location.reload()
    },

    urlImagen(imagen) {
      return Utiles.generarURL(imagen);
    },

  }
};
</script>
<style>
.fondo {
  background-image: url('../assets/navbar.png');
  background-size: cover;
  background-position: center;
}
#appbarfondo{
  background-image: url('../assets/navbar.png');
    background-position-y: bottom;
    background-repeat: unset;
}
</style>
