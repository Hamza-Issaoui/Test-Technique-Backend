Voici les étapes à suivre pour exécuter l'application :

1- Créez une base de données MongoDB nommée "dbTest-technique".

2- Clonez le dépôt avec la commande;    git clone https://github.com/Hamza-Issaoui/Test-Technique-Backend.git

3- Installez les dépendances avec la commande:    npm install

4- Lancez le serveur avec la commande:   npm run start

5- Structure du Projet

backend/
│
├─ Config/            # Fichiers de configuration (DB)
├─ Controllers/       # Logique métier pour les entités (users, articles, comments)
├─ Middlewares/       # Authentification, validation
├─ Models/            # Schémas Mongoose pour MongoDB
├─ Routes/            # Définition des endpoints API (articleRouter, authRouter, ...)
├─ Sockets/           # Gestion des événements Socket.IO
├─ uploads/           # Fichiers téléchargés par l'utilisateur
├─ server.js          # Point d'entrée du serveur HTTP + Socket.IO
├─ package.json       # Dépendances et scripts
├─ .env               # Variables d'environnement (non commit)
└─ README.md          # Documentation du projet


⚙️ Choix techniques

Node.js & Express : API REST rapide et modulable.

MongoDB & Mongoose : base NoSQL flexible pour les commentaires imbriqués.

JWT : authentification sécurisée.

Socket.IO : notifications temps réel pour commentaires et réponses.

sanitize-html : protection contre les injections XSS.

Structure MVC : séparation claire entre routes, contrôleurs et modèles pour maintenir la lisibilité et la maintenabilité.

