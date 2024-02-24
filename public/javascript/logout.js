// async function newFormHandler(event) {
//    event.preventDefault();

//    const title = document.querySelector('input[name="post-title"]').value;
//    const content = document.querySelector('input[name="post-content"]').value;

//    const response = await fetch(`/api/posts`, {
//       method: "POST",
//       body: JSON.stringify({
//          title,
//          content,
//       }),
//       headers: {
//          "Content-Type": "application/json",
//       },
async function logout() {
   const response = await fetch("/api/users/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" },
   });

   if (response.ok) {
      document.location.replace("/");
   } else {
      alert(response.statusText);
   }
}

document.querySelector("#logout").addEventListener("click", logout);
