import { LightningElement,api,wire} from 'lwc';
import similarCarsController from '@salesforce/apex/getSimilarCars.similarCarsController';
import CAR_OBJECT from '@salesforce/schema/Car__c';
// import { subscribe,MessageContext,unsubscribe } from 'lightning/messageService';
// import Car_Selected from '@salesforce/messageChannel/carSelected__c';
import {NavigationMixin} from 'lightning/navigation';
export default class SimilarCars extends NavigationMixin(LightningElement) {
    cars={};
    carOBJ=CAR_OBJECT;
    messageCallback;
    ck=false;
    @api recordId;
    onclickHandler(){
        similarCarsController({carId:this.recordId}).then(data=>{
            this.cars=data;
            console.log(this.cars);
            if(this.cars.length!==0){
                this.ck=true;
            }
            else{
                this.ck=false;
            }
            console.log('CK:-',this.ck);
        }).catch(error=>{
            console.error(error);
        });
    }

    handleNavigation(event){
        this.recordId=event.detail;
        console.log(this.recordId);
        this.navigationHandler();
    }

    
    navigationHandler(){
        console.log('Navigation Handler called');
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:this.carOBJ.objectApiName,
                actionName:'view'
            }
        });
    }
    
}