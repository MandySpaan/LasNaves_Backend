# Coworking Las Naves

Access Control and Coworking Space Management Project

## Index 🔍

- [Description](#)
- [Stack](#stack)
- [Local Installation](#local-installation-️)
- [Endpoints](#endpoints)
- [In the Pipeline](#in-the-pipeline-)
- [Points of Improvement](#points-of-improvement)

## Description 📖

An access control and management application for the coworking space Las Naves. <br/>
Users can register, check in and out of rooms, make reservations, and view real-time room availability. <br/>
Administrators can also monitor user entry and exit, as well as generate detailed administrative reports.

You can find the related frontend project here: [LasNaves_Frontend](https://github.com/MandySpaan/LasNaves_Frontend)

## Stack 💻

<a href="https://www.typescriptlang.org/">
    <img src= "https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
</a>
<a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MySQL" />
</a>
<a href="https://www.expressjs.com/">
    <img src= "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
</a>
<a href="https://nodejs.org/es/">
    <img src= "https://img.shields.io/badge/node.js-026E00?style=for-the-badge&logo=node.js&logoColor=white"/>
</a>
<a href="">
    <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="NPM" />
</a>
<a href="">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</a>
<a href="">
    <img src="https://img.shields.io/badge/bcrypt-3178C6?style=for-the-badge&" alt="bcrypt" />
</a>

## Local installation 🛠️

### Backend

1. Clone the repository
   `$ git clone https://github.com/MandySpaan/LasNaves_Backend`
2. Install dependencies
   `$ npm install --y`
3. Copy the file .env.example, change the name to .env and fill in all the fields
4. Plant the seeds into the tables
   `$ npm run db:seed`
5. Start the server
   `$ npm run dev`

### Frontend

You can find the related frontend project here: [LasNaves_Frontend](https://github.com/MandySpaan/LasNaves_Frontend)

1. Clone the repository
   `$ git clone https://github.com/MandySpaan/LasNaves_Frontend`
2. Install dependencies
   `$ npm install --y`
3. Start the server
   `$ npm run dev`

## Endpoints ⚙️

You can find all endpoints as Postman documentation here: [Endpoints Las Naves](https://documenter.getpostman.com/view/37118032/2sAXxMgE3z)<br/>
The collection is public and can be imported by clicking on "Run in Postman"

## In the Pipeline 🔜

Ongoing work includes the following:

- For users:

  - Change your own email address
  - Retrieve your own access history

- For admins:

  - Generate weekly and monthly reports

- For super admins:
  - Create, update and delete rooms
  - Update and deactivate users

## Points of Improvement 💡

Areas for improvement include the following:

- Security:

  - Logging failed attemps for wrong password
  - Rate limiting for request password reset and resend validation email

- Logging:

  - Implement error logging for database operations
  - Create a centralized logging system for tracking application errors

- Tests:

  - Implement automated testing for critical functions and API endpoints
  - Establish a process for running tests consistently
