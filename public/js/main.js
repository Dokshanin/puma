// Slider
$("#slider").tosrus({
   autoplay   : {
      play       : true
   },
   slides     : {
      scale      : "fill"
   },
   buttons    : false,
   pagination : {
      add        : true
   }
});

// Скрываем меню по умолчанию
$("#flow-overlay").hide();
$("#flow-hide").hide();

// Открываем при клике на пункт
var height = jQuery(document).height();
$("#flow-show > a").click(function() {
  $("#flow-hide").show();
  $("#flow-overlay").show().css({
    height: height
  });
});

// Закрыть при клике на окно
$("#flow-overlay").click(function() {
  $("#flow-hide").hide();
  $("#flow-overlay").hide();
});
