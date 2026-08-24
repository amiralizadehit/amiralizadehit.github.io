$(document).ready(function() {
  $.ajaxSetup({ cache: false });

  $("html").addClass("js-enabled");

  setup_nivo_lightbox();
  setup_dense();

  $(window).load(function() {
    $(".js-preloader").fadeOut(800, function() {
      $(".js-main-container").fadeIn(800);

      setup_scrollreveal();
    });
  });

  let state = 1;

  function init_ajax_videos() {
    document.querySelectorAll("#ajax-content video").forEach(function(video) {
      video.load();
      video.play().catch(function() {});
    });
  }

  // Swap a click-to-play poster for the real YouTube iframe. Delegated from
  // document so it survives #ajax-content being reloaded by the nav links.
  $(document).on("click", ".video-facade", function() {
    var facade = this;
    var iframe = document.createElement("iframe");
    iframe.className = "game-video game-video--16x9";
    iframe.src = facade.dataset.videoSrc;
    iframe.title = facade.dataset.videoTitle || "";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  });

  $("#ajax-content").load("./project.html", init_ajax_videos);

  function load_ajax_content(url) {
    $("#ajax-content")
      .html(
        '<div class="c-preloader  js-preloader" style="padding: 0.5rem 0 4rem;"><div class="c-preloader__spinner  t-preloader__spinner"></div></div>'
      )
      .fadeIn(150, function() {
        $("#ajax-content").load(url, function() {
          init_ajax_videos();
          $("#ajax-content").fadeIn(150);
        });
      });
  }

  function scroll_to_ajax_content_on_mobile() {
    if (window.innerWidth < 1024) {
      var target = document.getElementById("ajax-content");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  $("#cvlink").click(function(e) {
    e.preventDefault();
    if (state === 1) {
      $(this).css({
        "border-bottom": "3px solid #e0a80d",
        color: "whitesmoke"
      });
      $("#projectlink").css({ color: "#999", border: "none" });
      scroll_to_ajax_content_on_mobile();
      $("#ajax-content").fadeOut(150, function() {
        load_ajax_content("./cv.html");
      });
      state = 2;
    }
  });

  $("#projectlink").click(function(e) {
    e.preventDefault();
    if (state === 2) {
      state = 1;

      $(this).css({
        "border-bottom": "3px solid #e0a80d",
        color: "whitesmoke"
      });
      $("#cvlink").css({ color: "#999", border: "none" });
      scroll_to_ajax_content_on_mobile();
      $("#ajax-content").fadeOut(150, function() {
        load_ajax_content("./project.html");
      });
    }
  });
});

function setup_dense() {
  if ($.isFunction($.fn.dense)) {
    $("img").dense({
      glue: "@"
    });
  }
}

function setup_scrollreveal() {
  if (typeof ScrollReveal !== "undefined" && $.isFunction(ScrollReveal)) {
    window.sr = ScrollReveal();

    var default_config = {
      duration: 500,
      delay: 0,
      easing: "ease",
      scale: 1,
      mobile: false
    };
    var header_config = $.extend(false, default_config, {
      duration: 1200,
      delay: 700
    });
    var footer_config = $.extend(false, default_config, {
      duration: 1500,
      distance: 0,
      viewOffset: { top: 0, right: 0, bottom: 100, left: 0 }
    });

    var default_delay = 175;

    sr.reveal(".a-header", header_config, default_delay);
    sr.reveal(".a-footer", footer_config, default_delay);
  }
}

function setup_nivo_lightbox() {
  if ($.isFunction($.fn.nivoLightbox)) {
    var $selector = $(".js-lightbox");

    // Hide all titles to prevent tooltip from showing
    $selector.each(function() {
      var title = $(this).attr("title");
      $(this).attr("data-title", title);
      $(this).attr("title", "");
    });

    // On click, add titles back, so lightbox can display them
    $selector.click(function() {
      $selector.each(function() {
        var title = $(this).attr("data-title");
        $(this).attr("title", title);
      });
    });

    $selector.nivoLightbox({
      effect: "fade", // The effect to use when showing the lightbox
      theme: "default", // The lightbox theme to use
      keyboardNav: true, // Enable/Disable keyboard navigation (left/right/escape)
      clickOverlayToClose: true, // If false clicking the "close" button will be the only way to close the lightbox
      onInit: function() {}, // Callback when lightbox has loaded
      beforeShowLightbox: function() {}, // Callback before the lightbox is shown
      afterShowLightbox: function(lightbox) {}, // Callback after the lightbox is shown
      beforeHideLightbox: function() {}, // Callback before the lightbox is hidden
      //afterHideLightbox: function(){},              // Callback after the lightbox is hidden
      onPrev: function(element) {}, // Callback when the lightbox gallery goes to previous item
      onNext: function(element) {}, // Callback when the lightbox gallery goes to next item
      afterHideLightbox: function() {
        // Remove title to prevent tooltip from showing
        $selector.attr("title", "");
      },
      errorMessage:
        "The requested content cannot be loaded. Please try again later." // Error message when content can't be loaded
    });
  }
}
