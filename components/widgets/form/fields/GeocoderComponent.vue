<template>
    <div id="estarter-geocoder"></div>
    <input
        type="hidden"
        :name="name"
        :value="JSON.stringify(location)"
        />
</template>

<script>
    import abstractField  from "vuejs-estarter/components/vueFormDesigner/fields/abstractField.js"

    import mapboxgl from "mapbox-gl"
    import "mapbox-gl/dist/mapbox-gl.css"
    import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js"
    import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

    export default {
        name: 'GeocoderComponent',
        mixins: [abstractField],
        props: {
           name: {
               type: String,
               required: false,
               default: 'geocoder'
           },
           mapbox: {
               type: [String, Object],
               required: false,
               default: () => {}
           },
            types: {
               type: String,
                required: false,
                default: 'country,region,place,postcode,locality,neighborhood,address'
            },
        },
        emits: ['location-updated', 'model-updated'],
        watch: {
            // for formdesigner package
            model: function (newModel, oldModel) {
                if(this.value) {
                    this.location = {...this.value}
                    if(this.location.place_name) {
                        this.setLocation(this.location.place_name)
                    }
                } else {
                    this.location = {}
                    this.setLocation('')
                }
            }
        },
        data() {
            return {
                location: {},
                access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
            }
        },
        created() {
            // is formdesigner or standAlone ?
            let data
            if (this.mapbox === undefined) {
                data = this.value
            } else {
                data = this.mapbox
            }

            if(typeof data === 'string') {
                this.location = JSON.parse(data)
            } else {
                this.location = {...data}
            }
        },
        mounted() {
            this.createGeocoder()
        },
        methods: {
            createGeocoder() {

                const geocoder = new MapboxGeocoder({
                    accessToken:this.access_token,
                    types: this.types
                })

                geocoder.addTo('#estarter-geocoder');

                // Add geocoder result to container.
                geocoder.on('result', (e) => {
                    this.location = e.result
                    this.setLocation(this.location.place_name)
                    this.$emit("model-updated", this.location)
                })

                // Clear results container when search is cleared.
                geocoder.on('clear', () => {
                    this.location = {}
                    this.setLocation('')
                    this.$emit("model-updated", this.location)
                })

                if(this.location.place_name) {
                    this.setLocation(this.location.place_name)
                }
            },
            setLocation(name) {
                document.querySelector('.mapboxgl-ctrl-geocoder--input').value = name
                this.$emit("location-updated", this.location)
            }
        }
    }
</script>

<style lang="scss">
        .mapboxgl-ctrl-geocoder {
        box-shadow: none;
        border: 1px solid rgba(0,40,100,.12);
        border-radius: 3px;
        width: 100%!important;
        max-width: 100%!important;
    }
</style>
