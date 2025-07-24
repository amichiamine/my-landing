# Structure de depart : 
my-landing/
├── index.html
├── preview-*.html
├── admin-*.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   └── data/settings.json
└── README.md



# Explications du Fichier App.js : 


- loadSettings : récupère settings.json via fetch.
- applySettings : appelle renderHeader, renderBody, renderFooter si visible à true.
- renderHeader : injecte logo, menu, blocs dynamiques.
- renderBody : trie body.sections par order, rend chaque section (carousel, welcomeBanner, dynamicBlocks).
- renderCarousel : crée un carrousel simple avec vitesse, flèches stylées, pause au survol.
- renderWelcome : affiche le message de bienvenue selon style JSON.
- renderDynamicBlocks : pour header, body, footer, crée les blocs dynamiques selon layout et style.
- renderFooter : injecte le texte et les blocs dynamiques.
- bgCSS : utilitaire pour gérer solid, gradient ou image.
- initBurger : ferme le menu burger quand on clique sur un lien.

# Explications du fichier settings.json
- Le fichier settings.json centralise toutes les configurations de la landing page, de l’interface de personnalisation et des droits utilisateurs. est organisé en quatre parties principales :

- USERS
- roles : liste des rôles disponibles (admin, manager).
- credentials : dictionnaire des identifiants, stockés sous forme de hachage SHA-1 des mots de passe.
- pages : pages accessibles selon le rôle (3 pages pour les managers ; 4 pages pour l’admin, incluant la gestion des utilisateurs).
- HEADER
- visible : active/désactive l’affichage de l’en-tête.
- bg : type et valeur du fond (solid, gradient ou image).
- height : hauteur en pixels.
- logo : chemin vers le logo.
- siteName : texte du nom du site, police, taille, couleur et visibilité.
- menu :
- items : liste des liens du menu (label, URL, état actif).
- style : réglages de police, couleur, fond et arrondi pour chaque bouton.
- burger : activation du menu hamburger en mobile et couleur de l’icône.
- dynamicBlocks : blocs HTML libres ajoutables dans l’en-tête, chacun avec :
- un identifiant unique id
- le code HTML (html)
- un objet style (fond, police, couleur, padding, arrondi)
- un objet layout (ordre d’affichage, marges, padding, position CSS)
- la propriété visible pour afficher/cacher chaque bloc.
- BODY
- même structure de fond et hauteur globale que l’en-tête.
- sections : tableau ordonné de sections à rendre dans le corps (carousel, bandeau de bienvenue, blocs dynamiques), chacune comprenant :
- key : identifiant de la section
- visible/enabled : activation
- order : position dans l’ordre d’affichage
- layout : marges, padding et position CSS
- data : sous-configuration spécifique (style du carousel, images, textes, boutons, vitesse, flèches, pause au survol…).
- FOOTER
- structure identique à l’en-tête pour le fond, la hauteur et le texte central.
- dynamicBlocks : possibilité d’ajouter des blocs libres dans le pied de page selon le même modèle (id, html, style, layout, visible).

- Cette approche imbriquée rend le JSON à la fois lisible, extensible et universel : chaque nouvelle section, bloc ou réglage s’intègre simplement en ajoutant une nouvelle clé ou un nouvel objet sans modifier la logique de rendu.

# Explications des sections style.css :

- Variables CSS (:root) pour centraliser les couleurs et gradients.
- Reset global pour box-sizing et margins.
- Header : menu, logo, burger responsive selon media query 900px.
- Body : disposition Lego via display:grid; gap:2rem;.
- Carousel : style, conteneur, flèches (CSS classes).
- Welcome Banner : style isolé, bouton start-btn.
- Dynamic Blocks : blocs flexibles, arrondis et box-shadow.
- Footer : style simple, centré.
- Mobile : ajustement du carousel pour petits écrans <500px.

# - OBSERVATIONS: 
- Le style.css contient les styles par défaut (valeurs de référence) et gère la responsivité. Les valeurs dynamiques (couleurs, tailles, gradients…) injectées en inline par app.js à partir de settings.json. Concrètement :
- Dans style.css
- Vous définissez les conteneurs, structures et les className (par exemple .carousel-content, .welcome-banner, etc.)
- Vous mettez en place les media queries pour le responsive
- Dans app.js
- Vous lisez settings.json
- Pour chaque section et bloc, vous appliquez :
- js
- // Exemple pour le fond du header
el.style.background = bgCSS(cfg.header.bg.type, cfg.header.bg.value);
// Exemple pour la taille du siteName
siteNameEl.style.fontSize = cfg.header.siteName.size + "px";
siteNameEl.style.color    = cfg.header.siteName.color;
- // Etc.
- Ces styles inline prennent le pas sur les règles de style.css pour refléter immédiatement les paramètres JSON.
- Résultat
- style.css établit la mise en page et le comportement responsive
- app.js applique toutes les valeurs (couleurs, dimensions, arrondis…) via le JSON
- Vous obtenez une solution modulaire : modifiez settings.json → tout est mis à jour sans toucher au CSS

- En synthèse : le CSS gère la structure et le responsive, le JS lit la config JSON et injecte les valeurs dynamiques. 

# Explications Fichier index.html:

- Le <header> contient le logo, le nom du site, le menu et le contrôle burger pour mobile.
- Le <main> est laissé vide ; app.js injecte dynamiquement les sections (carrousel, welcome banner, blocs) en lisant settings.json.
- Le <footer> est également rempli par app.js d’après la configuration JSON.
- Le script inline à la fin ferme automatiquement le menu burger quand l’utilisateur clique sur un lien, améliorant l’expérience mobile.
- Tous les styles structurels et responsifs sont définis dans assets/css/style.css, tandis que app.js applique les valeurs dynamiques (couleurs, contenus, dimensions) depuis le JSON.

# Explications Fichier admin-header.html :

- La partie <header> est identique à la landing page, avec en plus :
- Un onglet Gestion utilisateurs (visible pour le rôle admin).
- Un bouton Déconnexion qui supprime la session dans localStorage.
- La sidebar liste les sous-pages d’admin accessibles.
- Le formulaire (#headerForm) regroupe tous les champs liés aux clés du JSON (bgType, height, siteName, etc.), ainsi qu’un bouton “Ajouter un bloc” pour les dynamicBlocks.
- L’aperçu live est chargé dans un <iframe> vers preview-header.html, qui lira et appliquera instantanément les nouvelles valeurs du JSON.
- Les scripts inline ferment le menu burger en mobile et gèrent la déconnexion sans dépendance externe.

# Explications Fichier admin-body.html:

- En-tête identique à admin-header.html, avec onglets et bouton Déconnexion.
- Formulaire #bodyForm
- Champs liés aux clés JSON : fond, hauteur, ordre des sections, carousel, welcomeBanner, blocs dynamiques.
- Tous les boutons d’enregistrement sont type="button" et traités dans admin-body.js.
- Media queries et structure définies dans style.css pour la responsivité.
- TinyMCE pour l’édition WYSIWYG du contenu HTML du bandeau de bienvenue.
- Aperçu live rendu dans preview-body.html chargé dans un <iframe>.
- Ajout dynamique de blocs via addBlock et affichage dans #bodyBlocksList (géré par le script JS).

# Explications admin-footer.html:

- Reprend le header admin commun pour navigation et déconnexion.
- Le formulaire #footerForm contient tous les champs pour piloter les clés JSON : fond, hauteur, texte, police, couleur, alignement, blocs dynamiques.
- Boutons et champs sont tous type="button" pour éviter la soumission native.
- L’aperçu live s’affiche dans un <iframe> pointant vers preview-footer.html.
- Les scripts inline ferment le menu burger en mobile et gèrent la déconnexion via localStorage.

# Explications Fichier preview-header.html:

- On fetch settings.json en AJAX.
- Si header.visible est false, on ne rend rien.
- On applique le fond et la hauteur, puis on injecte :
- Le logo et le nom du site (avec styles inline depuis JSON).
- Le markup du menu burger (checkbox+label) pour mobile.
- Les liens du menu, stylés inline.
- Les blocs dynamiques, triés par order et stylés (fond, padding, margin, position).
- Un petit script ferme automatiquement le menu burger au clic sur un lien.

# Explications Fichiers preview-body.html et preview-footer.html :

- Chaque preview lit settings.json via fetch et n’affiche que la section correspondante (header, body, footer).
- Les styles dynamiques (couleurs, fonds, dimensions, arrondis, espacements) sont appliqués en inline grâce aux fonctions utilitaires (bgCSS, etc.).
- Le corps (preview-body.html) utilise les mêmes fonctions de rendu que la landing page pour le carrousel, le banderole de bienvenue et les blocs dynamiques.
- Le pied de page (preview-footer.html) affiche le texte et les blocs dynamiques selon la configuration JSON.
- Aucun CSS supplémentaire n’est nécessaire ; tout l’aspect structurel et responsive est déjà géré par style.css.

# Les explications suivantes détaillent la structure et le fonctionnement de la page admin-users.html :

- En-tête commun

- Reprend exactement le <header> autres pages d’administration, avec :
- – Le logo et le titre “Admin StaGate LMS”
- – Le burger menu responsive (checkbox + <label class="burger">)
- – La navigation (<nav class="menu">) :

- Liens vers « En-tête », « Corps », « Pied de page », « Gestion utilisateurs », et retour site public
- Bouton « Déconnexion » qui supprime la clé stagate_admin_logged du localStorage et recharge la page
- Sidebar de navigation interne
- Balise <aside class="sidebar"> contenant des liens vers chaque sous-page d’administration
- L’onglet « Gestion utilisateurs » est marqué class="current"
- Tableau des utilisateurs existants
- <table id="usersTable"> avec en-tête (<thead>) pour les colonnes :
- – Utilisateur
- – Rôle
- – Actions (modifier / supprimer)

- Le <tbody> est initialement vide et sera rempli dynamiquement par le script admin-users.js
- Chaque ligne representera un compte défini dans settings.json (users.credentials)
- Formulaire d’ajout / modification
- Balise <form id="userForm">
- Champs :
- – #userLogin pour le nom d’utilisateur
- – #userPass pour le mot de passe en clair (sera hashé en SHA-1 via CryptoJS)
- – #userRole (select entre “manager” et “admin”)

- Bouton <button id="saveUser">Enregistrer</button> de type button pour éviter la soumission HTML classique

Scripts inline (footer de la page)

Fermeture automatique du burger menu au clic sur un lien (fonction document.querySelectorAll('.menu a')…)

Gestion de la déconnexion (même code que pour les autres pages d’admin)

Fonctionnement attendu sous admin-users.js

À l’ouverture, vérification de l’authentification (clé stagate_admin_logged) et affichage du login si nécessaire

Lecture de settings.json ou du localStorage pour récupérer users.credentials et users.roles

Remplissage du tableau : pour chaque paire login/hash, ajouter une ligne avec :
– Le nom d’utilisateur
– Le rôle (déterminé via settings.pages)
– Boutons « Modifier » / « Supprimer »

Au clic « Modifier », pré-remplir le formulaire avec les valeurs existantes

Au clic « Enregistrer »,
– Calcul du SHA-1 du mot de passe saisi (CryptoJS.SHA1)
– Mise à jour des objets users.credentials et users.pages dans la configuration
– Enregistrement dans localStorage (ou export JSON)
– Actualisation du tableau et de l’aperçu live le cas échéant

- Cette page agit comme un véritable mini-CRM côté client pour la gestion des comptes, s’intégrant de façon transparente à l’architecture Lego fondée sur settings.json.

# Explications Fichier admin-users.js :

- loadUsersConfig / saveUsersConfig : gèrent la partie users du JSON stocké en localStorage.
renderUsersTable() : reconstruit le tableau <tbody> de tous les comptes à partir de credentials et pages.
startEditUser(login) : pré-remplit le formulaire pour modification (nom et rôle). Le mot de passe reste vide (à changer si nécessaire).
deleteUser(login) : supprime la paire credentials[login] et retire l’utilisateur de tous les rôles.
saveUser() : lit le formulaire pour créer ou mettre à jour un compte :
Hash SHA-1 du mot de passe si fourni (via CryptoJS.SHA1).
Ajout dans le rôle sélectionné (users.pages[role]).
Authentification : la page ne fonctionne que si stagate_admin_logged === "1" dans localStorage.
Bindings DOM : attache les handlers aux boutons « Modifier », « Supprimer » et « Enregistrer ».
- Cette page offre une interface CRUD complète pour vos utilisateurs (admin et manager) directement depuis l’admin.