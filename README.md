To create a README for your code, you'll want to provide information that helps users understand what your code does, how to use it, and any other relevant details. Here's a basic template you can follow:

---

# RSA-based Authentication and Symmetric Encryption API

## Overview

This API implements RSA-based authentication for securely transmitting login credentials and symmetric encryption for ensuring confidentiality. It generates RSA key pairs, encrypts and decrypts data using RSA, and performs symmetric key encryption and decryption using AES-256-CBC mode.

## Features

- **RSA Key Generation**: Generates RSA key pairs (public and private keys).
- **RSA Encryption and Decryption**: Encrypts and decrypts data using RSA encryption.
- **Symmetric Key Generation**: Generates a random symmetric key for use in symmetric encryption.
- **Symmetric Encryption and Decryption**: Encrypts and decrypts data using AES-256-CBC symmetric encryption.
- **Secure Login Simulation**: Simulates a login process using RSA encryption for transmitting a symmetric key and symmetric encryption for transmitting login credentials.

## Usage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pansaar/security-project
   ```

2. Install dependencies:

   ```bash
   npm install next
   npm install crypto
   ```

### Running the API

Start the API server:

```bash
npm run brew
```

The API will be triggered at `http://localhost:3000/api/auth` when user inputs username, password and clicks login button.

### API Endpoints

#### `POST /api/auth`

Simulates a login process using RSA-based authentication and symmetric encryption.

Request Body:

```json
{
  "username": "example_user",
  "password": "example_password"
}
```

Response:

- `200 OK`: Successful login request.
- `405 Method Not Allowed`: Invalid HTTP method used (only `POST` allowed).

## Security Considerations

- **Secure Communication**: Ensure that the API is accessed over HTTPS to protect data transmission.
- **Secure Storage**: Store sensitive data (e.g., private keys) securely, following best practices.
- **Input Validation**: Validate user inputs to prevent injection attacks and other security vulnerabilities.

## Contributors

- [Pansaar Kerdpol 6422782852](https://github.com/Pansaar)

Feel free to customize this README with additional details specific to your project and use case.