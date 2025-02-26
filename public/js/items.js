document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("th");

  headers.forEach((header) => {

    header.addEventListener("click", (e) => {
      headers.forEach((ele) => {
        ele.classList.remove("sorted-asc", "sorted-desc");
      });

      // if (header.classList.contains('sorted-asc')) {

      // }

      // if (!header.dataset.order) {
      //   header.dataset.order = "asc";
      //   e.target.classList.add("sorted-asc");
      // } else {
      //   header.dataset.order = header.dataset.order === "asc" ? "desc" : "asc";
      //   e.target.classList.add(`sorted-${header.dataset.order}`);
      // }

    //   const aTag = header.querySelector("a");
    //   const newHref = aTag.href.split("?");
    //   aTag.href = `${newHref[0]}?sort=${header.dataset.column}&order=${header.dataset.order}`;
    // });
  });
});
