/* Carga los datos del pokemon y 
  hay un callback optativo para mejor manupulacion
  de los datos
*/
function loadData(idOrName,selector,callback = null){
  $(".loader").addClass("active");
  $.getJSON(`https://pokeapi.co/api/v2/pokemon/${idOrName}`,(data)=>{
    var img = data.sprites.other["official-artwork"].front_default;
    if(img == null){
      img = data.sprites.front_default;
      if(img == null){img = "https://cdn.browshot.com/static/images/not-found.png";}
    }
    $(selector).attr("src",img);
    $("#pokemon-input").val('');
    if(callback != null){callback(data);}
  }).fail(function(data){
    toggleWarn(data.responseText == 'Not Found'?'Pokémon no encontrado.':'Hubo un de servidor.');
    $("#pokemon-input").val('');
    setTimeout(toggleWarn,2000);
    $(".loader").removeClass("active");
  });
    

}
/* Prcoesa la id , para poner todas las fotos 
  correctas
  def si es true , carga la imagen principal
  y es se carga por defecto
  pero si se cargo antes, para no repetir el proceso , se puede pasar false
*/
function idProcess(id,def = true){
  if(id > 1){loadData(id - 1,"#pokemon-image-left")}
  else{$("#pokemon-image-left").attr("src","")}
  if(def){
    loadData(id,"#pokemon-image",function(data){
      $("#name-pokemon").text(data.id+" - "+data.name);
      $("#more-info-iframe").attr("src",`https://pokemon.fandom.com/es/wiki/${data.name}`);
    });
  }
  
  loadData(id + 1,"#pokemon-image-right")
}
/* Muestra o elimina la notificación */
function toggleWarn(msg = undefined){
  if(msg != undefined){
    $("#aviso").text(msg);
  }
  $('.cont-aviso').toggleClass("active")

}
/* Procesa la cantidad de fotos y cuando se cargan */
function syncPhotos(){
  var contLoad = 0;
  var topLoad;
  this.run = function(currentPokemonId){
    topLoad = (currentPokemonId == 1?2:3);
    contLoad++;
    if(contLoad == topLoad){
      $(".loader").removeClass("active");
      /* Para evitar bugs , cuando el usuario pasa muy rapido entre 
      Es opcional */
      var listImg = [
        $("#pokemon-image").attr("src"),
        $("#pokemon-image-left").attr("src"),
        $("#pokemon-image-right").attr("src")
      ]
      var urlNotFound = "https://cdn.browshot.com/static/images/not-found.png";
      if(listImg[0] != urlNotFound && listImg[1] != urlNotFound && listImg[2] != urlNotFound){
        if(listImg[0] == listImg[1] || listImg[0] == listImg[2] || listImg[1] == listImg[2]){
          idProcess(currentPokemonId);
        }
      }
      /* Hasta aca */
      
      contLoad = 0;
    }

  }
}

/* Añade texto para que se vea de forma vertical */
function addVerticalText(selector,text){
  $(selector).html("");
  if(window.innerWidth <= 600 ){
    $(selector).html("<span>"+text+"</span>");
    return;
  }
  for(const letra of text){
    var temp_cont = $(selector).html();
    $(selector).html(temp_cont+"<span>"+(letra == " "?"<br>":letra)+"</span>");
  }
}


$(function() {
  var currentPokemonId = 1;
  
  /* Escribe tu código aquí */
  idProcess(currentPokemonId);


  /* Busca el pokemon y ejecuta los cambios */ 
  function searchPokemon(){
    var pokemonName = $("#pokemon-input").val().toLowerCase();
    loadData(pokemonName,"#pokemon-image",function(data){
      currentPokemonId = data.id;
      idProcess(data.id,false);
      $("#name-pokemon").text(data.id+" - "+data.name);
      $("#more-info-iframe").attr("src",`https://pokemon.fandom.com/es/wiki/${data.name}`);
    });
}

  /* Eventos de buscade */
  $("#btn-search").click(function(){
    if($("#pokemon-input").val() == ''){
      toggleWarn("El campo esta vacio.");
      setTimeout(toggleWarn,1000);
      return;
    }
    searchPokemon();
  });
  $("#pokemon-input").keydown(function(e){
    if(e.keyCode == 13){
      if($("#pokemon-input").val() == ''){
        toggleWarn("El campo esta vacio.");
        setTimeout(toggleWarn,1000);
        return;
      }
      searchPokemon();
    }
  });

  /* Eventos para cambiar entre siguiente y anterior */
  $(".pokemon-right").click(function(){
    currentPokemonId = currentPokemonId == 893?893:currentPokemonId + 1;
    idProcess(currentPokemonId);
  })
  $(".pokemon-left").click(function(){
    currentPokemonId = currentPokemonId == 1?1:currentPokemonId - 1;
    idProcess(currentPokemonId);
  })


  /* Efecos input */
  
  $("#pokemon-input").focus(function(){
    $(".cont-input").addClass("active");
  });
  $("#pokemon-input").blur(function(){
    $(".cont-input").removeClass("active");
  });

  /* Enevtos de carga de imagenes */
  var sPhotos = new syncPhotos();
  
  $("#pokemon-image,#pokemon-image-left,#pokemon-image-right").on("load",function(e){
    sPhotos.run(currentPokemonId)
  });


  addVerticalText("#more-info-btn","Mostrar Información");

  $("#more-info-btn").click(function(){
    
    if($(".more-info").hasClass('active')){
      addVerticalText("#more-info-btn","Mostrar Información");
      $(".more-info").removeClass('active');
      return;
    }
    addVerticalText("#more-info-btn","Ocultar Información");
      $(".more-info").addClass('active');
  });
  /* Hasta aquí :) */
  
});





