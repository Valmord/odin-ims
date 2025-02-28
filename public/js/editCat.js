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
  const modalCancelBtn = modal.querySelector("#close-cat-modal");

  if (modal.classList.contains("shown")) modal.showModal();

  modalCancelBtn.addEventListener("click", () => {
    modal.classList.remove("shown");
    modal.close();
  });

  modal.addEventListener("submit", async (e) => {
    e.preventDefault();

    const catName = modal.querySelector("#cat-name").value;
    const friendlyName = modal.querySelector("#cat-friendly-name").value;

    console.log("Names", catName, friendlyName);

    try {
      await fetch(`/cat/update/${modal.dataset.index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Ensure this is correct
        },
        body: JSON.stringify({
          "cat-name": catName,
          "cat-friendly-name": friendlyName,
        }),
      });

      window.location.href = "/cat/edit/";
    } catch (err) {
      console.error("Error", err);
    }
  });

  delBtns.forEach((btn) => {
    const catId = btn.dataset.index;
    btn.addEventListener("click", async () => {
      const confirmation = confirm("Are you sure you want to delete?");
      if (confirmation) {
        try {
          await fetch(`/cat/delete/${catId}`, {
            method: "DELETE",
          });

          window.location.href = `/cat/edit`;
        } catch (err) {
          console.error(`Error deleting ${catId}`);
        }
      }
    });
  });
});
