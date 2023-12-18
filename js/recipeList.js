const app_id = '77bfbcec';
const app_key = '17f35bbf9f15bea012634cdd6da00ba5';
const endpoint = 'https://api.edamam.com/search';

const localStorage = window.localStorage;
const searchValue = JSON.parse(localStorage.getItem('search'));
const exceptValue = JSON.parse(localStorage.getItem('expect'));
const whatFetch = JSON.parse(localStorage.getItem('fetch'));

const loader = document.querySelector('.lds-dual-ring');
const observerEl = document.querySelector('#observer');

let from = 0;
let to = 20;
const observer = new IntersectionObserver(() => {
	loader.style.display = 'block';
	switch (whatFetch) {
		case 'ingredients':
			fetchListByIngridients(from, to);
			break;
		case 'kitchens':
			fetchListByKitchens(from, to);
			break;
		case 'generator':
			fetchListGenerator(from, to);
			break;
	}
	from += 20;
	to += 20;
});
observer.observe(observerEl);

async function fetchListByIngridients(from, to) {
	const url = new URL(endpoint);
	url.searchParams.append('q', searchValue);
	url.searchParams.append('app_id', app_id);
	url.searchParams.append('app_key', app_key);
	url.searchParams.append('from', from);
	url.searchParams.append('to', to);

	try {
		const responce = await fetch(url);
		if (responce.status !== 200)
			throw new Error(`Request failed with status code ${responce.status}`);
		const recipe = await responce.json();

		loader.style.display = 'none';

		const filteredRecipes = filterRecipes(recipe.hits, exceptValue);
		const listWrapper = document.querySelector('.recipe-generator .block');

		if (filteredRecipes.length === 0) {
			observer.disconnect(observerEl);
			if (!listWrapper.innerHTML)
				listWrapper.append(
					(document.createElement('h2').innerHTML =
						'Unfortunately, your search returned no results')
				);
		} else
			filteredRecipes.forEach((recipe) => insertRecipe(listWrapper, recipe));

		console.log(!listWrapper.innerHTML);
	} catch (error) {
		console.log(error);
	}
}

function filterRecipes(recipes, except) {
	if (except[0] === '') return recipes;

	const recipeList = recipes.filter(
		(item) =>
			item.recipe.ingredients.filter((ingredient) =>
				except.reduce(
					(accum, curVal) =>
						!ingredient.text.toUpperCase().includes(curVal.toUpperCase()) &&
						accum,
					true
				)
			).length === item.recipe.ingredients.length
	);

	return recipeList;
}

async function fetchListByKitchens(from, to) {
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

			if (responce.status !== 200)
				throw new Error(`Request failed with status code ${responce.status}`);
			const recipes = await responce.json();

			recipeList = [...recipeList, ...recipes.hits];
		} catch (error) {
			console.log(error);
		}
	}

	loader.style.display = 'none';

	if (recipeList.length === 0) {
		observer.disconnect(observerEl);
		if (!listWrapper.innerHTML)
			listWrapper.append(
				(document.createElement('h2').innerHTML =
					'Unfortunately, your search returned no results')
			);
	}

	recipeList.forEach((recipe) => insertRecipe(listWrapper, recipe));
}

async function fetchListGenerator() {
	const url = new URL(endpoint);
	url.searchParams.append('q', 'Balanced');
	url.searchParams.append('app_id', app_id);
	url.searchParams.append('app_key', app_key);
	url.searchParams.append('from', 0);
	url.searchParams.append('to', 100);

	try {
		const responce = await fetch(url);

		if (responce.status !== 200)
			throw new Error(`Request failed with status code ${responce.status}`);
		const recipes = await responce.json();

		const listWrapper = document.querySelector('.recipe-generator .block');

		loader.style.display = 'none';

		insertRecipe(listWrapper, recipes.hits[getRandomInt(0, 100)]);
		observer.disconnect(observerEl);
	} catch (error) {
		console.log(error);
	}
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
      <p class="description">${
				recipe.recipe.summary ?? recipe.recipe.ingredientLines.join('</br>')
			}</p>
    </div>
  `;

	insertWrapper.append(recipeHtml);
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}
