# Signup Component

A Signup component built with ReactJS (frontend) and NodeJS (backend) using TypeScript for user registration and validation.

## Features ✨

- **TypeScript-first**
- **Zod schema validation**
- **Structured error handling**
- **Pre-commit hooks**
- **Logging**

## Getting Started

1. Clone repository

    ```bash
    git clone git@github.com:SarvahaSystems/signup-component.git
    ```
2. Install dependencies and setup environment variables

    ```bash
    cd client/
    npm install
    cp .env.example .env
    ```

    ```bash
    cd server/
    npm install
    cp .env.example .env
    ```

3. Create Google Recaptcha Site Key
    1. Go to [Google Recaptcha Admin Console](https://www.google.com/recaptcha/admin/create)
    2. Fill the required details such as label, reCaptcha type, domains and name of the project
    3. After submitting, you will be getting the **Site Key** and **Secret Key**

    [![Screenshot-from-2025-02-18-11-16-52.png](https://i.postimg.cc/fR6TbXQ5/Screenshot-from-2025-02-18-11-16-52.png)](https://postimg.cc/FYVQWYRJ)
    [![Screenshot-from-2025-02-18-11-17-15-1.png](https://i.postimg.cc/0ND5KQ8v/Screenshot-from-2025-02-18-11-17-15-1.png)](https://postimg.cc/5H9WZfYK)

4.  Create SendGrid User Credentials
    1. Go to [SendGrid Console](https://app.sendgrid.com/)
    2. After login, go to the **Settings** section
    3. Choose **API Keys** and then **Create API Key**
    4. Give name to the API Key, it will act as username and click on **Create and View**
    5. Save the API Key somewhere safe as it will not be available in the future

