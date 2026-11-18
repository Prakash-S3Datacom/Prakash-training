
const url = "http://localhost:3000/api/auth/login";

for (let i = 1; i <= 7; i++) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "random@gmail.com",
            password: "wrong-password"
        })
    });

    const result = await response.json();

    console.log(
        `Attempt ${i}:`,
        response.status,
        result.message
    );
}
