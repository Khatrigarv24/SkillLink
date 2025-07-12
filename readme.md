<div align="center">
  <h1 align="center">SkillLink</h1>
  <p align="center">
    Share Skills, Grow Together 🚀
    <br />
    A full-stack web application designed to connect people who want to exchange skills and knowledge.
    <br />
    <a href="/frontend/src/pages/Home.jsx"><strong>Explore the code »</strong></a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

SkillLink is a community-driven platform where users can offer skills they're proficient in and request skills they want to learn. The core idea is to facilitate a barter economy for knowledge, connecting individuals for mutual growth without any monetary exchange. Our smart matching algorithm helps you find the perfect partner to start your learning journey.

---

### Key Features

*   👤 **User Authentication & Profile:** Secure sign-up and login. Manage your profile with personal details, availability, and skills.
*   🧠 **Skill Management:** Easily add skills you can offer and skills you want to learn to your profile.
*   🔍 **Smart Matching:** Discover users with complementary skills—those who want what you offer, and offer what you want.
*   🔄 **Skill Swaps:** Initiate, manage, and track skill swap requests with other users.
*   📊 **Dashboard:** A central hub to view your skills, potential matches, and pending swap requests at a glance.
*   ⭐ **Ratings & Feedback:** Rate your swap partners to build a trustworthy and transparent community.

---

### Built With

This project leverages modern technologies to provide a seamless and responsive user experience.

**Frontend:**
*   [React.js](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Framer Motion](https://www.framer.com/motion/)
*   [React Router](https://reactrouter.com/)

**Backend:**
*   [Node.js](https://nodejs.org/)
*   [Express.js](https://expressjs.com/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Drizzle ORM](https://orm.drizzle.team/)
*   [PostgreSQL](https://www.postgresql.org/)
*   [Docker](https://www.docker.com/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
*   Node.js (v18 or higher)
*   npm
*   Docker & Docker Compose

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/skilllink.git
    cd skilllink
    ```

2.  **Set up the Backend:**
    ```sh
    // filepath: backend/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/skilllink_db"
    PORT=3000
    JWT_SECRET="your_super_secret_jwt_key"
    ```
    ```sh
    cd backend
    npm install
    docker-compose up -d  # Starts the PostgreSQL database
    npm run db:push       # Pushes schema to the database
    npm run dev           # Starts the backend server
    ```

3.  **Set up the Frontend:**
    ```sh
    // filepath: frontend/.env
    VITE_API_URL=http://localhost:3000
    ```
    ```sh
    cd ../frontend
    npm install
    npm run dev # Starts the frontend development server
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

---

## Project Structure

The repository is organized into two main directories:

*   `backend/`: Contains the Node.js/Express server, database configuration, and API logic.
    *   `src/`: Main source code.
        *   `controllers/`: Request handlers.
        *   `db/`: Drizzle ORM schema and configuration.
        *   `routes/`: API route definitions.
*   `frontend/`: Contains the React client application.
    *   `src/`: Main source code.
        *   `components/`: Reusable UI components.
        *   `pages/`: Top-level page components.
        *   `context/`: React context for state management.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---