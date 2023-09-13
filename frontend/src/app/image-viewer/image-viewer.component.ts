// @ts-nocheck
import { Component } from '@angular/core';
import * as d3 from 'd3';
@Component({
	selector: 'app-image-viewer',
	templateUrl: './image-viewer.component.html',
	styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent {
	private data: Array<any> = [];
	private svg: any;
	private margin = 0;
	private width = 750 - (this.margin * 2);
	private height = 400 - (this.margin * 2);

	private createSvg(): void {
		this.svg = d3.select("figure#bar")
			.append("svg")
			.attr("width", this.width + (this.margin * 2))
			.attr("height", this.height + (this.margin * 2))
			.append("g")
			.attr("transform", "translate(" + this.margin + "," + this.margin + ")")
			.append("svg:image")
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', this.width)
			.attr('height', this.height)
			.attr("xlink:href", "https://placehold.co/1920x1080")
			
			d3.select("svg g").append("rect")
			.attr("x", 150)
			.attr("y", 50)
			.attr("width", 50)
			.attr("height", 140)
			.attr('stroke', 'black')
			.attr('fill', '#00000055');
	}
	private handleZoom(e: any): void {
		d3.select('svg g')
			.attr('transform', e.transform);
	}

	private initZoom(): void {

		let zoom = d3.zoom().on('zoom', this.handleZoom);
		d3.select('svg').call(zoom);
	}
	ngOnInit(): void {
		this.createSvg();
		this.initZoom();
	}
}
