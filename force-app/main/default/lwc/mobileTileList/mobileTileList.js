import { LightningElement, wire } from 'lwc';

import getMobiles from '@salesforce/apex/MobileController.getMobiles';

//Lightning Message Service and a Message Channel
import {publish, subscribe, MessageContext} from 'lightning/messageService'
import MOBILES_FILTERED_MESSAGE from '@salesforce/messageChannel/MobilesFiltered__c'
import MOBILE_SELECTED_MESSAGE from '@salesforce/messageChannel/MobileSelected__c'

export default class MobileTileList extends LightningElement {

    mobiles=[]
    error
    filters={};
    mobileFilterSubscription

    @wire(getMobiles, {filters:'$filters'})
    mobilesHandler({data, error}){
        if(data){
            console.log(data)
            this.mobiles = data
        }
        if(error){
            this.error = error
            console.error(error)
            
        }
    }

    /**Load Context for LMS */
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.mobileFilterSubscription = subscribe(this.messageContext, MOBILES_FILTERED_MESSAGE, (message)=>this.handleFilterChanges(message))
    }
    handleFilterChanges(message){
        console.log(message.filters)
        this.filters ={...message.filters}
    }

    handleMobileSelected(event){
        console.log("selected mobile Id", event.detail)
        publish(this.messageContext, MOBILE_SELECTED_MESSAGE, {
            mobileId:event.detail
        })
    }

    disconnectedCallback(){
        unsubscribe(this.mobileFilterSubscription)
        this.mobileFilterSubscription = null
    }
}