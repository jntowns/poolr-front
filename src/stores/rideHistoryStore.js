import { defineStore } from 'pinia'

export const useRideHistoryStore = defineStore('rideHistory', {
    state: () => {
        return {
            rides: []
        }
    },

    actions: {
        addRide(ride) {
            
            const newRide = {
                id:Date.now(),
                drivername: ride.drivername,
                vehicle: ride.vehicle,
                vehicleColor: ride.vehicleColor,
                startAddress: ride.startAddress,
                endAddress: ride.endAddress,
            }

            this.rides.push(newRide);


        }

    },
    persist:true


})