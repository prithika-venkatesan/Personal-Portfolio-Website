const form = document.getElementById("contact-form");
const statusMessage = document.getElementById("form-status");

form.addEventListener("submit", async (event) => {
    console.log("FORM SUBMIT EVENT FIRED!");
    event.preventDefault();

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const message = form.elements["message"].value.trim();

    statusMessage.textContent = "Sending...";

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong.");
        }

        statusMessage.textContent = result.message;
        form.reset();
    } catch (error) {
        statusMessage.textContent =
            "Could not send your message. Please try again.";
        console.error(error);
    }
});
