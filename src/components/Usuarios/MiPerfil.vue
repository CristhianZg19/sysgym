<template>
    <div>
        <h1>{{ nombreUsuario }}</h1>
         <v-btn
        depressed
        color="primary"
        @click="cambiarPassword">
        Cambiar contraseña
        </v-btn>
        <cartas-personalizadas :cartas="datosVisitas" />
        <cartas-personalizadas :cartas="datosPagos" />
    </div>
</template>
<script>
import HttpService from '../../Servicios/HttpService'
import CartasPersonalizadas from '../Dialogos/CartasPersonalizadas.vue'

export default {
    name: "MiPerfil",
    components: { CartasPersonalizadas },
    
    data:()=>({
        nombreUsuario: localStorage.getItem('nombreUsuario'),
        datosVisitas: [],
        datosPagos: [],
    }),

    mounted(){
        this.obtenerInformacion()
    },

    methods: {
        cambiarPassword(){
            this.$router.push( { name: 'CambiarPassword' })
        },

        obtenerInformacion(){
            HttpService.obtenerConDatos({
                metodo: 'informacion_perfil',
                idUsuario: localStorage.getItem('idUsuario')
            }, 'usuarios.php')
            .then(resultado => {
                this.crearCartas(resultado.datosVisitas, resultado.datosPagos)
            })
        },

        crearCartas(visitas, pagos){
            this.datosVisitas = [
                { color: 'purple darken-1', icono: 'mdi-calendar-star', nombre: 'Total visitas', total: visitas.totalVisitas},
                { color: 'pink darken-1', icono: 'mdi-calendar', nombre: 'Visitas hoy', total: visitas.visitasHoy},
                { color: 'red darken-1', icono: 'mdi-calendar-range', nombre: 'Visitas semana', total: visitas.visitasSemana},
                { color: 'indigo darken-1', icono: 'mdi-calendar-month', nombre: 'Visitas mes', total: visitas.visitasMes},
            ]
            this.datosPagos = [
                { color: 'blue darken-1', icono: 'mdi-alpha-s-circle', nombre: 'Total pagos', total: 'S/' + pagos.totalPagos},
                { color: 'teal darken-1', icono: 'mdi-calendar', nombre: 'Pagos hoy', total: 'S/' + pagos.pagosHoy},
                { color: 'green darken-1', icono: 'mdi-calendar-range', nombre: 'Pagos semana', total: 'S/' + pagos.pagosSemana},
                { color: 'orange darken-1', icono: 'mdi-calendar-month', nombre: 'Pagos mes', total: 'S/' + pagos.pagosMes},
            ]
    }
    }
}
</script>