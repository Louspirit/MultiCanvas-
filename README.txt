<<--- CANVAS COLLABORATIF� --->>

Projet : Canvas Collaboratif�. Apr�s le tr�s renomm� MiniCraft�, d�couvrez le canvas collaboratif : un paint-like con�u en javascript, 
qui vous permet de dessiner de fa�on amusante avec vos amis!

[- Proc�dure -]
Pour d�marrer le jeu, il faut installer node js. Placez vous dans le r�pertoire du jeu et effectuez la commande 'node server.js'.
Il vous suffit de lancer un navigateur (Chrome est conseill� pour la selection de couleur) � l'adresse localhost:3000. Pour que vos amis vous rejoignent,
il suffit qu'ils soient connect�s sur le m�me r�seau et qu'ils aillent � l'adresse <votre-ip>:3000 .

[- Fonctionnalit�s -]
Une fois le jeu d�marr� : Vous verrez une page blanche avec une barre de menu en haut de page. Cette barre de boutons vous permet de customiser votre pinceau.
Vous pouvez dessiner sur toute la page (except� sur les boutons!), simplement en cliquant sur le bouton gauche de votre souris. 

Voici les diff�rents pinceaux fournis :
 - Le crayon : trace un simple trait fin.
 - Le pinceau : trace un trait plus �pais et rond.
 - Les points : dessinent des points de taille al�atoire.
 - Le brouillon : � vous de le d�couvrir :)
 - La gomme : permet de gommer sur le dessin.

Choisir dans le selecteur de couleur(sous chrome) ou entrer une couleur en anglais dans le champ(FireFox) permet de d�finir la couleur des styles cit�s pr�c�demment.

Cliquer sur le bouton Tout Effacer r�initialisera une page blanche. Attention : cliquer sur ce bouton effacera �galement les pages de vos amis connect�s.  

Vous pouvez � tout moment modifier la taille de votre fen�tre, le dessin sera reform� pour toujours appara�tre en entier dans la fen�tre.

La magie de Canvas Collaboratif� est que les dessins que vous r�aliserez se refl�teront � l'identique sur les �crans de vos amis (de m�me leur dessin pour vous), en temps r�el!
Afin que chacun ne soit pas g�n�, son dessin appara�tra par dessus celui des autres.


[- Contenu de l'archive -]
-server.js : Le serveur est l'interm�diaire entre tous les clients. Il attribue un id � chaque nouvel arrivant. Lorsque que quelqu'un dessine, il envoit l'information au server,
qui notifie tous les clients que la personne avec tel id a dessin�.

-index.html : La page web qui contient le menu avec les boutons et les diff�rents canvas. Chaque fois que quelqu'un de nouveau dessine, un �l�ment html5 Canvas est cr�� et
lui sera d�di�. Pour tout ce qui est traitement : la page inclut le fichier de script canvas.js.

-canvas.js : La page javascript qui g�re le dessin, l'envoi et la r�ception de donn�es du serveur. La plupart des op�rations effectu�es par l'utilisateur 
sont signal�es au serveur (Tout effacer, commence � dessiner, dessine, a arr�t� de dessiner). Lors de cet envoi, les informations suivantes sont jointes : id, 
type de pinceau utilis�, couleur, coordonn�es du dessin). A la reception, on interpr�te le type d'op�ration � l'aide de l'argument 'evenement'. Gr�ce � l'id communiqu�, 
l'op�ration pourra �tre effectu�e sur le canvas correspondant. Chaque client poss�de un �ventail de palettes, une palette �tant attribu�e � chaque client. La palette contient des 
informations telles que le type de pinceau, la couleur, la position actuelle, etc... Lorsqu'un nouvel arrivant dessine, une palette et un canvas sont cr��s pour lui et lui sont d�di�s.
Ces �l�ments sont mis � jour d�s que le serveur notifie d'une activit� de la part de ce client.

-node_modules, composants essentiels au fonctionnement de node js.

Test� sur Chrome, Firefox (sous Windows).
<--- BY GUILLAUME ESCARIEUX --- FIL A2 --- EMN ---> 