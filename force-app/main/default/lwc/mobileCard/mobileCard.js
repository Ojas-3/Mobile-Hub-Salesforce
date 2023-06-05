import { LightningElement, wire } from 'lwc';

//Navigation
import {NavigationMixin} from 'lightning/navigation'
//Mobile__c Schema
import MOBILE_OBJECT from '@salesforce/schema/Mobile__c'
import NAME_FIELD from '@salesforce/schema/Mobile__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Mobile__c.Picture_URL__c'
import SERIES_FIELD from '@salesforce/schema/Mobile__c.Series__c'
import MRP_FIELD from '@salesforce/schema/Mobile__c.MRP__c'
import DESCRIPTION_FIELD from '@salesforce/schema/Mobile__c.Description__c'


//getFieldValue function is used to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';

//lightning message service
import { subscribe, MessageContext, unsubscribe} from 'lightning/messageService';
import MOBILE_SELECTED_MESSAGE from '@salesforce/messageChannel/MobileSelected__c'


export default class MobileCard extends NavigationMixin(LightningElement) {


    //load content for LMS
    @wire(MessageContext)
    messageContext

    //exposing fields to make them available in the template
    seriesField = SERIES_FIELD
    mrpField = MRP_FIELD
    description = DESCRIPTION_FIELD
    
    //Id of Displaying data of record
    recordId 

    //mobile field displayed with specific format
    mobileName
    mobilePictureUrl
    
    //subsrcibtion reference for mobileSelected
    mobileSelectionSubscription
    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.mobileName = getFieldValue(recordData, NAME_FIELD)
        this.mobilePictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)

    }

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.mobileSelectionSubscription = subscribe(this.messageContext, MOBILE_SELECTED_MESSAGE, (message)=>this.handleMobileSelected(message))
    }
    handleMobileSelected(message){
        this.recordId = message.mobileId
    }

    disconnectedCallback(){
        unsubscribe(this.mobileSelectionSubscription)
        this.mobileSelectionSubscription = null
    }

    //navigate to record page
    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:MOBILE_OBJECT.objectApiName,
                actionName:'view'
            }
        })
    }
}