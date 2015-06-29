<<--- CANVAS COLLABORATIF™ --->>

Projet : Canvas Collaboratif™. Après le très renommé MiniCraft™, découvrez le canvas collaboratif : un paint-like conçu en javascript, 
qui vous permet de dessiner de façon amusante avec vos amis!

[- Procédure -]
Pour démarrer le jeu, il faut installer node js. Placez vous dans le répertoire du jeu et effectuez la commande 'node server.js'.
Il vous suffit de lancer un navigateur (Chrome est conseillé pour la selection de couleur) à l'adresse localhost:3000. Pour que vos amis vous rejoignent,
il suffit qu'ils soient connectés sur le même réseau et qu'ils aillent à l'adresse <votre-ip>:3000 .

[- Fonctionnalités -]
Une fois le jeu démarré : Vous verrez une page blanche avec une barre de menu en haut de page. Cette barre de boutons vous permet de customiser votre pinceau.
Vous pouvez dessiner sur toute la page (excepté sur les boutons!), simplement en cliquant sur le bouton gauche de votre souris. 

Voici les différents pinceaux fournis :
 - Le crayon : trace un simple trait fin.
 - Le pinceau : trace un trait plus épais et rond.
 - Les points : dessinent des points de taille aléatoire.
 - Le brouillon : à vous de le découvrir :)
 - La gomme : permet de gommer sur le dessin.

Choisir dans le selecteur de couleur(sous chrome) ou entrer une couleur en anglais dans le champ(FireFox) permet de définir la couleur des styles cités précédemment.

Cliquer sur le bouton Tout Effacer réinitialisera une page blanche. Attention : cliquer sur ce bouton effacera également les pages de vos amis connectés.  

Vous pouvez à tout moment modifier la taille de votre fenêtre, le dessin sera reformé pour toujours apparaître en entier dans la fenêtre.

La magie de Canvas Collaboratif™ est que les dessins que vous réaliserez se reflèteront à l'identique sur les écrans de vos amis (de même leur dessin pour vous), en temps réel!
Afin que chacun ne soit pas gêné, son dessin apparaîtra par dessus celui des autres.


[- Contenu de l'archive -]
-server.js : Le serveur est l'intermédiaire entre tous les clients. Il attribue un id à chaque nouvel arrivant. Lorsque que quelqu'un dessine, il envoit l'information au server,
qui notifie tous les clients que la personne avec tel id a dessiné.

-index.html : La page web qui contient le menu avec les boutons et les différents canvas. Chaque fois que quelqu'un de nouveau dessine, un élément html5 Canvas est créé et
lui sera dédié. Pour tout ce qui est traitement : la page inclut le fichier de script canvas.js.

-canvas.js : La page javascript qui gère le dessin, l'envoi et la réception de données du serveur. La plupart des opérations effectuées par l'utilisateur 
sont signalées au serveur (Tout effacer, commence à dessiner, dessine, a arrété de dessiner). Lors de cet envoi, les informations suivantes sont jointes : id, 
type de pinceau utilisé, couleur, coordonnées du dessin). A la reception, on interprète le type d'opération à l'aide de l'argument 'evenement'. Grâce à l'id communiqué, 
l'opération pourra être effectuée sur le canvas correspondant. Chaque client possède un éventail de palettes, une palette étant attribuée à chaque client. La palette contient des 
informations telles que le type de pinceau, la couleur, la position actuelle, etc... Lorsqu'un nouvel arrivant dessine, une palette et un canvas sont créés pour lui et lui sont dédiés.
Ces éléments sont mis à jour dès que le serveur notifie d'une activité de la part de ce client.

-node_modules, composants essentiels au fonctionnement de node js.

Testé sur Chrome, Firefox (sous Windows).
<--- BY GUILLAUME ESCARIEUX --- FIL A2 --- EMN ---> 