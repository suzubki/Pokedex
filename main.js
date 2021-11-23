class Pokedex {
  constructor() {
    this.section = document.getElementById("section-content");
    this.generarMasPokemones = document.getElementById("generarMasPokemones");
    this.generarPokemonAleatorio = document.getElementById(
      "generarPokemonAleatorio"
    );
    this.iconoBuscar = document.getElementById("iconoBuscar");
    this.contenedor_resultados = document.getElementById(
      "contenedor_resultados"
    );
    this.iconoCerrar = document.getElementById("iconoCerrar");
    this.superData = [];
    this.pokemonActual = "";
    this.cociente = 12;
    this.count = 0;
    this.eventHandler();
  }

  // Manejador de eventos
  eventHandler() {
    document.addEventListener("DOMContentLoaded", () => {
      this.fetchData();

      // Habilitando los modales
      M.AutoInit();
    });

    // Evento de loader
    this.generarMasPokemones.addEventListener("click", () => {
      this.cargarPokemones();
    });

    // Evento de modales al hacer click en la imagen del pokemon
    document.addEventListener("click", (ev) => {
      this.aparecerModal(ev);
    });

    this.generarPokemonAleatorio.addEventListener("click", () => {
      this.pokemonAleatorio();
    });

    this.iconoBuscar.addEventListener("click", () => {
      this.busquedaDePokemon();
    });

    this.iconoCerrar.addEventListener("click", () => {
      this.cancelarBusqueda();
    });
  }

  //fetchData
  async fetchData() {
    const response = await fetch("./data.json");
    const data = await response.json();
    this.setSuperData = data;
    this.cargarPokemones();
  }

  //Establecimiento de la variable superData
  set setSuperData(data) {
    this.superData = [...data];
  }

  // Loader
  cargarPokemones() {
    const minidata = this.superData.slice(
      this.cociente * this.count,
      this.cociente * (this.count + 1)
    );
    this.count++;
    this.generarHTML(minidata);
  }

  // Creación de las cards
  generarHTML(data) {
    data.map((pokemon, index) => {
      const id = (this.count - 1) * this.cociente + index;
      const { name, ThumbnailImage: urlImage, type } = pokemon;
      if (this.pokemonActual !== name) {
        const card = document.createElement("div");
        card.classList.add("col");
        card.classList.add("s6");
        card.classList.add("m4");
        card.classList.add("l3");
        card.classList.add("xl2");

        if (type.length === 1) {
          card.innerHTML = `
                <div class="card" style="background-color:#3a3a4e">
                  <div class="card-image">
                    <a class="modal-trigger" href="#modal1">
                      <img src="${urlImage}" data-img=${id} />
                    </a>
                  </div>
                  <div class="card-content">
                    <p class="light-blue-text lighten-5">${name}</p>
                  </div>
                  <div class="card-action">
                    <a href="#">${type[0]}</a>
                  </div>
                </div>
          `;
        } else {
          card.classList.add("col");
          card.innerHTML = `
            <div class="card" style="background-color:#3a3a4e">
              <div class="card-image">
                    <a class="modal-trigger" href="#modal1">
                      <img src="${urlImage}" data-img=${id} />
                    </a>
              </div>
              <div class="card-content">
                <p class="light-blue-text lighten-5">${name}</p>
              </div>
              <div class="card-action type-content">
                <a href="#">${type[0]}</a>
                <a href="#">${type[1]}</a>
              </div>
            </div>
      `;
        }
        this.pokemonActual = name;
        this.section.appendChild(card);
      }
    });
  }

  // Despliegue de informacion de los modales
  aparecerModal(ev) {
    const { target } = ev;
    const posicionData = target.getAttribute("data-img");
    if (ev.target.nodeName === "IMG" && posicionData) {
      this.generarContenidoModal(posicionData);
    }
  }

  generarContenidoModal(posicion) {
    const {
      ThumbnailImage: urlImage,
      name,
      weight,
      height,
      abilities,
      weakness,
      type,
    } = this.superData[posicion];

    // Inserción de elementos al contenido izquierdo del modal
    const modal_leftContent = document.getElementById("modal_leftContent");
    modal_leftContent.innerHTML = `
    <img src=${urlImage} class="img-modal" />
    `;

    // Inserción de elementos al contenido derecho del modal
    // Nombre del pokemon
    const modal_nombrePokemon = document.getElementById("modal_nombrePokemon");
    modal_nombrePokemon.textContent = name;

    // Peso y altura del pokemon
    const modal_pesoPokemon = document.getElementById("modal_pesoPokemon");
    modal_pesoPokemon.textContent = `Peso: ${this.librasAKilogramos(weight)}kg`;

    const modal_alturaPokemon = document.getElementById("modal_alturaPokemon");
    modal_alturaPokemon.textContent = `Altura: ${this.pulgadaAMetro(height)}m`;

    // Habilidades del pokemon
    const habilidadesPokemon = document.getElementById(
      "modal_habilidadesPokemon"
    );
    this.limpiarContenido(habilidadesPokemon, "Habilidades");
    this.caracteristicasAElementosHTML(abilities, habilidadesPokemon);

    // Debilidades del pokemon
    const debilidadesPokemon = document.getElementById(
      "modal_debilidadesPokemon"
    );
    this.limpiarContenido(debilidadesPokemon, "Debilidades");
    this.caracteristicasAElementosHTML(weakness, debilidadesPokemon);

    // Tipo del pokemon
    const tipoDePokemon = document.getElementById("modal_tipoDePokemon");
    this.limpiarContenido(tipoDePokemon, "Tipo");
    this.caracteristicasAElementosHTML(type, tipoDePokemon);
  }

  // Limpieza de elementos
  limpiarContenido(elemento, texto = "") {
    elemento.textContent = "";
    elemento.innerHTML = `<h6 class="left-align">${texto}:</h6>`;
  }

  // Caracteristicas(habilidades, debilidades, tipo, etc)
  caracteristicasAElementosHTML = (caracteristicas, padre) => {
    caracteristicas.forEach((caracteristica) => {
      const h6Content = document.createElement("h6");
      h6Content.classList.add("col");
      h6Content.classList.add("s4");
      h6Content.textContent = caracteristica;
      padre.appendChild(h6Content);
    });
  };

  librasAKilogramos(masa) {
    const kilogramos = Math.round((masa / 2.205) * 100) / 100;
    return kilogramos;
  }

  pulgadaAMetro(tamaño) {
    const metros = Math.round((tamaño / 39.37) * 100) / 100;
    return metros;
  }

  // Obtener un pokemon aleatorio
  pokemonAleatorio() {
    const numeroAleatorio = Math.round(Math.random() * 599);
    this.generarContenidoModal(numeroAleatorio);
  }

  // Barra de búsqueda
  busquedaDePokemon() {
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();

    if (searchInput.length > 2) {
      const resultados = [];
      this.superData.filter((elemento) => {
        const { name, id } = elemento;
        const lowerCaseName = name.toLowerCase();
        if (lowerCaseName.startsWith(searchInput)) {
          resultados.push({ name: name, id: id });
        }
      });
      this.pokemonesEncontrados(resultados);
    }
  }

  pokemonesEncontrados(resultados) {
    if (resultados.length > 0) {
      resultados.forEach((elemento) => {
        const { name, id } = elemento;
        document.getElementById("iconoBuscar").style.display = "none";
        document.getElementById("iconoCerrar").style.display = "block";
        this.contenedor_resultados.style.display = "block";
        const element_a = document.createElement("a");
        element_a.classList.add("pokemonEncontrado");
        element_a.classList.add("modal-trigger");
        element_a.setAttribute("href", "#modal1");
        element_a.addEventListener("click", () => {
          this.generarContenidoModal(id);
        });
        element_a.textContent = name;
        this.contenedor_resultados.appendChild(element_a);
      });
    }
  }

  // Cerrar Barra
  cancelarBusqueda() {
    this.contenedor_resultados.style.display = "none";
    this.contenedor_resultados.innerHTML = ``;
    document.getElementById("iconoCerrar").style.display = "none";
    document.getElementById("iconoBuscar").style.display = "block";
  }
}

const POKEMONES = new Pokedex();
