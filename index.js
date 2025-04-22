const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// Função para extrair dados da Amazon
async function scrapeAmazon(keyword) {
  const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

  const response = await axios.get(url, {
    headers: {
      // Simula navegador real pra evitar bloqueio
      "User-Agent": "Mozilla/5.0",
    },
  });

  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  const items = [...document.querySelectorAll(".s-result-item")].map((item) => {
    const title = item.querySelector("h2 span")?.textContent || null;
    const rating = item.querySelector(".a-icon-alt")?.textContent || null;
    const reviews = item.querySelector(".a-size-base")?.textContent || null;
    const image = item.querySelector("img")?.src || null;

    return { title, rating, reviews, image };
  });

  // Retorna apenas itens com título válido
  return items.filter((i) => i.title);
}

// Rota GET /api/scrape?keyword=xxxxx
app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res
      .status(400)
      .json({ error: 'Parâmetro "keyword" é obrigatório.' });
  }

  try {
    const result = await scrapeAmazon(keyword);
    res.json({ results: result });
  } catch (err) {
    console.error("Erro ao buscar:", err.message);
    res.status(500).json({ error: "Erro ao buscar dados da Amazon." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
