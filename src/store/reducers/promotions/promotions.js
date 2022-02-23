import * as TYPES from '../../types';
import update from 'immutability-helper';
import moment from 'moment';

const initialState = {
    promotions: [],
    featuredCoupons:[],
    coupons:[],
    promProducts:[],
    promoDetails:null,
    promotionBundles:null,
    offerDetails:null,
    couponDetails:null,
    cardScan: null,
}
const reducer = (state = initialState, actions) => {
    switch (actions.type) {
        
        case TYPES.FETCHED_PROMOTIONS:
            var newState = {...state}
            if (actions.payload && actions.payload.length) {
                newState.promotions = actions.payload
                var payloadPromotions  = actions.payload
                var _offers = []
                payloadPromotions.map((promotion, index) => {
                    if (moment(promotion.end_date).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
                        if (promotion.products.length > 0) {
                            promotion.products.map((offer, ind) => {
                              let _offer = offer
                              _offer.promo_id = promotion.id
                              _offers.push(_offer)  
                            })
                        }
                    }
                })
                newState.promProducts = _offers
            }else{
                newState.promotions = []
                newState.promProducts = []
            }
            return newState
        case TYPES.FETCHED_FEATURED_COUPONS:
            return {
                ...state,
                featuredCoupons: actions.payload
            }
        case TYPES.FETCHED_COUPONS:
            return {
                ...state,
                coupons: actions.payload
            }
        case TYPES.PROMOTIONS_DETAILS:
            return {
                ...state,
                promoDetails: actions.promoDetails
            }
        case TYPES.PROMOTION_BUNDLES:
            return {
                ...state,
                promotionBundles: actions.promotionBundles
            }
        case TYPES.OFFER_DETAILS:
            return {
                ...state,
                offerDetails: actions.offerDetails
            }
        case TYPES.COUPON_DETAILS:
            return {
                ...state,
                couponDetails: actions.couponDetails
            }
        case TYPES.TOGGLE_CARD_SCAN:
            return {
                ...state,
                cardScan: actions.cardScan
            }
        case TYPES.UPDATE_COUPON_STATE:
            var newState = {...state}
            newState.coupons.map((coupon, i) => {
                if (coupon.id == actions.payload.coupon_id) {
                    newState.coupons[i].active = actions.payload.couponState
                    if (newState.couponDetails != null && newState.couponDetails.coupon_detail.id == coupon.id) {
                        newState.couponDetails.coupon_detail.active = actions.payload
                    }
                }
            })
            return newState

        default:
            return state

    }

}
export default reducer