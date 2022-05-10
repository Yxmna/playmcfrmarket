const items_url = "https://api.airtable.com/v0/appyIbyBTngKp9P86/Items";
const shops_url = "https://api.airtable.com/v0/appyIbyBTngKp9P86/Shops";
const fetch_option = {
  headers: {
    "Authorization": "Bearer keyTVjOQohMBgQBwK",
    "Content-Type": "application/json",
  }
}
var imgs = [];
var version = "0.8.1";
var select_prices = [],
  select_shops = [],
  select_types = [];
var fr = new Object;
var en = new Object;
var effects = ["Potion", "Tipped Arrow", "Splash Potion"];
var enchants = ["Book", "Sword", "Axe", "Shovel", "Hoe", "Trident", "Bow", "Crossbow", "Pickaxe", "Fishing Rod", "Shears", "Turtle Helmet", "Elytra", "Chestplate", "Leggings", "Helmet", "Boots"];
var items = [];
var shops = [];

console.log("version: " + version);


function start() {
  console.log("> start");
  setupDb();
}

function getItemsData(url, offset) {
  console.log("> getData");
  if (offset) {
    fetch(url + "?offset=" + offset, fetch_option)
      .then(function(res) {
        return res.json();
      })
      .then(function(obj) {
        let temp = obj.records;
        temp = temp.map(item => item.fields);
        items = items.concat(temp);
        if (obj.offset) {
          getItemsData(url, obj.offset)
        } else {
          items.sort(function(a, b) {
            if (fr[a.nom_produit.split(" ").join("_").toLowerCase()] < fr[b.nom_produit.split(" ").join("_").toLowerCase()]) return -1;
            if (fr[a.nom_produit.split(" ").join("_").toLowerCase()] > fr[b.nom_produit.split(" ").join("_").toLowerCase()]) return 1;
            return 0;
          });
          pre();
          load();
          console.log(items);
        }
      });
  } else {
    fetch(url, fetch_option)
      .then(function(res) {
        return res.json();
      })
      .then(function(obj) {
        let temp = obj.records;
        temp = temp.map(item => item.fields);
        items = items.concat(temp);
        if (obj.offset) {
          getItemsData(url, obj.offset)
        } else {
          items.sort(function(a, b) {
            if (fr[a.nom_produit.split(" ").join("_").toLowerCase()] < fr[b.nom_produit.split(" ").join("_").toLowerCase()]) return -1;
            if (fr[a.nom_produit.split(" ").join("_").toLowerCase()] > fr[b.nom_produit.split(" ").join("_").toLowerCase()]) return 1;
            return 0;
          });
          pre();
          load();
          console.log(items);
        }
      });
  }
}

function getShopsData(url, offset) {
  console.log("> getData");
  if (offset) {
    fetch(url + "?offset=" + offset, fetch_option)
      .then(function(res) {
        return res.json();
      })
      .then(function(obj) {
        let temp = obj.records;
        temp = temp.map(item => item.fields);
        shops = shops.concat(temp);
        if (obj.offset) {
          getShopsData(url, obj.offset)
        } else {
          console.log(shops);
        }
      });
  } else {
    fetch(url, fetch_option)
      .then(function(res) {
        return res.json();
      })
      .then(function(obj) {
        let temp = obj.records;
        temp = temp.map(item => item.fields);
        shops = shops.concat(temp);
        if (obj.offset) {
          getShopsData(url, obj.offset)
        } else {
          console.log(shops);
        }
      });
  }
}

function setupDb() {
  console.log("> setupDb");

  fetch("https://yxmna.github.io/mcapi/lang/fr_fr_simply.json").then(function(response) {
    return response.json();
  }).then(function(obj) {
    fr = obj;
    fetch("https://yxmna.github.io/mcapi/lang/en_us_simply.json").then(function(response) {
      return response.json();
    }).then(function(obj) {
      en = obj;
    });
  });
  getItemsData(items_url);
  getShopsData(shops_url);
}


/*



function init() {
  fetch("https://yxmna.github.io/mcapi/lang/fr_fr_simply.json").then(function(response) {
    return response.json();
  }).then(function(obj) {
    fr = obj;
    fetch("https://yxmna.github.io/mcapi/lang/en_us_simply.json").then(function(response) {
      return response.json();
    }).then(function(obj) {
      en = obj;
      getData(items)
        .then(function(res) {
          return res.json();
        })
        .then(function(obj) {
          console.log("items: ");
          console.log(obj);
          // items = obj.feed.entry;
          // items.sort(function(a, b) {
          //   if (fr[a.nom_produit.split(" ").join("_").toLowerCase()] < fr[b.nom_produit.split(" ").join("_").toLowerCase()]) return -1;
          //   if (fr[a.nom_produit.split(" ").join("_").toLowerCase()] > fr[b.nom_produit.split(" ").join("_").toLowerCase()]) return 1;
          //   return 0;
          // });
          getData(shops)
            .then(function(res) {
              return res.json();
            })
            .then(function(obj) {
              console.log("shops: ");
              console.log(obj);
              // shops = obj.feed.entry;
              // pre();
              // load();
            });
        });
    });
  });
}

*/

// --------------------------------------------------------------------------------------------------------PRELOAD

function pre() {
  document.getElementById("search").value = "";
  items.forEach((item, i) => {
    var img = new Image();
    var img2 = new Image();
    // SI ENCHANT
    if (String(enchants).includes(item.nom_produit.split(" ").pop()) && item.caracteristique && item.nom_produit != "Enchanted Book") {
      img.src = "https://yxmna.github.io/mcapi/img/enchanted_" + en[item.nom_produit.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
      // SI MAPART
    } else if (item.nom_produit == "Filled Map" && item.caracteristique.split(" ").pop().startsWith("https://")) {
      img.src = item.caracteristique.split(" ").pop();
      //SI SHULKER
    } else if (item.nom_produit.startsWith("Kit")) {
      img.src = "https://yxmna.github.io/mcapi/img/orange_shulker_box.png";
      // SINON
    } else {
      img.src = "https://yxmna.github.io/mcapi/img/" + (en[item.nom_produit.toLowerCase().split(" ").join("_")] ?? "err").split(" ").join("_").toLowerCase() + ".png";
    }
    if (item.nom_prix == "Free") {
      img2.src = "";
    } else {
      img2.src = "https://yxmna.github.io/mcapi/img/" + en[item.nom_prix.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
    }
    img.onerror = function() {
      img.src = "https://yxmna.github.io/mcapi/img/missing.png";
    };
    imgs[item.ID] = {
      "p": img,
      "s": img2
    };
  });
}


// --------------------------------------------------------------------------------------------------------LOAD


function load(name) {
  // REMOVE WINDOW
  if (String(document.getElementById("items").classList).includes("none")) {
    document.getElementById("shadow").classList.add("none");
    document.getElementById("items").classList.remove("none");
  }
  // REMOVE ARTICLE
  document.getElementById("items").innerHTML = "";
  // REMOVE SELECT
  select_prices, select_types, select_shops = [];
  // FILTER BY SEARCH
  if (document.getElementById("search").value) var name = document.getElementById("search").value;
  var db = items;
  if (name) db = db.filter(item => {
    if (fr[item.nom_produit.toLowerCase().split(" ").join("_")]) {
      if (fr[item.nom_produit.toLowerCase().split(" ").join("_")].toLowerCase().includes(name) || item.nom_produit.toLowerCase().includes(name)) return item;
    } else {
      if (item.nom_produit.toLowerCase().includes(name)) return item;
    }
  });
  //FILTER BY AMMOUT
  if (document.getElementById("filter").value == "lower") {
    db.sort((item1, item2) => ((item1.quantite_prix * countPrice(item1.nom_prix)) / item1.quantite_produit.split(" ")[0]) - ((item2.quantite_prix * countPrice(item2.nom_prix)) / item2.quantite_produit.split(" ")[0]));
  }
  if (document.getElementById("filter").value == "upper") {
    db.sort((item2, item1) => ((item1.quantite_prix * countPrice(item1.nom_prix)) / item1.quantite_produit.split(" ")[0]) - ((item2.quantite_prix * countPrice(item2.nom_prix)) / item2.quantite_produit.split(" ")[0]));
  }
  // FILTER BY SELECT
  if (document.getElementById("select_prices").value) db = db.filter(item => fr[item.nom_prix.split(" ").join("_").toLowerCase()] == (document.getElementById("select_prices").value));
  if (document.getElementById("select_shops").value) db = db.filter(item => item.magasin.includes(document.getElementById("select_shops").value));
  if (document.getElementById("select_types").value) db = db.filter(item => (item.type_vente ?? "").includes(document.getElementById("select_types").value));

  db.forEach((item, i) => {
    // ADD SELECT ARRAY
    if (!select_types.includes(item.type_vente) && item.type_vente) {
      select_types.push(item.type_vente);
    }
    if (!select_shops.includes(item.magasin) && item.magasin) {
      select_shops.push(item.magasin);
    }
    if (!select_prices.includes(fr[item.nom_prix.toLowerCase().split(" ").join("_")]) && fr[item.nom_prix.toLowerCase().split(" ").join("_")]) {
      select_prices.push(fr[item.nom_prix.toLowerCase().split(" ").join("_")]);
    }
    // VAR
    var article = document.createElement("article");
    var img = document.createElement("img");
    var title = document.createElement("h2");
    var price = document.createElement("h3");
    var img_price = document.createElement("img");
    var line1 = document.createElement("h4");
    var line2 = document.createElement("h4");
    var br = document.createElement("br");
    var extra_div = document.createElement("div");
    var extra_img = document.createElement("img");


    extra_img.classList.add("none");
    img = imgs[item.ID].p;

    // NAME
    // IF POTION
    if (effects.includes(item.nom_produit) && item.caracteristique) {
      var extra1 = item.caracteristique.split(" ");
      var extra2 = "";
      if (extra1.length > 1) {
        extra2 = extra1.pop();
      }
      title.innerHTML = item.quantite_produit + " " + fr[item.nom_produit.split(" ").join("_").toLowerCase() + ".effect." + extra1.join("_").toLowerCase()] + " " + extra2;
      // IF MAPART
    } else if ("Filled Map".includes(item.nom_produit) && item.caracteristique) {
      var extra1 = item.caracteristique.split(" ");
      var extra2 = extra1.pop();
      if (!extra2.startsWith("https://")) {
        extra1 = extra1.join(" ") + String(extra2);
        extra2 = "";
      }
      title.innerHTML = item.quantite_produit + " " + fr[item.nom_produit.split(" ").join("_").toLowerCase()] + " " + item.caracteristique;
      // IF IMAGE
      if (item.nom_produit == "Filled Map" && item.caracteristique.split(" ").pop().startsWith("https://")) {
        extra_img.src = "https://yxmna.github.io/mcapi/img/map.png";
        extra_img.classList.remove("none");
      }
      // IF SHULKER
    } else if (item.nom_produit.startsWith("Kit")) {
      title.innerHTML = item.quantite_produit + " " + item.nom_produit;
      // item.nom_produit = "Shulker Box";
      // IF BOOK ENCHANT
    } else if (item.nom_produit == "Enchanted Book" && item.caracteristique) {
      var extra1 = item.caracteristique.split(" ");
      var extra2 = extra1.pop();
      extra1 = extra1.join("_").toLowerCase();
      title.innerHTML = item.quantite_produit + " " + fr["enchantment.minecraft." + extra1] + " " + fr["enchantment.level." + extra2];
      // ELSE

    } else {
      if (fr[item.nom_produit.split(" ").join("_").toLowerCase()]) {
        title.innerHTML = item.quantite_produit + " " + fr[item.nom_produit.split(" ").join("_").toLowerCase()];
      } else {
        title.innerHTML = item.quantite_produit + " *" + item.nom_produit;
      }
    }

    // SHOP
    line1.innerHTML = item.magasin;
    if (item.type_vente) line2.innerHTML = item.proprietaire_magasin + ", " + item.type_vente.toLowerCase();

    // PRICE
    if (item.quantite_prix == 0) {
      price.innerHTML = "Gratuit";
    } else {
      price.innerHTML = item.quantite_prix + " ";
      img_price = imgs[item.ID].s;
      price.appendChild(img_price);
      price.innerHTML = price.innerHTML + " " + fr[item.nom_prix.toLowerCase().split(" ").join("_")];
    }

    // ID
    article.id = i;
    article.onclick = async function() {
      click(this.id, db);
    }

    // article.classList.add(item.nom_produit.split(" ").join("_").toLowerCase());

    article.setAttribute("count", (item.quantite_prix * countPrice(item.nom_prix)) / item.quantite_produit.split(" ")[0]);
    extra_div.classList.add("extra");
    extra_div.appendChild(extra_img);
    article.appendChild(img);
    article.appendChild(extra_div);
    article.appendChild(br);
    article.appendChild(title);
    article.appendChild(price);
    article.appendChild(line1);
    article.appendChild(line2);
    document.getElementById("items").appendChild(article);
  });
  // END FOREACH

  // ADD SELECT
  if (document.getElementById("select_prices").length == 1) {
    select_prices.forEach((item, i) => {
      var option = document.createElement("option");
      option.innerHTML = item;
      option.value = item;
      document.getElementById("select_prices").appendChild(option);
    });
    select_shops.forEach((item, i) => {
      var option = document.createElement("option");
      option.innerHTML = item;
      option.value = item;
      document.getElementById("select_shops").appendChild(option);
    });
    select_types.forEach((item, i) => {
      var option = document.createElement("option");
      option.innerHTML = item;
      option.value = item;
      document.getElementById("select_types").appendChild(option);
    });
  }

}


function countPrice(x) {
  switch (x) {
    case "Diamond Block":
      return 9;
      break;
    case "Diamond":
      return 1;
      break;
    case "Iron Block":
      return 1;
      break;
    case "Iron Ingot":
      return 1 / 9;
      break;
    case "Iron Nugget":
      return 1 / 9 / 9;
      break;
    case "Gold Ingot":
      return 1 / 3;
      break;
    case "Gold Block":
      return 9 / 3;
      break;
    case "Gold Nugget":
      return 1 / 3 / 9;
      break;
    case "Gratuit":
      return 0;
      break;
    case "Emerald Block":
      return 1 / 9 / 9;
      break;
    case "Emerald Block":
      return 1 / 9 / 9 / 9;
      break;
    default:
      return 1 / 9;
  }
}


// --------------------------------------------------------------------------------------------------------CLICK

function click(x, db) {
  document.getElementById("shadow").classList.remove("none");
  document.getElementById("items").classList.add("clicked");

  var product_img = document.getElementById("product_img");
  var product_name = document.getElementById("product_name");
  var product_content = document.getElementById("product_content");
  var product_price = document.getElementById("product_price");
  var seller_name = document.getElementById("seller_name");
  var seller_coo = document.getElementById("seller_coo");
  var seller_description = document.getElementById("seller_description");
  var seller_foundation = document.getElementById("seller_foundation");
  var seller_king = document.getElementById("seller_king");
  var seller_enderchest = document.getElementById("seller_enderchest");
  var seller_shulker = document.getElementById("seller_shulker");
  var seller_forum = document.getElementById("seller_forum");
  var seller_discord = document.getElementById("seller_discord");
  var seller_dynmap = document.getElementById("seller_dynmap");
  var shop_type = document.getElementById("shop_type");
  var shop_own = document.getElementById("shop_own");
  // var frame = document.getElementById("frame");

  // RESET
  product_img.src = "https://yxmna.github.io/mcapi/img/missing.png";
  product_name.innerHTML = "product_name";
  product_content.innerHTML = "";
  product_price.innerHTML = "";
  seller_name.innerHTML = "seller_name";
  seller_coo.innerHTML = "x:0 y0";
  seller_description.innerHTML = "";
  seller_foundation.innerHTML = "";
  seller_king.innerHTML = "";
  seller_enderchest.innerHTML = "";
  seller_shulker.innerHTML = "";
  seller_forum.href = "#";
  seller_discord.href = "#";
  seller_dynmap.href = "#";
  seller_forum.innerHTML = "";
  seller_discord.innerHTML = "";
  seller_dynmap.innerHTML = "";
  shop_type.innerHTML = "";
  shop_own.innerHTML = "";

  // frame.src = "";

  // UPDATE
  // TYPE
  if (db[x].type_vente) {
    shop_type.innerHTML = "Type de commerce: " + db[x].type_vente;
  }
  // GERANT
  shop_own.innerHTML = "Propriétaire: " + db[x].proprietaire_magasin;
  // NAME
  if (db[x].nom_produit.startsWith("Kit")) {
    product_name.innerHTML = db[x].nom_produit;
  } else {
    product_name.innerHTML = fr[db[x].nom_produit.split(" ").join("_").toLowerCase()];
  }
  // PRICE
  if (db[x].quantite_prix == 0) {
    product_price.innerHTML = "<li>Gratuit</li>";
  } else {
    product_price.innerHTML = "<li>" + db[x].quantite_prix + " <img src='https://yxmna.github.io/mcapi/img/" + en[db[x].nom_prix.toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[db[x].nom_prix.toLowerCase().split(" ").join("_")] + "</li>";
  }
  // IMAGE
  product_img.src = imgs[db[x].ID].p.src;


  // CONTENT
  var li = document.createElement("li");
  // IF KIT
  if (db[x].nom_produit.startsWith("Kit")) {
    li.innerHTML = db[x].quantite_produit + " <img src='https://yxmna.github.io/mcapi/img/shulker_box.png'> " + fr["shulker_box"] + " (" + en["shulker_box"] + ")";
  } else {
    li.innerHTML = db[x].quantite_produit + " <img src='https://yxmna.github.io/mcapi/img/" + en[db[x].nom_produit.toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[db[x].nom_produit.split(" ").join("_").toLowerCase()] + " (" + en[db[x].nom_produit.split(" ").join("_").toLowerCase()] + ")";
  }
  product_content.appendChild(li);
  if (db[x].caracteristique) {
    // console.log(db[x].caracteristique);
    db[x].caracteristique.split(", ").forEach((item, i) => {
      // IF KIT
      if (db[x].nom_produit.startsWith("Kit")) {
        var li = document.createElement("li");
        var name = item.split(" ");
        var count = name.shift();
        name = name.join(" ");
        if (item.includes("Enchanted")) {
          li.innerHTML = count + " <img src='https://yxmna.github.io/mcapi/img/enchanted_" + en[name.split("Enchanted ")[1].toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[name.split("Enchanted ")[1].split(" ").join("_").toLowerCase()] + " enchanté (Enchanted " + en[name.split("Enchanted ")[1].split(" ").join("_").toLowerCase()] + ")";
        } else if (item.includes("Potion")) {
          li.innerHTML = count + " <img src='https://yxmna.github.io/mcapi/img/potion.png'> " + fr["potion.effect." + name.split("Potion ")[1].split(" ").join("_").toLowerCase()] + "  (" + en["potion.effect." + name.split("Potion ")[1].split(" ").join("_").toLowerCase()] + ")";
        } else {
          li.innerHTML = count + " <img src='https://yxmna.github.io/mcapi/img/" + en[name.toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[name.split(" ").join("_").toLowerCase()] + " (" + en[name.split(" ").join("_").toLowerCase()] + ")";
        }
        // IF ENCHANT
      } else if (String(enchants).includes(db[x].nom_produit.split(" ").pop())) {
        console.log("ENCHANT");
        var li = document.createElement("li");
        var name = item.split(" ");
        var number = name.pop();
        name = name.join("_").toLowerCase();
        number = en["enchantment.level." + number];
        // if (item = "Enchanted Book") {
        //   li.innerHTML = "<img src='https://yxmna.github.io/mcapi/img/enchanted_book.png'> " + fr["enchantment.minecraft." + name] + " " + number + " (" + en["enchantment.minecraft." + name] + ")";
        // }
        li.innerHTML = "<img src='https://yxmna.github.io/mcapi/img/enchanted_book.png'> " + fr["enchantment.minecraft." + name] + " " + number + " (" + en["enchantment.minecraft." + name] + ")";
      }
      product_content.appendChild(li);
    });
  }

  var shop = shops.filter(s => s.nom == db[x].magasin);
  shop = shop[0];


  seller_name.innerHTML = shop.nom;
  console.log(shop);
  seller_coo.innerHTML = (shop.nether_point ?? "") + " " + (shop.nether_sortie ?? "") + " " + (shop.nether_direction ?? "") + " (x:" + (shop.overworld_x ?? "??") + " y:" + (shop.overworld_y ?? "??") + ")";
  if (shop.description) {
    seller_description.innerHTML = shop.description;
  }
  if (shop.fondateur && shop.fondateur) {
    if (shop.date && shop.date) {
      seller_foundation.innerHTML = "Fondée en " + shop.date + " par " + shop.fondateur;
    } else {
      seller_foundation.innerHTML = "Fondée par " + shop.fondateur;
    }
  } else if (shop.date && shop.date) {
    seller_foundation.innerHTML = "Fondée en " + shop.date;
  } else {
    seller_foundation.innerHTML = "";
  }
  if (shop.gerant) {
    seller_king.innerHTML = "Gérant: " + shop.gerant;
  }
  if (shop.enderchest) {
    seller_enderchest.innerHTML = "✔️ Enderchest";
  } else {
    seller_enderchest.innerHTML = "❌ Enderchest";
  }
  if (shop.emp_shulker) {
    seller_shulker.innerHTML = "✔️ Emplacement Shulker";
  } else {
    seller_shulker.innerHTML = "❌ Emplacement Shulker";
  }
  if (shop.forum) {
    seller_forum.href = shop.forum;
    seller_forum.innerHTML = "Liens forum";
  }
  if (shop.discord) {
    seller_discord.href = shop.discord;
    seller_discord.innerHTML = "Liens discord";
  }
  if (shop.dynmap) {
    seller_dynmap.href = shop.dynmap;
    seller_dynmap.innerHTML = "Liens dynmap";
  }

  // var frame = document.createElement("iframe");
  // frame.id = "frame";
  // frame.src = "http://dynmap.play-mc.fr:1872/?worldname=monde2&nopanel=true&nogui=true&mapname=perspective2&zoom=5&x=" + shop.overworld_x + "&y=64&z=" + shop.overworld_y;
  // document.getElementById("frame_div").appendChild(frame);



}


function back() {
  document.getElementById("shadow").classList.add("none");
  document.getElementById("items").classList.remove("clicked");
  document.getElementById("frame_div").innerHTML = "";
}
