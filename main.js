(canvas => {
	var length = 75;
	var seg = 0;
	var segadd = 0.1;
	var points = [];
	var addpoint = true;
	var accelerate = false;
	var iters = 1;

	function Point(ctx, seg, length, accelerate) {
		var self = this;
		this.radius = 0;
		this.length = length;
		this.seg = seg;
		this.v = Math.hypot(Math.cos(this.seg), Math.sin(this.seg));
		this.acceleration = this.v/50;
		this.fill = ctx.createLinearGradient(0, length, 0, 0);
		this.fill.addColorStop(0, 'transparent');
		this.fill.addColorStop(1, 'hsl(' + this.seg * 180 / Math.PI + ', 80%, 50%)');
		this.next = () => self.radius += self.v += accelerate ? self.acceleration : 0;
	}

	const ctx = canvas.getContext('2d');
	(draw = () => {
		requestAnimationFrame(draw);
		canvas.width = innerWidth * devicePixelRatio;
		canvas.height = innerHeight * devicePixelRatio;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const cx = canvas.width / 2;
		const cy = canvas.height / 2;
		for (var i = 0; i < iters; i++) {
			seg = (seg + segadd) % (2 * Math.PI);
			if (addpoint = !addpoint) points.push(new Point(ctx, seg, length, accelerate));
			points = points.filter(p => p.radius <= Math.hypot(cx, cy) + p.length).map(p => {
				ctx.fillStyle = p.fill;
				// translate to where we're going to start drawing
				ctx.translate(cx + p.radius * Math.cos(p.seg), cy + p.radius * Math.sin(p.seg));
				// rotate 90deg to face inward
				ctx.rotate(p.seg + 90 * Math.PI / 180);
				// draw the line being min(p.radius, length)
				ctx.fillRect(0, 0, 2, Math.min(p.radius, p.length));
				// reset the canvas for the next drawing
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				p.next();
				return p;
			});
		}
	})();

	var kind = 0;
	canvas.addEventListener('click', e => {
		switch (kind = ++kind % 3) {
			case 0:
				length = 75;
				segadd = 0.1;
				accelerate = false;
				iters = 1;
				break;
			case 1:
				length = 150;
				segadd = 0.5;
				accelerate = true;
				iters = 1;
				break;
			case 2:
				length = 1000;
				segadd = 0.2 * Math.PI / 180;
				accelerate = true;
				iters = 3;
				break;
		}
	});
})(document.getElementsByTagName('canvas')[0]);