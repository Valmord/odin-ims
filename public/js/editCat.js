document.addEventListener("DOMContentLoaded", () => {
  const editBtns = document.querySelectorAll(".edit-btn");
  const delBtns = document.querySelectorAll(".del-btn");
  console.log(editBtns);

  editBtns.forEach((btn) => {
    const catId = btn.dataset.index;
    btn.addEventListener("click", () => {
      window.location.href = `/cat/edit/${catId}`;
    });
  });

  const modal = document.querySelector("dialog");
  const modalSaveBtn = modal.querySelector("btn[type='submit'");
  const modalCancelBtn = modal.querySelector("#close-cat-modal");
  console.log(modal);
  console.log(modalSaveBtn, modalCancelBtn);
  if (modal.classList.contains("shown")) modal.showModal();

  modalCancelBtn.addEventListener("click", () => {
    modal.classList.remove("shown");
    modal.close();
  });
});
