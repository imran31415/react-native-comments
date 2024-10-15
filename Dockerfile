# Step 1: Use the official Node.js image as the base
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package and lock files to install dependencies first (leveraging Docker cache)
COPY package.json package-lock.json ./

# Step 4: Install all necessary dependencies
RUN npm install

# Step 5: Copy the entire app to the container
COPY . .

# Step 6: Expose the port your app will run on
EXPOSE 8082

# Step 7: Set environment variables
ENV EXPO_WEB_HOST=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Step 8: Command to run your Expo app in web mode
CMD ["npx", "expo", "start", "--web", "--non-interactive", "--port", "8082"]