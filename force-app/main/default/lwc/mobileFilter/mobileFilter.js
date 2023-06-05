import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import MOBILE_OBJECT from '@salesforce/schema/Mobile__c'
//mobile schema
import SERIES_FIELD from '@salesforce/schema/Mobile__c.Series__c'

//constants
const SERIES_ERROR = 'Error Loading Series'

//Lightning Message Service and a Message Channel
import {publish, MessageContext} from 'lightning/messageService'
import MOBILES_FILTERED_MESSAGE from '@salesforce/messageChannel/MobilesFiltered__c'

export default class MobileFilter extends LightningElement {
    filters={
        searchKey:'', maxPrice:200000
    }

    seriesError=SERIES_ERROR
    timer

    /**Load Context for LMS */
    @wire(MessageContext)
    messageContext

    /*** fetching series picklist */
    @wire(getObjectInfo, {objectApiName:MOBILE_OBJECT})
    mobileObjectInfo

    @wire(getPicklistValues,{
        recordTypeId:'$mobileObjectInfo.data.defaultRecordTypeId',
        fieldApiName: SERIES_FIELD
    })series

    /***Search range handler */
    handelSearchKeyChange(event){
        console.log(event.target.value)
        this.filters={...this.filters, "searchKey":event.target.value}
        this.sendDataToMobileList()
    }

    /**Price range handler */
    handleMaxPriceChange(event){
        console.log(event.target.value)
        this.filters={...this.filters, "maxPrice":event.target.value}
        this.sendDataToMobileList()
    }


    handleCheckbox(event){
        if(!this.filters.series){
            const series = this.series.data.values.map(item=>item.value)
            this.filters ={...this.filters, series}
        }
        const {name,value}=event.target.dataset
       // console.log("name",name)
       // console.log("value",value)
       if(event.target.checked){
        if(!this.filters[name].includes(value)){
            this.filters[name] = [...this.filters[name],value]
        }
        } else {
            this.filters[name] = this.filters[name].filter(item=>item !== value)   
        }
        this.sendDataToMobileList()
    }

    sendDataToMobileList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(() =>{
            publish(this.messageContext, MOBILES_FILTERED_MESSAGE, {
                filters:this.filters
            })
        },400)
    }
}