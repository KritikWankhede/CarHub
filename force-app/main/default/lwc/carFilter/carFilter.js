import { LightningElement,wire } from 'lwc';
import { getPicklistValues,getObjectInfo} from 'lightning/uiObjectInfoApi';
import CARS from '@salesforce/schema/Car__c';
import MANUFACTURER from '@salesforce/schema/Car__c.Manufacturer__c';
import CATEGORY from '@salesforce/schema/Car__c.Category__c';
import { publish , MessageContext} from 'lightning/messageService';
import CARS_Filtered from '@salesforce/messageChannel/carFiltered__c';
export default class CarFilter extends LightningElement {

    filters={
        searchKey:'',
        maxPrice:999999
    }

    @wire(MessageContext)
    messageContext;

    @wire(getObjectInfo,{objectApiName:CARS})
    objProp;

    @wire(getPicklistValues,{recordTypeId:'$objProp.data.defaultRecordTypeId',fieldApiName:MANUFACTURER})
    manufaturerPicklistValues;

    @wire(getPicklistValues,{recordTypeId:'$objProp.data.defaultRecordTypeId',fieldApiName:CATEGORY})
    categoryPicklistValues;

    handleSearch(event){
        console.log(event.target.value);
        this.filters={...this.filters,'searchKey':event.target.value};
        this.sendDataToCarList();
    }

    handlePriceChange(event){
        console.log(event.target.value);
        this.filters={...this.filters,'maxPrice':event.target.value};
        this.sendDataToCarList();
    }
    
    handleChange(event){
        if(!this.filters.categoryPicklistValues){
            console.log(this.categoryPicklistValues.data.values);
            console.log(this.manufaturerPicklistValues.data.values);
            const categoryPicklistValues=this.categoryPicklistValues.data.values.map(item=>item.value);
            const manufaturerPicklistValues=this.manufaturerPicklistValues.data.values.map(item=>item.value);
            console.log(categoryPicklistValues);
            console.log(manufaturerPicklistValues);
            this.filters={...this.filters,categoryPicklistValues,manufaturerPicklistValues};
            console.log(this.filters);
        }
        const{name,value}=event.target.dataset;
        console.log(name+' '+value);

        
        if(event.target.checked){
            console.log('Inside if target check');
            if(!this.filters[name].includes(value)){
                this.filters[name]=[...this.filters[name],value];
                console.log(this.filters[name]);
            }  
        }
        else{
            this.filters[name]=  this.filters[name].filter(item=> item!==value);
            console.log('Inside else block of handleChange');
            console.log( this.filters[name]);
        }
        this.sendDataToCarList();
    }

    sendDataToCarList(){
        console.log('Inside sendDataToCarList');
        const ck=publish(this.messageContext,CARS_Filtered,{
            filters:this.filters
        });
        console.log(ck);
    }
}