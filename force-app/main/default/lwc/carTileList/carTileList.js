import { LightningElement ,wire} from 'lwc';
import CAR_LIST from '@salesforce/apex/CarList.getCars';

import { publish,subscribe ,MessageContext} from 'lightning/messageService';
import CARS_Filtered from '@salesforce/messageChannel/carFiltered__c';
import CARS_Selected from '@salesforce/messageChannel/carSelected__c';
export default class CarTileList extends LightningElement {
    carFiltersub;
    filters={};
    cars;
    check;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        console.log('Inside connectedCallback');
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel(){
        console.log('Inside subscribeToMessageChannel');
        this.carFiltersub=subscribe(this.messageContext, CARS_Filtered, 
            (message) =>this.filterHandler(message));
        console.log(this.carFiltersub);
    }

    filterHandler(message){
        console.log('Inside filterHandler');
        console.log(message.filters);
        this.filters={...message.filters};
    }

    @wire(CAR_LIST,{filters:'$filters'})
    carDataHandler({data,error}){
        if(data){
            console.log(data);
            this.cars=data;
            if(this.cars.length===0){
                this.check=true;
            }
            else{
                this.check=false;
            }
            console.log('Inside the carDataHandler');
        }
        else if(error){
            console.log('Inside the carDataHandler Error');
            console.error(error);
        }
    }

    handleCarCard(event){
        console.log(event.detail);
        publish(this.messageContext,CARS_Selected,{
            carId:event.detail
        });
    }
   
}