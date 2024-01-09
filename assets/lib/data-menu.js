var dataMenu;
function load_data() {
  $.ajax({
    type: "GET",
    url: "https://tugasapi.informatikaunwaha.com/tajul/apimenu/api_get.php",
    data: {
      ambil: "menu",
    },
    dataType: "json",
    success: function (response) {
      dataMenu = response;

      $.each(dataMenu, function (indexmenu, menu) {
        $("#menu-makanan").append(`
          <div class="col-sm-3 gx-1 mb-1" data-namamenu='${menu.namamenu}'>
             <div class="card border-0">
             <div class="card-body p-1">
             <div  id='card-produk'class="card-image sc-add-to-cart" data-name="${menu.namamenu}" data-price="${menu.harga}" style="background-image: url(upload_imgmenu/${menu.gambar})"></div>
               <h5 class="fw-bold namamenu-list">${menu.namamenu}</h5>
               <h6 class="mb-3">${konfersiRupiah(menu.harga)}</h6>
             </div>

         </div>
          `);
      });
    },
  });
}
function konfersiRupiah(jumlah) {
  var rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(jumlah);
  rupiah = rupiah.replace(/,.*$/, "");
  if (jumlah == 0) {
    $("#proses").attr("disabled", true);
  } else {
    $("#proses").attr("disabled", false);
  }
  return rupiah;
}
load_data();

function loadDataAfterDelay() {
  $("#cart").simpleCart();
  $(".loading").fadeOut();
}

var countdown = 2;

function startCountdown() {
  console.log(countdown);
  countdown--;
  if (countdown >= 0) {
    setTimeout(startCountdown, 1000);
  } else {
    loadDataAfterDelay();
  }
}
$(document).ready(function () {
  startCountdown();
});
