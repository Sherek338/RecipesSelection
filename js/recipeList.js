const app_id = '77bfbcec';
const app_key = '17f35bbf9f15bea012634cdd6da00ba5';
const endpoint = 'https://api.edamam.com/search';

const localStorage = window.localStorage;
const searchValue = JSON.parse(localStorage.getItem('search'));
const exceptValue = JSON.parse(localStorage.getItem('expect'));

console.log(searchValue);

const loader = document.querySelector('.lds-dual-ring');
const observerEl = document.querySelector('#observer');

let from = 0;
let to = 20;
const observer = new IntersectionObserver(() => {
  if (Array.isArray(searchValue)) fetchListByKitchens(from, to);
  else fetchListByIngridients(from, to);
  from += 20;
  to += 20;
});
observer.observe(observerEl);

async function fetchListByIngridients(from, to) {
  loader.style.display = 'block';

  const url = new URL(endpoint);
  url.searchParams.append('q', searchValue);
  url.searchParams.append('app_id', app_id);
  url.searchParams.append('app_key', app_key);
  url.searchParams.append('from', from);
  url.searchParams.append('to', to);

  try {
    const responce = await fetch(url);
    if (responce.status !== 200) throw new Error(`Request failed with status code ${responce.status}`);
    const recipe = await responce.json();

    loader.style.display = 'none';

    const filteredRecipes = filterRecipes(recipe.hits, exceptValue);
    const listWrapper = document.querySelector('.recipe-generator .block');

    if (filteredRecipes.length === 0) {
      observer.disconnect(observerEl);
      listWrapper.append((document.createElement('h2').innerHTML = 'Это все что удалось найти'));
    } else filteredRecipes.forEach((recipe) => insertRecipe(listWrapper, recipe));
  } catch (error) {
    console.log(error);
  }
}

function filterRecipes(recipes, except) {
  if (except[0] === '') return recipes;

  const recipeList = recipes.filter(
    (item) =>
      item.recipe.ingredients.filter((ingredient) =>
        except.reduce((accum, curVal) => !ingredient.text.includes(curVal) && accum, true)
      ).length === item.recipe.ingredients.length
  );

  return recipeList;
}

async function fetchListByKitchens(from, to) {
  loader.style.display = 'block';

  const listWrapper = document.querySelector('.recipe-generator .block');
  let recipeList = [];

  for (const search of searchValue) {
    const url = new URL(endpoint);
    url.searchParams.append('q', search);
    url.searchParams.append('app_id', app_id);
    url.searchParams.append('app_key', app_key);
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);

    try {
      const responce = await fetch(url);

      if (responce.status !== 200) throw new Error(`Request failed with status code ${responce.status}`);
      const recipes = await responce.json();

      console.log(recipes);
      recipeList = [...recipeList, ...recipes.hits];
    } catch (error) {
      console.log(error);
    }
  }

  loader.style.display = 'none';

  if (recipeList.length === 0) {
    observer.disconnect(observerEl);
    listWrapper.append((document.createElement('h2').innerHTML = 'Это все что удалось найти'));
  }

  recipeList.forEach((recipe) => insertRecipe(listWrapper, recipe));
}

function insertRecipe(insertWrapper, recipe) {
  const recipeHtml = document.createElement('div');
  recipeHtml.classList.add('recipe-block');

  recipeHtml.innerHTML = `
    <div class="img">
      <img
        src="${recipe.recipe.image}"
        alt="Recipe Photo" />
    </div>
    <div class="info">
      <h3 class="title">${recipe.recipe.label}</h3>
      <p class="description">${recipe.recipe.summary ?? recipe.recipe.ingredientLines.join('</br>')}</p>
      <button class="btn white-block">Смотреть</button>
    </div>
  `;

  insertWrapper.append(recipeHtml);
}
