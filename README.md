
# Yatramitra Backend

The **Yatramitra Backend** provides the server-side functionality for the Yatramitra travel website. It is deployed on Render and utilizes a variety of technologies to offer robust features for booking and user management.

## Live Demo

The backend is deployed and can be accessed at: [Yatramitra Backend](https://yatramitra-backend.onrender.com/)

## Features

- **MongoDB:** Primary database for storing user and booking information.
- **User Authentication:** 
  - **Login API** with bcrypt for secure password hashing.
  - **JWT** for managing authentication and authorization.
- **Forgot Password Functionality:** 
  - Uses **crypto** to generate secure, random tokens for password reset.
- **Payment Gateway:** Integrated with **Stripe** for processing payments.
- **Email Notifications:** 
  - **Nodemailer** is used to send ticket confirmation emails to users.
- **Cookies:** Utilized for various functionalities including session management and tracking.
- **Autocomplete API:** Enhances user experience by providing autocomplete suggestions.
- **Security:** Implements various security measures for data protection and user privacy.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/D3athSkulll/yatramitra-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd yatramitra-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
 **Run the Server:** Start the backend server locally:
   ```bash
   npm start
   ```
   The server will be running at `http://localhost:3000` by default.

## API Endpoints

- **User Authentication:**
  - `POST /api/login` - Log in a user.
  - `POST /api/auth` - Authenticate a user

- **Booking:**
  - `POST /api/book/train` - Book a train ticket.
  - `POST /api/book/flight` - Book a flight ticket.
  - `POST /api/book/bus` - Book a bus ticket.

- **Payment:**
  - `POST /api/payment` - Process a payment via Stripe.

## Contributing

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes with a descriptive message:
   ```bash
   git commit -am 'Add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/my-feature
   ```
5. Create a Pull Request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **MongoDB** for providing a scalable database solution.
- **Stripe** for reliable payment processing.
- **Nodemailer** for email functionality by emailing travel invoice and other needs.
- **html-pdf** for converting generating travel invoice 
- **bcrypt** and **crypto** for secure authentication and password management.
- **Render** for hosting the backend service.

## Contact

For any questions or inquiries, please contact [Your Name] at [Your Email].

---

Feel free to tailor any sections or add more specific details as needed!
