
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <main className="app-container">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/">Go back to TaskFlow</Link>
        </main>
    );
}

export default NotFoundPage;
