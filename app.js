require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.static("public"));

app.get("/api/lokasi", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Parameter q wajib diisi" });
  try {
    const r = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json`,
      { params: { key: process.env.MAPTILER_KEY, language: "id", limit: 1 } }
    );
    const f = r.data.features[0];
    if (!f) return res.status(404).json({ error: "Lokasi tidak ditemukan" });

    const wilayah = [{ id: f.id, text: f.text }, ...(f.context || [])];
    const cari = (tipe) => {
      for (const t of tipe) {
        const item = wilayah.find((x) => x.id.startsWith(t + "."));
        if (item) return item.text;
      }
      return "-";
    };

    res.json({
      lokasi: f.place_name,
      negara: cari(["country"]),
      provinsi: cari(["region"]),
      kecamatan: cari(["municipal_district", "joint_submunicipality", "municipality", "county", "locality"]),
      longitude: f.center[0],
      latitude: f.center[1],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server jalan di http://localhost:3000"));