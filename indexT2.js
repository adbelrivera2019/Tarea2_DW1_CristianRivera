var mysql = require('mysql');
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/json'
    });
    var q = url.parse(req.url, true);
    var datos = q.query;

    var accion = datos.accion;

    let con = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "biblioteca"
    });

    let sql = "";
    let parametros = [];

    let tabla = datos.tabla;

    if (tabla == "libros") {
        switch (accion) {

            case "insert":
                sql = "insert into libros " +
                    " ( nombre, genero,fecha_lanzamiento,autor) " +
                    " values  " +
                    " (?, ?,?,?) ";
                parametros =    [datos.nombre,
                                datos.genero,
                                datos.fecha_lanzamiento,
                                datos.autor
                                ];
                break;
            case "select":
                sql = "select * from libros ";
                break;
            case "update":

                sql = " update libros " +
                            " set nombre = ? "+
                                " genero = ?  " +
                                " fecha_lanzamiento = ? " +
                                " autor = ?  " +
                                " where id_libros = ? ";
                parametros = [datos.nombre,
                             datos.genero,
                             datos.fecha_lanzamiento,
                             datos.autor,
                             datos.id_libros
                            ];

                break;
            case "delete":
                sql = "delete from libros where id_libros = ?"
                parametros = [datos.id_libros];
                break;
            default:
                sql = 
                "";
                break;

        }
    }
    if (tabla == "alumnos") {

        switch (accion) {
            case "select":
                sql = "select * from alumnos";
                break;
            case "insert":
                sql = "insert into alumnos " +
                    " ( numero_cuenta, nombre,apellido) " +
                    " values " +
                    " ( ?,?, ?) ";
                parametros = [datos.numero_cuenta, datos.nombre, datos.apellido];
                break;

            case "update":
                sql = " update  alumnos " +
                    " nombre = ?, apellido = ? " +
                    " where numero_cuenta = ? ";
                parametros = [
                    datos.nombre,
                    datos.apellido,
                    datos.numero_cuenta
                ];
            case "delete":
                sql = "delete from alumnos where numero_cuenta = ?";
                parametros = [datos.numero_cuenta];
                break;
            default:
                break;

        }

    }
    
    if (tabla == "prestamos") {

        switch (accion) {
            case "select":
                sql = "select * from prestamos";
                break;
            case "insert":
                sql = "insert into prestamos " +
                    " ( id_prestamo, id_libros,numero_cuenta,fecha_prestamo) " +
                    " values " +
                    " ( ?,?, ?,?) ";
                parametros = [datos.id_prestamo, 
                    datos.id_libros, 
                    datos.numero_cuenta,
                    datos.fecha_prestamo];
                break;

            case "update":
                sql = " update  prestamos " +
                    " set id_libros = ?, numero_cuenta = ?, fecha_prestamo = ? " +
                    " where id_prestamo = ? ";
                parametros = [datos.id_libros, 
                    datos.numero_cuenta,
                    datos.fecha_prestamo];
            case "delete":
                sql = "delete from prestamos where id_prestamo = ?";
                parametros = [datos.id_prestamo];
                break;
            default:
                break;

        }

    }

    if (sql != "") {

        con.connect(function (err) {

            if (err) {
                console.log(err);
            } else {

                con.query(sql, parametros, function (err, result) {

                    if (err) {
                        console.log(err);

                    } else {
                        res.write(JSON.stringify(result));
                        res.end();
                    }

                });

            }

        });

    } else {

        let retorno = {
            mensaje: "Metodo no encontrado"
        };

        res.write(JSON.stringify(retorno));
        res.end();

    }



}).listen(3000);