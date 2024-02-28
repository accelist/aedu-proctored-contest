const setButton = document.getElementById("btn");
const emailInput = document.getElementById("email");
const nameInput = document.getElementById("name");

setButton.addEventListener("click", () => {
  const email = emailInput.value;
  const name = nameInput.value;
  let participant = {
    name: name,
    email: email,
  };
  window.competitionBridge.setParticipant(JSON.stringify(participant));
});
