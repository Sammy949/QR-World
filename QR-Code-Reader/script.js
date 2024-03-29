const wrapper = document.querySelector(".wrapper"),
  form = document.querySelector("form"),
  fileInp = form.querySelector("input"),
  infoText = form.querySelector("p"),
  closeBtn = document.querySelector(".close"),
  copyBtn = document.querySelector(".copy");

function fetchRequest(file, formData) {
  infoText.innerText = "Scanning QR Code...";
  fetch("http://api.qrserver.com/v1/read-qr-code/", {
    method: 'POST',
    body: formData
  }).then(res => res.json()).then(result => {
    result = result[0].symbol[0].data;
    if (result) {
      infoText.innerText = "QR Code scanned successfully";
      document.querySelector("textarea").innerText = result;
      form.querySelector("img").src = URL.createObjectURL(file);
      wrapper.classList.add("active");
    } else {
      infoText.innerText = "No QR Code found";
    }
  }).catch(() => {
    infoText.innerText = "Couldn't scan QR Code";
  });
}

fileInp.addEventListener("change", async e => {
  let file = e.target.files[0];
  if (!file) return;
  let formData = new FormData();
  formData.append('file', file);
  fetchRequest(file, formData);
});

copyBtn.addEventListener("click", () => {
  let text = document.querySelector("textarea").textContent;
  navigator.clipboard.writeText(text);
});

form.addEventListener("click", () => fileInp.click());
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));

// Add drag and drop support
wrapper.addEventListener("dragover", e => {
  e.preventDefault();
});

wrapper.addEventListener("drop", e => {
  e.preventDefault();
  let file = e.dataTransfer.files[0];
  if (!file) return;
  let formData = new FormData();
  formData.append('file', file);
  fetchRequest(file, formData);
});
