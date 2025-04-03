// const app = document.querySelector("#app");

// const div = document.createElement("div");
// div.id = "an-awesome-id";
// div.innerText = "Hello World!";
// app.appendChild("div");

const app = [];

const div = {
  tag: "div",
  attributes: { id: "an-awesome-id" },
  children: "Hello World!",
};
app.push(div);

render(app);
