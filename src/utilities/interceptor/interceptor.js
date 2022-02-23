import * as Util from '../index';
export class Interceptor {
    static headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    static token = null;

    static getHeaders() {
        if (this.token != null) {
            this.headers.Authorization = `Bearer ${this.token}`;
        }
        return this.headers;

    }

    static getHeadersWithExplicitToken(token) {
        temp = this.headers;
        temp.Authorization = token;
        return temp;
    }

    static getFileUploadHeaders() {
        var custom = {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        }
        if (this.token != null) {
            custom.Authorization = this.token;
        }

        return custom;
    }

    static setToken(token) {
        this.token = token;
    }

    static getToken(){
        return this.token
    }
}