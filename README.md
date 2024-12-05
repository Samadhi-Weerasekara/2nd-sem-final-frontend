<div align="center">
 <img src="assests\Green__1_-removebg-preview.png" width="200" height="200" />
 </div>
# Green Shadow (Pvt) Ltd. Agricultural Management System - Frontend

## Description

The Green Shadow (Pvt) Ltd. Agricultural Management System - Frontend is the user interface for managing agricultural operations at Green Shadow. It allows users to interact with the system to manage fields, crops, staff, vehicles, equipment, and monitoring logs. The frontend communicates with the backend API, which is built with Spring Boot, to perform CRUD operations on various agricultural entities.


## Features

1. User Login: Provides role-based authentication (MANAGER, ADMINISTRATIVE, SCIENTIST).

2. Field Management: Allows users to view, add, update, and delete field details.

3. Crop Management: Manage crop types, their growth stages, and field allocations.

4. Staff Management: Manage human resources, including their assignments to fields and vehicles.

5. Vehicle Management: Assign and manage vehicles for staff operations.

6. Equipment Management: Manage agricultural equipment, including assignments to fields and staff.

6. Monitoring Logs: Record observations and activities related to crops and fields.

## Technologies Used

1. HTML: For the structure of the web pages.
2. CSS: For styling the layout and design.
3. JavaScript: For interactivity and making AJAX requests to the backend.
4. AJAX: For asynchronous API calls to interact with the backend.
5. Bootstrap/Tailwind CSS: For responsive design and easy styling.
6. jQuery: For DOM manipulation and simplifying AJAX requests.

##  Folder Structure

1. /assets: Contains static files like images, icons, etc.
2. /css: Contains CSS files for styling.
3. /js: Contains JavaScript files, including functions for handling API requests.
4. index.html: Main entry point for the application.


## Architecture Overview

1. **Entities:** Representations for Crop , Email , Equipment , Field , Staff , User , Vehicle and Monitoring Log
2. **Data Transfer Objects (DTOs):** Includes CropDTO, EmailDTO, EquipmentDTO , FieldDTO , StaffDTO , UserDTO , VehicleDTO and MoniterLogDTO
3. **Repositories:** Interfaces for database operations.
4. **Services:** Business logic for manage.
5. **Controllers:** API endpoints for handle Requests.
6. **Utilities:** Helper classes for tasks.
7. **Exceptions:** Custom error handling mechanisms for specific scenarios
8. **Configuration:** Application setup classes like application.properties,application-dev.properties


## Validation
Data validation is enforced through Hibernate Validator annotations within the DTO classes, ensuring both data integrity and accuracy.

## Logging
Logging is set up with Logback, capturing logs both in the console and in a dedicated file.

## Custom Exceptions
Custom exceptions are designed to address specific error situations, delivering clear and informative error messages to the client.


## UI examples

 <img src="assests\login.png" width="400" height="400" />
 <img src="assests\Screenshot 2024-12-05 165115.png"  width="400" height="200"/>
 <img src="assests\Screenshot 2024-12-05 165145.png" width="400" height="200" />
 <img src="assests\Screenshot 2024-12-05 165253.png" width="400" height="200" />
 <img src="assests\Screenshot 2024-12-05 165300.png" width="400" height="200" />
 <img src="assests\Screenshot 2024-12-05 165319.png" width="400" height="200" />
 
## API Documentation

To view this project API Documentation

Refer to the [ Postman API Documentation](https://documenter.getpostman.com/view/35384895/2sAYBbcTsX) for detailed API endpoints and usage instructions.


## License

This project is licensed under the MIT License - see the [ MIT License](https://github.com/Samadhi-Weerasekara/2nd-sem-final-frontend) file for details.

<p align="center">
  &copy; 2024 Samadhi Weerasekara
</p>
