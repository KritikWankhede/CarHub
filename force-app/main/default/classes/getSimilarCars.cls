public with sharing class getSimilarCars {
    @AuraEnabled(cacheable=true)
    public static List<Car__c> similarCarsController(Id carId){
        Car__c carObj= [Select Id,Name,Manufacturer__c from Car__c where Id=:carId];
        String manuName=carObj.Manufacturer__c;
        return [Select Id,Name,Manufacturer__c,Picture_URL__c,MSRP__c,Fuel_Type__c,Category__c from Car__c where Manufacturer__c=:manuName AND Id !=:carId order by Name];
    }
}