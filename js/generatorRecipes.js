const localStore = window.localStorage;
const submitBtn = document.querySelector('.btn');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  localStore.setItem('search', JSON.stringify(''));
  localStore.setItem('expect', JSON.stringify(''));
  localStore.setItem('fetch', JSON.stringify('generator'));
  window.location.href = window.location.href.replace(/recipeGenerator.html/, 'recipeList.html');
});
