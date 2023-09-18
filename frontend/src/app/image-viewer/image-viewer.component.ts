// @ts-nocheck
import { Component } from '@angular/core';
import { BackendServiceService, Iannotation } from '../backend-service.service';
import * as d3 from 'd3';


class D3SvgRectangle {
	nodelist: any;
	rect: any;

	constructor(private data: Iannotation) {
		const _that = this;
		const drag = d3.drag().on('drag', (e) => _that.handleDrag(e));
		this.rect = d3.select('svg g').append('rect')
			.attr('x', data.x)
			.attr('y', data.y)
			.attr('width', data.width)
			.attr('height', data.height)
			.attr('stroke', 'black')
			.style('stroke-dasharray', ('3, 3'))
			.attr('fill', '#00000011');
		this.rect.call(drag);

		this.p1 = d3.select('svg g').append('circle').attr('r', 5).attr('cx', data.x).attr('cy', data.y).attr('fill','#29b6f2');
		this.p2 = d3.select('svg g').append('circle').attr('r', 5).attr('cx', data.x + data.width).attr('cy', data.y).attr('fill','#29b6f2');
		this.p3 = d3.select('svg g').append('circle').attr('r', 5).attr('cx', data.x + data.width).attr('cy', data.y + data.height).attr('fill','#29b6f2');
		this.p4 = d3.select('svg g').append('circle').attr('r', 5).attr('cx', data.x).attr('cy', data.y + data.height).attr('fill','#29b6f2');

		const p1drag = d3.drag().on('drag', (e) => _that.handleP1Drag(e));
		const p2drag = d3.drag().on('drag', (e) => _that.handleP2Drag(e));
		const p3drag = d3.drag().on('drag', (e) => _that.handleP3Drag(e));
		const p4drag = d3.drag().on('drag', (e) => _that.handleP4Drag(e));
		this.p1.call(p1drag);
		this.p2.call(p2drag);
		this.p3.call(p3drag);
		this.p4.call(p4drag);

		const all_drags = [drag,p1drag,p2drag,p3drag,p4drag]
		for(let d of all_drags)
		{
			d.on('end',()=>_that.onDragEnd());
		}
	}
	onDragEnd():void
	{
		//console.log("drag_end")
	}
	updateRect() {
		this.rect.attr('x', this.data.x);
		this.rect.attr('y', this.data.y);
		this.rect.attr('width', this.data.width);
		this.rect.attr('height', this.data.height);

		this.p1.attr('cx', this.data.x);
		this.p1.attr('cy', this.data.y);

		this.p2.attr('cx', this.data.x + this.data.width);
		this.p2.attr('cy', this.data.y);

		this.p3.attr('cx', this.data.x + this.data.width);
		this.p3.attr('cy', this.data.y + this.data.height);

		this.p4.attr('cx', this.data.x);
		this.p4.attr('cy', this.data.y + this.data.height);
	}
	handleDrag(e: any) {
		this.data.x += e.dx;
		this.data.y += e.dy;
		this.updateRect();
	}
	handleP1Drag(e: any) {
		this.data.width -= e.dx;
		this.data.height -= e.dy;
		this.data.x += e.dx;
		this.data.y += e.dy;
		this.updateRect();
	}
	handleP2Drag(e: any) {
		this.data.width += e.dx;
		this.data.height -= e.dy;
		this.data.y += e.dy;
		this.updateRect();
	}
	handleP3Drag(e: any) {
		this.data.width += e.dx;
		this.data.height += e.dy;
		this.updateRect();
	}
	handleP4Drag(e: any) {
		this.data.width -= e.dx;
		this.data.height += e.dy;
		this.data.x += e.dx;
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
		this.svg = d3.select('figure#bar')
			.append('svg')
			.attr('width', this.width + (this.margin * 2))
			.attr('height', this.height + (this.margin * 2))
			.append('g')
			.attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
			.append('svg:image')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 1920)
			.attr('height', 1080)
			.attr('xlink:href', 'https://placehold.co/1920x1080/png');

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