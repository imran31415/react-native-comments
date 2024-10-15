# Comments App

This is a React Native application that allows users to view and manage nested comments. The app uses **Expo** for easy development and supports both **iOS** and **web** platforms. It features a comments list with pagination and nested replies.

---

## Features

- View a list of comments with pagination.
- Reply to comments, supporting nested child comments.
- Dynamically load more replies for each comment.
- Supports both **web** and **iOS** via **Expo**.
- Uses `protobuf` to structure and manage comments data.

---

## Prerequisites

Ensure you have the following tools installed:

- **Node.js** (version 18 or higher) – [Install Node.js](https://nodejs.org)
- **Expo CLI** – Install globally using:
  ```bash
  npm install --global expo-cli
  ```
- **iOS Simulator** (for Mac users) or a **physical device** for testing.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd comments-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo server:**
   ```bash
   npx expo start
   ```

4. **Run on iOS or web:**
   - Press **`i`** to launch the **iOS simulator**.
   - Press **`w`** to open the app in a **web browser**.

---

## Folder Structure

```
/components
  ├── CommentsList.tsx
  ├── Comment.tsx
/proto
  └── comments/comments.ts
/screens
  └── Index.tsx
App.tsx
```

---

## Configuration

Ensure that the backend API and protobuf files are properly configured. Adjust the `API_BASE_URL` in `api.ts` to match your backend URL.

---

## Troubleshooting

- **Metro bundler errors**: Clear the cache and restart the server:
  ```bash
  npx expo start --clear
  ```
- **iOS simulator issues**: Ensure Xcode is installed and updated.

---

## Dependencies

- **React Native**: For building the mobile app.
- **Expo**: Development framework.
- **react-native-paper**: UI components.
- **axios**: For API requests.
- **protobuf**: For structured data management.

---

## License

This project is licensed under the MIT License.

---

## Contributing

Feel free to fork the repository and submit pull requests.

---

## Author

Created by Imran Hassanali