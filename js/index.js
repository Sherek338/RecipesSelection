const submitBtn = document.querySelector('.form .btn');
const inputSearch = document.querySelector('#search');
const inputExcept = document.querySelector('#except');

const localStore = window.localStorage;

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const searchValue = inputSearch.value.trim();
  const exceptValue = inputExcept.value.trim().split(',');

  if (isEmptyForm(searchValue)) return;

  localStore.setItem('search', JSON.stringify(searchValue));
  localStore.setItem('expect', JSON.stringify(exceptValue));
  localStore.setItem('fetch', JSON.stringify('ingredients'));
  window.location.href = window.location.href.replace(
    /index.html(#help|#recipes|#logo|#about-us)?/,
    'pages/recipeList.html'
  );
});

function isEmptyForm(value) {
  if (value.length > 0) {
    return false;
  }
  return true;
}
