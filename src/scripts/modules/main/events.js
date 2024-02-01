export const returnHome = () => {
  const headerTitle = document.querySelector(".header-title");

  headerTitle.addEventListener("click", () => {
    document.location.reload(true);
  });
};