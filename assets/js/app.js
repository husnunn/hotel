var halamanAwal='home.html';
var dirPage='pages'


$(document).ready(function () {
    if(localStorage.getItem('pages')){
        halamanAwal=localStorage.getItem('pages')
    }else{
        localStorage.setItem('pages',halamanAwal)
        
    }
    load_halaman(halamanAwal)
});


$(".nav_link").on("click", function () {
  if (!$(this).attr("target-drop")) {
    var currentPageLink = $(this).attr("data-halaman");
    localStorage.setItem("pages", currentPageLink);
    load_halaman(currentPageLink);
    $(".dropdown-menus").removeClass("open");

  } else {
    console.log();
    $(".dropdown-menus").removeClass("open");

    $("#" + $(this).attr("target-drop")).toggleClass("open");
  }
});

$(".dropdown-menus a").on("click", function () {
  var currentPageLink = $(this).attr("data-halaman");
  localStorage.setItem("pages", currentPageLink);
  load_halaman(currentPageLink);
});

function load_halaman(halamanApa) { 
    $('#mainkonten').hide()
    $('#mainkonten').load(dirPage+'/'+halamanApa)
    $('#mainkonten').fadeIn(500)


    
 }