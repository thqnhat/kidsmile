﻿import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class CheckoutFormComponent extends Vue {
    loading: boolean = false;
    firstName: string = '';
    lastName: string = '';
    address: string = '';
    address2: string = '';
    townCity: string = '';
    country: string = '';
    postCode: string = '';
    nameOnCard: string = '';
    //@ts-ignore
    stripe: any = Stripe(window.stripeOptions.publishableKey);
    stripeCard: any = null;
    paymentError: string = null;

    constructor() {
        super();
    }

    mounted() {
        this.stripeCard = this.stripe.elements().create('card', { style: { base: { lineHeight: "24px"}} });
        this.stripeCard.mount(this.$refs.card);
    }

    beforeDestroy() {
        this.stripeCard.destroy();
    }

    state(field) {
        if (this.errors.has(field)) {
            return false;
        } else {
            return this.fields[field] && this.fields[field].dirty ? true : null;
        }
    }

    submit() {
        this.$validator.validateAll().then(result => {
            if (!result) {
                this.loading = false;
                return;
            }

            this.loading = true;

            this.stripe.createToken(this.stripeCard, { name: this.nameOnCard }).then(result => {
                if (result.error) {
                    this.loading = false;
                    return;
                }

                const order = {
                    stripeToken: result.token.id,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    address1: this.address,
                    address2: this.address2,
                    townCity: this.townCity,
                    county: this.country,
                    postCode: this.postCode,
                    items: this.$store.state.cartModule.cart.map(item => {
                        return {
                            productId: item.productId,
                            colourId: item.colourId,
                            storageId: item.storageId,
                            quantity: item.quantity
                        };
                    })
                };

                axios.post('/order', order)
                    .then(response => {
                        this.$store.commit('cartModule/clearCart');
                        this.$emit('success', response.data);
                        this.loading = false;
                    })
                    .catch(error => {
                        this.loading = false;
                        this.paymentError = error.response;
                    });
            });
        });
    }
}