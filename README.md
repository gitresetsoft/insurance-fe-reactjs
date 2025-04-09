# Zurince Insurance Portal - Frontend

## Overview

Zurince Insurance Portal is a comprehensive customer portal designed to streamline the insurance management experience. This application enables customers to create accounts, purchase or renew various types of insurance policies, manage their insurance portfolio, and submit insurance claims seamlessly through a user-friendly interface.

Key features include:
- User authentication and account management
- Insurance policy purchasing with customizable coverage options
- Insurance portfolio management dashboard
- Claims submission and tracking
- Payment processing for premiums

## Tech Stack

- **Frontend**: Vite⚡ React.js with TypeScript
- **UI Components**: Radix UI-based components
- **Form Management**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM

> ### Why React.js instead of Next.js
We chose React.js over Next.js for this application for several reasons:

1. **Simplicity**: The application is focused on client-side functionality with minimal server-side requirements, making React's client-side rendering approach sufficient.
2. **Learning Curve**: Using plain React.js allows for easier onboarding of new developers without the additional complexity of Next.js features.
3. **Deployment Flexibility**: The application can be deployed as a static site, allowing for simpler hosting options.
4. **Single-Page Application**: As a dashboard-focused customer portal, the SPA model works well without the need for Next.js's server-side rendering optimizations.

## Running the Application

### Prerequisites
- Node.js (v16.0 or later)
- npm (v7.0 or later) or yarn (v1.22 or later)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/gitresetsoft/insurance-fe-reactjs.git
   cd insurance-fe-reactjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL='http://localhost:3000'
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Future Improvements

### Functional Enhancements
- Real-time chat support for customer assistance
- Document upload and management for policy documents
- Automated premium calculation based on user details
- Multi-language support
- Comprehensive analytics dashboard for policy insights

### Technical Improvements
- **Google OAuth Integration**: Implement social login to streamline the authentication process and improve user experience
- **PostgreSQL Database**: Migrate from local storage to a robust PostgreSQL database for improved data persistence, security, and scalability
- **API Integration**: Connect to a comprehensive insurance API for real-time quotes and policy management
- **Mobile Application**: Develop corresponding mobile applications using React Native
- **Automated Testing**: Implement comprehensive unit and integration tests
- **CI/CD Pipeline**: Set up automated deployment processes for seamless updates

## License and Author

### License
This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details.
