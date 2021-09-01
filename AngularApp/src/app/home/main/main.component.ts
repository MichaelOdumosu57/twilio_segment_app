import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, HostListener, ViewContainerRef,ViewChild } from '@angular/core';
import { fromEvent, Subscription,of, Subject } from 'rxjs';
import { switchMap, take,tap,delay, exhaustMap,repeat, catchError, retry } from 'rxjs/operators';
import { RyberService } from 'src/app/ryber.service';
import { environment as env } from 'src/environments/environment';
import { io } from 'socket.io-client';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent  {

//metadata
    @HostBinding('class') myClass: string = "a_p_p_HomeView";
    subs: Subscription[] = [];
    @ViewChild('homeMap') myHomeMap:HTMLDivElement
    //

    state ={
        current:"busy",
        obs:new Subject(),
        reset:()=>{
            let {free,busy,pastTime,ref} = this
            free.button.style = {}
            free.text.style = {}
            busy.button.style = {}
            busy.text.style = {}
            pastTime.button.style = {}
            pastTime.text.style = {}
            ref.detectChanges()
        }
    }
    free = {
        button:{
            style:{},
            click:(evt:Event)=>{
                let {http} = this.ryber
                http.post(
                    env.backend.url,
                    {
                        env:"main",
                        type:"free"
                    }
                )
                .pipe(
                    take(1),
                    tap((result:any)=>{
                        if( !(result  instanceof HttpErrorResponse)){
                            let {state} = this
                            state.reset()
                            state.current = "free"
                            state.obs.next({})
                        }
                    })
                )
                .subscribe()
            },
        },
        text:{
            style:{}
        },

    }

    busy = {
        button:{
            style:{},
            click:(evt:Event)=>{
                let {http} = this.ryber
                http.post(
                    env.backend.url,
                    {
                        env:"main",
                        type:"busy"
                    }
                )
                .pipe(
                    take(1),
                    tap((result:any)=>{
                        if( !(result  instanceof HttpErrorResponse)){
                            let {state} = this
                            state.reset()
                            state.current = "busy"
                            state.obs.next({})
                        }
                    })
                )
                .subscribe()
            }
        },
        text:{
            style:{}
        },
    }

    pastTime = {
        button:{
            style:{},
            click:(evt:Event)=>{
                let {pastTime} = this
                let {http} = this.ryber

                http.post(
                    env.backend.url,
                    {
                        env:"main",
                        type:"pastTime"
                    }
                )
                .pipe(
                    take(1),
                    tap((result:any)=>{
                        if( !(result  instanceof HttpErrorResponse)){
                            let {state} = this
                            state.reset()
                            state.current = "pastTime"
                            state.obs.next({})
                        }
                    })
                )
                .subscribe()
            }
        },
        text:{
            style:{}
        },
    }

    instruct = {
        click:(evt:Event)=>{
            this.ryber.router.navigateByUrl("/")
        }
    }

    constructor(
        public ryber:RyberService,
        private ref:ChangeDetectorRef
    ) { }

    ngAfterViewInit(): void {
        let {free,busy,pastTime,state,ref,subs,ryber,myHomeMap} = this
        let lightBrown  ="radial-gradient(farthest-corner at 100% 0px,  tan 0%, brown 120%)"
        let ripeBanana = "radial-gradient(farthest-corner at 100% 0px, yellow 0%, green 200%)"
        let purple= "radial-gradient(farthest-corner at 100% 0px, violet 0%, purple 200%)"

        let stateEvent = state.obs
        .pipe(
            tap(()=>{
                switch (state.current) {
                    case "free":
                        free.button.style = {
                            "background":"white",
                            "border-radius":lightBrown
                        }
                        free.text.style = {
                            background:lightBrown,
                            "-webkit-background-clip": "text",
                            "-webkit-text-fill-color": "transparent",
                        }
                        break;

                    case "busy":
                        busy.button.style = {
                            "background":"white",
                            "border-radius":ripeBanana
                        }
                        busy.text.style = {
                            background:ripeBanana,
                            "-webkit-background-clip": "text",
                            "-webkit-text-fill-color": "transparent",
                        }
                        break;

                    case "pastTime":
                        pastTime.button.style = {
                            "background":"white",
                            "border-radius":purple
                        }
                        pastTime.text.style = {
                            background:purple,
                            "-webkit-background-clip": "text",
                            "-webkit-text-fill-color": "transparent",
                        }

                        break;

                    default:
                        break;
                }
                ref.detectChanges()
            })
        )
        .subscribe()
        state.obs.next({})
        subs.push(stateEvent)

        //

        // setup gogole maps
        let gScriptEvent:Subscription
        if(window.google){
            ryber.googleMaps.setup({
                map:myHomeMap
            })
        }
        else{
            gScriptEvent = fromEvent(ryber.googleMaps.script.element,"load")
            .pipe(
                tap((result)=>{
                    ryber.googleMaps.setup({
                        map:myHomeMap
                    })
                })
            )
            .subscribe()
            subs.push(gScriptEvent)
        }
        //

        // setup client socket for poll
        let clientIo = ryber.socket.client =io(env.backend.url)
        //

        // poll the direction endpoint to see which endpoint our marker should go
            // once we get to the destination then ok
        ryber.googleMaps.eggsCollected  = 0
        ref.detectChanges()
        clientIo.on("direction",(devObj)=>{
            let result =devObj.data.trim().toLowerCase()
            let current = ryber.googleMaps.marker.getPosition()
            let lat = current.lat()
            let lng = current.lng()
            if(["up","down","left","right"].includes(result)){
                // use of segment to track direction decisions
                analytics.track(result)
                //
            }

            switch (result) {
                case "up":
                    lat += .0005
                    break;

                case "down":
                    lat -= .0005
                    break;

                case "left":
                    lng -= .0005
                    break;

                case "right":
                    lng += .0005
                    break;

                default:
                    break;
            }

            ryber.googleMaps.marker.setPosition({lat,lng})
            // current = ryber.googleMaps.marker.getPosition()
            // console.log(current.lat(),current.lng())

            // if we arrived at an egg update the state
            ryber.googleMaps.eggs
            .forEach((x:any,i)=>{
                let egg = x.getPosition()


                current = ryber.googleMaps.marker.getPosition()
                console.log( current.lat(),current.lng())
                lat = Math.abs(egg.lat() - current.lat())
                lng = Math.abs(egg.lng() -current.lng())
                // console.log(lat,lng,1e-16)
                if(
                    lat < 1e-13 &&
                    lng < 1e-13
                ){
                    ryber.googleMaps.eggsCollected += 1
                    x.setMap(null);
                    ref.detectChanges()
                }

            })
            //
        })

        //
    }

    ngOnDestroy(): void {
        this.subs
        .forEach((x:any,i)=>{
            x.unsubscribe();
        })
    }

}
