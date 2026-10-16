var listeProduits;
var panier= new Array();
const TAUX_TVA=0.19
/*function chargerZoneItem() {
    const xhr = new XMLHttpRequest();
    // On suppose qu'on fait appel à un API qui retourne le contenu du fichier produits.json
    const url = "produits.json";

    // Configuration de la requête asynchrone (True)
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        // Vérification du cycle de vie de la requête
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var reponse = xhr.responseText;
                var objJSON = JSON.parse(reponse);
                listeProduits = objJSON.liste; // Stockage dans la variable globale

                // Récupérer le panier sauvegardé dans les cookies (si existant)
                //recupererPanierCookie();

                // Affichage dynamique des items
                afficherListeProduits();
            } else {
                alert("❌ Erreur lors de la récupération des données (Status " + xhr.status + ")");
            }
        }
    };

    xhr.send();
}*/

async function chargerZoneItem() {
    const url = "produits.json";

    try {
        // Envoi de la requête GET
        const response = await fetch(url);

        // Vérification si la réponse est correcte (status entre 200 et 299)
        if (!response.ok) {
            throw new Error("Status " + response.status);
        }

        // Extraction et analyse automatique du JSON
        const objJSON = await response.json();

        listeProduits = objJSON.liste; // Stockage dans la variable globale

        // Récupérer le panier sauvegardé dans les cookies (si existant)
        //recupererPanierCookie();

        // Affichage dynamique des items
        afficherListeProduits();

    } catch (error) {
        // Gestion des erreurs réseau ou de statut HTTP incorrect
        alert("❌ Erreur lors de la récupération des données (" + error.message + ")");
    }
}


function afficherListeProduits() {
    listeProduits.forEach(function(item) {
        var description = item.description;
        var image = item.image;
        var prix = item.prix;
        var noeudDivItem = document.createElement("div");
        noeudDivItem.setAttribute("class", "item");

        var noeudImage = document.createElement("img");
        noeudImage.setAttribute("class", "imageItem");
        noeudImage.setAttribute("src", image);
        noeudDivItem.appendChild(noeudImage);
        
        noeudImage.addEventListener("click", function () {
            afficherDetail(item);
        });

        var noeudDescription = document.createElement("div");
        noeudDescription.setAttribute("class", "description");
        noeudDescription.appendChild(document.createTextNode(description));
        noeudDivItem.appendChild(noeudDescription);

        var noeudPrix = document.createElement("div");
        noeudPrix.setAttribute("class", "prix");
        noeudPrix.appendChild(document.createTextNode(prix));
        noeudDivItem.appendChild(noeudPrix);

        var noeudBtnAjouter = document.createElement("div");
        noeudBtnAjouter.setAttribute("class", "ajouter");
        noeudBtnAjouter.appendChild(document.createTextNode("Ajouter"));
        noeudDivItem.appendChild(noeudBtnAjouter);
    
    
        noeudBtnAjouter.addEventListener("click", function(){
        var ligneCommande = {produit : item, quantite : "1" };
        ajouterItem(ligneCommande);
        });
        document.getElementById("zoneContenuItem").appendChild(noeudDivItem);
    });
}

function ajouterItem(ligneCommande){
    panier.push(ligneCommande);
    enregistrerPanier(); 
    var quantite = ligneCommande.quantite;
    var nbItemPanier = parseInt(document.getElementById("idItem").innerHTML);
    nbItemPanier += parseInt(quantite);
    document.getElementById("idItem").innerHTML = nbItemPanier;
}
function afficheFacture(){
    document.getElementById("zoneContenuItem").style.display = "none";
    document.getElementById("zoneContenuFacture").style.display = "block";
    document.getElementById("zoneContenuFacture").style.height = "85%";

    var sousTotal = 0;
    var noeudTBody = document.querySelector("#corpsTableau");
    noeudTBody.innerHTML = "";
    panier.forEach(function(ligneCommande, index){
        var nomDeProduit = ligneCommande.produit.description;
        var quantite = ligneCommande.quantite;
        var prix = ligneCommande.produit.prix;
        sousTotal += parseInt(quantite) * parseFloat(prix);

        var noeudTr = document.createElement("tr");
        var noeudTd1 = document.createElement("td");
        var contenuTd1 = document.createTextNode(nomDeProduit);
        noeudTd1.appendChild(contenuTd1);
        noeudTr.appendChild(noeudTd1);

        var noeudTd2 = document.createElement("td");
        var noeudTd21 = document.createElement("input");
        noeudTd21.setAttribute("type", "text");
        noeudTd21.setAttribute("value", quantite);
        noeudTd21.addEventListener("change", function(){
            var nouvelleQte = this.value;
            panier[index].quantite = nouvelleQte;
            enregistrerPanier();
            calculerFacture();
        });
        noeudTd2.appendChild(noeudTd21);
        noeudTr.appendChild(noeudTd2);

        var noeudTd3 = document.createElement("td");
        var contenuTd3 = document.createTextNode(prix);
        noeudTd3.appendChild(contenuTd3);
        noeudTr.appendChild(noeudTd3);

        noeudTBody.appendChild(noeudTr);
        
    });
    var totalTVA = sousTotal * TAUX_TVA;
    var total = sousTotal + totalTVA;
    document.querySelector("#idSousTotal").innerHTML = sousTotal.toFixed(2) + " $";
    document.querySelector("#idTVA").innerHTML = totalTVA.toFixed(2) + " $";
    document.querySelector("#idTotal").innerHTML = total.toFixed(2) + " $";
}

function calculerFacture(){
    var sousTotal = 0;
    var totalQte = 0;
    panier.forEach(function(ligneCommande){
        /*
          un petit rappel pour la ligneCommande
          ligneCommande = {produit : pr, quantite : qte};
        */
        var quantite = ligneCommande.quantite;
        var prix = ligneCommande.produit.prix;
        sousTotal += parseInt(quantite) * parseFloat(prix);
        totalQte += parseInt(quantite);
    });
    var totalTVA = sousTotal * TAUX_TVA;
    var total = sousTotal + totalTVA;
    document.querySelector("#idSousTotal").innerHTML = sousTotal.toFixed(2) + " $";
    document.querySelector("#idTVA").innerHTML = totalTVA.toFixed(2) + " $";
    document.querySelector("#idTotal").innerHTML = total.toFixed(2) + " $";

    //Modification du panier
    document.getElementById("idItem").innerHTML = totalQte;
}
function afficherDetail(unProduit){
    document.querySelector("#zoneDetail").style.display = "block";
    document.querySelector("#uneImage").src = unProduit.image;
    document.querySelector("#uneDescription").innerHTML = unProduit.description;
    document.querySelector("#unPrix").innerHTML = unProduit.prix;
    document.querySelector("#unDetail").innerHTML = unProduit.details;

    document.querySelector("#unAjout").addEventListener("click", function(){
        var qte = document.querySelector("#txtQuantite").value;
        var ligneCommande = {produit : unProduit, quantite : qte};
        ajouterItem(ligneCommande);
        document.querySelector("#zoneDetail").style.display = "none";
        document.querySelector("#txtQuantite").value = "1";
    });
}

function enregistrerPanier(){
    if(typeof(localStorage) == "undefined"){
        alert("votre navigateur ne supporte pas les cookies");
        return;
    }
    localStorage.setItem("panier", JSON.stringify(panier));
}
function fermerDialogue(){
    document.querySelector("#zoneDetail").style.display = "none";
}
document.getElementById("panier").addEventListener("click", afficheFacture);
window.onload = chargerZoneItem;