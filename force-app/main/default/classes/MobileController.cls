public with sharing class MobileController {
    //wrapper class
    public class Filters{
        @AuraEnabled
        public String searchKey{get;set;}
        @AuraEnabled
        public Decimal maxPrice{get;set;}
        @AuraEnabled
        public String[] series{get;set;}
    }
    @AuraEnabled(Cacheable=true)
    public static List<Mobile__c> getMobiles(Filters filters) {
        String key, whereClause = '';
        Decimal maxPrice;
        String[] series, criteria = new List<String>{};
        if(filters != null) {
            maxPrice = filters.maxPrice;
            series = filters.series;
            if(!String.isEmpty(filters.searchKey)){
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE: key');
            }
            if(filters.maxPrice >= 0){
                criteria.add('MRP__c <= :maxPrice');
            }
            if(filters.series != null){
                criteria.add('Series__c IN :series');
            }
            if(criteria.size() > 0){
                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
            }
        }

        String query = 'SELECT Id, Name, MRP__c, Series__c, Description__c, Picture_URL__c FROM Mobile__c ' + whereClause + ' WITH SECURITY_ENFORCED ORDER BY Name';
        return Database.query(query);

    }

}