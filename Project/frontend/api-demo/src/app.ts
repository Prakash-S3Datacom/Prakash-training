
// 1. Define the User interface

interface User {
    id: number;
    name: string;
    username: string;
    email: string;

    address: {
        city: string;
    };

    company: {
        name: string;
    };
}

// 2. Get HTML elements

const userContainer = document.getElementById("user-container");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const retryButton = document.getElementById("retry-btn");

// 3. Fetch users from API

async function fetchUsers(): Promise<void> {

    // Check whether HTML elements exist

    if (
        !(userContainer instanceof HTMLElement) ||
        !(loading instanceof HTMLElement) ||
        !(errorMessage instanceof HTMLElement) ||
        !(retryButton instanceof HTMLButtonElement)
    ) {
        console.error("Required HTML elements are missing");
        return;
    }

    // Show loading state

    loading.hidden = false;
    errorMessage.hidden = true;
    retryButton.hidden = true;

    userContainer.innerHTML = "";

    try {

        // Send GET request

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        // Check HTTP response
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // Convert JSON response into typed data
        const users: User[] = await response.json();

        // Hide loading state
        loading.hidden = true;

        // Render user cards
        users.forEach((user) => {

            const card = document.createElement("article");
            card.className = "user-card";

            const heading = document.createElement("h3");
            heading.textContent = user.name;

            const username = document.createElement("p");
            username.textContent = `Username: ${user.username}`;

            const email = document.createElement("p");
            email.textContent = `Email: ${user.email}`;

            const city = document.createElement("p");
            city.textContent = `City: ${user.address.city}`;

            const company = document.createElement("p");
            company.textContent = `Company: ${user.company.name}`;

            card.append(
                heading,
                username,
                email,
                city,
                company
            );

            userContainer.appendChild(card);

        });

    } catch (error: unknown) {

        // Hide loading state

        loading.hidden = true;

        // Display error state

        errorMessage.hidden = false;
        retryButton.hidden = false;

        if (error instanceof Error) {
            errorMessage.textContent = error.message;
        } else {
            errorMessage.textContent = "Something went wrong!";
        }
    }
}

// 4. Retry button event

if (retryButton instanceof HTMLButtonElement) {

    retryButton.addEventListener("click", () => {
        fetchUsers();
    });

}

// 5. Initial API call

fetchUsers();
