var url = "https://spreadsheets.google.com/feeds/list/1fpwqMhe0DqP3LGV7mj6PcICzteFacqnhgXGzXdZkyss/4/public/values?alt=json";
var url2 = "https://spreadsheets.google.com/feeds/list/1fpwqMhe0DqP3LGV7mj6PcICzteFacqnhgXGzXdZkyss/2/public/values?alt=json";
var imgs = [];
var version = "0.7";
var select_prices = [],
  select_shops = [],
  select_types = [];
var fr = new Object;
var en = new Object;
var effects = ["Potion", "Tipped Arrow", "Splash Potion"];
var enchants = ["Sword", "Axe", "Shovel", "Hoe", "Trident", "Bow", "Crossbow", "Pickaxe", "Fishing Rod", "Shears", "Turtle Helmet", "Elytra", "Chestplate", "Leggings", "Helmet", "Boots"];

console.log("version: " + version);


function init() {
  fetch("https://yxmna.github.io/mcapi/lang/fr_fr_simply.json").then(function(response) {
    return response.json();
  }).then(function(obj) {
    fr = obj;
    fetch("https://yxmna.github.io/mcapi/lang/en_us_simply.json").then(function(response) {
      return response.json();
    }).then(function(obj) {
      en = obj;
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
          fetch(url2)
            .then(function(res) {
              return res.json();
            })
            .then(function(obj) {
              base2 = obj.feed.entry;
              pre();
              load();
            });
        });
    });
  });
}



// --------------------------------------------------------------------------------------------------------PRELOAD
function pre() {
  document.getElementById("search").value = "";
  base.forEach((item, i) => {
    var img = new Image();
    var img2 = new Image();
    // SI ENCHANT
    if (String(enchants).includes(item.gsx$produit.$t.split(" ").pop()) && item.gsx$caracteristique.$t) {
      img.src = "https://yxmna.github.io/mcapi/img/enchanted_" + en[item.gsx$produit.$t.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
      // SI MAPART
    } else if (item.gsx$produit.$t == "Filled Map" && item.gsx$caracteristique.$t.split(" ").pop().startsWith("https://")) {
      img.src = item.gsx$caracteristique.$t.split(" ").pop();
      //SI SHULKER
    } else if (item.gsx$produit.$t.startsWith("Kit")) {
      img.src = "https://yxmna.github.io/mcapi/img/orange_shulker_box.png";
      // SINON
    } else {
      img.src = "https://yxmna.github.io/mcapi/img/" + en[item.gsx$produit.$t.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
    }
    if (item.gsx$nameprice.$t == "Free") {
      img2.src = "";
    } else {
      img2.src = "https://yxmna.github.io/mcapi/img/" + en[item.gsx$nameprice.$t.toLowerCase().split(" ").join("_")].split(" ").join("_").toLowerCase() + ".png";
    }
    img.onerror = function() {
      // img.src = "https://yxmna.github.io/mcapi/img/missing.png";
    };
    imgs[item.gsx$id.$t] = {
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
  var db = base;
  if (name) db = db.filter(item => {
    if (fr[item.gsx$produit.$t.toLowerCase().split(" ").join("_")]) {
      if (fr[item.gsx$produit.$t.toLowerCase().split(" ").join("_")].toLowerCase().includes(name) || item.gsx$produit.$t.toLowerCase().includes(name)) return item;
    } else {
      if (item.gsx$produit.$t.toLowerCase().includes(name)) return item;
    }
  });
  //FILTER BY AMMOUT
  if (document.getElementById("filter").value == "lower") {
    db.sort((item1, item2) => ((item1.gsx$quantiteprix.$t * countPrice(item1.gsx$nameprice.$t)) / item1.gsx$quantiteproduit.$t.split(" ")[0]) - ((item2.gsx$quantiteprix.$t * countPrice(item2.gsx$nameprice.$t)) / item2.gsx$quantiteproduit.$t.split(" ")[0]));
  }
  if (document.getElementById("filter").value == "upper") {
    db.sort((item2, item1) => ((item1.gsx$quantiteprix.$t * countPrice(item1.gsx$nameprice.$t)) / item1.gsx$quantiteproduit.$t.split(" ")[0]) - ((item2.gsx$quantiteprix.$t * countPrice(item2.gsx$nameprice.$t)) / item2.gsx$quantiteproduit.$t.split(" ")[0]));
  }
  // FILTER BY SELECT
  if (document.getElementById("select_prices").value) db = db.filter(item => item.gsx$nomprix.$t.includes(document.getElementById("select_prices").value));
  if (document.getElementById("select_shops").value) db = db.filter(item => item.gsx$commerce.$t.includes(document.getElementById("select_shops").value));
  if (document.getElementById("select_types").value) db = db.filter(item => item.gsx$typevente.$t.includes(document.getElementById("select_types").value));

  db.forEach((item, i) => {
    // ADD SELECT ARRAY
    if (!select_types.includes(item.gsx$typevente.$t) && item.gsx$typevente.$t) {
      select_types.push(item.gsx$typevente.$t);
    }
    if (!select_shops.includes(item.gsx$commerce.$t) && item.gsx$commerce.$t) {
      select_shops.push(item.gsx$commerce.$t);
    }
    if (!select_prices.includes(item.gsx$nomprix.$t) && item.gsx$nomprix.$t) {
      select_prices.push(item.gsx$nomprix.$t);
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
    img = imgs[item.gsx$id.$t].p;

    // NAME
    // IF POTION
    if (effects.includes(item.gsx$produit.$t) && item.gsx$caracteristique) {
      var extra1 = item.gsx$caracteristique.$t.split(" ");
      var extra2 = "";
      if (extra1.length > 1) {
        extra2 = extra1.pop();
      }
      title.innerHTML = item.gsx$quantiteproduit.$t + " " + fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase() + ".effect." + extra1.join("_").toLowerCase()] + " " + extra2;
      // IF MAPART
    } else if ("Filled Map".includes(item.gsx$produit.$t) && item.gsx$caracteristique.$t) {
      var extra1 = item.gsx$caracteristique.$t.split(" ");
      var extra2 = extra1.pop();
      if (!extra2.startsWith("https://")) {
        extra1 = extra1.join(" ") + String(extra2);
        extra2 = "";
      }
      title.innerHTML = item.gsx$quantiteproduit.$t + " " + fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase()] + " " + item.gsx$caracteristique.$t;
      // IF IMAGE
      if (item.gsx$produit.$t == "Filled Map" && item.gsx$caracteristique.$t.split(" ").pop().startsWith("https://")) {
        extra_img.src = "https://yxmna.github.io/mcapi/img/map.png";
        extra_img.classList.remove("none");
      }
      // IF SHULKER
    } else if (item.gsx$produit.$t.startsWith("Kit")) {
      title.innerHTML = item.gsx$quantiteproduit.$t + " " + item.gsx$produit.$t;
      // item.gsx$produit.$t = "Shulker Box";
      // IF BOOK ENCHANT
    } else if (item.gsx$produit.$t == "Enchanted Book" && item.gsx$caracteristique.$t) {
      title.innerHTML = item.gsx$quantiteproduit.$t + " " + item.gsx$caracteristique.$t;
      // ELSE
    } else {
      if (fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase()]) {
        title.innerHTML = item.gsx$quantiteproduit.$t + " " + fr[item.gsx$produit.$t.split(" ").join("_").toLowerCase()];
      } else {
        title.innerHTML = item.gsx$quantiteproduit.$t + " *" + item.gsx$produit.$t;
      }
    }

    // SHOP
    line1.innerHTML = item.gsx$commerce.$t;
    line2.innerHTML = item.gsx$proprietaire.$t + ", " + item.gsx$typevente.$t.toLowerCase();

    // PRICE
    if (item.gsx$quantiteprix.$t == 0) {
      price.innerHTML = "Gratuit";
    } else {
      price.innerHTML = item.gsx$quantiteprix.$t + " ";
      img_price = imgs[item.gsx$id.$t].s;
      price.appendChild(img_price);
      price.innerHTML = price.innerHTML + " " + item.gsx$nomprix.$t;
    }

    // ID
    article.id = i;
    article.onclick = async function() {
      click(this.id, db);
    }

    // article.classList.add(item.gsx$produit.$t.split(" ").join("_").toLowerCase());

    article.setAttribute("count", (item.gsx$quantiteprix.$t * countPrice(item.gsx$nameprice.$t)) / item.gsx$quantiteproduit.$t.split(" ")[0]);
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
  shop_type.innerHTML = "Type de commerce: " + db[x].gsx$typevente.$t;
  // GERANT
  shop_own.innerHTML = "Propriétaire: " + db[x].gsx$proprietaire.$t;
  // NAME
  if (db[x].gsx$produit.$t.startsWith("Kit")) {
    product_name.innerHTML = db[x].gsx$produit.$t;
  } else {
    product_name.innerHTML = fr[db[x].gsx$produit.$t.split(" ").join("_").toLowerCase()];
  }
  // PRICE
  if (db[x].gsx$quantiteprix.$t == 0) {
    product_price.innerHTML = "<li>Gratuit</li>";
  } else {
    product_price.innerHTML = "<li>" + db[x].gsx$quantiteprix.$t + " <img src='https://yxmna.github.io/mcapi/img/" + en[db[x].gsx$nameprice.$t.toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[db[x].gsx$nameprice.$t.toLowerCase().split(" ").join("_")] + "</li>";
  }
  // IMAGE
  product_img.src = imgs[db[x].gsx$id.$t].p.src;


  // CONTENT
  var li = document.createElement("li");
  if (db[x].gsx$produit.$t.startsWith("Kit")) {
    li.innerHTML = db[x].gsx$quantiteproduit.$t + " <img src='https://yxmna.github.io/mcapi/img/shulker_box.png'> " + fr["shulker_box"] + " (" + en["shulker_box"] + ")";
  } else {
    li.innerHTML = db[x].gsx$quantiteproduit.$t + " <img src='https://yxmna.github.io/mcapi/img/" + en[db[x].gsx$produit.$t.toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[db[x].gsx$produit.$t.split(" ").join("_").toLowerCase()] + " (" + en[db[x].gsx$produit.$t.split(" ").join("_").toLowerCase()] + ")";
  }
  product_content.appendChild(li);
  if (db[x].gsx$caracteristique.$t) {
    // console.log(db[x].gsx$caracteristique.$t);
    db[x].gsx$caracteristique.$t.split(", ").forEach((item, i) => {
      if (db[x].gsx$produit.$t.startsWith("Kit")) {
        var li = document.createElement("li");
        var name = item.split(" ");
        var count = name.shift();
        name = name.join(" ");
        if (item.includes("Enchanted")) {
          li.innerHTML = count + " <img src='https://yxmna.github.io/mcapi/img/enchanted_" + en[name.split("Enchanted ")[1].toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[name.split("Enchanted ")[1].split(" ").join("_").toLowerCase()] + " enchanté (Enchanted " + en[name.split("Enchanted ")[1].split(" ").join("_").toLowerCase()] + ")";
        } else {
          li.innerHTML = count + " <img src='https://yxmna.github.io/mcapi/img/" + en[name.toLowerCase().split(" ").join("_")].toLowerCase().split(" ").join("_") + ".png'> " + fr[name.split(" ").join("_").toLowerCase()] + " (" + en[name.split(" ").join("_").toLowerCase()] + ")";
        }
      }
      product_content.appendChild(li);
    });
  }

  var shop = base2.filter(s => s.gsx$nom.$t == db[x].gsx$commerce.$t);
  shop = shop[0];


  seller_name.innerHTML = shop.gsx$nom.$t;
  seller_coo.innerHTML = shop.gsx$netherpoint.$t + " " + shop.gsx$nethersortie.$t + " " + shop.gsx$netherdirection.$t + " (x:" + shop.gsx$overworldx.$t + " y:" + shop.gsx$overworldy.$t + ")";
  if (shop.gsx$description) {
    seller_description.innerHTML = shop.gsx$description.$t;
  }
  if (shop.gsx$fondateur && shop.gsx$fondateur.$t) {
    if (shop.gsx$date && shop.gsx$date.$t) {
      seller_foundation.innerHTML = "Fondée en " + shop.gsx$date.$t + " par " + shop.gsx$fondateur.$t;
    } else {
      seller_foundation.innerHTML = "Fondée par " + shop.gsx$fondateur.$t;
    }
  } else if (shop.gsx$date && shop.gsx$date.$t) {
    seller_foundation.innerHTML = "Fondée en " + shop.gsx$date.$t;
  } else {
    seller_foundation.innerHTML = "";
  }
  if (shop.gsx$gerant) {
    seller_king.innerHTML = "Gérant: " + shop.gsx$gerant.$t;
  }
  if (shop.gsx$enderchest) {
    seller_enderchest.innerHTML = "✔️ Enderchest";
  } else {
    seller_enderchest.innerHTML = "❌ Enderchest";
  }
  if (shop.gsx$emp_shulker) {
    seller_shulker.innerHTML = "✔️ Emplacement Shulker";
  } else {
    seller_shulker.innerHTML = "❌ Emplacement Shulker";
  }
  if (shop.gsx$forum.$t) {
    seller_forum.href = shop.gsx$forum.$t;
    seller_forum.innerHTML = "Liens forum";
  }
  if (shop.gsx$discord.$t) {
    seller_discord.href = shop.gsx$discord.$t;
    seller_discord.innerHTML = "Liens discord";
  }
  if (shop.gsx$dynmap.$t) {
    seller_dynmap.href = shop.gsx$dynmap.$t;
    seller_dynmap.innerHTML = "Liens dynmap";
  }

  // var frame = document.createElement("iframe");
  // frame.id = "frame";
  // frame.src = "http://dynmap.play-mc.fr:1872/?worldname=monde2&nopanel=true&nogui=true&mapname=perspective2&zoom=5&x=" + shop.gsx$overworldx.$t + "&y=64&z=" + shop.gsx$overworldy.$t;
  // document.getElementById("frame_div").appendChild(frame);



}


function back() {
  document.getElementById("shadow").classList.add("none");
  document.getElementById("items").classList.remove("clicked");
  document.getElementById("frame_div").innerHTML = "";
}
