//Nombre de cartes.
var nombreImages = null;
//Nombre de cartes découvertes.
var nombreReussite = null;
//Heure de démarrage du jeu. Initialisée lors du premier clic.
var heureDebut = null;
//Temps maximal en ms pour découvrir les cartes.
var tempsMaximal = null;
//Permet de determiner le début de la partie.
var partieCommencee = null;

//Initialisation des variables.
initialisation();

//Permet d'afficher les résultats.
afficherResultats();

//Permet de distribuer les cartes.
distribuerCartes();



/**
* Cette fonction permet d'initialiser les variables.
*/
function initialisation()
{
	nombreReussite = 0; // 0 carte découverte.
	tempsMaximal = 300000;  //5 minutes.
	partieCommencee = false; //La partie n'a pas encore commencée.
	nombreImages = 28; //28 cartes seront distribuées.
}

/**
* Cette fonction gère les actions à réaliser lorsque le joueur perd.
*/
function perdu()
{
	console.log('Entrée dans la fonction perdu().');
	alert('Vous avez perduuuuu !');
	//On recharge la page.
	window.location.reload();
}

/**
* Cette fonction gère les actions à réaliser lorsque le joueur gagne.
*/
function gagne(temps)
{
	console.log('Entrée dans la fonction gagne(temps). temps = ' . temps);
	//On insère le temps en bdd.
	insererResultat(temps);
	alert('Vous avez gagnéééééééééé !');
	//On recharge la page.
	window.location.reload();
}

/**
* Cette fonction gère l'évolution de la barre de progression.
*/
function miseAJourBarreDeProgression() 
{
	console.log('Entrée dans la fonction miseAJourBarreDeProgression().');
	//Permet d'enregistrer l'heure de début de la mise à jour. 
        var now = new Date();
	//On fait la différence entre l'heure de début du jeu et l'heure de mise à jour.
        var timeDiff = now.getTime() - heureDebut.getTime();
	//On calcul le pourcentage de temps déja écoulé avant la fin.
	//Ce pourcentage sera utilisé pour faire évoluer la barre de progression.
        var perc = Math.round((timeDiff/tempsMaximal)*100);
	
	//Si le pourcentage est supérieur à 100 alors on le reaffecte à 100 
	//afin que le rouge de la progression ne dépasse pas les bordures.
	if(perc>100)
	{
		perc = 100;
	}
	
	//On fait évoluer la barre de progression.
	$('#progressionBarre').css("width", perc + "%");
    
	//Si le nombre de cartes trouvées est égal au nombre de cartes distribuées avant la fin du temps maximal.
	if(perc < 100 && nombreImages == nombreReussite)
	{
		//On exécute les actions à réaliser lorsque le joueur gagne.
		gagne(timeDiff);		
	}
	//Si le nombre de cartes trouvées est différent du nombre de cartes distribuées lorsque le temps max est terminé.
	else if(perc >= 100 && nombreImages != nombreReussite)
	{
	        //On exécute les actions à réaliser lorsque le joueur perd.
		perdu();
	}
	//Sinon on réexécute cette fonction dans 500 ms afin de faire progresser la barre de progression.
	else
	{
		 setTimeout(miseAJourBarreDeProgression, 500);
	}
}

/**
* Cette fonction permet d'insérer un résultat dans la bdd.
*/
function insererResultat(temps)
{
	console.log('Entrée dans la fonction insererResultat(temps). temps = ' . temps);
	//Permet d'enregistrer le temps effectué par le joueur gagnant. (Utilisation de JQuery & Ajax)
	$.ajax({
	   url : 'TimeDao.php', // La ressource ciblée.
	   type : 'POST', // Le type de la requête HTTP.
	   data : 'time=' + temps // Un paramètre.
	});
}

/**
* Cette fonction permet d'afficher les résultats.
*/
function afficherResultats()
{
	console.log('Entrée dans la fonction afficherResultats().');
	//Permet de charger la div avec l'identifiant 'top' avec les meilleurs resultats.  (Utilisation de JQuery & Ajax)
	$( "#top" ).load( "TimeDao.php");
}

/**
* Cette fonction permet de distribuer les cartes.
*/
function distribuerCartes()
{
	console.log('Entrée dans la fonction distribuerCartes().');
	//Chaque image...
	for(var image=1;image<=nombreImages/2;image++)
	{
		//...doit être positionnée deux fois de manière aléatoire.
		for(var carte=1;carte<=2;carte++)
		{
			do
			{
				//Recherche d'une position aléatoire.
				var position = Math.floor(Math.random() * nombreImages + 1);
				//Récupération de l'image chargée à cette position.
				var objetImage = document.getElementById('i' + position);	
			}while(objetImage.src != '');//Si une image est déja chargée alors on recommence la manoeuvre 
						     //jusqu'a ce que l'on trouve une position vide.
			//Une fois une position vide trouvée on charge une image dans celle ci.
			objetImage.src = 'images/' + image + '.png';
			//Et on rend invisible l'image.
			objetImage.style.display = 'none';
		}
	}
}

//Variable permettant d'enregistrer la première carte retournée d'une paire à tester.
var carteUneRetournee = null;
//Variable permettant d'enregistrer la deuxième carte retournée d'une paire à tester.
var carteDeuxRetournee = null;


/**
* Fonction appelée lors d'un clic sur une carte.
*/
function onClickCarte(image)
{
	console.log('Entrée dans la fonction onClickCarte(image).');
	
	//Si c'est la première fois que l'on retourne une carte alors on démarre le jeu
	if(!partieCommencee)
	{
		//On enregistre l'heure de début.
		heureDebut = new Date();
		//On démarre la barre de progression.
		miseAJourBarreDeProgression();
		//partieCommencee est mis à true pour indiquer que le jeu est commencé.
		partieCommencee = true;
	}
	//On récupère une variable représentant l'image sur laquelle l'utilisateur a cliqué.
	var objetImage = document.getElementById(image);	
	//On regarde si c'est la première carte de la paire de carte à tester.
	//Et que la carte selectionné est invisible.
	if(carteUneRetournee == null && objetImage.style.display == 'none')
	{
		//On stocke les informations de cette carte dans la variable 'carteUneRetournee' afin 
		//de l'analyser lorsque deux cartes seront retournées.
		carteUneRetournee = objetImage;
		//On la rend visible.
		carteUneRetournee.style.display = '';
	}
	//On regarde si c'est la deuxième carte de la paire de carte à tester.
	//Et que la carte selectionné est invisible.
	else if(carteDeuxRetournee == null && objetImage.style.display == 'none')
	{
		//On stocke les informations de cette carte dans la variable 'carteDeuxRetournee' afin de l'analyser.
		carteDeuxRetournee = objetImage;
		//On la rend visible.
		carteDeuxRetournee.style.display = '';
		//On attend une demi seconde avant d'analyser les deux cartes.
		setTimeout(isIdentique, 500);
	}
}

/**
* Fonction permettant de vérifier si deux cartes sont identiques ou non
* et d'effectuer les actions nécessaires selon le résultat.
*/
function isIdentique()
{
		console.log('Entrée dans la fonction isIdentique()');
		
		//Si les deux cartes retournées sont identiques...
		if(carteUneRetournee.src == carteDeuxRetournee.src)
		{
			//On incrémente de 2 le nombre de cartes découvertes.
			nombreReussite += 2;
		}
		else
		{
			//sinon les deux cartes retournées redeviennent invisibles.
			carteUneRetournee.style.display = 'none';
			carteDeuxRetournee.style.display = 'none';
		}
		
		//On remet les variables permettant d'identifier les cartes en cours d'analyse à null.
		carteUneRetournee = null;
		carteDeuxRetournee = null;
}
