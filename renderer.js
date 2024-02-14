const electron = require("electron");
const {ipcRenderer} = electron;
const lengthtrue = null;
const lengthfalse = null;

ipcRenderer.send("get-data");


let davaOlustur = document.querySelector("#HDavaOlustur");
let davabaşarili = document.querySelector("#başarilidava");
let davabaşarisiz = document.querySelector("#başarisizdava");
let tumdavalar = document.querySelector("#tumdava");

tumdavalar.addEventListener("click", ()=>{
  ipcRenderer.send("get-data");
})
davabaşarili.addEventListener("click", ()=>{
  ipcRenderer.send("get-data",true);
})
davabaşarisiz.addEventListener("click", ()=>{
  ipcRenderer.send("get-data",false);
})

tumdavalar.addEventListener("click", ()=>{
  ipcRenderer.send("get-data");
})

davaOlustur.addEventListener("click", ()=>{
  ipcRenderer.send("key:newData");
})

ipcRenderer.on('data-response', (event, data, arg) => {
    let parsedData;
    let arguman=arg;
    let fdata=null;
    let tdata=null;
    let Adata = null;
    let datalenght=null;
    try {
        parsedData = JSON.parse(data);
    } catch (error) {
        alert('Veri ayrıştırma hatası:', error);
        return;
    }
    
    if (parsedData.error) {
        alert('An error occurred: ' + parsedData.error);
    } 
    else {
     
     if(arguman === undefined){
        updateTable(parsedData.data);
       
      }
      else{
       
        const filteredData = parsedData.data.filter(dava => dava.statu === arguman);
       
        updateTable(filteredData);
      }
      const filteredDatat = parsedData.data.filter(dava => dava.statu === true);
      tdata= filteredDatat.length;
      const filteredDataf = parsedData.data.filter(dava => dava.statu === false);
      fdata= filteredDataf.length;
      const filteredDataA = parsedData.data.filter(dava => dava.sonucTipi === true);
      Adata= filteredDataA.length;
      datalenght = (parsedData.data).length;
      guncelleBasariliDavaSayisi(fdata,tdata,datalenght,Adata);
      }
    
});

      function guncelleBasariliDavaSayisi(fsayi,tsayi,datalenght,Asayi) {
        const basariliDavaSayisiElementi = document.getElementById('basariliDavaSayisi');
        const basarisizDavaSayisiElementi = document.getElementById('basarisizDavaSayisi');
        const DavaSayisiElementi = document.getElementById('DavaSayisi');
        const AktifDavaSayisiElementi = document.getElementById('AktifDavaSayisi');
        basariliDavaSayisiElementi.textContent = tsayi;
        basarisizDavaSayisiElementi.textContent=fsayi;
        DavaSayisiElementi.textContent=datalenght;
        AktifDavaSayisiElementi.textContent=Asayi;
      }

function updateTable(davalar) {
    
    const tableBody = document.getElementById('davaDosyalariTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 

    davalar.forEach(dava => {
        let row = tableBody.insertRow();
        row.insertCell(0).textContent = dava.davaId;
        row.insertCell(1).textContent = dava.baslik;
        row.insertCell(2).textContent = dava.tur;
        row.insertCell(3).textContent = dava.durum;
        row.insertCell(4).textContent = dava.dosyaTarihi;
        row.insertCell(5).textContent = dava.davaci;
        row.insertCell(6).textContent = dava.davali;
        row.insertCell(7).textContent = dava.detaylar;
        row.insertCell(8).textContent = dava.statu;
        row.insertCell(9).textContent = dava.sonucTipi;
        let silButonuHucresi = row.insertCell(10);
        let silButonu = document.createElement("button");
        silButonu.textContent = "Sil";
        silButonu.dataset.id = dava.davaId; // Butona data-id özelliği olarak davaId'yi ekle
    
        silButonu.addEventListener("click", function() {
            silDavayi(this.dataset.id); // Bu fonksiyona butonun data-id'sini ilet
        });
    
        silButonuHucresi.appendChild(silButonu);
    });
   
} 
function silDavayi(davaId) {
  alert("Silme işlemi: " + davaId);
  // Burada silme işlemi için gerekli kodlar yer alabilir
}