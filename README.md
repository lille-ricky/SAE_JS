## Author : Enrik Pashaj, TP1A

Suite à des contraintes de temps et au fait que j’aurais dû le faire en binôme (my bad), je vous présente cette implémentation du jeu Siam avec les mécanismes de base en place, en respectant la méthode MVC.  

## Choix techniques

### Architecture des classes
- **Modèle (Game.js)** : Gère la logique et l’état du jeu  
- **Vue (View.js)** : Gère la manipulation du DOM et la représentation visuelle  
- **Contrôleur (Controller.js)** : Coordonne les interactions utilisateur entre le Modèle et la Vue  

### Gestion des événements
- Utilisation d’événements DOM pour gérer les interactions utilisateur  
- Gestion des déplacements des pièces et des interactions avec le plateau  

### Retour visuel
Implémentation de classes CSS (`clCliquable`, `clSurvol`, `clSelection`) pour un retour utilisateur immédiat sur les mouvements valides et les sélections.

## Points à travailler

### Logique du jeu
- Implémentation de la condition de victoire  
- Validation complète des mécaniques de poussée  
- Gestion des cas limites pour les déplacements des pièces  
- Gestion des rotations des pièces  

### Interface utilisateur
- Amélioration des animations de déplacement des pièces  
- Ajout de messages d’état du jeu : pour l’instant, ils ne s’affichent que dans la console  
- Amélioration des visuels du sélecteur d’orientation  
- Gestion du placement des pièces  
- Ajout de fonctionnalités de sauvegarde de partie  
- La structure des tours de jeu est déjà implémentée, mais le manque de gestion du placement des pièces l’empêche de fonctionner correctement.  
- Finaliser l’implémentation de la condition de victoire  
- Améliorer les mécaniques de poussée et de rotation des pièces  

  


