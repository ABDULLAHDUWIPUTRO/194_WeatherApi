const inputEl = document.getElementById("lokasi");
const statusEl = document.getElementById("status");
const hasilEl = document.getElementById("hasil");

async function cariLokasi() {
  const q = inputEl.value.trim();
  if (!q) { statusEl.textContent = "Isi lokasi dulu."; return; }

  statusEl.textContent = "Mencari...";
  hasilEl.hidden = true;

  try {
    const res = await fetch(`/api/lokasi?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    document.getElementById("outLokasi").textContent = data.lokasi;
    document.getElementById("outNegara").textContent = data.negara;
    document.getElementById("outProvinsi").textContent = data.provinsi;
    document.getElementById("outKecamatan").textContent = data.kecamatan;
    document.getElementById("outLng").textContent = data.longitude;
    document.getElementById("outLat").textContent = data.latitude;

    hasilEl.hidden = false;
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  }
}

document.getElementById("btnCari").addEventListener("click", cariLokasi);
inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") cariLokasi(); });