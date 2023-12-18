const localStore = window.localStorage;

const submitBtn = document.querySelector('.form .btn');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const checkboxes = document.querySelectorAll('.checkboxes .checkbox input:checked');

  if (isEmptyForm(checkboxes)) return;

  const searchValue = Array.from(checkboxes).map((checkbox) => checkbox.id);

  localStore.setItem('search', JSON.stringify(searchValue));
  localStore.setItem('expect', JSON.stringify(''));
  localStore.setItem('fetch', JSON.stringify('kitchens'));
  window.location.href = window.location.href.replace(/byKitchens.html/, 'recipeList.html');
});

function isEmptyForm(value) {
  if (value.length > 0) {
    return false;
  }
  return true;
}
