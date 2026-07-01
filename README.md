# coLABoratory - Backend

This is the backend architecture for the coLABoratory real-time web IDE. It powers the collaborative socket environment, database operations, user authentication, and interfaces securely with Generative AI APIs.

## Features

- **Real-Time Collaboration Engine**: Utilizes Socket.io to manage project rooms. It facilitates instant synchronization of file tree structures and chat messages across all connected clients.
- **Resource Optimization**: Implements efficient Socket.io memory management by explicitly removing users from rooms upon disconnection to prevent ghost connections and memory leaks.
- **AI Agent Endpoints**: 
  - `/ai/get-result`: Processes standard AI queries contextualized by the frontend.
  - `/ai/generate-code`: A specialized endpoint that ingests complex JSON file trees and prompts. It employs stringent prompt engineering to enforce structured JSON output from the AI, enabling autonomous file modification.
- **Secure Authentication**: Robust user authentication flow using JWTs (JSON Web Tokens) and bcrypt for password hashing.
- **Data Persistence**: Mongoose schemas designed for scalability, efficiently storing nested file tree objects and chat histories within project documents.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Engine**: Socket.io
- **Authentication**: JWT & bcrypt
- **AI Integration**: Google Generative AI (Gemini Flash)

## Getting Started

1. Clone the repository and navigate to the backend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file with the required environment variables:
   ```env
   PORT=3000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   GOOGLE_AI_KEY=<your_gemini_api_key>
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Architecture Notes

- **AI Controller Logic**: The AI controllers are specifically engineered to handle potential formatting errors from the LLM. If the AI returns markdown blocks despite instructions, the backend safely strips and parses the JSON before returning the updated file tree to the client.
- **Modular Design**: The codebase follows a clean Controller-Service-Route architecture for maintainability and separation of concerns.

---

**Developed by [@om-singh-D](https://github.com/om-singh-D)**
