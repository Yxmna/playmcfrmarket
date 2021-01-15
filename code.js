var url = "https://spreadsheets.google.com/feeds/list/1fpwqMhe0DqP3LGV7mj6PcICzteFacqnhgXGzXdZkyss/4/public/values?alt=json";
var imgs = [];
var version = "0.3";
var prices = [];
var shops = [];
var types = [];
var fr = new Object;
console.log("version: " + version);

fetch("https://yxmna.github.io/mcapi/lang/fr_FR.json").then(function(response) {
  return response.json();
}).then(function(obj) {
  fr = obj;
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
      if (a.gsx$nomproduit.$t.toUpperCase() < b.gsx$nomproduit.$t.toUpperCase()) return -1;
      if (a.gsx$nomproduit.$t.toUpperCase() > b.gsx$nomproduit.$t.toUpperCase()) return 1;
      return 0;
    });
    pre();
    load();
  });

function pre() {
  base.forEach((item, i) => {
    var img = new Image();
    img.src = "https://yxmna.github.io/mcapi/img/" + item.gsx$productname.$t.toLowerCase().split(" ").join("_") + ".png";
    img.src = "https://yxmna.github.io/mcapi/img/" + item.gsx$productname.$t.toLowerCase().split(" ").join("_") + ".png";
    img.onerror = function() {
      img.src = "https://yxmna.github.io/mcapi/img/missing.png";
    };
    imgs[item.gsx$id.$t] = img;
  });
}

function load(name) {
  document.getElementById("items").innerHTML = "";

  prices, types, shops = [];
  var db = base;
  if (name) db = db.filter(item => {
    if (item.gsx$nomproduit.$t.toLowerCase().includes(name) || item.gsx$productname.$t.toLowerCase().includes(name)) return item;
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
    // img.src = "https://yxmna.github.io/mcapi/img/" + item.gsx$productname.$t.toLowerCase().split(" ").join("_") + ".png";
    // img.onerror = function() {
    //   img.src = "https://yxmna.github.io/mcapi/img/missing.png";
    // };



    title.innerHTML = item.gsx$quantiteproduit.$t + " " + item.gsx$nomproduit.$t;


    line1.innerHTML = item.gsx$commerce.$t;
    line2.innerHTML = item.gsx$proprietaire.$t + ", " + item.gsx$typevente.$t.toLowerCase();


    if (item.gsx$quantiteprix.$t == 0) {
      price.innerHTML = "Gratuit";
    } else {
      price.innerHTML = item.gsx$quantiteprix.$t + " ";
      img_price.src = "https://yxmna.github.io/mcapi/img/" + item.gsx$nameprice.$t.toLowerCase().split(" ").join("_") + ".png";
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


function click(x) {
  console.log(x);
}
