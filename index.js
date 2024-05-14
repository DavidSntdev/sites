document.addEventListener("DOMContentLoaded", function () {
  var portifolioDiv = document.getElementById("portifolio");
  var desaparecerDiv = document.getElementById("desaparecer");
  var aparecer = document.getElementById("aparecer");
  var voltarDiv = document.getElementById("voltar");

  portifolioDiv.addEventListener("click", function () {
    desaparecerDiv.style.display = "none";
    aparecer.style.display = "block";
  });
  voltarDiv.addEventListener("click", function () {
    desaparecerDiv.style.display = "block";
    aparecer.style.display = "none";
  });
});
