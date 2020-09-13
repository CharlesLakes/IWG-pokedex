/* Carga los datos del pokemon y 
  hay un callback optativo para mejor manupulacion
  de los datos
*/
function loadData(idOrName,selector,callback = null){
  $(".loader").addClass("active");
  $.getJSON("https://pokeapi.co/api/v2/pokemon/"+idOrName,(data)=>{
    var img = data.sprites.other["official-artwork"].front_default;
    if(img == null){
      img = data.sprites.front_default
    }
    if(img == null){
      img = "https://cdn.browshot.com/static/images/not-found.png";
    }
    console.log(img);
    $(selector).attr("src",img);
    if(callback != null){
      callback(data);
    }
    $("#pokemon-input").val('');
    
  }).fail(function(data){
    toggleWarn(data.responseText == 'Not Found'?'Pokémon no encontrado.':'Hubo un de servidor.');
    $("#pokemon-input").val('');
    setTimeout(toggleWarn,2000);
    $(".loader").removeClass("active");
    });
    

}
/* Prcoesa la id , para poner todas las fotos 
  correctas
*/
function idProcess(id,def = true){
  if(id > 1){
    loadData(id - 1,"#pokemon-image-left")
  }else{
    $("#pokemon-image-left").attr("src","")
  }
  if(def){
    loadData(id,"#pokemon-image",function(data){
      $("#name-pokemon").text(data.id+" - "+data.name);
    });
  }
  
  loadData(id + 1,"#pokemon-image-right")
}
/* Busca el pokemon y ejecuta los cambios */ 
function searchPokemon(callback){
  
  var pokemonName = $("#pokemon-input").val().toLowerCase();
    loadData(pokemonName,"#pokemon-image",function(data){
      callback(data.id);
      idProcess(data.id,false);
      $("#name-pokemon").text(data.id+" - "+data.name);
    })
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
    if(currentPokemonId == 1){
      topLoad = 2;
    }else{
      topLoad = 3;
    }
    contLoad++;
    if(contLoad == topLoad){
      $(".loader").removeClass("active");
      contLoad = 0;
    }
  }
}

$(function() {
  var currentPokemonId = 1;
  
  /* Escribe tu código aquí */
  idProcess(currentPokemonId);

  /* Eventos de buscade */
  $("#btn-search").click(function(){
    if($("#pokemon-input").val() == ''){
      toggleWarn("El campo esta vacio.");
      setTimeout(toggleWarn,1000);
      return;
    }
    
      searchPokemon(function(id){
        currentPokemonId = id;
      });

    
  });
  $("#pokemon-input").keydown(function(e){
    if(e.keyCode == 13){
      if($("#pokemon-input").val() == ''){
        toggleWarn("El campo esta vacio.");
        setTimeout(toggleWarn,1000);
        return;
      }
      searchPokemon(function(id){
        currentPokemonId = id;
      });
    }
  });

  /* Eventos para cambiar entre siguiente y anterior */
  $(".pokemon-right").click(function(){
    currentPokemonId += 1;
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
  
  $("#pokemon-image").on("load",function(e){
    sPhotos.run(currentPokemonId)
  });
  $("#pokemon-image-left").on("load",function(){
    sPhotos.run(currentPokemonId)
  });
  $("#pokemon-image-right").on("load",function(){
    sPhotos.run(currentPokemonId)
  });
  /* Hasta aquí :) */
  
});





