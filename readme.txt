
==============================
Project Report — ADIMAX PET SHOP 🐾
==============================

Group Identification:
- André Marcelino Watanabe — USP Number: 14558311
- Renato Spessotto — USP Number: 14605824

---

Requirements:

The ADIMAX PET SHOP project implements a real online store system using HTML5, CSS3, and PHP.
The project has evolved beyond mockups and now offers real features:

- Display pet products for customer browsing.
- Login system for customers and administrators with PHP and database validation.
- Registration form for new users.
- Cart management: add, update, and remove products.
- Modular structure: header, footer, login, and product pages.
- Dynamic session management with PHP.
- Planned Admin Panel for future product management.

---

Project Description:

This project simulates and implements the core interface and logic of an online pet shop.
Built with HTML5, CSS3, PHP, and server-side logic, it covers authentication, product navigation, and shopping cart features.

Functionalities implemented:
-> Homepage with services, products, and special offers (site.html).
-> Login screen with PHP validation (login.html → login_pagina.php).
-> Products catalog page (produtos.html + produtos.php) showing items and prices.
-> User registration system (register/register.php).
-> Cart management (add/update/remove items) via PHP scripts (carrinho/, update_carte.php, remove_item.php).
-> Logout feature (sair.php) to destroy sessions.
-> Modular design with reusable header and footer.

Planned functionalities:
-> Admin Panel for managing products, users, and orders.

---

Navigation Diagram (SPA):
<<<<<<< HEAD

+----------------+
|     Home       | (site.html)
+----------------+
       |
       |--> Login (login.html -> login_pagina.php)
       |
       |--> Products (produtos.html -> produtos.php)
       |
       |--> Register (register/register.php)
       |
       |--> Cart (carrinho/, update_carte.php, remove_item.php)
       |
       |--> Logout (sair.php)
       |
       |--> Admin Panel (Planned)

This navigation map reflects the functional routes of the current application
and prepares for future admin-exclusive management areas.

---

Planned Data to Store on the Server:

-> Customer and admin login credentials.
-> Product data: name, price, image, description.
-> Registered customer profiles and their shopping cart contents.
-> Purchase orders and sales history (Planned).

---

Comments About the Code:

-> Structured in HTML5 for markup, CSS3 for styling, and PHP for server-side logic.
-> Use of semantic HTML tags to enhance document clarity.
-> Header and footer components are modular and reused across pages.
-> PHP handles sessions for login/logout, cart state, and data flow.
-> CSS layouts apply Flexbox and Grid for responsive design.
-> Simple and intuitive navigation flow.

---

Test Plan:

- Manual testing to verify page loading and link navigation.
- Login and logout functions tested with valid and invalid credentials.
- Registration process tested with various data entries.
- Product cart tested for add, update, and remove actions.
- Compatibility verified with Chrome and Firefox.
- Responsive behavior checked on mobile and desktop using browser DevTools.

Future Plan:
-> Use Postman to test backend HTTP requests.
-> Implement Selenium for automated user flow testing.

---

Test Results:

- Login and registration forms validated successfully.
- Products display properly on the catalog page.
- Cart functionalities (add/update/remove) perform as expected.
- The layout adapts responsively to various screen sizes.
- Navigation links work correctly across the system.

---

Build Procedures:

1. Install a local server (XAMPP, WAMP, Laragon) with PHP and MySQL.
2. Clone the GitHub repository:
   git clone https://github.com/seu-usuario/seu-repositorio.git

3. Move the project folder to your server's directory (e.g., `htdocs` for XAMPP).

4. Start Apache and MySQL services.

5. Access the application through your browser:
   http://localhost/SEU_PROJETO/site.html

6. Create the necessary database and tables (if not yet done) as defined in the `/database` folder.

---

Problems:

-> Initial SPA navigation was pure HTML, now mixed with PHP links — full JavaScript SPA planned.
-> Admin Panel not yet implemented.
-> Integration with a real database is still in progress.

---

Comments:

The ADIMAX PET SHOP project has successfully evolved from mockups to a functional PHP-based system,
including login, registration, cart manipulation, and dynamic navigation.

Future steps will focus on creating a full Admin Panel, improving the JavaScript-based SPA experience,
and refining the user interface and backend interactions.

🧡 ADIMAX PET SHOP — Taking care of your pet like family!
=======
>>>>>>> 836198b (MIlestone 1)

+----------------+
|     Home       | (site.html)
+----------------+
       |
       |--> Login (login.html -> login_pagina.php)
       |
       |--> Products (produtos.html -> produtos.php) 
       |	Brinquedos para cães -> brinquedos.html; 
       |	Produtos de higiene -> higiene.html; 
       |	Roupinhas para cães -> roupas.html; 
       |	Arranhador pra gato -> arranhador_gato.html
       |
       |--> Register (register/register.php)
       |
       |--> Cart (carrinho/, update_carte.php, remove_item.php)
       |
       |--> Logout (sair.php)
       |
       |--> Admin Panel (Planned)

This navigation map reflects the functional routes of the current application
and prepares for future admin-exclusive management areas.

---

Planned Data to Store on the Server:

-> Customer and admin login credentials.
-> Product data: name, price, image, description.
-> Registered customer profiles and their shopping cart contents.
-> Purchase orders and sales history (Planned).

---

Comments About the Code:

-> Structured in HTML5 for markup, CSS3 for styling, and PHP for server-side logic.
-> Use of semantic HTML tags to enhance document clarity.
-> Header and footer components are modular and reused across pages.
-> PHP handles sessions for login/logout, cart state, and data flow.
-> CSS layouts apply Flexbox and Grid for responsive design.
-> Simple and intuitive navigation flow.

---

Test Plan:

- Manual testing to verify page loading and link navigation.
- Login and logout functions tested with valid and invalid credentials.
- Registration process tested with various data entries.
- Product cart tested for add, update, and remove actions.
- Compatibility verified with Chrome and Firefox.
- Responsive behavior checked on mobile and desktop using browser DevTools.

Future Plan:
-> Use Postman to test backend HTTP requests.
-> Implement Selenium for automated user flow testing.

---

Test Results:

- Login and registration forms validated successfully.
- Products display properly on the catalog page.
- Cart functionalities (add/update/remove) perform as expected.
- The layout adapts responsively to various screen sizes.
- Navigation links work correctly across the system.

---

Build Procedures:

1. Install a local server (XAMPP, WAMP, Laragon) with PHP and MySQL.
2. Clone the GitHub repository:
   git clone https://github.com/seu-usuario/seu-repositorio.git

3. Move the project folder to your server's directory (e.g., `htdocs` for XAMPP).

4. Start Apache and MySQL services.

5. Access the application through your browser:
   http://localhost/SEU_PROJETO/site.html

6. Create the necessary database and tables (if not yet done) as defined in the `/database` folder.

---

Problems:

-> Initial SPA navigation was pure HTML, now mixed with PHP links — full JavaScript SPA planned.
-> Admin Panel not yet implemented.
-> Integration with a real database is still in progress.

---

Comments:

The ADIMAX PET SHOP project has successfully evolved from mockups to a functional PHP-based system,
including login, registration, cart manipulation, and dynamic navigation.

Future steps will focus on creating a full Admin Panel, improving the JavaScript-based SPA experience,
and refining the user interface and backend interactions.

🧡 ADIMAX PET SHOP — Taking care of your pet like family!
