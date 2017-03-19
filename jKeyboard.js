/*
By Josuha Koo (zz85nus @ gmail.com)
http://lab4games.net/zz85/blog
Version 1
Jan-Feb 2009

*/

function jKeyboard($){
var sMode = false;

var c = 0;
var events = [];
var canvas, ctx, kbCanvas;
var strokes = [];
var drawing = false, clicked = false, grip = false;
var trashLetters = [];
var autofire, autoFireInt = 200, autofireX;
var objFocus;
function simpleSprite() { return {
	
}
}

function Sprite(o) {
	var s = simpleSprite();
	
	// Use new keys
	for (var k in o) {
		s[k] = o[k];
		
	}
	
	return s;
}
 var fps = 50;
 var fdur = 1000/fps;
var lastU = new Date();

function frameRate() {
	
	var n = (new Date()).getTime();
	if ((n-lastU)<fdur) return;
	lastU = n;
	if (events['mousemove']) {
		$('#out').html('Mouse moving');
		var e = events['mousemove'];
		strokes.push({x:e.x, y:e.y});
		kbCanvas.mousemove(e);
		kbCanvas.paint();
		
		if (sMode && drawing) { // For drawing keyboard paths
			ctx.beginPath();
			ctx.moveTo(strokes[0].x,strokes[0].y);
			
			for (var s=1; s<strokes.length;s++) {
				ctx.lineTo(strokes[s].x,strokes[s].y);
			}
			ctx.stroke();
		}
	} else {
		$('#out').html('Nothing');
		
	}
	
	//events = [];
	
}

var keyObjects = [];

var startKb =  function() {
		
		var canvas = document.createElement('canvas');
		
		
		if ($.browser.msie) {
			// IE is still not supported YET. 
			// We have to load Excanvas on demand and render
			// We also have to use a different API to access textarea.
			
			//http://ajaxpatterns.org/On-Demand_Javascript
			
			
			                       
			dhtmlLoadScript('excanvas.js');
			G_vmlCanvasManager.initElement(canvas);
			
			/* */
			/*
			jQuery.getScript("excanvas.js", function(){
				if (typeof(G_vmlCanvasManager) != 'undefined') {
					G_vmlCanvasManager.initElement(canvas);
				}
			});
			*/
			
		}
		
		
		if (!canvas.getContext){ 
         	 	 alert("Sorry, your browser does not support html 5 canvas. Please try with another browser!!");
         	 	 return;
         	 }
         	 
         	var kbWidth = 670;
		var kbHeight = 250;
		
		// Setting Keyboard DOM attributes
		$(canvas).attr('id', 'jKeyboard')
		.attr('width', kbWidth)
		.attr('height', kbHeight)
		.attr('style', 'border: solid 2px #666; padding:5px; position: fixed; left:100px;\
			top:100px;\
			-moz-border-radius: 15px;\
			-webkit-border-radius: 15px;\
			background:#fff;\
			filter:alpha(opacity=60);\
			-moz-opacity:0.6;\
			-khtml-opacity: 0.6;\
			opacity: 0.6;\
			');
		
			
		// Centers Keyboard
		$(canvas).css({left: ($(window).width()-kbWidth)/2, top: ($(window).height()-kbHeight)/2});
         	 	
         	 $('body').append(canvas);
         	 ctx = canvas.getContext("2d");
         	 CanvasTextFunctions.enable(ctx);
         	 
         	 var zz = 0;
         	 handleKeyboardDrag =  function(e) {
         	  	  if (grip) {		
				$('#jKeyboard').css({left:e.pageX - gripXY.x, 
				top:e.pageY - gripXY.y});
			}
		  }
         	 
         	  kbCanvas = {
         	 	elements:[],	
         	 	paint:function() {
         	 		ctx.clearRect(0,0,canvas.width,canvas.height);
         	 		for (var e in this.elements) {
         	 			this.elements[e].paint();
				}
			},
			mousemove:function(e) {
				if (clicked) {
					drawing = true;
					
				}
				
				
				
				$('#out').html('Mouse moving');
				var hit = false; 
				for (var o in this.elements) {
					var o2 = this.elements[o];
					
					
					if (o2.ispressed) {
						o2.isdragged = true;
						if (typeof o2.drag == 'function') 
						o2.drag(e);
					}
					
					if (typeof o2.hover != 'function') continue;
					
					
					if ((o2.x<e.x)&&(o2.y<e.y)&&
						((o2.x+o2.w)>e.x)&&
						((o2.y+o2.h)>e.y)) {
						
						if (typeof o2.hover == 'function') 
							o2.hover(e);
						hit = true;
						
					} else {
						if (o2.ishover) {
							o2.hoveroff(e);
						}
					}
				}
				if (!hit) {
					$('#jKeyboard').css({cursor:'auto'});
				}
			},
			mousedown:function(e) {
				clicked =true;
				strokes = [];
				grip = true;
				gripXY = e;
				strokes.push({x:e.x, y:e.y});
				$('#out').html('Mouse Down');
				for (var o in this.elements) {
					var o2 = this.elements[o];
					
					if ((o2.x<e.x)&&(o2.y<e.y)&&
						((o2.x+o2.w)>e.x)&&
						((o2.y+o2.h)>e.y)) {
						o2.clicked = true;
						grip = false;
						if (typeof o2.mousedown == 'function')  {
							o2.ispress = true;
							o2.mousedown(e);
						}
						o2.paint();
						
						break;
					}
				}
				
				if (grip) {
					$(document).mousemove(handleKeyboardDrag);
				}
			},
			mouseup:function(e) {
				if (grip) {
					$(document).unbind('mousemove', handleKeyboardDrag);
				}
				grip = false;
				clicked = false; drawing = false;
				for (var o in this.elements) {
					var o2 = this.elements[o];
					if (o2.ispress) {
						
						if (typeof o2.mouseup != 'function') continue;
						if ((o2.x<e.x)&&(o2.y<e.y)&&
							((o2.x+o2.w)>e.x)&&
							((o2.y+o2.h)>e.y)) {
							o2.mouseup(e);
							hit = true;
						}
						o2.ispress = false;
					}
				}
			}
         	 };
         	 

         	 
         	 
         	 // Keyboard Layout.
         	 var kbItems = [];
         	 kbItems[0] = [ '`','1','2','3','4','5','6','7','8','9','0','-','=','delete'];
         	 kbItems[1] = [ 'tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'];
         	 kbItems[2] = [ 'caps','a','s','d','f','g','h','j','k','l', ';','\'','enter'];
         	 kbItems[4] = [ 'shift','z','x','c','v','b','n','m',',','.','/','reserved'];
         	 kbItems[5] = [ 'space'];
         	 
         	 
		function roundedRect(ctx,x,y,width,height,radius,hover, click){  
			ctx.beginPath();  
			ctx.moveTo(x,y+radius);  
			ctx.lineTo(x,y+height-radius);  
			ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
			ctx.lineTo(x+width-radius,y+height);  
			ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
			ctx.lineTo(x+width,y+radius);  
			ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
			ctx.lineTo(x+radius,y);  
			ctx.quadraticCurveTo(x,y,x,y+radius);  
			
			// 000 333 666 dark light ligher
			// click hover default 000 555 aaa , 000 999 555
			if (click) {
				ctx.strokeStyle = "#000";
				ctx.stroke();
				
			} else 
			if (hover) {
				ctx.strokeStyle = "#999";
				
				ctx.stroke();
				//ctx.fillStyle = "yellow"; 
				//ctx.fill();  
			} else {
				ctx.strokeStyle = "#555";
				ctx.stroke();
			}
		}  
		
		function hover() {
			$('#out').html(':)');
			this.ishover = true;
			//kbCanvas.paint();
			$('#jKeyboard').css({cursor:'pointer'});
		}
		
		function hoveroff() {
			this.ishover = false;
			this.ispress = false;
			$('#jKeyboard').css({cursor:'auto'});
		}
		
		function replaceIt(txtarea, newtxt) {
			if (!txtarea) return;
			
			// IE txtarea.selection
			//document.selection.createRange().text = 'Some new text';

			
			var oldtxt = $(txtarea).val();
			var start = txtarea.selectionStart;
			var end = txtarea.selectionEnd;
			if (autofireX > -1) { autofireX+= newtxt.length ; 
			start =  end = autofireX;  } // Work around for Chrome
			else { autofireX = start; }
			 
			var select = end - start;
			
			//$('#out2').append('start '+start + ' end ' +end+ ' select ' + select + ' ' + newtxt.length  + '<br />');
			
		  $(txtarea).val(
			oldtxt.substr(0, start)+
			newtxt+
			oldtxt.substr(end)
		   );
		  
		  
		  //if (select>0) // There's no need for checking selection here? 
		  if (txtarea.setSelectionRange) {
			 txtarea.setSelectionRange(start+newtxt.length , start+newtxt.length);
		  }
		  
		  
		 // txtarea.focus();
		 
		}

		
		function lettermousepress() {
			replaceIt(findFocusTarget(),this.txt);
			
			// Set autofire
			
			autofire = window.setInterval(replaceIt, autoFireInt,
				findFocusTarget(),this.txt);
			
			
		}
		
		function mouseup() {
			this.ispress = false;
		}
         	 
         	 function paint() {
         	 	 roundedRect(ctx, this.x , this.y, this.w, this.h, 5, this.ishover, this.ispress ); 
         	 	 //ctx.strokeRect(this.x , this.y, this.w, this.h ); //ctx.fillText(this.txt, this.x + this.w/2, this.y + this.h/2);
         	 	 ctx.drawTextCenter(null,12,this.x + this.w/2, this.y + this.h/2+5, this.txt);
         	 }
         	 
         	 function lookupwidth(c) {
         	 	 if (c=='tab') return 70;
         	 	 if (c=='delete') return 70;
         	 	 if (c=='caps') return 80;
         	 	 if (c=='enter') return 77;
         	 	 if (c=='shift') return 97;
         	 	 if (c=='reserved') return 100;
         	 	 if (c=='space') return 660;
         	 	 
         	 	 return 40;
         	 }
         	 
         	 
         	 // Init Objects
         	 
         	 
         	 var kx,ky;
         	 var padding = 5;
         	 ky = padding;
         	 for (var i1 in kbItems) {
         	 	 kx = padding;
         	 	 for (i2 in kbItems[i1]) {
         	 	 	 var key1 = kbItems[i1][i2]
         	 	 	 
         	 	 	 
         	 	 	 var item = {txt: key1, x:kx, y:ky, w:lookupwidth(key1), h:40, 
         	 	 	 paint:paint,
         	 	 	 hover:hover,
         	 	 	 hoveroff:hoveroff,
         	 	 	 mousedown:lettermousepress,
         	 	 	 mouseup:mouseup};
         	 	 	 kx+= item.w + padding;
         	 	 	 
         	 	 	 keyObjects[key1] = item;
         	 	 	 kbCanvas.elements.push(keyObjects[key1]);
         	 	 }
         	 	 ky+= padding + 40;
         	 }
         	 
         	 /* Key Bindings*/
         	 
         	 function kd(key) {
         	 	 if ($(findFocusTarget()).attr('type')=='password') return;
         	 	 keyObjects[key].ispress = true; keyObjects[key].paint();
         	 	 
         	 }
         	 function ku(key) { keyObjects[key].ispress = false; kbCanvas.paint(); }
         	 
         	 function findFocusTarget() {
         	 	 var target = $(':focus');
         	 	 
			 if (target.is('input') || target.is('textarea') ) {
			 	 return target[0];
			 } else {
			 	 return null;
			 }
         	 	
         	 }
         	 
         	 $(document).bind('keydown', '`', function() { kd('`') } )
		.bind('keyup', '`', function() { ku('`')} )
		.bind('keydown', '1', function() { kd('1') } )
		.bind('keyup', '1', function() { ku('1')} )
		.bind('keydown', '2', function() { kd('2') } )
		.bind('keyup', '2', function() { ku('2')} )
		.bind('keydown', '3', function() { kd('3') } )
		.bind('keyup', '3', function() { ku('3')} )
		.bind('keydown', '4', function() { kd('4') } )
		.bind('keyup', '4', function() { ku('4')} )
		.bind('keydown', '5', function() { kd('5') } )
		.bind('keyup', '5', function() { ku('5')} )
		.bind('keydown', '6', function() { kd('6') } )
		.bind('keyup', '6', function() { ku('6')} )
		.bind('keydown', '7', function() { kd('7') } )
		.bind('keyup', '7', function() { ku('7')} )
		.bind('keydown', '8', function() { kd('8') } )
		.bind('keyup', '8', function() { ku('8')} )
		.bind('keydown', '9', function() { kd('9') } )
		.bind('keyup', '9', function() { ku('9')} )
		.bind('keydown', '0', function() { kd('0') } )
		.bind('keyup', '0', function() { ku('0')} )
		.bind('keydown', '-', function() { kd('-') } )
		.bind('keyup', '-', function() { ku('-')} )
		.bind('keydown', '=', function() { kd('=') } )
		.bind('keyup', '=', function() { ku('=')} )
		.bind('keydown', 'backspace', function() { kd('delete') } )
		.bind('keyup', 'backspace', function() { ku('delete')} )
		.bind('keydown', 'tab', function() { kd('tab') } )
		.bind('keyup', 'tab', function() { ku('tab')} )
		.bind('keydown', 'q', function() { kd('q') } )
		.bind('keyup', 'q', function() { ku('q')} )
		.bind('keydown', 'w', function() { kd('w') } )
		.bind('keyup', 'w', function() { ku('w')} )
		.bind('keydown', 'e', function() { kd('e') } )
		.bind('keyup', 'e', function() { ku('e')} )
		.bind('keydown', 'r', function() { kd('r') } )
		.bind('keyup', 'r', function() { ku('r')} )
		.bind('keydown', 't', function() { kd('t') } )
		.bind('keyup', 't', function() { ku('t')} )
		.bind('keydown', 'y', function() { kd('y') } )
		.bind('keyup', 'y', function() { ku('y')} )
		.bind('keydown', 'u', function() { kd('u') } )
		.bind('keyup', 'u', function() { ku('u')} )
		.bind('keydown', 'i', function() { kd('i') } )
		.bind('keyup', 'i', function() { ku('i')} )
		.bind('keydown', 'o', function() { kd('o') } )
		.bind('keyup', 'o', function() { ku('o')} )
		.bind('keydown', 'p', function() { kd('p') } )
		.bind('keyup', 'p', function() { ku('p')} )
		.bind('keydown', '[', function() { kd('[') } )
		.bind('keyup', '[', function() { ku('[')} )
		.bind('keydown', ']', function() { kd(']') } )
		.bind('keyup', ']', function() { ku(']')} )
		.bind('keydown', '\\', function() { kd('\\') } )
		.bind('keyup', '\\', function() { ku('\\')} )
		.bind('keydown', 'capslock', function() { kd('caps') } )
		.bind('keyup', 'capslock', function() { ku('caps')} )
		.bind('keydown', 'a', function() { kd('a') } )
		.bind('keyup', 'a', function() { ku('a')} )
		.bind('keydown', 's', function() { kd('s') } )
		.bind('keyup', 's', function() { ku('s')} )
		.bind('keydown', 'd', function() { kd('d') } )
		.bind('keyup', 'd', function() { ku('d')} )
		.bind('keydown', 'f', function() { kd('f') } )
		.bind('keyup', 'f', function() { ku('f')} )
		.bind('keydown', 'g', function() { kd('g') } )
		.bind('keyup', 'g', function() { ku('g')} )
		.bind('keydown', 'h', function() { kd('h') } )
		.bind('keyup', 'h', function() { ku('h')} )
		.bind('keydown', 'j', function() { kd('j') } )
		.bind('keyup', 'j', function() { ku('j')} )
		.bind('keydown', 'k', function() { kd('k') } )
		.bind('keyup', 'k', function() { ku('k')} )
		.bind('keydown', 'l', function() { kd('l') } )
		.bind('keyup', 'l', function() { ku('l')} )
		.bind('keydown', ';', function() { kd(';') } )
		.bind('keyup', ';', function() { ku(';')} )
		.bind('keydown', '\'', function() { kd('\'') } )
		.bind('keyup', '\'', function() { ku('\'')} )
		.bind('keydown', 'enter', function() { kd('enter') } )
		.bind('keyup', 'enter', function() { ku('enter')} )
		.bind('keydown', 'shift', function() { kd('shift') } )
		.bind('keyup', 'shift', function() { ku('shift')} )
		.bind('keydown', 'z', function() { kd('z') } )
		.bind('keyup', 'z', function() { ku('z')} )
		.bind('keydown', 'x', function() { kd('x') } )
		.bind('keyup', 'x', function() { ku('x')} )
		.bind('keydown', 'c', function() { kd('c') } )
		.bind('keyup', 'c', function() { ku('c')} )
		.bind('keydown', 'v', function() { kd('v') } )
		.bind('keyup', 'v', function() { ku('v')} )
		.bind('keydown', 'b', function() { kd('b') } )
		.bind('keyup', 'b', function() { ku('b')} )
		.bind('keydown', 'n', function() { kd('n') } )
		.bind('keyup', 'n', function() { ku('n')} )
		.bind('keydown', 'm', function() { kd('m') } )
		.bind('keyup', 'm', function() { ku('m')} )
		.bind('keydown', ',', function() { kd(',') } )
		.bind('keyup', ',', function() { ku(',')} )
		.bind('keydown', '.', function() { kd('.') } )
		.bind('keyup', '.', function() { ku('.')} )
		.bind('keydown', '/', function() { kd('/') } )
		.bind('keyup', '/', function() { ku('/')} )
		.bind('keydown', 'reserved', function() { kd('reserved') } )
		.bind('keyup', 'reserved', function() { ku('reserved')} )
		.bind('keydown', 'space', function() { kd('space') } )
		.bind('keyup', 'space', function() { ku('space')} );
         	 
         	 /* Code Generatation for Keybindings
         	 for (var key in keyObjects) {
         	 	 
         	 	 $('#out2').append("$(document).bind('keydown', 'keyz', function() { kd('keyz') } );".replace(/keyz/g,key));
         	 	 $('#out2').append("<br/>");
         	 	 $('#out2').append("$(document).bind('keyup', 'keyz', function() { ku('keyz')} );".replace(/keyz/g,key));
         	 	 $('#out2').append("<br/>");
         	 }*/
         	 
         	 keyObjects['caps'].mousedown = function() {
         	 	 var lower = ( keyObjects['a'].txt=='a');
         	 	 
         	 	 var az = 'abcdefghijklmnopqrstuvwxyz';
         	 	 if (lower) az = az.toUpperCase();
         	 	 
         	 	 for (var i in az) {
         	 	 	 keyObjects[az[i].toLowerCase()].txt = az[i]; 
         	 	 }
         	 	 
         	 	 var charsLower = '`1234567890-=[]\\;\',./';
         	 	 var charsUpper = '~!@#$%^&*()_+{}|:"<>?';
         	 	 
         	 	 if (lower) {
         	 	 	 for (var i in charsLower) {
         	 	 	 	 keyObjects[charsLower[i]].txt = charsUpper[i]; 
         	 	 	 }
         	 	 } else {
         	 	 	 for (var i in charsLower) {
         	 	 	 	 keyObjects[charsLower[i]].txt = charsLower[i]; 
         	 	 	 }
         	 	 }
         	 	 
         	 	 kbCanvas.paint();
         	 }
         	 
         	 // To Implement Reserved keys for Language options perhaps?
         	 keyObjects['reserved'].mousedown = null;
         	 
         	 // To implement proper shift
         	 keyObjects['shift'].mousedown = keyObjects['caps'].mousedown;
         	 
         	 keyObjects['space'].mousedown = function() {
         	 	 replaceIt(findFocusTarget(),' ');
         	 	 autofire = window.setInterval(replaceIt, autoFireInt,
				findFocusTarget(),' ');
         	 }
         	 
         	 keyObjects['enter'].mousedown = function() {
         	 	 replaceIt(findFocusTarget(),'\n');
         	 	 autofire = window.setInterval(replaceIt, autoFireInt,
				findFocusTarget(),'\n');
         	 }
         	 
         	 keyObjects['delete'].mousedown = function() {
         	 	 txtarea = objFocus;
         	 	if (!txtarea) return;
         	 			
			
			var start = txtarea.selectionStart;
			var end = txtarea.selectionEnd;
			var oldtxt = $(txtarea).val();
			
			var af = (autofireX > -1);
			
			if (af) { start =  end = --autofireX;  } // Work around for Chrome
			
			
			var selection = end - start;
			
			if ((selection ==0) || af) {
				
				var newstr = oldtxt.substr(0, start-1)+
					oldtxt.substr(end);
									
				$(txtarea).val(newstr);
			  
			  
				   if (txtarea.setSelectionRange) {
					  txtarea.setSelectionRange(start-1,start-1);
		
				  }
			
			} else {
				replaceIt(objFocus,'');
			}
			
			if (!af) { autofireX = start; }
			
			autofire = window.setTimeout(keyObjects['delete'].mousedown, autoFireInt);
         	 }
         	 
         	 keyObjects['tab'].mousedown = function() {
         	 	 replaceIt(findFocusTarget(),'\t');
         	 }
         	 
         	/* 	 
         	 $('*').focus(function() {
         	 	alert(this);
         	 	objFocus = findFocusTarget();
         	 });*/
         	 
         	 // Set event handlers for the main Canvas
		$('#jKeyboard').mousemove(function(e) {
			var x = e.pageX - $(this).offset().left;
			var y = e.pageY - $(this).offset().top;
			//kbCanvas.mousemove({x:x,y:y});
			events['mousemove'] = {x:x,y:y};
			frameRate();
		}).mousedown(function(e) {
			var x = e.pageX - $(this).offset().left;
			var y = e.pageY - $(this).offset().top;
			objFocus = findFocusTarget();
			kbCanvas.mousedown({x:x,y:y});
			
						
		}).mouseup(function(e) {
			var x = e.pageX - $(this).offset().left;
			var y = e.pageY - $(this).offset().top;
			kbCanvas.mouseup({x:x,y:y});
			
			// Stop the auto fire!
			window.clearInterval(autofire);
			autofireX = -1;
			
			if (objFocus) objFocus.focus();  
		});
		
		kbCanvas.paint();
		//setInterval(frameRate,1000/fps); // Auto fire rate
}



//$(document).ready(_

startKb();

} //


function startScripts($) {
	
	var canvastxtsrc = 'http://jabtunes.com/notation/canvastext.js';
	var hotkeyssrc = 'http://js-hotkeys.googlecode.com/files/jquery.hotkeys-0.7.9.min.js';
	
	if ($('#jKeyboard').size()==0) {
		// Load scripts
		$.getScript(canvastxtsrc, 
			function() {
				$.getScript(hotkeyssrc,function(){ jKeyboard(jQuery);});
			}
		);
	} else {
		$('#jKeyboard').toggle();
	}
}



// This is for the orginal bookmarklet
/*
(function(){
 var e = document.createElement('script');
 e.type='text/javascript';
 e.src = 'http://jabtunes.com/notation/jKeyboard.js.php';
 document.getElementsByTagName('head')[0].appendChild(e); 
})(); // Encapsulation

(function(){var e=document.createElement('script');e.type='text/javascript';e.src='http://jabtunes.com/notation/jKeyboard.js.php';document.getElementsByTagName('head')[0].appendChild(e);})();
*/


// This is taken from http://coder-zone.blogspot.com/2009/05/jquery-bookmarklet.html
(function(){
	
  // Check if jQuery is loaded
  if(typeof window.jQuery != 'undefined' &&  $.fn.jquery=='1.4.1') {
    startScripts(window.jQuery);
  } else {
    // Check for conflicts
    var conflict = typeof window.$ != 'undefined';
    // Create the script and point to Google API
    var script = document.createElement('script');
    script.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js');
    // Add the script to the 'head' for processing
    document.getElementsByTagName('head')[0].appendChild(script);
    
    /*
    // Create a way to wait until script loading - Polling method
    var attempts = 15;
    (function(){
      // Check again if jQuery is undefined
      if(typeof window.jQuery == 'undefined') {
        if(--attempts > 0) {
          // Calls himself in a few milliseconds
          window.setTimeout(arguments.callee, 250)
        } else {
          // Too much attempts to load, send error
          alert('An error ocurred while loading jQuery')
        }
      } else {
        //message('jQuery '+jQuery.fn.jquery+' loaded'+          (conflict && jQuery.noConflict() ? ' with noConflict' : ''));
    	startScripts(window.jQuery);    

    })();
    */
    script.onload = function () {
    	    startScripts(window.jQuery);
    };
    	    
  }

  function message(msg) {
    var element = jQuery('<a>')
      .html(msg)
      .attr('href', '#')
      .css({
        width: 'auto',
        opacity: 0.9,
        position: 'fixed',
        zIndex: 9000,
        top: '15px',
        right: '20px',
        background: '#000',
        'float': 'right',
        padding: '7px 10px',
        color: '#fff',
        border: 'solid 2px #fff',
        textDecoration: 'none',
        textAlign: 'center',
        font: '12px "Lucida Grande",Helvetica,Tahoma bold',
        borderRadius: '5px',
        MozBorderRadius: '5px',
        MozBoxShadow: '0 0 20px #000',
        WebkitBorderRadius: '5px',
        WebkitBoxShadow: '0 0 20px #000'
      })
      .click(function(evt){
        evt.preventDefault();
        jQuery(this).fadeOut('slow', function(){jQuery(this).remove()});
      })
      .appendTo('body');
    window.setTimeout(function(){ element.trigger('click') }, 2500);
  };
})()
