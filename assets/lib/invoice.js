function load_invoice() {
  $.ajax({
    type: "GET",
    url: "https://tugasapi.informatikaunwaha.com/tajul/apimenu/api_get.php",
    data: {
      ambil: "invoice",
      orderkode: localStorage.getItem(""),
    },
    dataType: "json",
    success: function (response) {
      console.log(response);
      dataInvoice = response;

      $.each(dataInvoice, function (indexmenu, menu) {});
    },
  });
}
load_invoice();
