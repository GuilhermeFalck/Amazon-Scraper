const input = document.getElementById("keyword");
const button = document.getElementById("searchBtn");
const results = document.getElementById("results");

button.addEventListener("click", async () => {
  const keyword = input.value.trim();
  if (!keyword) {
    alert("Digite uma palavra-chave.");
    return;
  }

  results.innerHTML = "Carregando...";

  try {
    const response = await fetch(
      `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`
    );
    const data = await response.json();

    if (data.error) {
      results.innerHTML = `<p>Erro: ${data.error}</p>`;
      return;
    }

    results.innerHTML = "";
    data.results.forEach((item) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h2>${item.title}</h2>
        <p>⭐ ${item.rating || "Sem avaliação"} - ${
        item.reviews || "0"
      } reviews</p>
        <img src="${item.image}" alt="Imagem do produto" />
      `;
      results.appendChild(div);
    });
  } catch (error) {
    results.innerHTML = `<p>Erro ao buscar os dados.</p>`;
    console.error(error);
  }
});
