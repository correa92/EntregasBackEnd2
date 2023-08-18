const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const pass1 = document.getElementById("pass1").value;
  const pass2 = document.getElementById("pass2").value;
  const urlToken = document.getElementById("urlToken").value;
  const mjs = document.getElementById("mjs");

  if (pass1 === pass2) {
    const data = {
      password: pass1,
    };

    const requestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    fetch(`${urlToken}`, requestInit)
      .then((response) => response.json())
      .then((data) => {
        if(data.error){
          mjs.innerHTML = `Token vencido`;
        }else{
          mjs.innerHTML = `Cambio de contraseña exitoso`;
        }
      })
      .catch((error) => {  
        console.error("Error:", error);
      });
  } else {
    mjs.innerHTML = `Las contraseñas no coinciden`;
  }
});
