
import {throwError as observableThrowError} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AppConfig {

    private config: Object = null;
    private env: Object = null;

    constructor(private http: Http) {

    }

    /**
     * returns the value of the property from config file
     */
    public getProperty(key: any) {
        return this.config[key];
    }

    /**
     * returns the currently used env name
     */
    public getEnv(key: any) {
        return this.env[key];
    }

    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'prod', 'dev')
     *   b) Loads "env.[env].json" to get all env's variables (e.g.: 'env.dev.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('env.json').pipe(map(res => res.json()),catchError((error: any): any => {
                console.log('Configuration file "env.json" could not be read');
                resolve(true);
                return observableThrowError(error.json().error || 'Server error');
            }),).subscribe((envResponse) => {
                this.config = envResponse;
                resolve(true);
            });
        });
    }
}
