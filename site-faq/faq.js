document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos h2
  const headers = document.querySelectorAll("h2");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      // Obtém o elemento <p> associado ao <h2> clicado
      const p = header.nextElementSibling;

      // Verifica se o <p> está visível
      const isVisible = p.style.display === "block";

      // Oculta todos os <p>
      document.querySelectorAll(".text p").forEach((paragraph) => {
        paragraph.style.display = "none";
        paragraph.previousElementSibling.querySelector("img").src =
          "assets/images/icon-plus.svg"; // Muda o ícone para plus
      });

      // Se o <p> clicado não estava visível, mostre-o
      if (!isVisible) {
        p.style.display = "block";
        header.querySelector("img").src = "assets/images/icon-minus.svg"; // Muda o ícone para minus
      }
    });
  });
});
