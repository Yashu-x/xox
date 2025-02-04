# Step 1: Use the official Node.js image as the base image
FROM node:20-alpine

# Define build arguments
ARG NEXTAUTH_SECRET
ARG MONGODB_URI
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

# Set environment variables
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV MONGODB_URI=$MONGODB_URI
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .


# Step 7: Build the Next.js app for production
RUN npm run build

# Step 8: Expose the port your app will run on
EXPOSE 3000

# Step 9: Run the app in production mode
CMD ["npm", "start"]
