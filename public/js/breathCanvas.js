var BreathCanvas = function() {};

BreathCanvas.prototype.init = function(color0, color1) {
	var self = this;
	if (!this.initialized) {
		//this.initialized = true;
		this.callbacks = [];
		this.$canvas = $('#breathCanvas');
		this.$controller = $('#breathController');
		this.$instructions = $('#instructions');
		this.hideThumb = true;

		if (this.$canvas.length) {
		
			var c0 = 'rgb(' + color0[0] + ',' + color0[1] + ',' + color0[2] + ')',
				c1 = 'rgb(' + color1[0] + ',' + color1[1] + ',' + color1[2] + ')';
			
			this.$controller.css('background', '-webkit-gradient(linear,left top,left bottom,from(' + c0 + '),to(' + c1 + '))');

			this.$controller.addClass('active');
			
			this.reset();
			this.started = false;
			var to = null,
				t = new Date().getTime();
			
			this.$canvas.scroll(function(e) {
				if (self.started) {
					var y = self.$canvas.scrollTop()/self.$canvas.height();
					var t2 = new Date().getTime();
					self.notify(y, t2-t);
					t = t2;
					if (self.initialized && self.hideThumb) self.$controller.addClass('active');
					self.initialized = true;
					clearTimeout(to);
					to = setTimeout(self.showThumb.bind(self), 3000);
				} else {
					e.preventDefault();
					self.$canvas.scrollTop(50); //Half the circle height
				}
			});

			this.$instructions.click(function(e) {
				self.hideInstructions();
			});
		}
	}
};

BreathCanvas.prototype.reset = function(callback) {
	var self = this;
	this.started = false;
	this.hideThumb = false;
	this.$canvas.scrollTop(50); //Half the circle height
	this.showThumb();
	setTimeout(function(){
		self.hideThumb = true;
		if (callback !== undefined) {
			callback();
		}
	},100);
};

BreathCanvas.prototype.start = function() {
	var self = this;
	this.reset(function() {
		self.started = true;
	});
};

BreathCanvas.prototype.stop = function() {
	this.started = false;
};

BreathCanvas.prototype.bind = function(callback) {
	this.callbacks.push(callback);
};

BreathCanvas.prototype.showThumb = function() {
	if (this.$instructions.hasClass('hidden'))
		this.$controller.removeClass('active');
};

BreathCanvas.prototype.showInstructions = function() {
	this.$instructions.removeClass('hidden');
}

BreathCanvas.prototype.hideInstructions = function() {
	this.$instructions.addClass('hidden');
	this.showThumb();
}

BreathCanvas.prototype.notify = function(y) {
	var callbacks = this.callbacks;
	var l = callbacks.length;
	for (var i = 0; i < l; i++) {
		callbacks[i](y);
	}
};