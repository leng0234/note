document.addEventListener("DOMContentLoaded", function () {
    const colorOptions = document.querySelectorAll('input[name="color"]');
    const createButton = document.getElementById('create-btn');

    function updateButtonColor() {
        const selectedColor = document.querySelector('input[name="color"]:checked').value;
        createButton.style.backgroundColor = selectedColor;
    }

    colorOptions.forEach(option => {
        option.addEventListener('change', updateButtonColor);
    });

    updateButtonColor();

    // Hide messages after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.message').forEach(msg => msg.style.display = "none");
    }, 3000);
});
