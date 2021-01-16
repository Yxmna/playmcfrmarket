var url = "https://spreadsheets.google.com/feeds/list/1fpwqMhe0DqP3LGV7mj6PcICzteFacqnhgXGzXdZkyss/4/public/values?alt=json";
var imgs = [];
var version = "0.4";
var prices = [];
var shops = [];
var types = [];
var fr = new Object;
var en = new Object;
var effects = ["Potion", "Tipped Arrow", "Splash Potion"];
var tools = ["Sword", "Axe", "Shovel", "Hoe", "Trident", "Bow", "Crossbow", "Pickaxe", "Fishing Rod", "Shears", "Turtle Helmet", "Elytra"];

console.log("version: " + version);

fetch("https://yxmna.github.io/mcapi/lang/fr_fr_simply.json").then(function(response) {
  return response.json();
}).then(function(obj) {
  fr = obj;
});

fetch("https://yxmna.github.io/mcapi/lang/en_us_simply.json").then(function(response) {
  return response.json();
}).then(function(obj) {
  en = obj;
});

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(obj) {
    base = obj.feed.entry;
    // db.sort(function(a, b) {
    //   return a.gsx$ID.$t - b.gsx$ID.$t;
    // });
    base.sort(function(a, b) {
      if (fr[a.gsx$produit.$t.split(" ").join("_").toLowerCase()] < fr[b.gsx$produit.$t.split(" ").join("_").toLowerCase()]) return -1;
      if (fr[a.gsx$produit.$t.split(" ").join("_").toLowerCase()] > fr[b.gsx$produit.$t.split(" ").join("_").toLowerCase()]) return 1;
      // if (a.gsx$id.$t < b.gsx$id.$t) return -1;
      // if (a.gsx$id.$t > b.gsx$id.$t) return 1;
      return 0;
    });
    pre();
    load();
  });



// --------------------------------------------------------------------------------------------------------PRELOAD
function pre() {
  document.getElementById("search").value = "";
  base.forEach((item, i) => {
    var img = new Image();
    console.log(item.gsx$produit.$t);
    if (String(tools).includes(item.gsx$produit.$t.split(" ").pop()) && item.gsx$caracteristique.$t) {
      img.src = "https://yxmna.github.io/mcapi/img/enchanted_" + en[item.gsx$produit.$t.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
    } else {
      img.src = "https://yxmna.github.io/mcapi/img/" + en[item.gsx$produit.$t.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
    }
    img.onerror = function() {
      // img.src = "https://yxmna.github.io/mcapi/img/missing.png";
    };
    imgs[item.gsx$id.$t] = img;
  });
}


// --------------------------------------------------------------------------------------------------------LOAD
function load(name) {
  document.getElementById("items").innerHTML = "";

  prices, types, shops = [];
  var db = base;
  if (name) db = db.filter(item => {
    if (fr[item.gsx$produit.$t.toLowerCase().split(" ").join("_")]) {
      if (fr[item.gsx$produit.$t.toLowerCase().split(" ").join("_")].toLowerCase().includes(name) || item.gsx$produit.$t.toLowerCase().includes(name)) return item;
    } else {
      if (item.gsx$produit.$t.toLowerCase().includes(name)) return item;
    }
  });

  if (document.getElementById("prices").value) db = db.filter(item => item.gsx$nomprix.$t.includes(document.getElementById("prices").value));
  if (document.getElementById("shops").value) db = db.filter(item => item.gsx$commerce.$t.includes(document.getElementById("shops").value));
  if (document.getElementById("types").value) db = db.filter(item => item.gsx$typevente.$t.includes(document.getElementById("types").value));






  db.forEach((item, i) => {

    if (!types.includes(item.gsx$typevente.$t) && item.gsx$typevente.$t) {
      types.push(item.gsx$typevente.$t);
    }
    if (!shops.includes(item.gsx$commerce.$t) && item.gsx$commerce.$t) {
      shops.push(item.gsx$commerce.$t);
    }
    if (!prices.includes(item.gsx$nomprix.$t) && item.gsx$nomprix.$t) {
      prices.push(item.gsx$nomprix.$t);
    }

    var article = document.createElement("article");
    var img = document.createElement("img");
    var title = document.createElement("h2");
    var price = document.createElement("h3");
    var img_price = document.createElement("img");
    var line1 = document.createElement("h4");
    var line2 = document.createElement("h4");
    var br = document.createElement("br");

    img = imgs[item.gsx$id.$t];

    if (effects.includes(item.gsx$produit.$t) && item.gsx$caracteristique) {
      var extra1 = item.gsx$caracteristique.$t.split(" ");
      var extra2 = "";
      if (extra1.length > 1) {
        extra2 = extra1.pop();
      }
      title.innerHTML = item.gsx$quantiteproduit.$t + " " + fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase() + ".effect." + extra1.join("_").toLowerCase()] + " " + extra2;

    } else if (tools.includes(item.gsx$produit.$t) && item.gsx$caracteristique) {





    } else if ("Filled Map".includes(item.gsx$produit.$t) && item.gsx$caracteristique) {

      var extra1 = item.gsx$caracteristique.$t.split(" ");
      var extra2 = extra1.pop();
      if (!extra2.startsWith("https://")) {
        extra1 = extra1.join(" ") + String(extra2);
        extra2 = "";
      }


      console.log(extra1);
      console.log(extra2);
      title.innerHTML = item.gsx$quantiteproduit.$t + " " + fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase()] + " " + item.gsx$caracteristique.$t;







    } else {
      if (fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase()]) {
        title.innerHTML = item.gsx$quantiteproduit.$t + " " + fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase()];
      } else {
        title.innerHTML = item.gsx$quantiteproduit.$t + " *" + item.gsx$produit.$t;
      }
    }

    line1.innerHTML = item.gsx$commerce.$t;
    line2.innerHTML = item.gsx$proprietaire.$t + ", " + item.gsx$typevente.$t.toLowerCase();

    if (item.gsx$quantiteprix.$t == 0) {
      price.innerHTML = "Gratuit";
    } else {
      price.innerHTML = item.gsx$quantiteprix.$t + " ";
      img_price.src = "https://yxmna.github.io/mcapi/img/" + en[item.gsx$nameprice.$t.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
      price.appendChild(img_price);
      price.innerHTML = price.innerHTML + " " + item.gsx$nomprix.$t;
    }

    img.id = item.gsx$id.$t;
    img.onclick = async function() {
      click(this.id);
    }
    title.id = item.gsx$id.$t;
    title.onclick = async function() {
      click(this.id);
    }

    article.classList.add(item.gsx$produit.$t.split(" ").join("_").toLowerCase());

    article.appendChild(img);
    article.appendChild(br);
    article.appendChild(title);
    article.appendChild(price);
    article.appendChild(line1);
    article.appendChild(line2);

    document.getElementById("items").appendChild(article);
  });

  if (document.getElementById("prices").length == 1) {
    prices.forEach((item, i) => {
      var option = document.createElement("option");
      option.innerHTML = item;
      option.value = item;
      document.getElementById("prices").appendChild(option);
    });
    shops.forEach((item, i) => {
      var option = document.createElement("option");
      option.innerHTML = item;
      option.value = item;
      document.getElementById("shops").appendChild(option);
    });
    types.forEach((item, i) => {
      var option = document.createElement("option");
      option.innerHTML = item;
      option.value = item;
      document.getElementById("types").appendChild(option);
    });
  }

}

function search() {
  load(document.getElementById("search").value.toLowerCase());
}


// --------------------------------------------------------------------------------------------------------CLICK
function click(x) {
  console.log(x);
}
