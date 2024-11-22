import { LightningElement,wire } from 'lwc';
import CAR_OBJECT from '@salesforce/schema/Car__c';
import NAME from '@salesforce/schema/Car__c.Name';
import MANUFACTURER from '@salesforce/schema/Car__c.Manufacturer__c';
import CATEGORY from '@salesforce/schema/Car__c.Category__c';
import MSRP from '@salesforce/schema/Car__c.MSRP__c';
import FUEL from '@salesforce/schema/Car__c.Fuel_Type__c';
import URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import SEATS from '@salesforce/schema/Car__c.Seats__c';
import CONTROL from '@salesforce/schema/Car__c.Control__c';
import { getFieldValue } from 'lightning/uiRecordApi';
import { subscribe,MessageContext,unsubscribe } from 'lightning/messageService';
import Car_Selected from '@salesforce/messageChannel/carSelected__c';
import {NavigationMixin} from 'lightning/navigation'
export default class CarCard extends NavigationMixin(LightningElement) {
    car=CAR_OBJECT;
    recordId;
   // name=NAME;
    manufacturer=MANUFACTURER;
    //carHubLogo=carhub_logo;
    category=CATEGORY;
    msrp=MSRP;
    fuel=FUEL;
    seats=SEATS;
    control=CONTROL;
    //urlField=URL_FIELD;
    carName;
    carImage;
    messageCallback=null;
    recordLoaderHandler(event){
        const{records}=event.detail;
        const recordData=records[this.recordId];
        this.carName=getFieldValue(recordData,NAME);
        this.carImage=getFieldValue(recordData,URL_FIELD);
    }

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.subscribeHandler();
    }

    subscribeHandler(){
        this.messageCallback=subscribe(this.messageContext,Car_Selected,
            (message)=>this.messageHandler(message)
        );
    }

    messageHandler(message){
        this.recordId=message.carId;
    }

    disconnectedCallback(){
        unsubscribe(this.messageCallback);
        this.messageCallback=null;
    }
    navigationHandler(){
        console.log('Navigation Handler called');
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:this.car.objectApiName,
                actionName:'view'
            }
        });
    }
}