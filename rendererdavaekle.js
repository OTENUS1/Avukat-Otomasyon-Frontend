const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('davaFormu');
    form.addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(event) {
    event.preventDefault();

    const davaDosya = {
        baslik: document.getElementById('baslik').value,
        tur: document.getElementById('tur').value,
        durum: document.getElementById('durum').value,
        dosyaTarihi: document.getElementById('dosyaTarihi').value,
        davaci: document.getElementById('davaci').value,
        davali: document.getElementById('davali').value,
        detaylar: document.getElementById('detaylar').value,
        statu: document.getElementById("statu").value
    };

    ipcRenderer.send('dava-form-submit', davaDosya);
}

ipcRenderer.on('dava-form-response', (event, response) => {
    if (response.error) {
        alert('Bir hata oluştu: ' + response.error);
    } else {
        alert('Dava başarıyla eklendi');
        ipcRenderer.send('close-current-window');
        // Burada formu temizleyebilir veya başka bir işlem yapabilirsiniz
    }
});
