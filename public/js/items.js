document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog");
  const form = document.querySelector("form");
  const openAddModalBtn = document.querySelector("#add-new-item");
  const cancelBtn = modal.querySelector("#close-modal");

  const nameElement = form.querySelector("#item-name");
  const descElement = form.querySelector("#item-description");
  const priceElement = form.querySelector("#item-price");
  const stockElement = form.querySelector("#item-stock");
  const delBtn = form.querySelector("#delete-item-btn");

  openAddModalBtn.onclick = () => modal.showModal();
  cancelBtn.addEventListener("click", () => {
    form.setAttribute("method", "post");
    form.reset();
    descElement.textContent = "";
    delBtn.className = "hidden";
    modal.close();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formType = form.getAttribute("method").toLowerCase();

    if (formType !== "put" && formType !== "post") {
      alert("Bigtime error");
      return;
    }

    if (formType === "put") {
      const itemId = form.dataset.id;
      if (!itemId || isNaN(itemId)) {
        console.error("Invalid id");
        form.reset();
        descElement.textContent = "";
        return;
      }

      await fetch(`/item/update/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameElement.value.trim(),
          desc: descElement.textContent.trim(),
          price: Number(priceElement.value.trim()),
          inventory: Number(stockElement.value.trim()),
        }),
      });
      form.reset();
      descElement.textContent = "";
      modal.close();
      window.location.reload();
      return;
    }

    form.submit();
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

      form.dataset.id = parent.dataset.id;
      nameElement.value = item.name;
      descElement.textContent = item.description;
      priceElement.value = Number(item.price.slice(1));
      stockElement.value = item.inventory;
      delBtn.className = "";

      form.setAttribute("method", "put");

      modal.showModal();
    });
  });

  delBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const userConfirm = confirm("Are you sure you want to delete this item?");

    if (!userConfirm) return;

    const itemId = form.dataset.id;
    if (!itemId || isNaN(itemId)) {
      console.error("Invalid id");
      form.reset();
      descElement.textContent = "";
      modal.close();
      return;
    }

    const response = await fetch(`/item/delete/${itemId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.reload();
    }
  });
});
