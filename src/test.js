const a = {
  Name: "mmd",
  Age: 20,
  City:"Babool"
};

var keys = Object.keys(a);
console.log(keys.length * Math.random() );
const q = a[keys[keys.length * Math.random() << 0]];
console.log(q);