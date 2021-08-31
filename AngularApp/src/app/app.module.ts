import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment as env } from 'src/environments/environment';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule} from '@angular/common/http';

// dev addtions

//

if (env.production) {

    Object.entries(console)
    .forEach((x, i) => {
        let [key, val] = x
        if (typeof val === "function") {
            (console[key] as any) = () => { }
        }
    })
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
