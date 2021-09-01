import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay,tap } from 'rxjs/operators';
import { mediaPrefix } from './customExports';

@Injectable({
    providedIn: 'root'
})
export class RyberService {

    constructor(
        public router: Router,
        public http: HttpClient
    ) { }

    nav:any={
        inital:false,
        initOnMobile:false,
        items:[
            "HOME",
            "ABOUT",
            "BLOG",
            "EVENTS",
            "LABS",
            "SHOP",
        ],
        showMenu:{
            click:(evt)=>{
                let {changeDisplay} =this.nav.mobileMenu.view
                changeDisplay()

            }
        },
        showFn:(devObj)=>{
        let {vcf,ref} = devObj
            vcf.element.nativeElement.style.opacity = 1;
            this.nav.inital = true
            ref.detectChanges();
        }
    }

    labs :any ={
        panel:{
            show:false,
            view:{
                style:{
                    width:"0px"
                },
            },
            url:{
                style:{},
                type:"iframe"
            },
            thumbnail:{
                style:{}
            },
            title:{
                style:{}
            },
            lab:{
                style:{},
                type:"iframe"
            },
            close:{
                click:(evt:Event)=>{
                    let {labs}=this;
                    labs.panel.view.style.opacity = 0
                    labs.panel.view.style.height = '0px';
                    labs.panel.view.style.width = '0px';
                    delete labs.panel.view.style.transition;

                    // let the animation occur then close the panel
                    of({})
                    .pipe(
                        delay(2000),
                        tap(()=>{
                            labs.panel.show = false
                        })
                    )
                    .subscribe()
                    //
                }
            }
        },
    }

    googleMaps:any = {
        script:{
            element:null
        },
        setup:(devObj)=>{
            let {map} = devObj
            let {googleMaps}= this
            let nyc = {lat:40.7195,lng:-73.903}

            googleMaps.map = new google.maps.Map(
                map.nativeElement,
                {
                    zoom:16.5,
                    center:nyc
                }
            ),
            googleMaps.marker = new SlidingMarker({
                position: {lat:40.719,lng:-73.903},
                map: googleMaps.map,
                draggable: true,
                duration:1500,
            });

            googleMaps.eggs = Array(4).fill(null)
            .map((x:any,i)=>{
                new SlidingMarker({
                    position: [
                        {lat:40.718,lng:-73.903},
                        {lat:40.721,lng:-73.905},
                        {lat:40.7198,lng:-73.901},
                    ][i],
                    map: googleMaps.map,
                    draggable: true,
                    duration:1500,
                    icon:mediaPrefix({media:'eggs.png'})
                });
            })


            // for the oddest reason this map fn wont allow my markers to be seen

            //
            console.log(googleMaps.eggs)

        },
        map:null,
        marker:null,
        eggs:null

    }
}
