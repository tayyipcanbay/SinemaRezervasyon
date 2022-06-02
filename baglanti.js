const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
})
con.query("CREATE DATABASE IF NOT EXISTS sinema", (err, res) => {
    if (err) throw err;
    console.log("Sinema veritabanı oluşturuldu");
});

con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sinema"
})
let salon = "";
function tablolariCek() {
    con.query("SHOW TABLES", (err, res) => {
        if (err) throw err;
        console.log(res);
        return res;
    });
}
function salonOlustur(salonAdi, koltukSayisi = 20) {
    con.query("CREATE TABLE IF NOT EXISTS " + salonAdi + " (id INT AUTO_INCREMENT PRIMARY KEY, satin_alan VARCHAR(50), iletisim_numarasi VARCHAR(50) , rezerve TINYINT(1) NOT NULL)", (err, res) => {
        if (err) throw err;
        console.log("Salon oluşturuldu");
    })
    for (i = 0; i < koltukSayisi; i++) {
        con.query("INSERT INTO `" + salonAdi + "` (`id`, `satin_alan`, `iletisim_numarasi`, `rezerve`) VALUES (NULL, '', '', '0');")
    }
}
function salonlariListele() {
    con.query("SHOW TABLES", (err, res) => {
        if (err) throw err;
        let div = document.getElementById("salonListele");
        div.innerHTML = "";
        console.log(res);
        for (i = 0; i < res.length; i++) {

            let salonKutu = document.createElement("div");
            div.appendChild(salonKutu);
            salonKutu.setAttribute("id", res[i]['Tables_in_sinema']);
            let txt = document.createTextNode(res[i]['Tables_in_sinema'])
            salonKutu.appendChild(txt);
        }
    })
}
function rezervasyonListe() {
    con.query("SHOW TABLES", (err, res) => {
        if (err) throw err;
        let div = document.getElementById("rezervasyon");
        let select = '<select id="salonlarMenu">'
        for (i = 0; i < res.length; i++) {
            select += '<option value=' + res[i]['Tables_in_sinema'] + '>' + res[i]['Tables_in_sinema'] + '</option>'
            console.log(res[i]['Tables_in_sinema'])
        }
        select += "</select>";
        div.innerHTML += select
        let secButon = document.createElement("button");
        // secButon.setAttribute("type", "submit");
        secButon.innerHTML = "Git!"
        secButon.setAttribute("onclick", "rezervasyonYap()")
        div.appendChild(secButon);
    })
}
function rezervasyonYap() {
    let e = document.getElementById("salonlarMenu");
    let salonAdi = e.options[e.selectedIndex].value
    con.query("SELECT * FROM `" + salonAdi + "`", (err, res) => {
        if (err) throw err;
        let div = document.getElementById("rezervasyon");
        div.innerHTML = "";
        for (i = 0; i < res.length; i++) {
            if (i % 5 == 0) {
                div.innerHTML += "<hr>"
            }
            if (res[i]['rezerve'] == 0) {
                div.innerHTML += "<button style='background-color:green' id='" + res[i]['id'] + "' onclick=bilgiGir(" + res[i]['id'] + ")>" + res[i]['id'] + " Numaralı Koltuk</button><br>"
                salon = salonAdi;
            }
            else {
                div.innerHTML += "<button style='background-color:red' id='" + res[i]['id'] + "' >" + res[i]['id'] + " Numaralı Koltuk</button>" + res[i]['satin_alan'] + " için rezerve<br>"
            }
        }
    })
}

function bilgiGir(id) {
    console.log(id);
    let div = document.getElementById("bilgiGir");
    let satin_alan = document.createElement("input");
    satin_alan.setAttribute("id", "satin_alan");
    div.appendChild(satin_alan);
    let iletisim_numarasi = document.createElement("input");
    iletisim_numarasi.setAttribute("id", "iletisim_numarasi");
    div.appendChild(iletisim_numarasi);
    let kaydet = document.createElement("button");
    kaydet.setAttribute("onclick", "gonder(" + id + ")");
    div.appendChild(kaydet);
}
function gonder(id) {
    let satin_alan = document.getElementById("satin_alan").value;
    let iletisim_numarasi = document.getElementById("iletisim_numarasi").value;
    con.query("UPDATE `" + salon + "` SET `satin_alan` = '" + satin_alan + "', `iletisim_numarasi` = '" + iletisim_numarasi + "', `rezerve` = '1' WHERE `" + salon + "`.`id` = " + id + ";")
}
module.exports = {
    con, tablolariCek, salonOlustur
}
