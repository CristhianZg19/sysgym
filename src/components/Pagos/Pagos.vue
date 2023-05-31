<template>
  <v-container>
    <v-dialog v-model="dialogoFactura" width="500" style="height: 420px">
      <div id="cpe">
        <div style="text-align: center; background-color: #ccc">
          <h3>Comprobante de Pago N° {{ factura.id }}</h3>
        </div>
        <div style="display: flex">
          <div style="flex: 1">
            <img src="../../assets/logo.png" height="120" alt="img">
<!--             <img height="120" :src="urlImagen(logo)" alt="Logo" />
 -->          </div>
          <div style="flex: 1" text-aling="right">
            <h3>{{ nombreGimnasio }}</h3>
            Dirección: Chulis <br />
            Fecha: {{ factura.fecha.slice(0, 10) }}
          </div>
        </div>
        <hr />
        <div>
          <u>
            <center><h4>Datos del cliente</h4></center>
          </u>
          <v-row>
            <v-col md="3"> Nombres: </v-col>
            <v-col md="6">
              {{ factura.nombre }}
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3"> Matricula: </v-col>
            <v-col md="6">
              {{ factura.matricula }}
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3"> Membresia: </v-col>
            <v-col md="6">
              {{ factura.membresia }}
            </v-col>
          </v-row>
        </div>
        <hr />

        <div>
          <v-row>
            <v-col style="text-align: right">
              Total: {{ factura.monto }}<br />
            </v-col>
          </v-row>
        </div>
        <hr />
        <div style="text-align: right">
          <br />
          <b><i>Gracias por elegirnos.</i></b>
        </div>
      </div>

      <v-btn color="error" @click="imprimirPDF(factura.nombre)"
        >Imprimir en PDF</v-btn
      >
    </v-dialog>

    <h1>
      Pagos <span class="indigo--text display-1"> S/{{ totalPagos }}</span>
    </h1>
    <periodo-busqueda @buscar="onBuscar" />

    <cartas-totales
      v-if="pagos.length > 0"
      :totales="totalesMembresias"
      :titulo="'Pagos realizados por membresía'"
      :icono="'mdi-alpha-s-circle'"
      :color="'deep-orange darken-1'"
    />

    <v-card class="mt-3">
      <v-card-title>
        Pagos realizados:
        <b v-if="!filtros.fechaInicio"> hoy</b>
        <b v-if="filtros.fechaInicio">
          {{ filtros.fechaInicio }} al {{ filtros.fechaFin }}</b
        >
        <v-spacer></v-spacer>
        <v-text-field
          v-model="busqueda"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :loading="cargando"
        :headers="encabezadoTabla"
        :items="pagos"
        :search="busqueda"
        sort-by="nombre"
        class="elevation-1"
        :footer-props="{ itemsPerPageText: 'Por página' }"
      >
        <template v-slot:[`item.imagen`]="{ item }">
          <v-avatar v-if="item.imagen">
            <img :src="urlImagen(item.imagen)" alt="Foto" />
          </v-avatar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon color="red" @click="imprimirCPE(item)"
            >mdi-file-pdf-box</v-icon
          >
        </template>

        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
            No se han encontrado datos :(
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
    <cartas-totales
      v-if="pagos.length > 0"
      class="mt-3"
      :totales="totalesUsuarios"
      :titulo="'Pagos realizados por usuario'"
      :icono="'mdi-account-cash'"
      :color="'green darken-3'"
    />

    <cartas-totales-miembros
      v-if="pagos.length > 0"
      class="mt-3"
      :totales="totalesMiembros"
      :titulo="'Pagos realizados por miembros'"
    />

    <v-overlay :value="cargando">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import HttpService from "../../Servicios/HttpService";
import Utiles from "../../Servicios/Utiles";
import PeriodoBusqueda from "../Dialogos/PeriodoBusqueda.vue";
import CartasTotales from "../Dialogos/CartasTotales.vue";
import CartasTotalesMiembros from "../Dialogos/CartasTotalesMiembros.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  items: [],
  name: "Pagos",
  components: { PeriodoBusqueda, CartasTotales, CartasTotalesMiembros },
  data: () => ({
    nombreGimnasio: "",
    logo: "",
    busqueda: "",
    cargando: false,
    dialogoFactura: false,
    pagos: [],
    encabezadoTabla: [
      { text: "Imagen", sortable: true, value: "imagen" },
      { text: "Miembro", sortable: true, value: "nombre" },
      { text: "Matrícula", sortable: true, value: "matricula" },
      { text: "Fecha", sortable: true, value: "fecha" },
      { text: "Monto pagado", sortable: true, value: "monto" },
      { text: "Membresía pagada", sortable: true, value: "membresia" },
      { text: "Cobró", sortable: true, value: "usuario" },
      { text: "CPE", sortable: true, value: "actions" },
    ],
    filtros: {
      fechaInicio: null,
      fechaFin: null,
    },
    totalPagos: 0,
    totalesMembresias: [],
    totalesUsuarios: [],
    totalesMiembros: [],
    factura: {
      fecha: "",
    },
    empresa: {
      nombre: "xdddd",
      direccion: "xdddd",
      ruc: "xdddd",
      web: "xdddd",
    },
    invoice_id: "123456890",
    amount_paid: 10.99,
    amount_due: 0,
    headerss: [
      { text: "Membresía", sortable: true, value: "name" },
      { text: "Cobró", sortable: true, value: "description" },
      { text: "CPE", sortable: true, value: "unit_cost" },
    ],
    items: [
      {
        name: "Web Design",
        description: "Invoice app",
        unit_cost: 300,
        quantity: 6,
      },
    ],
  }),

  mounted() {
    this.obtenerPagos();
    this.nombreUsuario = localStorage.getItem("nombreUsuario");
    this.nombreGimnasio = localStorage.getItem("nombreGimnasio");
    this.logo = localStorage.getItem("logoGimnasio");
    console.log(this.logo, "logo");
  },
  computed: {
    all_items: function () {
      return this.items.reduce((accumulator, item) => {
        return accumulator + item.unit_cost * item.quantity;
      }, 0);
    },
    date: () => new Date().toLocaleString(),
  },

  methods: {
    async imprimirPDF(id) {
      // Obtener el elemento del v-card
      const extension = ".pdf";
     
      const card = document.querySelector("#cpe");

      // Crear un canvas con el contenido del v-card
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(card);

      // Crear un objeto jsPDF y añadir el canvas como imagen
      const pdf = new jsPDF("p", "pt", "a4");

      pdf.addImage(canvas.toDataURL("image/jpg", 0.8), "jpg", 25, 25, 500, 350);
      pdf.setFillColor(255, 255, 22); // establecer el color de fondo en blanco (RGB: 255, 255, 255)

      pdf.save(id + extension);
    },
    onBuscar(fechas) {
      console.log(fechas);
      this.filtros = {
        fechaInicio: fechas[0],
        fechaFin: fechas[1],
      };

      this.obtenerPagos();
    },

    urlImagen(imagen) {
      return Utiles.generarURL(imagen);
    },
    imprimirCPE(pago) {
      this.factura = pago;
      this.dialogoFactura = true;
      /*       generarPDF(pago);
       */
    },
    cerrarFactura() {},
    imprimirFactura() {},
    format_price: (number) => {
      return "S/" + parseFloat(number).toFixed(2);
    },
    add_item: function () {
      this.items.push({
        name: "name",
        description: "description",
        unit_cost: 0,
        quantity: 1,
      });
    },
    update_value: function (index, event, property) {
      this.items[index][property] = event.target.innerText;
    },
    remove_item: function (index) {
      this.items.splice(index, 1);
    },
    obtenerPagos() {
      this.cargando = true;
      let payload = {
        metodo: "obtener",
        filtros: this.filtros,
      };
      HttpService.obtenerConDatos(payload, "pagos.php").then((respuesta) => {
        console.log(respuesta.pagos, "pagos");
        this.pagos = respuesta.pagos;
        this.totalPagos = respuesta.totalPagos;
        this.totalesMembresias = respuesta.totalesMembresias;
        this.totalesUsuarios = respuesta.totalesUsuario;
        this.totalesMiembros = respuesta.totalesMiembros;
        console.log(respuesta);
        this.cargando = false;
      });
    },
  },
};
</script>

<style>
#cpe {
  width: 500px;
  height: 420px;
  padding: 20px;
  background-color: #fff;
  font-weight: 700;
}
.top-heading {
  background: purple;
  color: white;
}

@media print {
  .hide-print {
    display: none;
    visibility: hidden;
  }

  .input-field input,
  table input {
    border-bottom: none;
  }
}
</style>