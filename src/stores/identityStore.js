import { defineStore } from 'pinia'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'

export const useIdentityStore = defineStore('identity', {
    state: () => ({
        id: null,
        realName: null,
        username: null,
        email: null,
        phoneNumber: null,
        vehicleModel: null
    }),
    actions: {
        async getIdentity() {
            try {
                const response = await apiClient.post('/api/auth/validatetoken')
                this.id = response.data.id;
                this.realName = response.data.realName;
                this.username = response.data.username;
                this.email = response.data.email;
                this.phoneNumber = response.data.phoneNumber;
                this.vehicleModel = response.data.vehicleModel;
            } catch (error) {
                console.error('Error fetching user information:', error)
                // showToast('Failed to fetch user information', 'error');
            }
        },
        setIdentity(user) {
            this.id = user.id;
            this.realName = user.realName;
            this.username = user.username;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber;
            this.vehicleModel = user.vehicleModel;
        },
        async postIdentity(user) {
            try {
                const response = await apiClient.put('/api/user/me', user)
                this.id = response.data.id;
                this.realName = response.data.realName;
                this.username = response.data.username;
                this.email = response.data.email;
                this.phoneNumber = response.data.phoneNumber;
                this.vehicleModel = response.data.vehicleModel;
                showToast('User information updated successfully', 'success');
                return response;
            } catch (error) {
                console.error('Failed to update user info', error)
                return null;
            }
        },
        clearIdentity() {
            this.id = null
            this.realName = null
            this.username = null
            this.email = null
            this.phoneNumber = null
            this.vehicleModel = null
        }
    }
})