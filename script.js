document.addEventListener("DOMContentLoaded", function () {
  var desaparecerDiv = document.getElementById("desaparecer");
  var aparecer = document.getElementById("aparecer");

  desaparecerDiv.addEventListener("click", function () {
    desaparecerDiv.style.display = "none";
    aparecer.style.display = "block";
  });
});
