

var ingredientSearchItem = 'onion';
var recipeSearchItem = 'onion rings';

function displayIngredients(){

  console.log('reeeeeeeeeeeeeeeeeeeeeeeeee')
}

//grabs recepies based on single item input
function getRecipesByIngredient(){

    var requestUrl = 'https://russelldev-cors-anywhere.herokuapp.com/https://api.edamam.com/search?q='+ingredientSearchItem+'&app_id=b958af72&app_key=46b1301f63cc0535dde1e7187e2ff26b';

fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //targeting the list by id. in this case the placeholder is, recepieList1
        let list = document.getElementById("recipeList1");
        var recipeLog = document.getElementById('recipeInformation');       
        console.log(data.q);

      //makes list of recipes that use the item in the search function and console logs for good measure
      for(i=0; i < data.hits.length; i++) {
      console.log(data.hits[i].recipe.label);
      currentLabel = data.hits[i].recipe.label;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = "#"+currentLabel;
      a.textContent = currentLabel;
      recipeName = document.createElement('h2');
      recipeName.textContent = currentLabel;
      li.appendChild(a);
      list.appendChild(li);

      var recipeIngredientList = document.createElement('ul');
      // adding ingredients to the second list
          for(y=0; y <data.hits[i].recipe.ingredients.length; y++){
            var li2 = document.createElement('li');
            console.log(data.hits[i].recipe.ingredients[y].text)
            li2.textContent = data.hits[i].recipe.ingredients[y].text;
            recipeIngredientList.appendChild(li2)
      } 
      recipeName.appendChild(recipeIngredientList)
      recipeLog.appendChild(recipeName)
      
      list.querySelectorAll('li').forEach(item =>{
      item.addEventListener('click', displayIngredients);
    });
      }
    });
}


function getRecipesByName(){

    var requestUrl = 'https://russelldev-cors-anywhere.herokuapp.com/https://api.edamam.com/search?q='+recipeSearchItem+'&app_id=b958af72&app_key=46b1301f63cc0535dde1e7187e2ff26b';

fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //targeting the list by id. in this case the placeholder is, recepieList2     
        let list = document.getElementById("recipeList2");
        var recipeLog = document.getElementById('recipeInformation');       
        console.log(data);
        
        //makes list of recipes that use the item in the search function then use that to make another list to add ingredients to
        for(i=0; i < data.hits.length; i++) {
          currentLabel = data.hits[i].recipe.label;
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = "#"+currentLabel;
          a.textContent = currentLabel;
          recipeName = document.createElement('h2');
          recipeName.id.add('#'+currentLabel)
          recipeName.textContent = currentLabel;
          li.appendChild(a);
          list.appendChild(li);
          var recipeIngredientList = document.createElement('ul'); 
         // adding ingredients to the second list
          for(y=0; y <data.hits[i].recipe.ingredients.length; y++){
            var li2 = document.createElement('li');
            console.log(data.hits[i].recipe.ingredients[y].text)
            li2.textContent = data.hits[i].recipe.ingredients[y].text;
            recipeIngredientList.appendChild(li2)
      }
      recipeName.appendChild(recipeIngredientList)
      recipeLog.appendChild(recipeName)
      
      list.querySelectorAll('li').forEach(item =>{
      item.addEventListener('click', displayIngredients);
    });

      };
      
    });
}

getRecipesByIngredient()
getRecipesByName()
