// @ts-nocheck
import { Component } from '@angular/core';
import { BackendServiceService, Iannotation } from '../backend-service.service';
import * as d3 from 'd3';


class D3SvgRectangle {
	nodelist: any;
	constructor(private data: Iannotation) {
		const _that = this;
		const drag = d3.drag().on('drag', (e) => _that.handleDrag(e));
		this.rect = d3.select("svg g").append("rect")
			.attr("x", data.x)
			.attr("y", data.y)
			.attr("width", data.width)
			.attr("height", data.height)
			.attr('stroke', 'red')
			.style("stroke-dasharray", ("3, 3"))
			.attr('fill', '#00000022');
		this.rect.call(drag);
	}
	updateRect() {
		this.rect.attr('x', this.data.x);
		this.rect.attr('y', this.data.y);
	}
	handleDrag(e: any) {
		this.data.x += e.dx;
		this.data.y += e.dy;
		this.updateRect();
	}

}
@Component({
	selector: 'app-image-viewer',
	templateUrl: './image-viewer.component.html',
	styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent {
	private data: Array<any> = [];
	private svg: any;
	private margin = 0;
	private width = 1550 - (this.margin * 2);
	private height = 800 - (this.margin * 2);
	annotations?: Iannotation[]
	constructor(private service: BackendServiceService) { }
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
			.attr('width', 1920)
			.attr('height', 1080)
			.attr("xlink:href", "https://placehold.co/1920x1080/png");

		for (let an of this.annotations) {

			new D3SvgRectangle(an);
		}
	}
	private handleZoom(e: any): void {
		d3.select('svg g').attr('transform', e.transform);
	}

	private initZoom(): void {
		let zoom = d3.zoom().on('zoom', this.handleZoom);
		d3.select('svg').call(zoom);
	}
	ngOnInit(): void {
		this.service.getAnnotations().subscribe({
			next: (data) => {
				this.annotations = data;
				this.createSvg();
				this.initZoom();
			}
		});
	}
}