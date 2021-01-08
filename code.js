var url = "https://spreadsheets.google.com/feeds/list/1fpwqMhe0DqP3LGV7mj6PcICzteFacqnhgXGzXdZkyss/4/public/values?alt=json"
var imgs = [];
var version = "0.1";

console.log("version: " + version);

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
    console.log(item.gsx$id.$t);
    var img = new Image();
    img.src = "https://yxmna.github.io/mcitems/" + item.gsx$productname.$t.toLowerCase().split(" ").join("_") + ".png";
    img.src = "https://yxmna.github.io/mcitems/" + item.gsx$productname.$t.toLowerCase().split(" ").join("_") + ".png";
    img.onerror = function() {
      img.src = "https://yxmna.github.io/mcitems/missing.png";
    };
    imgs[item.gsx$id.$t] = img;
  });
  console.log(imgs);
}

function load(name) {

  var db = base;
  if (name) db = db.filter(item => item.gsx$nomproduit.$t.toLowerCase().includes(name));

  db.forEach((item, i) => {

    var article = document.createElement("article");
    var img = document.createElement("img");
    var title = document.createElement("h2");
    var price = document.createElement("h3");
    var img_price = document.createElement("img");
    var line1 = document.createElement("h4");
    var line2 = document.createElement("h4");
    var br = document.createElement("br");

    img = imgs[item.gsx$id.$t];
    // img.src = "https://yxmna.github.io/mcitems/" + item.gsx$productname.$t.toLowerCase().split(" ").join("_") + ".png";
    // img.onerror = function() {
    //   img.src = "https://yxmna.github.io/mcitems/missing.png";
    // };



    title.innerHTML = item.gsx$quantiteproduit.$t + " " + item.gsx$nomproduit.$t;
    price.innerHTML = item.gsx$quantiteprix.$t + " ";
    img_price.src = "https://yxmna.github.io/mcitems/" + item.gsx$nameprice.$t.toLowerCase().split(" ").join("_") + ".png";
    line1.innerHTML = item.gsx$commerce.$t;
    line2.innerHTML = item.gsx$proprietaire.$t + ", shop " + item.gsx$typevente.$t.toLowerCase();

    price.appendChild(img_price);
    price.innerHTML = price.innerHTML + " " + item.gsx$nomprix.$t;

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

}

function search() {
  document.getElementById("items").innerHTML = "";
  load(document.getElementById("search").value.toLowerCase());
}


function click(x) {
  console.log(x);
}
