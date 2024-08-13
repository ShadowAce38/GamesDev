const contenantChoixOrdi = document.getElementById('choix-ordi');
const contenantChoixUser = document.getElementById('choix-user');
const contenantResultat = document.getElementById('resultat');

const choixPossibles = document.querySelectorAll('button');
let choixUser;
let resultat;
let choixOrdi;

// Événement 'click sur les boutons'
choixPossibles.forEach(choixPossible => choixPossible.addEventListener('click', (e) => {
    // Récupération de l'ID du bouton cliqué
    choixUser = e.target.id;
    // Ajout de l'image qui correspond au choix
    contenantChoixUser.innerHTML = `<img src="${choixUser}.png">`;
    generer_choix_ordi();
    verifcation();
}));

// Fonction pour générer le choix de l'ordinateur
function generer_choix_ordi() {
    const random = Math.floor(Math.random() * 3) + 1; // Générer des nombres compris entre 1 et 3
    if (random === 1) { // Si le random est égal à 1
        choixOrdi = "pierre";
    }
    if (random === 2) { // Si le random est égal à 2
        choixOrdi = "feuille";
    }
    if (random === 3) { // Si le random est égal à 3
        choixOrdi = "ciseaux";
    }
    contenantChoixOrdi.innerHTML = `<img src="${choixOrdi}.png">`;
}

// Fonction pour vérifier si le joueur a gagné ou non
function verifcation() {
    if (choixUser === choixOrdi) {
        resultat = "Égalité !";
    }
    // Les cas où le joueur perd
    else if (choixUser === "pierre" && choixOrdi === "feuille") {
        resultat = "Perdu !";
    }
    else if (choixUser === "feuille" && choixOrdi === "ciseaux") {
        resultat = "Perdu !";
    }
    else if (choixUser === "ciseaux" && choixOrdi === "pierre") {
        resultat = "Perdu !";
    }
    // Les cas où le joueur gagne
    else if (choixUser === "pierre" && choixOrdi === "ciseaux") {
        resultat = "Gagné !";
    }
    else if (choixUser === "feuille" && choixOrdi === "pierre") {
        resultat = "Gagné !";
    }
    else if (choixUser === "ciseaux" && choixOrdi === "feuille") {
        resultat = "Gagné !";
    }
    contenantResultat.innerHTML = resultat;
}
