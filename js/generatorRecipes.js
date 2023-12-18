const localStore = window.localStorage;
const submitBtn = document.querySelector('.btn');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  localStore.setItem('search', JSON.stringify(''));
  localStore.setItem('expect', JSON.stringify(''));
  window.location.href = window.location.href.replace(/recipeGenerator.html/, 'recipeList.html');
});
