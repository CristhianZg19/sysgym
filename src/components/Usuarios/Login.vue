<template>
  <v-container fluid fill-height class="fondo">
    <v-card class="center-card" >
      <v-row>
        <v-col cols="12" md="6">
          <div style="flex: 1">
            <img src="./logogym.jpg" height="100%" width="100%" alt="img" style="border-radius: 10px;margin:10px;" />
          </div>
        </v-col>
        <v-col cols="12" md="6" style="height: 20%">
          <v-card
            class="elevation-12"
            height="100%"
            style="margin-top: 25%; margin-left: 15%; width: 70%"
          >
            <v-toolbar dark >
              <v-toolbar-title style="width: 100%; text-align: center"
                >Iniciar sesión</v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  name="login"
                  label="Usuario"
                  type="text"
                  outlined
                  v-model="usuario"
                ></v-text-field>
                <v-text-field
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  outlined
                  label="Contraseña"
                  type="password"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="dark" outlined @click="iniciarSesion" style="width:100%">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="mostrarMensaje"
        :timeout="3000"
        :color="mensaje.color"
        top
      >
        {{ mensaje.texto }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>
<script>
import HttpService from "../../Servicios/HttpService";

export default {
  name: "Login",

  data: () => ({
    usuario: "",
    password: "",
    mensaje: {
      texto: "",
      color: "",
    },
    mostrarMensaje: false,
  }),

  methods: {
    iniciarSesion() {
      if (!this.usuario) {
        this.mostrarMensaje = true;
        this.mensaje.texto = "Debes colocar el usuario";
        this.mensaje.color = "warning";
        return;
      }
      if (!this.password) {
        this.mostrarMensaje = true;
        this.mensaje.texto = "Debes colocar la contraseña";
        this.mensaje.color = "warning";
        return;
      }
      let payload = {
        metodo: "login",
        usuario: {
          usuario: this.usuario,
          password: this.password,
        },
      };
      HttpService.obtenerConDatos(payload, "usuarios.php").then((resultado) => {
        if (resultado) {
          this.$emit("logeado", resultado);
        }
      });
    },
  },
};
</script>
<style >
.fondo {
  background-image: url('./fondogym.jpg');
  background-size: cover;
  background-position: center;
  height: 100%;
}
.center-card {
  background-color: #272717b8 !important;
  margin: 0 auto;
  border-radius: 10px;
}
</style>