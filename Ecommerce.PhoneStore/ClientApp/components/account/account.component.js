var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import OrderListComponent from '../shared/order-list/order-list.component.vue';
import axios from 'axios';
let AccountComponent = class AccountComponent extends Vue {
    constructor() {
        super();
        this.orders = [];
    }
    setData(orders) {
        this.orders = orders;
    }
};
AccountComponent = __decorate([
    Component({
        components: {
            'order-list': OrderListComponent
        },
        beforeRouteEnter(to, from, next) {
            axios.get('/order').then(response => {
                next(vm => vm.setData(response.data));
            });
        }
    })
], AccountComponent);
export default AccountComponent;
//# sourceMappingURL=account.component.js.map