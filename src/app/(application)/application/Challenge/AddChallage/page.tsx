"use client";

import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useSession } from "next-auth/react";

// Define a Zod schema for email validation
const emailSchema = z.object({
  player2email: z.string().email("Invalid email address"),
});

const Page = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate the email
      emailSchema.parse({ player2email: email });

      const userId = session?.user?.id;
      if (!userId) {
        setError("You must be logged in to send a challenge.");
        return;
      }

      // Send the API request
      const response = await axios.post(
        "http://localhost:3000/api/challages/addchallages",
        {
          player1id: userId,
          player2email: email,
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Challenge sent successfully!");
        setEmail("");
      }
    } catch (error: any) {
      if (error.response) {
        // API errors with response
        const { status, data } = error.response;
        if (status === 404) {
          setError(data.error || "Player not found.");
        } else if (status === 400) {
          setError(data.error || "Challenge already sent or invalid data.");
        } else {
          setError(data.error || "Failed to send challenge. Please try again.");
        }
      } else if (error instanceof z.ZodError) {
        // Validation errors
        setError(error.errors[0]?.message || "Invalid email address.");
      } else {
        // Network or unexpected errors
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Send a Challenge</h1>
      <div>
        <label htmlFor="email">Enter Player 2 Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          placeholder="Player 2 Email"
          className="border px-2 py-1 rounded"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send Challenge
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default Page;
