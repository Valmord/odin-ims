addEventListener("DOMContentLoaded", () => {
  const addCatModal = document.querySelector("#open-cat-modal");
  const catModal = document.querySelector("#category-modal");
  const closeCatModal = document.querySelector("#close-cat-modal");

  addCatModal.addEventListener("click", () => {
    catModal.showModal();
    // document.querySelector('dialog').show;
  });

  closeCatModal.addEventListener("click", () => {
    catModal.close();
  });
});
