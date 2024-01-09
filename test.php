<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json;');
require_once "model.php";

// penggunaan
$request = $_SERVER['REQUEST_METHOD'];
$test = new Model(
    "localhost",
    "inft8894_mahasiswa",
    "inft8894_root",
    "inft8894_db_hotel",
    "tb_booking"
);

switch ($request) {
    case 'GET':
        $ambilParam = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
        switch ($ambilParam[0]) {
            case 'all':
                $test->findAll();
                break;
            case 'cari':
                if (isset($ambilParam[1],$ambilParam[2],$ambilParam[3])) {
                    $test->find($ambilParam[1], $ambilParam[2], $ambilParam[3]);
                }
                break;
        }
        break;
    case 'POST':
        $ambilParam = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
        $perintah = $ambilParam[0];
        if ($perintah == 'input') {
            $test->input($_POST);
        }
        break;
    case 'PUT':
        parse_str(file_get_contents("php://input"), $PUT);
        
        $test->edit($PUT['id_booking'], $PUT, "id_booking");
        $ambilParam = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
        switch ($ambilParam[0]) {
            case 'ketersediaan':
                $test = new Model(
                    "localhost",
                    "inft8894_mahasiswa",
                    "inft8894_root",
                    "inft8894_db_hotel",
                    "tb_kamar"
                );
                $test->edit($PUT['nomor_kamar'], $PUT, "nomor_kamar");
                break;
        }
        break;
       
        

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $DELETE);
        $test->hapus($DELETE['id'], $DELETE['kolom']);
        break;
}
