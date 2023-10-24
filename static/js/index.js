window.HELP_IMPROVE_VIDEOJS = false;

// evo through diffusion
const INTERP_BASE_DIFF = [
  "./static/interpolation/diffusion_balancing",
  "./static/interpolation/diffusion_landing",
  "./static/interpolation/diffusion_crawling",
  "./static/interpolation/diffusion_hurdling",
  "./static/interpolation/diffusion_gripping",
  "./static/interpolation/diffusion_box_moving",
];
const N_INTERPS_DIFF = INTERP_BASE_DIFF.length;
const NUM_INTERP_FRAMES_DIFF = Array(N_INTERPS_DIFF).fill(21);

// evo through embedding optim
const INTERP_BASE_EO = [
  "./static/interpolation/evo_balancing",
  "./static/interpolation/evo_landing",
  "./static/interpolation/evo_crawling",
  "./static/interpolation/evo_hurdling",
  "./static/interpolation/evo_gripping",
  "./static/interpolation/evo_box_moving",
]
const N_INTERPS_EO = INTERP_BASE_EO.length;
const NUM_INTERP_FRAMES_EO = [20, 10, 41, 29, 28, 9];

// general
const INTERP_BASE = INTERP_BASE_DIFF.concat(INTERP_BASE_EO);
const N_INTERPS = INTERP_BASE.length;
const NUM_INTERP_FRAMES = NUM_INTERP_FRAMES_DIFF.concat(NUM_INTERP_FRAMES_EO);

var interp_images = [];
for (var n = 0; n < N_INTERPS; n++) {
  interp_images.push([]);
}

function preloadInterpolationImages(n) {
  for (var i = 0; i < NUM_INTERP_FRAMES[n]; i++) {
    if (n <= 5) {
      it = (NUM_INTERP_FRAMES[n] - 1 - i) * 50;
      var path = INTERP_BASE[n] + '/sample_000_base_' + String(it).padStart(3, '0') + '.png';
    } else {
      it = i;
      var path = INTERP_BASE[n] + '/' + String(it).padStart(4, '0') + '.png';
    }
    interp_images[n][i] = new Image();
    interp_images[n][i].src = path;
  }
}

function setInterpolationImage(n, i) {
  var image = interp_images[n][i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper-' + String(n)).empty().append(image);
}

function interpolationAtN(n) {
  preloadInterpolationImages(n);
  $('#interpolation-slider-' + String(n)).on('input', function(event) {
    setInterpolationImage(n, this.value);
  });
  setInterpolationImage(n, 0);
  $('#interpolation-slider-' + String(n)).prop('max', NUM_INTERP_FRAMES[n] - 1);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    for (var n=0; n < N_INTERPS; n++) {
      interpolationAtN(n);
    }

    bulmaSlider.attach();

    // If the comparison slider is present on the page lets initialise it, this is good you will include this in the main js to prevent the code from running when not needed
    if ($(".comparison-slider")[0]) {
      let compSlider = $(".comparison-slider");
    
      //let's loop through the sliders and initialise each of them
      compSlider.each(function() {
        let compSliderWidth = $(this).width() + "px";
        $(this).find(".resize img").css({ width: compSliderWidth });
        drags($(this).find(".divider"), $(this).find(".resize"), $(this));
      });

      //if the user resizes the windows lets update our variables and resize our images
      $(window).on("resize", function() {
        let compSliderWidth = compSlider.width() + "px";
        compSlider.find(".resize img").css({ width: compSliderWidth });
      });
    }

	// Dropdown menu for image comparison slide bar
	var DropdownListIdValue = "DropdownListID";
	$('#' + DropdownListIdValue).on("change", function(){
		// alert($(this).val());
		$(".data").hide();
		$('#' + $(this).val()).fadeIn(700);
	}).change();

})


// This is where all the magic happens
// This is a modified version of the pen from Ege Görgülü - https://codepen.io/bamf/pen/jEpxOX - and you should check it out too.
// https://codepen.io/MarioDesigns/pen/KvXZPK
function drags(dragElement, resizeElement, container) {
	
	// This creates a variable that detects if the user is using touch input insted of the mouse.
	let touched = false;
	window.addEventListener('touchstart', function() {
		touched = true;
	});
	window.addEventListener('touchend', function() {
		touched = false;
	});
	
	// clicp the image and move the slider on interaction with the mouse or the touch input
	dragElement.on("mousedown touchstart", function(e) {
			
		//add classes to the emelents - good for css animations if you need it to
		dragElement.addClass("draggable");
		resizeElement.addClass("resizable");
		//create vars
		let startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
		let dragWidth = dragElement.outerWidth();
		let posX = dragElement.offset().left + dragWidth - startX;
		let containerOffset = container.offset().left;
		let containerWidth = container.outerWidth();
		let minLeft = containerOffset + 10;
		let maxLeft = containerOffset + containerWidth - dragWidth - 10;
		
		//add event listner on the divider emelent
		dragElement.parents().on("mousemove touchmove", function(e) {
			
			// if the user is not using touch input let do preventDefault to prevent the user from slecting the images as he moves the silder arround.
			if ( touched === false ) {
				e.preventDefault();
			}
			
			let moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
			let leftValue = moveX + posX - dragWidth;

			// stop the divider from going over the limits of the container
			if (leftValue < minLeft) {
				leftValue = minLeft;
			} else if (leftValue > maxLeft) {
				leftValue = maxLeft;
			}

			let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + "%";

			$(".draggable").css("left", widthValue).on("mouseup touchend touchcancel", function() {
				$(this).removeClass("draggable");
				resizeElement.removeClass("resizable");
			});
			
			$(".resizable").css("width", widthValue);
			
		}).on("mouseup touchend touchcancel", function() {
			dragElement.removeClass("draggable");
			resizeElement.removeClass("resizable");
			
		});
	
	}).on("mouseup touchend touchcancel", function(e) {
		// stop clicping the image and move the slider
		dragElement.removeClass("draggable");
		resizeElement.removeClass("resizable");
	
	});
	
}
