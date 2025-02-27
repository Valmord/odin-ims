document.addEventListener("DOMContentLoaded", () => {
  const headerLinks = document.querySelectorAll("header a");
  headerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      console.log(link);
    });
  });
});
