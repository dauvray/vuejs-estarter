<template>
    <div>
        <div v-if="sentResetLink">
            <div class="alert alert-success" role="alert">
                Un email vient de vous être envoyé afin de réinitialiser votre mot de passe
            </div>
        </div>
        <form v-else>
            <vue-form-generator ref="forgottenPasswordForm" :schema="schema" :model="model" :options="formOptions"
                                @validated="updateValidationFormClasses()"></vue-form-generator>

            <div class="form-group">
                <button type="submit" @click.prevent="postEmail" class="btn btn-primary">
                    Valider
                </button>
            </div>

        </form>
    </div>
</template>

<script>

    import { mapActions } from 'vuex'
    import {BaseMixin} from 'vuejs-estarter/mixins/BaseMixin'
    import {FormMixin} from 'vuejs-estarter/mixins/FormMixin'

    export default {
        name: 'ForgottenPasswordForm',
        mixins: [BaseMixin, FormMixin],
        data() {
            return {
                sentResetLink: false,
                model: {
                    email: '',
                },
                schema: {
                    fields: [
                        {
                            type: 'input',
                            inputType: 'email',
                            inputName: 'email',
                            label: 'Email',
                            model: 'email',
                            placeholder: 'email@exemple.com',
                            required: true,
                            autocomplete: 'off',
                            validator: ["email"]
                        }
                    ]
                }
            }
        },
        methods: {
            ...mapActions([
                'auth/forgottenPasword',
            ]),
            postEmail() {
                this.$refs.forgottenPasswordForm.validate().then( resp => {
                    if (resp.length == 0) {
                        this['auth/forgottenPasword']({"email": this.model.email})
                        .then(response => {
                            if (response.status === "passwords.sent") {
                                this.sentResetLink = true
                            }
                        })
                    }
                })
            },
            handleError(err) {
                this.serverSideFormErrors(err, this.$refs.forgottenPasswordForm)
            },
        }
    }

</script>
