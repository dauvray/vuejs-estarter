<template>

    <div id="app" :class="[isVisible ? 'visible' : 'invisible']">
        <div class="top-content">
            <header-app />
            <main class="container-fluid">
                <!--
                Even when routes use the same component, treat them
                as distinct and create the component again.
                <transition :name="transitionName" mode="out-in" >
                    <router-view :key="$route.fullPath" />
                    <router-view></router-view>
                </transition>
                -->
                <transition>
                    <router-view></router-view>
                </transition>
            </main>
        </div>
        <div v-if="!isVisible" class="d-flex justify-content-center visible">
            <div class="spinner-border text-warning" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <footer-app />
    </div>

</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import breadcrumbs from 'vuejs-estarter/mixins/BreadcrumbsMixin'

    export default {
        name: 'App',
        components: {
            HeaderApp : () => import('vuejs-estarter/components/partials/Header'),
            FooterApp : () => import('vuejs-estarter/components/partials/Footer')
        },
        inject: ["eventBus"],
        mixins: [breadcrumbs],
        metaInfo: {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: 'Default Title',
            // all titles will be injected into this template
            titleTemplate: '%s | My Awesome Webapp'
        },
        data() {
            return {
                'isVisible': false
            }
        },
        methods: {
            ...mapActions([
                'auth/checkUser',
                'auth/retrieveUser',
            ])
        },
        created() {

            // after page refresh check if user is loggedin.
            try {
                this['auth/checkUser']()
                .then(response => {
                    if(response){
                        this['auth/retrieveUser']()
                        .then(response => {
                          setTimeout(() => {
                              this.isVisible = true
                          }, 1000);
                       });
                    } else {
                        this.$router.push({'name' : 'login'}).catch(err => {})
                        setTimeout(() => {
                            this.isVisible = true
                        }, 1000);
                    }
                })
            }
            catch(error) {
                console.error(error);
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
            }
        },
    }

</script>

<style lang="scss" >

    #app {

        overflow: hidden;

        .fade-enter-active,
        .fade-leave-active {
            transition-duration: 0.3s;
            transition-property: opacity;
            transition-timing-function: ease;
        }

        .fade-enter,
        .fade-leave-active {
            opacity: 0
        }
    }

    html, body {
        height: 100%;
    }
    #app {
        display: flex;
        flex-direction: column;
    }
    .top-content {
        flex: 1 0 auto;
    }
    footer {
        flex-shrink: 0;
    }

</style>
