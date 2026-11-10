
import { getUsers, getPosts, getComments } from "./services/api.js";

import type { User, Post, Comment } from "./types/api.types";

const userContainer = document.getElementById("users");
const postContainer = document.getElementById("posts");
const commentContainer = document.getElementById("comments");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const retryButton = document.getElementById("retry-btn");

async function loadData(): Promise<void> {

    if (
        !(userContainer instanceof HTMLElement) ||
        !(postContainer instanceof HTMLElement) ||
        !(commentContainer instanceof HTMLElement) ||
        !(loading instanceof HTMLElement) ||
        !(errorMessage instanceof HTMLElement) ||
        !(retryButton instanceof HTMLButtonElement)
    ) {
        console.error("Required HTML elements are missing");
        return;
    }

    loading.hidden = false;
    errorMessage.hidden = true;
    retryButton.hidden = true;

    userContainer.replaceChildren();
    postContainer.replaceChildren();
    commentContainer.replaceChildren();

    try {

        // Fetch all three endpoints simultaneously
        const [users, posts, comments]: [
            User[],
            Post[],
            Comment[]
        ] = await Promise.all([
            getUsers(),
            getPosts(),
            getComments()
        ]);

        // Display users
        users.forEach((user) => {
            const card = document.createElement("div");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = user.name;

            const email = document.createElement("p");
            email.textContent = `Email: ${user.email}`;

            const city = document.createElement("p");
            city.textContent = `City: ${user.address.city}`;

            card.append(heading, email, city);
            userContainer.appendChild(card);
        });

        // Display posts
        posts.forEach((post) => {
            const card = document.createElement("div");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = post.title;

            const body = document.createElement("p");
            body.textContent = post.body;

            const author = document.createElement("small");
            author.textContent = `User ID: ${post.userId}`;

            card.append(heading, body, author);
            postContainer.appendChild(card);
        });

        // Display comments
        comments.forEach((comment) => {
            const card = document.createElement("div");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = comment.name;

            const email = document.createElement("p");
            email.textContent = `Email: ${comment.email}`;

            const body = document.createElement("p");
            body.textContent = comment.body;

            card.append(heading, email, body);
            commentContainer.appendChild(card);
        });

    } catch (error: unknown) {

        errorMessage.hidden = false;

        if (error instanceof Error) {
            errorMessage.textContent = error.message;
        } else {
            errorMessage.textContent = "Something went wrong.";
        }

        retryButton.hidden = false;

    } finally {
        loading.hidden = true;
    }
}

// Retry button
if (retryButton instanceof HTMLButtonElement) {
    retryButton.addEventListener("click", loadData);
}

// Initial API call
loadData();
