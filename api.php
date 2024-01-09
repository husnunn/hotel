<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

// Function to connect to the database
function connectDB() {
    $db_host = "localhost";
    $db_user = "inft8894_admin";
    $db_password = "inft8894_root";
    $db_name = "inft8894_db_hotel";

    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);

    if ($conn->connect_error) {
        die("Connection to the database failed: " . $conn->connect_error);
    }

    return $conn;
}

// Function to add a hotel booking to the database
function addBooking($data) {
    $conn = connectDB();

    $name = $data['name'];
    $email = $data['email'];
    $checkin = $data['checkin'];
    $checkout = $data['checkout'];
    $room = $data['room'];

    $sql = "INSERT INTO tb_booking VALUES (NULL,'$name', '$email', '$checkin', '$checkout', '$room')";

    if ($conn->query($sql) === TRUE) {
        $response = array('status' => 'success', 'message' => 'Data successfully saved.');
    } else {
        $response = array('status' => 'error', 'message' => 'Error: ' . $conn->error);
    }

    $conn->close();
    return $response;
}

// Function to retrieve hotel bookings from the database
function getBookings() {
    $conn = connectDB();

    $sql = "SELECT * FROM tb_booking";
    $result = $conn->query($sql);

    $data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    $conn->close();
    echo json_encode($data);
}

// Function to delete a hotel booking from the database
function deleteBooking($id) {
    $conn = connectDB();

    $sql = "DELETE FROM hotel_bookings WHERE id = '$id'";

    $conn->query($sql);

    $conn->close();
}
// Fungsi untuk memperbarui data tamu di database


    function edit($id, $post, $kolom)
    {
        try {
            // if (!empty($post[$kolom])) {
            //     unset($post[$kolom]);
            // }
            $data = "";
            foreach ($post as $key => $value) {
                $data .= "," .$key . "=" . "'".$value."'";
                $data = ltrim($data, ',');
    
            } $koneksi = connectDB();
            $tabel = 'tb_booking';
            $sql = "update $tabel set $data where $kolom = '$id'";
            mysqli_query($koneksi, $sql);
            if (mysqli_affected_rows($koneksi) > 0) {
                $respon= ['status'=>'ok','messege'=>'berhasil'];
            }
            echo json_encode($respon);
        } catch (Exception $e) {
            $error = ['status' => 'gagal', 'message' =>
            $e->getMessage(),"trace"=>$e->getTrace()];
            echo json_encode($error);
        }
    }

   


// Main program to handle requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = array(
        'name' => $_POST['name'],
        'email' => $_POST['email'],
        'checkin' => $_POST['checkin'],
        'checkout' => $_POST['checkout'],
        'room' => $_POST['room'],
       
    );

    $result = addBooking($data);

    header('Content-Type: application/json');
    echo json_encode($result);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = getBookings();

    header('Content-Type: application/json');
    echo json_encode($data);
}
else if ($_REQUEST['fungsi'] == "editget"){
    $conn = connectDB();
$id = $_GET['id'];
    $sql = "SELECT * FROM tb_booking where id_booking = '$id'";
    $result = $conn->query($sql);

    $data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    $conn->close();
    echo json_encode($data);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $delete_vars);
    deleteBooking($delete_vars['id']);

    header('Content-Type: application/json');
    echo json_encode(array('status' => 'success', 'message' => 'Data successfully deleted.'));
}elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Mendapatkan data dari request PUT
    parse_str(file_get_contents("php://input"), $put_vars);

    // Implementasikan logika perbarui data sesuai kebutuhan
    // Misalnya, Anda dapat menggunakan $put_vars untuk mendapatkan data yang diperbarui
    edit($put_vars['id'], $put_vars,'id_booking');
    
    

    // Mengembalikan respons dalam format JSON
    }
?>



