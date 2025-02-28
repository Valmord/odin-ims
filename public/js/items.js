document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog");
  const form = document.querySelector("form");
  const openAddModalBtn = document.querySelector("#add-new-item");
  const cancelBtn = modal.querySelector("#close-modal");

  const nameElement = form.querySelector("#item-name");
  const descElement = form.querySelector("#item-description");
  const priceElement = form.querySelector("#item-price");
  const stockElement = form.querySelector("#item-stock");

  openAddModalBtn.onclick = () => modal.showModal();
  cancelBtn.addEventListener("click", () => {
    form.setAttribute("method", "post");
    form.reset();
    modal.close();
  });

  modal.addEventListener("submit", (e) => {
    if (modal.getAttribute("method").toLowerCase() === "put") {
      e.preventDefault();
      alert("Im here!");
    }
  });

  const tableData = document.querySelectorAll("td");
  tableData.forEach((td) => {
    td.addEventListener("click", () => {
      const parent = td.parentNode;
      const item = {
        id: +parent.dataset.id,
      };
      parent.querySelectorAll("td").forEach((td) => {
        item[td.className] = td.textContent.trim();
      });

      nameElement.value = item.name;
      descElement.textContent = item.description;
      priceElement.value = Number(item.price.slice(1));
      stockElement.value = item.inventory;

      modal.showModal();
    });
  });
});
