public with sharing class CarList {

    public class Filters{
        @AuraEnabled
        public String searchKey {get;set;}
        @AuraEnabled
        public Decimal maxPrice{get;set;}
        @AuraEnabled
        public String[] categoryPicklistValues{get;set;}
        @AuraEnabled
        public String[] manufaturerPicklistValues{get;set;}
    }

    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(Filters filters){
        System.debug('inside getCars');
        String query='';
        try{
        String key,whereClause='';
        Decimal maxPrice;
        String[] categoryPicklistValues,manufaturerPicklistValues,criteria=new List<String>{};
        if(filters!=null){
            maxPrice=filters.maxPrice;
            categoryPicklistValues=filters.categoryPicklistValues;
            manufaturerPicklistValues=filters.manufaturerPicklistValues;
            if(!String.isEmpty(filters.searchKey)){
                key='%'+filters.searchKey+'%';
                criteria.add('Name LIKE :key');
            }
            if(filters.maxPrice>=0){
                criteria.add('MSRP__c<=:maxPrice');
            }
            if(filters.categoryPicklistValues!= null){
                criteria.add('Category__c IN :categoryPicklistValues');
            }
            if(filters.manufaturerPicklistValues!= null){
                criteria.add('Manufacturer__c IN :manufaturerPicklistValues');
            }
            if(criteria.size()>0){
                whereClause='where '+String.join(criteria, ' AND ');
            }
        }
        // return [Select Id,Name,Manufacturer__c,Description__c,MSRP__c,Fuel_Type__c,
        //         Category__c,Control__c,Seats__c,Picture_URL__c 
        //         from Car__c];
        System.debug(criteria);
        query='Select Id,Name,Manufacturer__c,Description__c,MSRP__c,Fuel_Type__c,Category__c,Control__c,Seats__c,Picture_URL__c from Car__c '+whereClause+' WITH SECURITY_ENFORCED Order by Name';
        System.debug(query);
            
        }
        catch(Exception e){
            System.debug('Inside Exception in CarList');
            System.debug(e);
        }
        return Database.query(query);
    }
}