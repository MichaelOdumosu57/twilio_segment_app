import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, HostListener, ViewContainerRef, ViewChild } from '@angular/core';
import { fromEvent, Subscription, of, Subject } from 'rxjs';
import { switchMap, take, tap, delay, exhaustMap, repeat, catchError, retry } from 'rxjs/operators';
import { RyberService } from 'src/app/ryber.service';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

    //metadata
    @HostBinding('class') myClass: string = "a_p_p_IntroView";
    subs: Subscription[] = [];
    //
    begin = {
        click:(evt:Event)=>{
            this.ryber.router.navigateByUrl("/home")
        }
    }
    constructor(
        public ryber:RyberService,
        private ref:ChangeDetectorRef
    ) { }

    ngOnInit(): void {
    }

}
