/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

import { VisualSettings } from "./settings";

export class Visual implements IVisual {

    private target: HTMLElement;
    private svg: Selection<SVGElement>;
    private settings: VisualSettings;

    //private imageUrl = 'https://www.aena.es/publica/assets/images/aena-green-bg.svg'
    private imageUrl = 'https://img.icons8.com/ios-filled/50/96CE00/airplane-mode-on.png'
  
    private width: number;
    private height: number;

    private x_plane: number;
    private y_plane: number;
    private w_plane: number;
    private h_plane: number;
    private speed: number;

    private timer: number;

    private initialise(svg: Selection<SVGElement>)
    {
        // Width and Height of the visual
        this.width = 150;
        this.height = 50;
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);

        // Init Plane
        this.speed = 0;
        this.x_plane = this.width;
        this.y_plane = this.height/4;
        this.w_plane = 30;
        this.h_plane = 30;

        this.draw(svg);
    }


    private draw(svg: Selection<SVGElement>)
    {
        svg.selectAll("g").remove();
        var plane = svg.append("g")
            .attr("transform", "translate(" + this.x_plane + ", " + this.y_plane +  ")") // y x
        plane.append('svg:image')
            .attr("xlink:href", this.imageUrl )
            //.attr("xlink:href", imagePath )
            //.attr("src", "@/assets/plane.png")
            //.attr("href", "file://C:/Users/alici/PBI_visual/welDevReactVisual/Aena_Logo_New.svg" )
            //.attr("src", "@/assets/Aena_Logo_New.png")
            .attr('width', this.w_plane)
            .attr('height', this.h_plane)
            .attr('x', 0)
            .attr('y', 0)
            //.attr('transform', 'rotate(0, 10,  10)')
            //.attr('transform', 'rotate(180, 30,  30)')
       // svg.selectAll("g").remove();
    }

    private move(svg: Selection<SVGElement>)
    {
        //this.x_plane = this.x_plane - 1;
        this.x_plane = this.x_plane + 1;

        // console.log("x:", this.x_plane )
        //if (this.x_plane => 0){
        if (this.x_plane >= this.width){
                //this.x_plane = this.width;
                this.x_plane = -30;
        }
        this.draw(svg);
    }

    private initTimer(svg: Selection<SVGElement>)
    {
        if (this.timer != null){
            clearInterval(this.timer);
        }
        var visual = this;
        this.timer = setInterval(function () {
            visual.move(svg);
        }, 50);
    }
    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        
        this.svg = d3.select(options.element)
            .append("svg")
            .classed("plane", true);
        if (typeof document !== "undefined"){
            this.initialise(this.svg);
            this.initTimer(this.svg);
        }
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        //this.width = options.viewport.width;
        //this.height = options.viewport.height;
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return VisualSettings.parse(dataView) as VisualSettings;
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}