var macaudio = require('macaudio');
var Leap = require('leapjs');

var f1 = 0;
var f2 = 0;

Leap.loop(function(frame){
	if (frame.hands[0]) {
		f1 = Math.floor(frame.hands[0].palmPosition[1] * 1.5);
	} else {
		f1 = 0;
	}
	if (frame.hands[1]) {
		f2 = Math.floor(frame.hands[1].palmPosition[1] * 1.5);
	} else {
		f2 = 0;
	}
});

// Smaller buffer gives smoother glissando while waving
var bufferSize = 512; // 512, 1024, 2048 or 4096
var node = new macaudio.JavaScriptOutputNode(bufferSize);

var phase1 = 0;
var phase2 = 0;

node.onaudioprocess = function(e) {
	var phaseStep1 = f1 / node.sampleRate;
	var phaseStep2 = f2 / node.sampleRate;

	var L = e.getChannelData(0);
	var R = e.getChannelData(1);
	for (var i = 0; i < e.bufferSize; i++) {
		L[i] = Math.sin(2 * Math.PI * phase1);
		R[i] = Math.sin(2 * Math.PI * phase2);

		phase1 += phaseStep1;
		phase2 += phaseStep2;
	}
};

node.start();
