document.addEventListener("DOMContentLoaded", () => {
    const message = document.querySelector(".message");
    if (message) {
        setTimeout(() => {
            message.style.display = "none";
        }, 3000);
    }
});
