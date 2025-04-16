
Projeto: Loja Online — ADIMAX PET SHOP 🐾

Identificação
- Nome: André Marcelino Watanabe Número USP: 14558311
- Nome: Renato Spessotto; Número USP:14605824
---


==============================
Project Description
==============================

This project simulates the interface of an online pet shop called ADIMAX PET SHOP.
The current milestone focuses on building static mockups using HTML5 and CSS3.

Functionalities to implement:

-> Homepage with description, images, and offers (site.html).
-> Login screen for users and administrators (login.html).
-> Products catalog page displaying product images and highlights (produtos.html).
-> Future: Admin panel for product management.



==============================
Navigation Diagram (SPA)
==============================

+----------------+
|     Home       | (site.html)
+----------------+
       |
       |--> Login (login.html)
       |
       |--> Products (produtos.html)
       |
       |--> Admin Panel (Planned)
                |
                |--> Add Product (Planned)
                |--> Edit Product (Planned)
                |--> Delete Product (Planned)

Description:
- Users start on the Home page.
- From the Home page, they can access the Login page to log in as a customer or administrator.
- Users can navigate to the Products page to browse available items.
- Administrators (when logged in) will have access to the Admin Panel.
- The Admin Panel will provide options to Add, Edit, and Delete products.

This diagram reflects the current structure of the ADIMAX PET SHOP project
and outlines the intended future flow once administrative functions are implemented.

Planned Data to Store on the Server:

-> Customer and admin login data (username, password).
-> Product information (name, price, description, images).
-> Registered user data and their orders (planned).

==============================
Comments About the Code
==============================

-> The project is fully structured in HTML5 and CSS3.
-> Semantic tags were used for clear document organization.
-> The layout applies Flexbox and Grid to ensure responsiveness.
-> Separation of concerns was maintained by splitting CSS across multiple files (style.css, login.css, site.css).
-> Mockups provide a faithful visual representation of the user flow.

==============================
Test Plan
==============================

-> Manual testing was performed to validate visual rendering and navigation flow.
-> The application was tested in modern browsers like Google Chrome and Mozilla Firefox.
-> Page responsiveness was checked using browser DevTools.

Future Plan:

-> Backend API testing using Postman.
-> UI navigation testing with Selenium automation scripts.

==============================
Test Results
==============================

-> All pages load successfully without visual glitches.
-> Navigation links work correctly and point to the expected screens.
-> The interface adapts to various screen sizes including mobile.

==============================
Build Procedures
==============================

1. Clone the GitHub repository:
   git clone https://github.com/seu-usuario/seu-repositorio.git

2. Navigate to the project folder:
   cd seu-repositorio

3. Open site.html in a web browser:
   start site.html

==============================
Problems
==============================

-> The system does not yet handle user authentication or real product storage.
-> The admin management panel is under development.
-> Full SPA navigation behavior with JavaScript is still planned.

==============================
Comments
==============================

This milestone established the graphical interface mockups for the online store ADIMAX PET SHOP using HTML5 and CSS3.
The focus was on creating clear, responsive layouts and ensuring navigability.
In the next phase, the project will evolve to integrate a real backend system, improve user interaction, and adopt dynamic SPA behavior with JavaScript.
