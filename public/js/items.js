document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog");
  const openModalBtn = document.querySelector("#add-new-item");
  const cancelBtn = modal.querySelector("#close-modal");

  openModalBtn.onclick = () => modal.showModal();
  cancelBtn.onclick = () => modal.close();
});
