var listeProduits;
var panier= new Array();
const TAUX_TVA=0.19

async function changerZoneItem() {
    try {
        const reponse = await fetch("./produits.json");

        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }

        const donnees = await reponse.json();

        if (!Array.isArray(donnees.liste)) {
            throw new Error("Le fichier JSON ne contient pas de liste de produits valide.");
        }

        listeProduits = donnees.liste;
        afficherListeProduits();
    } catch (erreur) {
        console.error("Impossible de charger les produits :", erreur);
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
// ...existing code...
function continuerDeMagasiner() {
    document.getElementById("zoneContenuFacture").style.display = "none";
    document.getElementById("zoneContenuItem").style.display = "block";
}

document.getElementById("continuerMagasiner")
    .addEventListener("click", continuerDeMagasiner);

// ...existing code...
window.onload = changerZoneItem;