
import * as TYPES from '../../types';

export const showLoader = () => {
    return {
        type: TYPES.SHOW_LOADER
    }
}

export const hideLoader = () => {
    return {
        type: TYPES.HIDE_LOADER
    }
}

export const showListItemsLoader = () => {
    return {
        type: TYPES.SHOW_LIST_ITEMS_LOADER
    }
}

export const hideListItemsLoader = () => {
    return {
        type: TYPES.HIDE_LIST_ITEMS_LOADER
    }
}

export const apiResponse = (status) => {
	return {
		type: TYPES.API_RESPONSE,
		status: status
	}
}

export const hideCategoriesLoader = () => {
    return{
        type: TYPES.HIDE_CATEGORIES_LOADER
    }
}

export const showCategoriesLoader = () => {
    return{
        type: TYPES.SHOW_CATEGORIES_LOADER
    }
}

export const apiResponseText = (message) => {
    return {
        type: TYPES.API_RESPONSE_TEXT,
        message: message
    }
}

export const apiResponseCode = (code) => {
    return {
        type: TYPES.API_RESPONSE_CODE,
        code: code
    }
}